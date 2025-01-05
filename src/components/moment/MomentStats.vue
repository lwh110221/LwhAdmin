<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-medium mb-6">动态统计</h2>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="i in 2" :key="i" class="bg-gray-100 rounded-lg p-4 h-24"></div>
      </div>
      <div class="animate-pulse h-64 bg-gray-100 rounded-lg"></div>
    </div>

    <!-- 统计数据 -->
    <div v-else-if="stats" class="space-y-6">
      <!-- 数据卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 总动态数 -->
        <div class="bg-indigo-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-indigo-600 font-medium">总动态数</p>
              <p class="mt-2 text-3xl font-bold text-indigo-800">{{ stats.total_moments }}</p>
            </div>
            <div class="bg-indigo-100 rounded-full p-3">
              <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <p class="mt-2 text-sm text-indigo-600">平台总动态数量</p>
        </div>

        <!-- 今日新增 -->
        <div class="bg-pink-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-pink-600 font-medium">今日新增</p>
              <p class="mt-2 text-3xl font-bold text-pink-800">{{ stats.today_new_moments }}</p>
            </div>
            <div class="bg-pink-100 rounded-full p-3">
              <svg class="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <p class="mt-2 text-sm text-pink-600">今日新发布动态</p>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="text-center text-gray-500 py-4">
      获取统计数据失败
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { momentService } from '@/api'
import { logger } from '@/utils/logger'

// 统计数据
const stats = ref(null)
const loading = ref(false)

// 获取统计数据
const fetchStats = async () => {
  loading.value = true
  try {
    logger.info('开始获取动态统计数据')
    const response = await momentService.getStats()
    logger.info('获取动态统计数据响应', response)

    if (response?.code === 200 && response.data) {
      stats.value = response.data
      logger.info('动态统计数据解析成功', stats.value)
    } else {
      stats.value = null
      logger.warn('获取动态统计数据失败', {
        code: response?.code,
        message: response?.message
      })
    }
  } catch (error) {
    stats.value = null
    logger.error('获取动态统计数据失败', {
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