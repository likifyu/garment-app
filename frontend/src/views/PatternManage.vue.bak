<template>
  <div class="pattern-manage">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="样板名称">
          <el-input v-model="searchForm.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择" clearable>
            <el-option label="上装" value="上装" />
            <el-option label="下装" value="下装" />
            <el-option label="套装" value="套装" />
            <el-option label="配饰" value="配饰" />
          </el-select>
        </el-form-item>
        <el-form-item label="尺码">
          <el-select v-model="searchForm.size" placeholder="请选择" clearable>
            <el-option label="S" value="S" />
            <el-option label="M" value="M" />
            <el-option label="L" value="L" />
            <el-option label="XL" value="XL" />
            <el-option label="XXL" value="XXL" />
          </el-select>
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
        新建样板
      </el-button>
    </div>

    <!-- 样板列表 -->
    <el-card class="table-card">
      <el-table :data="patterns" v-loading="loading" style="width: 100%">
        <el-table-column prop="name" label="样板名称" min-width="150" />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="size" label="尺码" width="80" />
        <el-table-column label="关联设计" width="150">
          <template #default="{ row }">
            {{ row.design?.title || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" />
        <el-table-column label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
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
    <PatternDialog
      v-model="dialogVisible"
      :pattern="currentPattern"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPatterns, deletePattern as deletePatternApi } from '@/api/pattern'

const patterns = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const currentPattern = ref(null)

const searchForm = reactive({
  name: '',
  category: '',
  size: ''
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
    const res = await getPatterns({
      ...searchForm,
      page: pagination.page,
      limit: pagination.limit
    })
    patterns.value = res.patterns
    pagination.total = res.pagination.total
  } catch (error) {
    console.error('获取样板列表失败:', error)
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
    name: '',
    category: '',
    size: ''
  })
  handleSearch()
}

function handleAdd() {
  currentPattern.value = null
  dialogVisible.value = true
}

function handleEdit(row) {
  currentPattern.value = row
  dialogVisible.value = true
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm('确定要删除这个样板吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deletePatternApi(row.id)
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
</script>

<style scoped>
.pattern-manage {
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
