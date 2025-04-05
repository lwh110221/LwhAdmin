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
/* 设置基础样式 */
html {
  font-size: 16px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f3f4f6;
  color: #374151;
  overflow-x: hidden;
}

/* 响应式字体大小 */
@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}

/* 移动端表单元素优化 */
input, select, textarea, button {
  font-size: 1rem;
  line-height: 1.5;
}

/* 移动端优化 */
@media (max-width: 640px) {
  input, select, textarea, button {
    font-size: 16px; /* 防止iOS自动缩放 */
  }
}

/* 滚动条优化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 确保所有容器都有适当的padding */
.container {
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

/* 修复iOS点击高亮问题 */
* {
  -webkit-tap-highlight-color: transparent;
}
</style>
