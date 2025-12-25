/**
 * Axios 请求封装
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 30000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data

    // 如果返回的状态码不是成功，提示错误
    if (res.success === false) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  error => {
    console.error('请求错误:', error)

    let message = '网络错误，请稍后重试'

    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = error.response.data.error || '请求参数错误'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器错误'
          break
      }
    } else if (error.message) {
      message = error.message
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default request
