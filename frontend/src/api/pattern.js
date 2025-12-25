/**
 * 样板 API
 */

import request from '@/utils/request'

/**
 * 获取样板列表
 */
export function getPatterns(params) {
  return request({
    url: '/patterns',
    method: 'get',
    params
  })
}

/**
 * 获取样板详情
 */
export function getPatternById(id) {
  return request({
    url: `/patterns/${id}`,
    method: 'get'
  })
}

/**
 * 创建样板
 */
export function createPattern(data) {
  return request({
    url: '/patterns',
    method: 'post',
    data
  })
}

/**
 * 更新样板
 */
export function updatePattern(id, data) {
  return request({
    url: `/patterns/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除样板
 */
export function deletePattern(id) {
  return request({
    url: `/patterns/${id}`,
    method: 'delete'
  })
}

/**
 * 根据设计稿获取样板
 */
export function getPatternsByDesignId(designId) {
  return request({
    url: `/patterns/design/${designId}`,
    method: 'get'
  })
}
