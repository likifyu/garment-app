<template>
  <div class="design-manage">
    <div class="page-header">
      <h1 class="page-title">设计作品集</h1>
      <a-button type="primary" size="large" @click="openCreateModal" class="create-btn">
        <template #icon><icon-plus /></template>
        新建设计
      </a-button>
    </div>
    <div class="search-filter-section">
      <a-input-search v-model="searchKeyword" placeholder="搜索设计作品..." size="large" class="search-input" @search="handleSearch">
        <template #prefix><icon-search /></template>
      </a-input-search>
      <div class="filter-controls">
        <a-select v-model="filterCategory" placeholder="全部分类" size="large" class="filter-select" allow-clear @change="handleFilter">
          <a-option value="">全部分类</a-option>
          <a-option value="连衣裙">连衣裙</a-option>
          <a-option value="套装">套装</a-option>
          <a-option value="上装">上装</a-option>
          <a-option value="下装">下装</a-option>
          <a-option value="配饰">配饰</a-option>
        </a-select>
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
        <div class="stat-icon total"><icon-file-image /></div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total }}</div>
          <div class="stat-label">总设计</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon progress"><icon-sync /></div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.inProgress }}</div>
          <div class="stat-label">进行中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon completed"><icon-check-circle /></div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
    </div>
    <div v-if="viewMode === 'grid'" class="design-grid">
      <div v-for="design in filteredDesigns" :key="design.id" class="design-card" @click="viewDesign(design)">
        <div class="design-image-wrapper">
          <div class="design-image-placeholder"><span class="placeholder-text">{{ design.name.charAt(0) }}</span></div>
          <div class="design-overlay">
            <a-button type="text" class="overlay-btn" @click.stop="editDesign(design)"><icon-edit /></a-button>
            <a-button type="text" class="overlay-btn" @click.stop="deleteDesign(design)"><icon-delete /></a-button>
          </div>
          <div class="category-tag">{{ design.category }}</div>
        </div>
        <div class="design-info">
          <h3 class="design-name">{{ design.name }}</h3>
          <div class="design-meta">
            <span class="design-date">{{ design.createdAt }}</span>
            <a-tag :color="getStatusColor(design.status)" size="small">{{ design.status }}</a-tag>
          </div>
          <div class="progress-section">
            <div class="progress-header"><span class="progress-label">进度</span><span class="progress-value">{{ design.progress }}%</span></div>
            <a-progress :percent="design.progress" :color="getProgressColor(design.progress)" :show-text="false" size="small" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="design-list">
      <div v-for="design in filteredDesigns" :key="design.id" class="design-list-item" @click="viewDesign(design)">
        <div class="list-image-wrapper"><div class="list-image-placeholder"><span class="placeholder-text">{{ design.name.charAt(0) }}</span></div></div>
        <div class="list-content">
          <h3 class="list-name">{{ design.name }}</h3>
          <div class="list-meta"><span class="list-category">{{ design.category }}</span><span class="list-date">{{ design.createdAt }}</span></div>
          <a-progress :percent="design.progress" :color="getProgressColor(design.progress)" size="small" />
        </div>
        <div class="list-status"><a-tag :color="getStatusColor(design.status)" size="large">{{ design.status }}</a-tag></div>
        <div class="list-actions">
          <a-button type="text" @click.stop="editDesign(design)"><template #icon><icon-edit /></template>编辑</a-button>
          <a-button type="text" status="danger" @click.stop="deleteDesign(design)"><template #icon><icon-delete /></template>删除</a-button>
        </div>
      </div>
    </div>
    <a-modal v-model:visible="modalVisible" :title="isEditMode ? '编辑设计' : '新建设计'" width="600px" @ok="handleModalOk" @cancel="handleModalCancel" :ok-button-props="{ loading: submitting }">
      <a-form :model="formState" layout="vertical" ref="formRef">
        <a-form-item field="name" label="设计名称" required><a-input v-model="formState.name" placeholder="请输入设计名称" size="large" /></a-form-item>
        <a-form-item field="category" label="分类" required>
          <a-select v-model="formState.category" placeholder="请选择分类" size="large">
            <a-option value="连衣裙">连衣裙</a-option>
            <a-option value="套装">套装</a-option>
            <a-option value="上装">上装</a-option>
            <a-option value="下装">下装</a-option>
            <a-option value="配饰">配饰</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="description" label="描述"><a-textarea v-model="formState.description" placeholder="请输入设计描述" :rows="4" size="large" /></a-form-item>
        <a-form-item field="status" label="状态" required>
          <a-radio-group v-model="formState.status" size="large">
            <a-radio value="进行中">进行中</a-radio>
            <a-radio value="已完成">已完成</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="progress" label="进度" required><a-slider v-model="formState.progress" :min="0" :max="100" :marks="{ 0: '0%', 50: '50%', 100: '100%' }" /></a-form-item>
        <a-form-item field="tags" label="标签"><a-input-tag v-model="formState.tags" placeholder="输入标签后按回车添加" allow-add size="large" /></a-form-item>
      </a-form>
    </a-modal>
    <a-empty v-if="filteredDesigns.length === 0" description="暂无设计作品" class="empty-state">
      <a-button type="primary" @click="openCreateModal">创建第一个设计</a-button>
    </a-empty>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { IconPlus, IconSearch, IconApps, IconList, IconFileImage, IconSync, IconCheckCircle, IconEdit, IconDelete } from '@arco-design/web-vue/es/icon'
import audioManager from '@/utils/audioManager'
const searchKeyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const viewMode = ref('grid')
const modalVisible = ref(false)
const isEditMode = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const formState = reactive({ id: null, name: '', category: '', description: '', status: '进行中', progress: 0, tags: [] })
const designs = ref([
  { id: 1, name: '春日碎花连衣裙', category: '连衣裙', description: '春日系列碎花连衣裙，采用轻盈面料', status: '已完成', progress: 100, createdAt: '2024-01-15', tags: ['春日', '碎花', '连衣裙'] },
  { id: 2, name: '商务休闲套装', category: '套装', description: '适合职场穿着的商务休闲套装', status: '进行中', progress: 65, createdAt: '2024-01-18', tags: ['商务', '休闲', '套装'] },
  { id: 3, name: '优雅蕾丝上衣', category: '上装', description: '精致蕾丝设计，展现优雅气质', status: '进行中', progress: 40, createdAt: '2024-01-20', tags: ['蕾丝', '优雅', '上衣'] },
  { id: 4, name: '高腰阔腿裤', category: '下装', description: '修饰腿型的高腰阔腿裤设计', status: '已完成', progress: 100, createdAt: '2024-01-22', tags: ['高腰', '阔腿裤', '修身'] },
  { id: 5, name: '复古波点半身裙', category: '下装', description: '复古风格波点图案半身裙', status: '进行中', progress: 80, createdAt: '2024-01-25', tags: ['复古', '波点', '半身裙'] },
  { id: 6, name: '丝绸方巾', category: '配饰', description: '纯手工印染丝绸方巾', status: '已完成', progress: 100, createdAt: '2024-01-28', tags: ['丝绸', '方巾', '配饰'] },
  { id: 7, name: '夏日清凉吊带裙', category: '连衣裙', description: '适合夏季穿着的清凉吊带裙', status: '进行中', progress: 25, createdAt: '2024-02-01', tags: ['夏日', '吊带裙', '清凉'] },
  { id: 8, name: '经典西装外套', category: '上装', description: '经典款西装外套，百搭实用', status: '进行中', progress: 55, createdAt: '2024-02-05', tags: ['西装', '外套', '经典'] }
])
const statistics = computed(() => ({ total: designs.value.length, inProgress: designs.value.filter(d => d.status === '进行中').length, completed: designs.value.filter(d => d.status === '已完成').length }))
const filteredDesigns = computed(() => {
  let result = [...designs.value]
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(d => d.name.toLowerCase().includes(keyword) || d.description.toLowerCase().includes(keyword) || d.tags.some(tag => tag.toLowerCase().includes(keyword)))
  }
  if (filterCategory.value) result = result.filter(d => d.category === filterCategory.value)
  if (filterStatus.value) result = result.filter(d => d.status === filterStatus.value)
  return result
})
const getStatusColor = (status) => status === '已完成' ? 'green' : 'blue'
const getProgressColor = (progress) => { if (progress === 100) return '#00b42a'; if (progress >= 50) return '#165dff'; return '#ff7d00' }
const handleSearch = () => audioManager.playClick()
const handleFilter = () => audioManager.playClick()
const handleViewModeChange = () => audioManager.playClick()
const viewDesign = (design) => { audioManager.playClick(); Message.info(`查看设计: ${design.name}`) }
const openCreateModal = () => { audioManager.playClick(); isEditMode.value = false; modalVisible.value = true; resetForm() }
const editDesign = (design) => { audioManager.playClick(); isEditMode.value = true; modalVisible.value = true; formState.id = design.id; formState.name = design.name; formState.category = design.category; formState.description = design.description; formState.status = design.status; formState.progress = design.progress; formState.tags = [...design.tags] }
const deleteDesign = (design) => { audioManager.playClick(); Modal.confirm({ title: '确认删除', content: `确定要删除设计「${design.name}」吗？此操作不可恢复。`, okText: '删除', cancelText: '取消', onOk: () => { const index = designs.value.findIndex(d => d.id === design.id); if (index > -1) { designs.value.splice(index, 1); audioManager.playSuccess(); Message.success('删除成功') } } }) }
const resetForm = () => { formState.id = null; formState.name = ''; formState.category = ''; formState.description = ''; formState.status = '进行中'; formState.progress = 0; formState.tags = [] }
const handleModalOk = async () => { audioManager.playClick(); if (!formState.name) { Message.warning('请输入设计名称'); return } if (!formState.category) { Message.warning('请选择分类'); return } submitting.value = true; await new Promise(resolve => setTimeout(resolve, 500)); if (isEditMode.value) { const index = designs.value.findIndex(d => d.id === formState.id); if (index > -1) { designs.value[index] = { ...designs.value[index], name: formState.name, category: formState.category, description: formState.description, status: formState.status, progress: formState.progress, tags: [...formState.tags] } } audioManager.playSuccess(); Message.success('更新成功') } else { const newDesign = { id: Date.now(), name: formState.name, category: formState.category, description: formState.description, status: formState.status, progress: formState.progress, createdAt: new Date().toISOString().split('T')[0], tags: [...formState.tags] }; designs.value.unshift(newDesign); audioManager.playSuccess(); Message.success('创建成功') } submitting.value = false; modalVisible.value = false; resetForm() }
const handleModalCancel = () => { audioManager.playClick(); modalVisible.value = false; resetForm() }
onMounted(() => audioManager.playClick())

</script>

<style scoped lang="scss">
.design-manage {
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

  &.progress {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.completed {
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

.design-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.design-card {
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

    .design-overlay {
      opacity: 1;
    }
  }
}

.design-image-wrapper {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.design-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 72px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
}

.design-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay-btn {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

.category-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.design-info {
  padding: 20px;
}

.design-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.design-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.design-date {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.progress-section {
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

.design-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.design-list-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.3);
  }
}

.list-image-wrapper {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
}

.list-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder-text {
    font-size: 32px;
  }
}

.list-content {
  flex: 1;
  min-width: 0;
}

.list-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
}

.list-category {
  color: #667eea;
}

.list-date {
  color: rgba(255, 255, 255, 0.5);
}

.list-status {
  flex-shrink: 0;
}

.list-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.empty-state {
  margin-top: 80px;
}

// Modal styles
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

:deep(.arco-input-tag) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.arco-tag {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
  color: #667eea;
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

// Responsive design
@media (max-width: 768px) {
  .design-manage {
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

  .design-grid {
    grid-template-columns: 1fr;
  }

  .design-list-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .list-image-wrapper {
    width: 100%;
    height: 200px;
  }

  .list-content {
    width: 100%;
  }

  .list-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>