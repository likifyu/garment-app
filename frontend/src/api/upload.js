/**
 * 文件上传 API
 */

import request from '@/utils/request'

/**
 * 上传设计稿图片
 */
export function uploadDesignImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('type', 'design')

  return request({
    url: '/upload/design',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 上传样板文件
 */
export function uploadPatternFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/upload/pattern',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 批量上传图片
 */
export function uploadMultipleImages(files) {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('images', file)
  })

  return request({
    url: '/upload/images',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
