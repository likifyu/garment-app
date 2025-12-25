<template>
  <div class="design-manage">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="设计标题">
          <el-input v-model="searchForm.title" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择" clearable>
            <el-option label="春装" value="春装" />
            <el-option label="夏装" value="夏装" />
            <el-option label="秋装" value="秋装" />
            <el-option label="冬装" value="冬装" />
            <el-option label="运动" value="运动" />
            <el-option label="休闲" value="休闲" />
          </el-select>
        </el-form-item>
        <el-form-item label="设计师">
          <el-input v-model="searchForm.designer" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新建设计稿
      </el-button>
    </div>

    <!-- 设计稿列表 -->
    <el-card class="table-card">
      <el-table :data="designs" v-loading="loading" style="width: 100%">
        <el-table-column label="图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.imageUrl"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px"
              :preview-src-list="[row.imageUrl]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="设计标题" min-width="150" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="season" label="季节" width="100" />
        <el-table-column prop="designer" label="设计师" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="版本数" width="80">
          <template #default="{ row }">
            {{ row._count?.versions || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchData"
          @current-change="fetchData"
        />
      </div>
    </el-card>

    <!-- 新建/编辑对话框 -->
    <DesignDialog
      v-model="dialogVisible"
      :design="currentDesign"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDesigns, deleteDesign as deleteDesignApi } from '@/api/design'
import { useDesignStore } from '@/stores/design'
import DesignDialog from '@/components/DesignDialog.vue'

const router = useRouter()
const designStore = useDesignStore()

const designs = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const currentDesign = ref(null)

const searchForm = reactive({
  title: '',
  category: '',
  designer: ''
})

const pagination = reactive({
  total: 0,
  page: 1,
  limit: 20
})

onMounted(() => {
  fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const res = await getDesigns({
      ...searchForm,
      page: pagination.page,
      limit: pagination.limit
    })
    designs.value = res.designs
    pagination.total = res.pagination.total
  } catch (error) {
    console.error('获取设计稿列表失败:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  Object.assign(searchForm, {
    title: '',
    category: '',
    designer: ''
  })
  handleSearch()
}

function handleAdd() {
  currentDesign.value = null
  dialogVisible.value = true
}

function handleView(row) {
  router.push(`/designs/${row.id}`)
}

function handleEdit(row) {
  currentDesign.value = row
  dialogVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('确定要删除这个设计稿吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteDesignApi(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

function handleSuccess() {
  dialogVisible.value = false
  fetchData()
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('zh-CN')
}

function getStatusType(status) {
  const types = {
    draft: 'info',
    published: 'success',
    archived: 'warning'
  }
  return types[status] || 'info'
}

function getStatusText(status) {
  const texts = {
    draft: '草稿',
    published: '已发布',
    archived: '已归档'
  }
  return texts[status] || status
}
</script>

<style scoped>
.design-manage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-card {
  margin-bottom: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-card {
  flex: 1;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
