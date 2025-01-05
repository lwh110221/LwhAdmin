<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  // 如果有token，尝试获取用户信息
  if (authStore.token) {
    const success = await authStore.fetchUserInfo()
    if (!success) {
      // 如果获取用户信息失败，清除token并跳转到登录页
      authStore.logout()
      router.push('/login')
    }
  }
})
</script>

<template>
  <router-view></router-view>
</template>

<style>
</style>
