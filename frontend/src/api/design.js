/**
 * 设计稿 API
 */

import request from '@/utils/request'

/**
 * 获取设计稿列表
 */
export function getDesigns(params) {
  return request({
    url: '/designs',
    method: 'get',
    params
  })
}

/**
 * 获取设计稿详情
 */
export function getDesignById(id) {
  return request({
    url: `/designs/${id}`,
    method: 'get'
  })
}

/**
 * 创建设计稿
 */
export function createDesign(data) {
  return request({
    url: '/designs',
    method: 'post',
    data
  })
}

/**
 * 更新设计稿
 */
export function updateDesign(id, data) {
  return request({
    url: `/designs/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除设计稿
 */
export function deleteDesign(id) {
  return request({
    url: `/designs/${id}`,
    method: 'delete'
  })
}

/**
 * 创建设计稿版本
 */
export function createDesignVersion(id, data) {
  return request({
    url: `/designs/${id}/versions`,
    method: 'post',
    data
  })
}

/**
 * 获取设计稿版本列表
 */
export function getDesignVersions(id) {
  return request({
    url: `/designs/${id}/versions`,
    method: 'get'
  })
}
