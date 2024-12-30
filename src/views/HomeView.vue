<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">欢迎回来，{{ authStore.admin?.username }}</h1>
    <div class="bg-white shadow rounded-lg p-6">
      <p class="text-gray-600">
        这里是后台管理系统的首页，您可以在左侧菜单中选择要管理的功能。
      </p>
    </div>
  </div>
</template>
