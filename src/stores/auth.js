import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/api/index'

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
      const response = await authService.login(username, password)
      if (response.code === 200 && response.data) {
        const { token: newToken, admin: adminData } = response.data
        token.value = newToken
        admin.value = adminData
        localStorage.setItem('token', newToken)
        return true
      }
      return false
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  /**
   * 清除登录状态
   */
  const logout = () => {
    token.value = ''
    admin.value = null
    localStorage.removeItem('token')
  }

  /**
   * 检查是否已登录
   */
  const isAuthenticated = () => !!token.value

  return {
    token,
    admin,
    login,
    logout,
    isAuthenticated
  }
}) 