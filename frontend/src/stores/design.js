/**
 * 设计稿状态管理
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as DesignApi from '@/api/design'

export const useDesignStore = defineStore('design', () => {
  const designs = ref([])
  const currentDesign = ref(null)
  const loading = ref(false)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  })

  /**
   * 获取设计稿列表
   */
  async function fetchDesigns(params = {}) {
    loading.value = true
    try {
      const res = await DesignApi.getDesigns(params)
      designs.value = res.designs
      pagination.value = res.pagination
    } catch (error) {
      console.error('获取设计稿列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取设计稿详情
   */
  async function fetchDesignById(id) {
    loading.value = true
    try {
      const res = await DesignApi.getDesignById(id)
      currentDesign.value = res.data
      return res.data
    } catch (error) {
      console.error('获取设计稿详情失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建设计稿
   */
  async function addDesign(data) {
    try {
      const res = await DesignApi.createDesign(data)
      await fetchDesigns()
      return res.data
    } catch (error) {
      console.error('创建设计稿失败:', error)
      throw error
    }
  }

  /**
   * 更新设计稿
   */
  async function updateDesignData(id, data) {
    try {
      const res = await DesignApi.updateDesign(id, data)
      await fetchDesigns()
      return res.data
    } catch (error) {
      console.error('更新设计稿失败:', error)
      throw error
    }
  }

  /**
   * 删除设计稿
   */
  async function removeDesign(id) {
    try {
      await DesignApi.deleteDesign(id)
      await fetchDesigns()
    } catch (error) {
      console.error('删除设计稿失败:', error)
      throw error
    }
  }

  return {
    designs,
    currentDesign,
    loading,
    pagination,
    fetchDesigns,
    fetchDesignById,
    addDesign,
    updateDesignData,
    removeDesign
  }
})
