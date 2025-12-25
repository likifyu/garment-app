<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? '编辑设计稿' : '新建设计稿'"
    width="600px"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="设计标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入设计标题" />
      </el-form-item>

      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类">
          <el-option label="春装" value="春装" />
          <el-option label="夏装" value="夏装" />
          <el-option label="秋装" value="秋装" />
          <el-option label="冬装" value="冬装" />
          <el-option label="运动" value="运动" />
          <el-option label="休闲" value="休闲" />
        </el-select>
      </el-form-item>

      <el-form-item label="季节" prop="season">
        <el-select v-model="form.season" placeholder="请选择季节">
          <el-option label="2024 春夏" value="2024 春夏" />
          <el-option label="2024 秋冬" value="2024 秋冬" />
          <el-option label="2025 春夏" value="2025 春夏" />
        </el-select>
      </el-form-item>

      <el-form-item label="设计师" prop="designer">
        <el-input v-model="form.designer" placeholder="请输入设计师名称" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="draft">草稿</el-radio>
          <el-radio label="published">已发布</el-radio>
          <el-radio label="archived">已归档</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="设计图片" prop="imageUrl">
        <div class="upload-section">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleImageChange"
            :show-file-list="false"
            accept="image/*"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              选择图片
            </el-button>
          </el-upload>
          <div v-if="form.imageUrl" class="preview-image">
            <el-image :src="form.imageUrl" fit="contain" style="max-height: 200px" />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="设计说明">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入设计说明"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        {{ isEdit ? '保存' : '创建' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
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

async function handleImageChange(file) {
  imageFile.value = file.raw
  // 本地预览
  form.imageUrl = URL.createObjectURL(file.raw)
}

async function handleSubmit() {
  try {
    await formRef.value.validate()

    submitting.value = true

    // 如果有新图片，先上传
    if (imageFile.value) {
      const res = await uploadDesignImage(imageFile.value)
      form.imageUrl = res.data.imageUrl
    }

    if (isEdit.value) {
      await updateDesign(props.design.id, form)
      ElMessage.success('更新成功')
    } else {
      await createDesign(form)
      ElMessage.success('创建成功')
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
  margin-top: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
}
</style>
