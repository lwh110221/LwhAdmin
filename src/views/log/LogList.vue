<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 统计数据 -->
    <LogStats class="mb-6" />

    <!-- 搜索表单 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-medium mb-4">搜索条件</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 关键词搜索 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">关键词</label>
          <input
            v-model="searchForm.keyword"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="搜索日志内容"
          >
        </div>
        <!-- 日志类型 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">日志类型</label>
          <select
            v-model="searchForm.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部类型</option>
            <option value="auth">认证相关</option>
            <option value="user">用户操作</option>
            <option value="news">新闻操作</option>
            <option value="moment">动态操作</option>
            <option value="system">系统操作</option>
          </select>
        </div>
        <!-- 日志级别 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">日志级别</label>
          <select
            v-model="searchForm.level"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部级别</option>
            <option value="info">信息</option>
            <option value="warn">警告</option>
            <option value="error">错误</option>
          </select>
        </div>
        <!-- 时间范围 -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">时间范围</label>
          <div class="flex space-x-4">
            <input
              v-model="searchForm.start_time"
              type="datetime-local"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <span class="self-center">至</span>
            <input
              v-model="searchForm.end_time"
              type="datetime-local"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>
      </div>
      <!-- 操作按钮 -->
      <div class="mt-4 flex justify-end space-x-3">
        <button
          @click="resetSearch"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          重置
        </button>
        <button
          @click="handleSearch"
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          搜索
        </button>
      </div>
    </div>

    <!-- 日志列表 -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium">日志列表</h2>
          <button
            @click="handleClean"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            清理日志
          </button>
        </div>

        <!-- 日志列表内容 -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">级别</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP地址</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作人</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading" class="animate-pulse">
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  加载中...
                </td>
              </tr>
              <tr v-else-if="!logList.length" class="hover:bg-gray-50">
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  暂无数据
                </td>
              </tr>
              <tr v-for="log in logList" :key="log.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ log.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-blue-100 text-blue-800': log.type === 'auth',
                      'bg-green-100 text-green-800': log.type === 'user',
                      'bg-yellow-100 text-yellow-800': log.type === 'news',
                      'bg-purple-100 text-purple-800': log.type === 'moment',
                      'bg-gray-100 text-gray-800': log.type === 'system'
                    }"
                  >
                    {{ getLogType(log.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': log.level === 'info',
                      'bg-yellow-100 text-yellow-800': log.level === 'warn',
                      'bg-red-100 text-red-800': log.level === 'error'
                    }"
                  >
                    {{ getLogLevel(log.level) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">{{ log.content }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ log.ip }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ log.operator }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(log.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-700">
            共 {{ pagination.total }} 条记录
          </div>
          <div class="flex justify-end space-x-2">
            <button
              @click="handlePageChange(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              :class="pagination.page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'"
            >
              上一页
            </button>
            <span class="px-3 py-1 text-sm">
              第 {{ pagination.page }} 页
            </span>
            <button
              @click="handlePageChange(pagination.page + 1)"
              :disabled="!hasNextPage"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              :class="!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { logService } from '@/api'
import { logger } from '@/utils/logger'
import LogStats from './LogStats.vue'

const { showMessage } = useMessage()

// 搜索表单
const searchForm = ref({
  keyword: '',
  type: '',
  level: '',
  start_time: '',
  end_time: ''
})

// 日志列表数据
const logList = ref([])
const loading = ref(false)
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0
})

// 计算是否有下一页
const hasNextPage = computed(() => {
  return pagination.value.page * pagination.value.limit < pagination.value.total
})

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

// 获取日志类型文本
const getLogType = (type) => {
  const types = {
    auth: '认证相关',
    user: '用户操作',
    news: '新闻操作',
    moment: '动态操作',
    system: '系统操作'
  }
  return types[type] || type
}

// 获取日志级别文本
const getLogLevel = (level) => {
  const levels = {
    info: '信息',
    warn: '警告',
    error: '错误'
  }
  return levels[level] || level
}

// 获取日志列表
const fetchLogList = async (searchParams = {}) => {
  loading.value = true
  try {
    logger.info('开始获取日志列表', {
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...searchParams
    })

    const response = await logService.getLogList({
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...searchParams
    })

    if (response?.code === 200) {
      logList.value = response.data.items
      pagination.value.total = response.data.pagination.total
      logger.info('获取日志列表成功', { total: pagination.value.total })
    } else {
      showMessage(response?.message || '获取日志列表失败', 'error')
      logger.warn('获取日志列表失败', response?.message)
    }
  } catch (error) {
    showMessage('获取日志列表失败', 'error')
    logger.error('获取日志列表失败', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  // 移除空值
  const params = {}
  Object.entries(searchForm.value).forEach(([key, value]) => {
    if (value !== '') {
      params[key] = value
    }
  })

  logger.info('搜索参数', params)
  pagination.value.page = 1
  fetchLogList(params)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    type: '',
    level: '',
    start_time: '',
    end_time: ''
  }
  pagination.value.page = 1
  fetchLogList()
}

// 页码变化
const handlePageChange = (page) => {
  if (page < 1 || (hasNextPage.value && page > Math.ceil(pagination.value.total / pagination.value.limit))) {
    return
  }
  pagination.value.page = page
  fetchLogList()
}

// 清理日志
const handleClean = async () => {
  if (!confirm('确定要清理日志吗？此操作不可恢复！')) {
    return
  }

  try {
    logger.info('开始清理日志', searchForm.value)
    const response = await logService.cleanLogs(searchForm.value)

    if (response?.code === 200) {
      showMessage('清理成功', 'success')
      logger.info('清理日志成功')
      // 刷新列表和统计数据
      fetchLogList()
      // 通知统计组件刷新数据
      const statsComponent = document.querySelector('log-stats')?.__vueParentComponent?.ctx
      if (statsComponent?.fetchStats) {
        statsComponent.fetchStats()
      }
    } else {
      showMessage(response?.message || '清理失败', 'error')
      logger.warn('清理日志失败', response?.message)
    }
  } catch (error) {
    showMessage('清理失败', 'error')
    logger.error('清理日志失败', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  logger.info('日志列表页面加载')
  fetchLogList()
})

defineExpose({
  logList,
  loading,
  pagination,
  hasNextPage,
  searchForm,
  formatDate,
  getLogType,
  getLogLevel,
  handleSearch,
  resetSearch,
  handlePageChange,
  handleClean
})
</script> 