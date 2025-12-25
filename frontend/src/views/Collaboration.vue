<template>
  <div class="collaboration">
    <div class="page-header">
      <h1 class="page-title">协作中心</h1>
      <a-button type="primary" size="large" @click="openCreateModal" class="create-btn">
        <template #icon><icon-plus /></template>
        创建协作
      </a-button>
    </div>

    <div class="search-filter-section">
      <a-input-search v-model="searchKeyword" placeholder="搜索协作项目..." size="large" class="search-input" @search="handleSearch">
        <template #prefix><icon-search /></template>
      </a-input-search>
      <div class="filter-controls">
        <a-select v-model="filterStatus" placeholder="全部状态" size="large" class="filter-select" allow-clear @change="handleFilter">
          <a-option value="">全部状态</a-option>
          <a-option value="进行中">进行中</a-option>
          <a-option value="已完成">已完成</a-option>
        </a-select>
        <a-radio-group v-model="viewMode" type="button" size="large" @change="handleViewModeChange">
          <a-radio value="grid"><icon-apps /></a-radio>
          <a-radio value="list"><icon-list /></a-radio>
        </a-radio-group>
      </div>
    </div>

    <div class="statistics-row">
      <div class="stat-card">
        <div class="stat-icon total"><icon-user-group /></div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total }}</div>
          <div class="stat-label">总协作</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active"><icon-sync /></div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.active }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon members"><icon-user /></div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.members }}</div>
          <div class="stat-label">参与成员</div>
        </div>
      </div>
    </div>

    <div v-if="viewMode === 'grid'" class="collaboration-grid">
      <div v-for="project in filteredProjects" :key="project.id" class="project-card" @click="viewProject(project)">
        <div class="project-header">
          <div class="project-icon">{{ project.name.charAt(0) }}</div>
          <div class="project-category">{{ project.category }}</div>
        </div>
        <div class="project-info">
          <h3 class="project-name">{{ project.name }}</h3>
          <p class="project-description">{{ project.description }}</p>
          <div class="project-meta">
            <div class="project-members">
              <a-avatar-group :size="32" :max-count="3">
                <a-avatar v-for="member in project.members" :key="member.id" :style="{ backgroundColor: member.color }">
                  {{ member.name.charAt(0) }}
                </a-avatar>
              </a-avatar-group>
            </div>
            <a-tag :color="getStatusColor(project.status)" size="small">{{ project.status }}</a-tag>
          </div>
          <div class="project-progress">
            <div class="progress-header">
              <span class="progress-label">进度</span>
              <span class="progress-value">{{ project.progress }}%</span>
            </div>
            <a-progress :percent="project.progress" :color="getProgressColor(project.progress)" :show-text="false" size="small" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="collaboration-list">
      <div v-for="project in filteredProjects" :key="project.id" class="project-list-item" @click="viewProject(project)">
        <div class="list-icon-wrapper">
          <div class="list-icon">{{ project.name.charAt(0) }}</div>
        </div>
        <div class="list-content">
          <h3 class="list-name">{{ project.name }}</h3>
          <p class="list-description">{{ project.description }}</p>
          <div class="list-meta">
            <span class="list-category">{{ project.category }}</span>
            <span class="list-date">{{ project.createdAt }}</span>
          </div>
          <div class="list-members">
            <a-avatar-group :size="28" :max-count="4">
              <a-avatar v-for="member in project.members" :key="member.id" :style="{ backgroundColor: member.color }">
                {{ member.name.charAt(0) }}
              </a-avatar>
            </a-avatar-group>
          </div>
        </div>
        <div class="list-status">
          <a-tag :color="getStatusColor(project.status)" size="large">{{ project.status }}</a-tag>
          <a-progress :percent="project.progress" :color="getProgressColor(project.progress)" size="small" style="margin-top: 8px" />
        </div>
        <div class="list-actions">
          <a-button type="text" @click.stop="editProject(project)">
            <template #icon><icon-edit /></template>
            编辑
          </a-button>
          <a-button type="text" status="danger" @click.stop="deleteProject(project)">
            <template #icon><icon-delete /></template>
            删除
          </a-button>
        </div>
      </div>
    </div>

    <a-modal v-model:visible="modalVisible" :title="isEditMode ? '编辑协作' : '创建协作'" width="600px" @ok="handleModalOk" @cancel="handleModalCancel" :ok-button-props="{ loading: submitting }">
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item field="name" label="协作名称" required>
          <a-input v-model="formState.name" placeholder="请输入协作名称" size="large" />
        </a-form-item>
        <a-form-item field="category" label="类别" required>
          <a-select v-model="formState.category" placeholder="请选择类别" size="large">
            <a-option value="设计协作">设计协作</a-option>
            <a-option value="样板开发">样板开发</a-option>
            <a-option value="样衣制作">样衣制作</a-option>
            <a-option value="工艺评审">工艺评审</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="description" label="描述">
          <a-textarea v-model="formState.description" placeholder="请输入协作描述" :rows="4" size="large" />
        </a-form-item>
        <a-form-item field="status" label="状态" required>
          <a-radio-group v-model="formState.status" size="large">
            <a-radio value="进行中">进行中</a-radio>
            <a-radio value="已完成">已完成</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="progress" label="进度" required>
          <a-slider v-model="formState.progress" :min="0" :max="100" :marks="{ 0: '0%', 50: '50%', 100: '100%' }" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-empty v-if="filteredProjects.length === 0" description="暂无协作项目" class="empty-state">
      <a-button type="primary" @click="openCreateModal">创建第一个协作</a-button>
    </a-empty>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { IconPlus, IconSearch, IconApps, IconList, IconUserGroup, IconSync, IconUser, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'
import audioManager from '@/utils/audioManager'

const searchKeyword = ref('')
const filterStatus = ref('')
const viewMode = ref('grid')
const modalVisible = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const formState = reactive({ id: null, name: '', category: '', description: '', status: '进行中', progress: 0 })

const projects = ref([
  {
    id: 1,
    name: '春季新品设计',
    category: '设计协作',
    description: '2025春季系列服装设计协作项目',
    status: '进行中',
    progress: 75,
    createdAt: '2024-01-15',
    members: [
      { id: 1, name: '张设计师', color: '#667eea' },
      { id: 2, name: '李版师', color: '#f5576c' },
      { id: 3, name: '王工艺', color: '#00f2fe' }
    ]
  },
  {
    id: 2,
    name: '连衣裙样板开发',
    category: '样板开发',
    description: '新款连衣裙的样板制作与调整',
    status: '进行中',
    progress: 50,
    createdAt: '2024-01-20',
    members: [
      { id: 2, name: '李版师', color: '#f5576c' },
      { id: 4, name: '赵样衣', color: '#764ba2' }
    ]
  },
  {
    id: 3,
    name: '西装工艺评审',
    category: '工艺评审',
    description: '经典西装系列工艺标准评审',
    status: '已完成',
    progress: 100,
    createdAt: '2024-01-10',
    members: [
      { id: 1, name: '张设计师', color: '#667eea' },
      { id: 3, name: '王工艺', color: '#00f2fe' },
      { id: 5, name: '刘质检', color: '#ff7d00' }
    ]
  }
])

const statistics = computed(() => ({
  total: projects.value.length,
  active: projects.value.filter(p => p.status === '进行中').length,
  members: [...new Set(projects.value.flatMap(p => p.members.map(m => m.id)))].length
}))

const filteredProjects = computed(() => {
  let result = [...projects.value]
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
    )
  }
  if (filterStatus.value) result = result.filter(p => p.status === filterStatus.value)
  return result
})

const getStatusColor = (status) => status === '已完成' ? 'green' : 'blue'
const getProgressColor = (progress) => {
  if (progress === 100) return '#00b42a'
  if (progress >= 50) return '#165dff'
  return '#ff7d00'
}

const handleSearch = () => audioManager.playClick()
const handleFilter = () => audioManager.playClick()
const handleViewModeChange = () => audioManager.playClick()

const viewProject = (project) => {
  audioManager.playClick()
  Message.info(`查看协作: ${project.name}`)
}

const openCreateModal = () => {
  audioManager.playClick()
  isEditMode.value = false
  modalVisible.value = true
  resetForm()
}

const editProject = (project) => {
  audioManager.playClick()
  isEditMode.value = true
  modalVisible.value = true
  formState.id = project.id
  formState.name = project.name
  formState.category = project.category
  formState.description = project.description
  formState.status = project.status
  formState.progress = project.progress
}

const deleteProject = (project) => {
  audioManager.playClick()
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除协作「${project.name}」吗？此操作不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    onOk: () => {
      const index = projects.value.findIndex(p => p.id === project.id)
      if (index > -1) {
        projects.value.splice(index, 1)
        audioManager.playSuccess()
        Message.success('删除成功')
      }
    }
  })
}

const resetForm = () => {
  formState.id = null
  formState.name = ''
  formState.category = ''
  formState.description = ''
  formState.status = '进行中'
  formState.progress = 0
}

const handleModalOk = async () => {
  audioManager.playClick()
  if (!formState.name) {
    Message.warning('请输入协作名称')
    return
  }
  if (!formState.category) {
    Message.warning('请选择类别')
    return
  }
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  if (isEditMode.value) {
    const index = projects.value.findIndex(p => p.id === formState.id)
    if (index > -1) {
      projects.value[index] = {
        ...projects.value[index],
        name: formState.name,
        category: formState.category,
        description: formState.description,
        status: formState.status,
        progress: formState.progress
      }
    }
    audioManager.playSuccess()
    Message.success('更新成功')
  } else {
    const newProject = {
      id: Date.now(),
      name: formState.name,
      category: formState.category,
      description: formState.description,
      status: formState.status,
      progress: formState.progress,
      createdAt: new Date().toISOString().split('T')[0],
      members: [
        { id: 999, name: '我', color: '#667eea' }
      ]
    }
    projects.value.unshift(newProject)
    audioManager.playSuccess()
    Message.success('创建成功')
  }
  submitting.value = false
  modalVisible.value = false
  resetForm()
}

const handleModalCancel = () => {
  audioManager.playClick()
  modalVisible.value = false
  resetForm()
}

onMounted(() => audioManager.playClick())
</script>

<style scoped lang="scss">
.collaboration {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  color: #fff;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.create-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-size: 16px;
  padding: 0 32px;
  height: 44px;
  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #65408a 100%);
  }
}

.search-filter-section {
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  :deep(.arco-input) {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    &:focus {
      border-color: #667eea;
      background: rgba(255, 255, 255, 0.08);
    }
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  width: 150px;
  :deep(.arco-select-view) {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  .arco-select-view-value {
    color: #fff;
  }
}

.statistics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  &.total {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  &.active {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  &.members {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #a0a0a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.collaboration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.project-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
  }
}

.project-header {
  position: relative;
  padding: 24px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.project-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.project-category {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.project-info {
  padding: 20px;
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.project-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project-progress {
  margin-top: 16px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.progress-value {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.collaboration-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-list-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
  }
}

.list-icon-wrapper {
  flex-shrink: 0;
}

.list-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.list-content {
  flex: 1;
  min-width: 0;
}

.list-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.list-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12px;
  line-height: 1.5;
}

.list-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 13px;
}

.list-category {
  color: #667eea;
}

.list-date {
  color: rgba(255, 255, 255, 0.5);
}

.list-members {
  margin-bottom: 12px;
}

.list-status {
  flex-shrink: 0;
  min-width: 120px;
}

.list-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.empty-state {
  margin-top: 80px;
}

:deep(.arco-modal) {
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.arco-modal-header) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.arco-modal-title) {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

:deep(.arco-modal-close-btn) {
  color: rgba(255, 255, 255, 0.6);
  &:hover {
    color: #fff;
  }
}

:deep(.arco-modal-body) {
  padding: 24px;
}

:deep(.arco-modal-footer) {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.arco-form-item-label-col > label) {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

:deep(.arco-input),
:deep(.arco-textarea),
:deep(.arco-select-view) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  &:focus {
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.08);
  }
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
}

:deep(.arco-radio-button) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  &.arco-radio-button-checked {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: transparent;
    color: #fff;
  }
}

:deep(.arco-slider) {
  .arco-slider-track {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  .arco-slider-btn {
    border-color: #667eea;
  }
}

:deep(.arco-tag) {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

@media (max-width: 768px) {
  .collaboration {
    padding: 16px;
  }
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  .page-title {
    font-size: 24px;
  }
  .search-filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input {
    max-width: none;
  }
  .filter-controls {
    flex-wrap: wrap;
  }
  .filter-select {
    flex: 1;
    min-width: 120px;
  }
  .statistics-row {
    grid-template-columns: 1fr;
  }
  .collaboration-grid {
    grid-template-columns: 1fr;
  }
  .project-list-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .list-icon-wrapper {
    width: 100%;
  }
  .list-content {
    width: 100%;
  }
  .list-actions {
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
