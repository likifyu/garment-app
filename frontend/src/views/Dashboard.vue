<template>
  <div class="dashboard">
    <a-row :gutter="24">
      <a-col :span="8">
        <a-card class="stat-card designs-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon">
              <icon-image :size="40" />
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.designCount }}</div>
              <div class="stat-label">设计稿总数</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="stat-card projects-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon">
              <icon-clock-circle :size="40" />
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.patternCount }}</div>
              <div class="stat-label">项目进行中</div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="stat-card collaborators-card" :bordered="false">
          <div class="stat-content">
            <div class="stat-icon">
              <icon-user-group :size="40" />
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.versionCount }}</div>
              <div class="stat-label">协作者</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top: 32px">
      <a-col :span="24">
        <a-card class="actions-card" :bordered="false" title="快捷操作">
          <div class="quick-actions">
            <a-button type="primary" size="large" @click="$router.push('/designs')">
              <template #icon>
                <icon-plus />
              </template>
              新建设计稿
            </a-button>
            <a-button size="large" @click="$router.push('/patterns')">
              <template #icon>
                <icon-upload />
              </template>
              上传文件
            </a-button>
            <a-button size="large">
              <template #icon>
                <icon-user-add />
              </template>
              邀请协作
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top: 32px">
      <a-col :span="24">
        <a-card class="progress-card" :bordered="false" title="项目进度">
          <div class="progress-list">
            <div v-for="project in projectProgress" :key="project.id" class="progress-item">
              <div class="progress-header">
                <span class="progress-name">{{ project.name }}</span>
                <span class="progress-percent">{{ project.percent }}%</span>
              </div>
              <a-progress
                :percent="project.percent"
                :color="getProgressColor(project.percent)"
                :stroke-width="12"
                show-text="false"
              />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row style="margin-top: 32px">
      <a-col :span="24">
        <a-card class="recent-card" :bordered="false" title="最近上传的设计稿">
          <a-table
            :data="recentDesigns"
            :pagination="false"
            :bordered="false"
            class="designs-table"
          >
            <template #columns>
              <a-table-column title="设计标题" data-index="title" />
              <a-table-column title="分类" data-index="category" :width="140" />
              <a-table-column title="设计师" data-index="designer" :width="140" />
              <a-table-column title="创建时间" :width="180">
                <template #cell="{ record }">
                  {{ formatDate(record.createdAt) }}
                </template>
              </a-table-column>
              <a-table-column title="进度" :width="180">
                <template #cell="{ record }">
                  <a-progress
                    :percent="record.progress || 0"
                    :stroke-width="6"
                    :color="getProgressColor(record.progress || 0)"
                    show-text="false"
                  />
                </template>
              </a-table-column>
              <a-table-column title="操作" :width="120" fixed="right">
                <template #cell="{ record }">
                  <a-button type="text" @click="viewDesign(record.id)">
                    查看详情
                  </a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDesigns } from '@/api/design'
import {
  IconImage,
  IconClockCircle,
  IconUserGroup,
  IconPlus,
  IconUpload,
  IconUserAdd
} from '@arco-design/web-vue/es/icon'

const router = useRouter()

const stats = ref({
  designCount: 0,
  patternCount: 0,
  versionCount: 0
})

const recentDesigns = ref([])

const projectProgress = ref([
  { id: 1, name: '春季连衣裙系列', percent: 75 },
  { id: 2, name: '男装休闲系列', percent: 45 },
  { id: 3, name: '配饰设计项目', percent: 90 },
  { id: 4, name: '冬季大衣系列', percent: 30 }
])

onMounted(async () => {
  try {
    const res = await getDesigns({ limit: 5 })
    recentDesigns.value = res.designs
    stats.value.designCount = res.pagination.total
    stats.value.versionCount = res.designs.reduce((sum, d) => sum + (d._count?.versions || 0), 0)
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('zh-CN')
}

function getProgressColor(percent) {
  if (percent >= 80) return '#D4AF37'
  if (percent >= 50) return '#3B82F6'
  return '#C2410C'
}

function viewDesign(id) {
  router.push(`/designs/${id}`)
}
</script>

<style scoped>
.dashboard {
  padding: 0;
  min-height: 100vh;
  background: #0A0E27;
}
.stat-card {
  background: linear-gradient(145deg, #12193A 0%, #0A0E27 100%);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(59, 130, 246, 0.1);
}
.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}
.stat-content {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 8px;
}
.stat-icon {
  width: 88px;
  height: 88px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}
.stat-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  opacity: 0.8;
  filter: blur(20px);
}
.designs-card .stat-icon {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}
.projects-card .stat-icon {
  background: linear-gradient(135deg, #D4AF37 0%, #B8962E 100%);
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
}
.collaborators-card .stat-icon {
  background: linear-gradient(135deg, #C2410C 0%, #9F3410 100%);
  box-shadow: 0 8px 24px rgba(194, 65, 12, 0.4);
}
.stat-icon :deep(svg) {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}
.stat-info {
  flex: 1;
}
.stat-number {
  font-size: 42px;
  font-weight: 700;
  background: linear-gradient(135deg, #FFFFFF 0%, #9CA3AF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}
.stat-label {
  font-size: 15px;
  color: #9CA3AF;
  margin-top: 8px;
  font-weight: 500;
}
.actions-card,
.progress-card,
.recent-card {
  background: linear-gradient(145deg, #12193A 0%, #0A0E27 100%);
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}
.actions-card :deep(.arco-card-header),
.progress-card :deep(.arco-card-header),
.recent-card :deep(.arco-card-header) {
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  padding: 24px;
}
.actions-card :deep(.arco-card-header-title),
.progress-card :deep(.arco-card-header-title),
.recent-card :deep(.arco-card-header-title) {
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
}
.actions-card :deep(.arco-card-body),
.progress-card :deep(.arco-card-body),
.recent-card :deep(.arco-card-body) {
  padding: 24px;
}
.quick-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.quick-actions .arco-btn {
  height: 48px;
  padding: 0 32px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
}
.quick-actions .arco-btn-primary {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}
.quick-actions .arco-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}
.quick-actions .arco-btn-secondary {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3B82F6;
}
.quick-actions .arco-btn-secondary:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-2px);
}
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.progress-item {
  padding: 16px;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}
.progress-item:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
}
.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.progress-name {
  font-size: 15px;
  font-weight: 500;
  color: #FFFFFF;
}
.progress-percent {
  font-size: 14px;
  font-weight: 600;
  color: #3B82F6;
}
.designs-table {
  background: transparent;
}
.designs-table :deep(.arco-table) {
  background: transparent;
}
.designs-table :deep(.arco-table-thead-th) {
  background: rgba(59, 130, 246, 0.08);
  color: #9CA3AF;
  font-weight: 600;
  border-bottom: 1px solid rgba(59, 130, 246, 0.15);
  padding: 16px;
}
.designs-table :deep(.arco-table-td) {
  background: transparent;
  color: #E5E7EB;
  border-bottom: 1px solid rgba(59, 130, 246, 0.08);
  padding: 16px;
}
.designs-table :deep(.arco-table-tr:hover .arco-table-td) {
  background: rgba(59, 130, 246, 0.05);
}
.designs-table :deep(.arco-btn-text) {
  color: #3B82F6;
}
.designs-table :deep(.arco-btn-text:hover) {
  background: rgba(59, 130, 246, 0.1);
}
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 16px;
  }
  .stat-number {
    font-size: 32px;
  }
  .quick-actions {
    flex-direction: column;
  }
  .quick-actions .arco-btn {
    width: 100%;
  }
}
</style>
