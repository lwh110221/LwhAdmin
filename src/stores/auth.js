import { defineStore } from 'pinia'
import { ref } from 'vue'
import http from '@/api/http'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const admin = ref(null)

  const login = async (username, password) => {
    try {
      const response = await http.post('/admin/auth/login', {
        username,
        password
      })
      
      if (response.code === 200 && response.data) {
        const { token: newToken, admin: adminData } = response.data
        token.value = newToken
        admin.value = adminData
        localStorage.setItem('token', newToken)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    token.value = ''
    admin.value = null
    localStorage.removeItem('token')
  }

  const isAuthenticated = () => !!token.value

  return {
    token,
    admin,
    login,
    logout,
    isAuthenticated
  }
}) 