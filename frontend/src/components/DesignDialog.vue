<template>
  <a-modal
    :visible="modelValue"
    :title="isEdit ? '编辑设计稿' : '新建设计稿'"
    :width="600"
    :footer="false"
    @cancel="handleClose"
    unmount-on-close
  >
    <a-form
      :model="form"
      :rules="rules"
      ref="formRef"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
      layout="horizontal"
    >
      <a-form-item label="设计标题" field="title">
        <a-input v-model="form.title" placeholder="请输入设计标题" allow-clear />
      </a-form-item>

      <a-form-item label="分类" field="category">
        <a-select v-model="form.category" placeholder="请选择分类" allow-clear>
          <a-option label="春装" value="春装" />
          <a-option label="夏装" value="夏装" />
          <a-option label="秋装" value="秋装" />
          <a-option label="冬装" value="冬装" />
          <a-option label="运动" value="运动" />
          <a-option label="休闲" value="休闲" />
        </a-select>
      </a-form-item>

      <a-form-item label="季节" field="season">
        <a-select v-model="form.season" placeholder="请选择季节" allow-clear>
          <a-option label="2024 春夏" value="2024 春夏" />
          <a-option label="2024 秋冬" value="2024 秋冬" />
          <a-option label="2025 春夏" value="2025 春夏" />
        </a-select>
      </a-form-item>

      <a-form-item label="设计师" field="designer">
        <a-input v-model="form.designer" placeholder="请输入设计师名称" allow-clear />
      </a-form-item>

      <a-form-item label="状态" field="status">
        <a-radio-group v-model="form.status">
          <a-radio value="draft">草稿</a-radio>
          <a-radio value="published">已发布</a-radio>
          <a-radio value="archived">已归档</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="设计图片" field="imageUrl">
        <div class="upload-section">
          <a-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            @change="handleImageChange"
          >
            <template #upload-button>
              <a-button type="primary">
                <template #icon>
                  <icon-image />
                </template>
                选择图片
              </a-button>
            </template>
          </a-upload>
          <div v-if="form.imageUrl" class="preview-image">
            <a-image
              :src="form.imageUrl"
              fit="contain"
              :height="200"
              :preview="true"
            />
          </div>
        </div>
      </a-form-item>

      <a-form-item label="设计说明" field="description">
        <a-textarea
          v-model="form.description"
          placeholder="请输入设计说明"
          :rows="4"
          allow-clear
        />
      </a-form-item>
    </a-form>

    <div class="dialog-footer">
      <a-space>
        <a-button @click="handleClose">取消</a-button>
        <a-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '保存' : '创建' }}
        </a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconImage } from '@arco-design/web-vue/es/icon'
import { createDesign, updateDesign } from '@/api/design'
import { uploadDesignImage } from '@/api/upload'

const props = defineProps({
  modelValue: Boolean,
  design: Object
})

const emit = defineEmits(['update:modelValue', 'success'])

const formRef = ref(null)
const submitting = ref(false)
const imageFile = ref(null)

const isEdit = computed(() => !!props.design)

const form = reactive({
  title: '',
  category: '',
  season: '',
  designer: '',
  status: 'draft',
  imageUrl: '',
  description: ''
})

const rules = {
  title: [{ required: true, message: '请输入设计标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  designer: [{ required: true, message: '请输入设计师名称', trigger: 'blur' }]
}

watch(() => props.design, (newVal) => {
  if (newVal) {
    Object.assign(form, {
      title: newVal.title || '',
      category: newVal.category || '',
      season: newVal.season || '',
      designer: newVal.designer || '',
      status: newVal.status || 'draft',
      imageUrl: newVal.imageUrl || '',
      description: newVal.description || ''
    })
  } else {
    resetForm()
  }
})

function resetForm() {
  Object.assign(form, {
    title: '',
    category: '',
    season: '',
    designer: '',
    status: 'draft',
    imageUrl: '',
    description: ''
  })
  imageFile.value = null
}

function handleClose() {
  emit('update:modelValue', false)
  resetForm()
}

async function handleImageChange(fileList) {
  if (fileList && fileList.length > 0) {
    imageFile.value = fileList[0].originFile
    // 本地预览
    form.imageUrl = URL.createObjectURL(fileList[0].originFile)
  }
}

async function handleSubmit() {
  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    submitting.value = true

    // 如果有新图片，先上传
    if (imageFile.value) {
      const res = await uploadDesignImage(imageFile.value)
      form.imageUrl = res.data.imageUrl
    }

    if (isEdit.value) {
      await updateDesign(props.design.id, form)
      Message.success('更新成功')
    } else {
      await createDesign(form)
      Message.success('创建成功')
    }

    emit('success')
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.upload-section {
  width: 100%;
}

.preview-image {
  margin-top: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  background: rgba(26, 31, 58, 0.5);
}

.dialog-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

/* Arco Design 暗色主题适配 */
:deep(.arco-modal-header) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

:deep(.arco-modal-body) {
  background: transparent;
}

:deep(.arco-modal) {
  background: var(--color-surface);
}

:deep(.arco-form-item-label-col > .arco-form-item-label) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.arco-input),
:deep(.arco-select),
:deep(.arco-textarea) {
  background: rgba(26, 31, 58, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

:deep(.arco-input::placeholder),
:deep(.arco-select .arco-select-placeholder),
:deep(.arco-textarea::placeholder) {
  color: rgba(255, 255, 255, 0.35);
}

:deep(.arco-input:hover),
:deep(.arco-select:hover),
:deep(.arco-textarea:hover) {
  border-color: var(--color-electric);
}

:deep(.arco-input:focus),
:deep(.arco-select-focus),
:deep(.arco-textarea:focus) {
  border-color: var(--color-electric);
  background: rgba(26, 31, 58, 0.8);
}

:deep(.arco-radio-text) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.arco-image-img) {
  border-radius: 4px;
}
</style>
