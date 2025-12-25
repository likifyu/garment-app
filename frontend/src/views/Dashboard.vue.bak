<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon design-icon">
              <el-icon :size="40"><Picture /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.designCount }}</div>
              <div class="stat-label">设计稿总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon pattern-icon">
              <el-icon :size="40"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.patternCount }}</div>
              <div class="stat-label">样板总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon version-icon">
              <el-icon :size="40"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.versionCount }}</div>
              <div class="stat-label">历史版本</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card header="快捷操作">
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/designs')">
              <el-icon><Plus /></el-icon>
              新建设计稿
            </el-button>
            <el-button @click="$router.push('/patterns')">
              <el-icon><Plus /></el-icon>
              新建样板
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近上传 -->
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-card header="最近上传的设计稿">
          <el-table :data="recentDesigns" style="width: 100%">
            <el-table-column prop="title" label="设计标题" />
            <el-table-column prop="category" label="分类" width="120" />
            <el-table-column prop="designer" label="设计师" width="120" />
            <el-table-column label="创建时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button link type="primary" @click="viewDesign(row.id)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDesigns } from '@/api/design'

const router = useRouter()

const stats = ref({
  designCount: 0,
  patternCount: 0,
  versionCount: 0
})

const recentDesigns = ref([])

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

function viewDesign(id) {
  router.push(`/designs/${id}`)
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.design-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.pattern-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.version-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

.quick-actions {
  display: flex;
  gap: 10px;
}
</style>
