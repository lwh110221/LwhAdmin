import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/api/index'
import { logger } from '@/utils/logger'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const admin = ref(null)

  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   */
  const login = async (username, password) => {
    try {
      logger.info('开始登录', { username })
      const response = await authService.login(username, password)
      logger.info('登录响应', response)
      
      if (response?.code === 200) {
        const { token: newToken, admin: adminData } = response.data
        token.value = newToken
        admin.value = adminData
        localStorage.setItem('token', newToken)
        logger.info('登录成功', { username: adminData.username })
        return true
      }
      logger.warn('登录失败', response?.message)
      return false
    } catch (error) {
      logger.error('登录失败', error)
      return false
    }
  }

  /**
   * 获取管理员信息
   */
  const fetchUserInfo = async () => {
    try {
      logger.info('开始获取管理员信息')
      const response = await authService.getProfile()
      logger.info('获取管理员信息响应', response)
      
      if (response?.code === 200) {
        admin.value = response.data
        logger.info('获取管理员信息成功', admin.value)
        return true
      }
      logger.warn('获取管理员信息失败', response?.message)
      return false
    } catch (error) {
      logger.error('获取管理员信息失败', error)
      return false
    }
  }

  /**
   * 清除登录状态
   */
  const logout = () => {
    logger.info('用户登出', { username: admin.value?.username })
    token.value = ''
    admin.value = null
    localStorage.removeItem('token')
  }

  /**
   * 检查是否已登录
   */
  const isAuthenticated = () => {
    const hasToken = !!token.value
    // 如果有token但没有用户信息，尝试获取用户信息
    if (hasToken && !admin.value) {
      logger.info('检测到token但无用户信息，尝试获取用户信息')
      fetchUserInfo()
    }
    return hasToken
  }

  return {
    token,
    admin,
    login,
    logout,
    isAuthenticated,
    fetchUserInfo
  }
}) 