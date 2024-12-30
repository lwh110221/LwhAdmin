import axios from 'axios'
import { logger } from '@/utils/logger'

// 创建axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    }
    logger.info(`Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    // 对请求错误做些什么
    logger.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const { data } = response
    logger.info(`Response: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`)
    return data
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      const { status, config } = error.response
      logger.error(`API Error: ${config.method?.toUpperCase()} ${config.url} - Status: ${status}`, error)
      
      switch (status) {
        case 401:
          // 未授权，跳转到登录页
          logger.warn('Unauthorized, redirecting to login page')
          break
        case 403:
          // 权限不足
          logger.warn('Permission denied')
          break
        case 404:
          // 请求不存在
          logger.warn('Resource not found')
          break
        case 500:
          // 服务器错误
          logger.error('Server error', error)
          break
        default:
          logger.error(`Unhandled error status: ${status}`, error)
          break
      }
    } else {
      logger.error('Network Error', error)
    }
    return Promise.reject(error)
  }
)

export default http 