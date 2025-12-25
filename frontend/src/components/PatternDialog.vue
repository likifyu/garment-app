<template>
  <el-dialog
    :model-value="modelValue"
    :title="isEdit ? '编辑样板' : '新建样板'"
    width="600px"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="样板名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入样板名称" />
      </el-form-item>

      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类">
          <el-option label="上装" value="上装" />
          <el-option label="下装" value="下装" />
          <el-option label="套装" value="套装" />
          <el-option label="配饰" value="配饰" />
        </el-select>
      </el-form-item>

      <el-form-item label="尺码" prop="size">
        <el-select v-model="form.size" placeholder="请选择尺码">
          <el-option label="S" value="S" />
          <el-option label="M" value="M" />
          <el-option label="L" value="L" />
          <el-option label="XL" value="XL" />
          <el-option label="XXL" value="XXL" />
        </el-select>
      </el-form-item>

      <el-form-item label="关联设计" prop="designId">
        <el-select
          v-model="form.designId"
          placeholder="请选择关联的设计稿（可选）"
          clearable
          filterable
        >
          <el-option
            v-for="design in designs"
            :key="design.id"
            :label="design.title"
            :value="design.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="样板文件" prop="fileUrl">
        <div class="upload-section">
          <el-upload
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :show-file-list="false"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              选择文件
            </el-button>
            <template #tip>
              <div class="upload-tip">支持 PDF、DWG、DXF 等格式</div>
            </template>
          </el-upload>
          <div v-if="form.fileUrl" class="file-info">
            <el-icon><Document /></el-icon>
            {{ fileDisplayName }}
          </div>
        </div>
      </el-form-item>

      <el-form-item label="样板说明">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入样板说明"
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
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { createPattern, updatePattern } from '@/api/pattern'
import { uploadPatternFile } from '@/api/upload'
import { getDesigns } from '@/api/design'

const props = defineProps({
  modelValue: Boolean,
  pattern: Object
})

const emit = defineEmits(['update:modelValue', 'success'])

const formRef = ref(null)
const submitting = ref(false)
const fileObj = ref(null)
const designs = ref([])

const isEdit = computed(() => !!props.pattern)

const form = reactive({
  name: '',
  category: '',
  size: '',
  designId: null,
  fileUrl: '',
  description: ''
})

const fileDisplayName = computed(() => {
  if (fileObj.value) {
    return fileObj.value.name
  }
  if (form.fileUrl) {
    return form.fileUrl.split('/').pop()
  }
  return ''
})

const rules = {
  name: [{ required: true, message: '请输入样板名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  size: [{ required: true, message: '请选择尺码', trigger: 'change' }]
}

onMounted(async () => {
  await fetchDesigns()
})

async function fetchDesigns() {
  try {
    const res = await getDesigns({ limit: 100 })
    designs.value = res.designs
  } catch (error) {
    console.error('获取设计稿列表失败:', error)
  }
}

watch(() => props.pattern, (newVal) => {
  if (newVal) {
    Object.assign(form, {
      name: newVal.name || '',
      category: newVal.category || '',
      size: newVal.size || '',
      designId: newVal.designId,
      fileUrl: newVal.fileUrl || '',
      description: newVal.description || ''
    })
  } else {
    resetForm()
  }
})

function resetForm() {
  Object.assign(form, {
    name: '',
    category: '',
    size: '',
    designId: null,
    fileUrl: '',
    description: ''
  })
  fileObj.value = null
}

function handleClose() {
  emit('update:modelValue', false)
  resetForm()
}

function handleFileChange(file) {
  fileObj.value = file
}

async function handleSubmit() {
  try {
    await formRef.value.validate()

    submitting.value = true

    // 如果有新文件，先上传
    if (fileObj.value) {
      const res = await uploadPatternFile(fileObj.value.raw)
      form.fileUrl = res.data.fileUrl
    }

    if (isEdit.value) {
      await updatePattern(props.pattern.id, form)
      ElMessage.success('更新成功')
    } else {
      await createPattern(form)
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

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.file-info {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
