<template>
  <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
    <h2 class="text-lg font-medium mb-4 sm:mb-6">用户统计</h2>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-lg p-4 h-24"></div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div v-else-if="stats" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <!-- 总用户数 -->
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">总用户数</p>
            <p class="mt-2 text-2xl sm:text-3xl font-bold text-blue-800">{{ stats.totalUsers }}</p>
          </div>
          <div class="bg-blue-100 rounded-full p-3">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-sm text-blue-600">平台总用户数量</p>
      </div>

      <!-- 今日新增 -->
      <div class="bg-green-50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">今日新增</p>
            <p class="mt-2 text-2xl sm:text-3xl font-bold text-green-800">{{ stats.newUsersToday }}</p>
          </div>
          <div class="bg-green-100 rounded-full p-3">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-sm text-green-600">今日新注册用户</p>
      </div>

      <!-- 本月活跃 -->
      <div class="bg-purple-50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-600 font-medium">本月活跃</p>
            <p class="mt-2 text-2xl sm:text-3xl font-bold text-purple-800">{{ stats.activeUsersThisMonth }}</p>
          </div>
          <div class="bg-purple-100 rounded-full p-3">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-sm text-purple-600">本月活跃用户数</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="text-center text-gray-500 py-4">
      <button
        @click="fetchStats"
        class="mt-2 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 focus:outline-none"
      >
        重新加载
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userService } from '@/api'
import { logger } from '@/utils/logger'

// 统计数据
const stats = ref(null)
const loading = ref(false)

// 转换统计数据
const transformStats = (data) => {
  // 尝试从不同的可能的字段名获取数据
  return {
    totalUsers: data.totalUsers || data.total_users || data.total || 0,
    newUsersToday: data.newUsersToday || data.new_users_today || data.new_today || 0,
    activeUsersThisMonth: data.activeUsersThisMonth || data.active_users_this_month || data.active_month || 0
  }
}

// 获取统计数据
const fetchStats = async () => {
  loading.value = true
  try {
    logger.info('开始获取用户统计数据')
    const response = await userService.getStats()
    logger.info('获取用户统计数据响应', response)

    if (response?.code === 200 && response.data) {
      // 转换数据
      stats.value = transformStats(response.data)
      logger.info('统计数据解析成功', stats.value)
    } else {
      stats.value = null
      logger.warn('获取用户统计数据失败', {
        code: response?.code,
        message: response?.message
      })
    }
  } catch (error) {
    stats.value = null
    logger.error('获取用户统计数据失败', {
      error: {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      }
    })
  } finally {
    loading.value = false
  }
}

// 组件加载时获取数据
onMounted(() => {
  fetchStats()
})

// 暴露方法供父组件调用
defineExpose({
  refresh: fetchStats
})
</script> 