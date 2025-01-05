<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- 总日志数 -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">总日志数</p>
          <p class="mt-2 text-3xl font-semibold text-gray-900">
            {{ loading ? '...' : stats.total_count || 0 }}
          </p>
        </div>
        <div class="p-3 bg-blue-500 bg-opacity-10 rounded-full">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>
      <div class="mt-4">
        <p class="text-sm text-gray-600">
          最近更新: {{ loading ? '...' : formatDate(stats.last_log_time) }}
        </p>
      </div>
    </div>

    <!-- 今日日志数 -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">今日日志数</p>
          <p class="mt-2 text-3xl font-semibold text-gray-900">
            {{ loading ? '...' : stats.today_count || 0 }}
          </p>
        </div>
        <div class="p-3 bg-green-500 bg-opacity-10 rounded-full">
          <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <div class="mt-4">
        <p class="text-sm text-gray-600">
          较昨日: 
          <span :class="stats.day_increase >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ loading ? '...' : (stats.day_increase >= 0 ? '+' : '') + stats.day_increase }}
          </span>
        </p>
      </div>
    </div>

    <!-- 错误日志数 -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">错误日志数</p>
          <p class="mt-2 text-3xl font-semibold text-gray-900">
            {{ loading ? '...' : stats.error_count || 0 }}
          </p>
        </div>
        <div class="p-3 bg-red-500 bg-opacity-10 rounded-full">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div class="mt-4">
        <p class="text-sm text-gray-600">
          错误率: {{ loading ? '...' : ((stats.error_count / stats.total_count * 100) || 0).toFixed(2) }}%
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { logService } from '@/api'
import { logger } from '@/utils/logger'

// 统计数据
const stats = ref({
  total_count: 0,
  today_count: 0,
  error_count: 0,
  day_increase: 0,
  last_log_time: null
})

// 加载状态
const loading = ref(false)

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '暂无'
  try {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  } catch (error) {
    logger.error('日期格式化错误', error)
    return '日期格式错误'
  }
}

// 获取统计数据
const fetchStats = async () => {
  loading.value = true
  try {
    const response = await logService.getLogStats()
    if (response?.code === 200) {
      stats.value = response.data
      logger.info('获取日志统计数据成功', stats.value)
    } else {
      logger.warn('获取日志统计数据失败', response?.message)
    }
  } catch (error) {
    logger.error('获取日志统计数据失败', error)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchStats()
})

defineExpose({
  stats,
  loading,
  formatDate,
  fetchStats
})
</script> 