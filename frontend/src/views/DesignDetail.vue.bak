<template>
  <div class="design-detail" v-loading="loading">
    <el-page-header @back="$router.back()" content="设计稿详情" />

    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 左侧：图片和基本信息 -->
      <el-col :span="12">
        <el-card>
          <el-image :src="design?.imageUrl" fit="contain" style="width: 100%" />
        </el-card>

        <el-card style="margin-top: 20px">
          <el-descriptions title="基本信息" :column="2" border>
            <el-descriptions-item label="设计标题">{{ design?.title }}</el-descriptions-item>
            <el-descriptions-item label="分类">{{ design?.category }}</el-descriptions-item>
            <el-descriptions-item label="季节">{{ design?.season || '-' }}</el-descriptions-item>
            <el-descriptions-item label="设计师">{{ design?.designer }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(design?.status)">
                {{ getStatusText(design?.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(design?.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="设计说明" :span="2">
              {{ design?.description || '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <!-- 右侧：历史版本和关联样板 -->
      <el-col :span="12">
        <!-- 关联样板 -->
        <el-card header="关联样板">
          <el-button type="primary" size="small" @click="handleAddPattern">
            <el-icon><Plus /></el-icon>
            添加样板
          </el-button>
          <el-table :data="design?.patterns || []" style="margin-top: 10px; width: 100%">
            <el-table-column prop="name" label="样板名称" />
            <el-table-column prop="size" label="尺码" width="80" />
            <el-table-column prop="category" label="分类" width="100" />
          </el-table>
        </el-card>

        <!-- 历史版本 -->
        <el-card header="历史版本" style="margin-top: 20px">
          <el-timeline>
            <el-timeline-item
              v-for="version in design?.versions"
              :key="version.id"
              :timestamp="formatDate(version.createdAt)"
            >
              <div>
                <strong>{{ version.title }}</strong>
                <el-tag size="small" style="margin-left: 10px">v{{ version.version }}</el-tag>
              </div>
              <div style="margin-top: 5px; color: #666">{{ version.description }}</div>
              <el-image
                v-if="version.imageUrl"
                :src="version.imageUrl"
                style="margin-top: 10px; max-width: 200px"
                fit="contain"
              />
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDesignById } from '@/api/design'

const route = useRoute()

const design = ref(null)
const loading = ref(false)

onMounted(async () => {
  await fetchDesign()
})

async function fetchDesign() {
  loading.value = true
  try {
    design.value = await getDesignById(route.params.id)
  } catch (error) {
    console.error('获取设计稿详情失败:', error)
  } finally {
    loading.value = false
  }
}

function handleAddPattern() {
  // TODO: 实现添加样板功能
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
.design-detail {
  padding: 20px;
}
</style>
