<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 搜索表单 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-medium mb-4">搜索条件</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 开始日期 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
          <input
            v-model="searchForm.startDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <!-- 结束日期 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
          <input
            v-model="searchForm.endDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
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

    <!-- 动态列表 -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium">动态列表</h2>
          <!-- 动态统计 -->
          <div v-if="stats" class="flex space-x-4">
            <div class="text-sm">
              <span class="text-gray-500">总动态数：</span>
              <span class="font-medium">{{ stats.total_moments }}</span>
            </div>
            <div class="text-sm">
              <span class="text-gray-500">今日新增：</span>
              <span class="font-medium text-green-600">{{ stats.today_new_moments }}</span>
            </div>
          </div>
        </div>

        <!-- 动态列表内容 -->
        <div class="space-y-4">
          <!-- 加载状态 -->
          <div v-if="loading" class="animate-pulse space-y-4">
            <div v-for="i in 3" :key="i" class="bg-gray-50 p-4 rounded-lg">
              <div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>

          <!-- 暂无数据 -->
          <div v-else-if="!momentList.length" class="text-center text-gray-500 py-8">
            暂无动态数据
          </div>

          <!-- 动态列表 -->
          <div v-else class="divide-y divide-gray-100">
            <div v-for="moment in momentList" :key="moment.id" class="bg-gray-50 p-4 rounded-lg">
              <!-- 用户信息和时间 -->
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">{{ moment.username }}</span>
                  <span class="text-sm text-gray-500">ID: {{ moment.user_id }}</span>
                </div>
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-500">{{ formatDate(moment.created_at) }}</span>
                  <button
                    @click="handleDelete(moment)"
                    class="text-red-600 hover:text-red-900 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>

              <!-- 动态内容 -->
              <p class="text-gray-800 mb-3">{{ moment.content }}</p>

              <!-- 图片展示 -->
              <div v-if="moment.images?.length" class="flex flex-wrap gap-2">
                <img
                  v-for="image in moment.images"
                  :key="image"
                  :src="getImageUrl(image)"
                  alt="动态图片"
                  class="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-90"
                  @click="openImagePreview(moment.images, image)"
                >
              </div>
            </div>
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

    <!-- 图片预览模态框 -->
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      @click="showPreview = false"
    >
      <div class="relative max-w-full max-h-full">
        <img
          :src="getImageUrl(previewImages[currentPreviewIndex])"
          class="max-w-full max-h-[90vh] object-contain"
          alt="预览图片"
        >
        <!-- 导航按钮 -->
        <button
          v-if="previewImages.length > 1 && currentPreviewIndex > 0"
          @click.stop="currentPreviewIndex--"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
        >
          ←
        </button>
        <button
          v-if="previewImages.length > 1 && currentPreviewIndex < previewImages.length - 1"
          @click.stop="currentPreviewIndex++"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { momentService } from '@/api'
import { logger } from '@/utils/logger'
import { getImageUrl } from '@/utils/image'

const { showMessage } = useMessage()

// 搜索表单
const searchForm = ref({
  startDate: '',
  endDate: ''
})

// 动态列表数据
const momentList = ref([])
const loading = ref(false)
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0
})

// 统计数据
const stats = ref(null)

// 图片预览相关
const showPreview = ref(false)
const previewImages = ref([])
const currentPreviewIndex = ref(0)

const openImagePreview = (images, currentImage) => {
  previewImages.value = images
  currentPreviewIndex.value = images.indexOf(currentImage)
  showPreview.value = true
}

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

// 获取动态统计数据
const fetchStats = async () => {
  try {
    logger.info('开始获取动态统计数据')
    const response = await momentService.getStats()

    if (response?.code === 200) {
      stats.value = response.data
      logger.info('获取动态统计数据成功', stats.value)
    } else {
      logger.warn('获取动态统计数据失败', response?.message)
    }
  } catch (error) {
    logger.error('获取动态统计数据失败', error)
  }
}

// 获取动态列表
const fetchMomentList = async (searchParams = {}) => {
  loading.value = true
  try {
    logger.info('开始获取动态列表', {
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...searchParams
    })

    const response = await momentService.getList({
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...searchParams
    })

    if (response?.code === 200) {
      momentList.value = response.data.items
      pagination.value.total = response.data.pagination.total
      logger.info('获取动态列表成功', { total: pagination.value.total })
    } else {
      const errorMsg = response?.message || '获取动态列表失败'
      showMessage(errorMsg, 'error')
      logger.warn('获取动态列表失败', { message: errorMsg, response })
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || '获取动态列表失败'
    showMessage(errorMsg, 'error')
    logger.error('获取动态列表失败', {
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

// 删除动态
const handleDelete = async (moment) => {
  if (!confirm(`确定要删除该动态吗？`)) {
    return
  }

  try {
    logger.info('开始删除动态', { momentId: moment.id })
    const response = await momentService.deleteMoment(moment.id)

    if (response?.code === 200) {
      showMessage('删除成功', 'success')
      logger.info('删除动态成功', { momentId: moment.id })
      // 重新加载列表
      fetchMomentList()
      // 重新获取统计数据
      fetchStats()
    } else {
      showMessage(response?.message || '删除失败', 'error')
      logger.warn('删除动态失败', response?.message)
    }
  } catch (error) {
    showMessage('删除失败', 'error')
    logger.error('删除动态失败', error)
  }
}

// 搜索
const handleSearch = () => {
  // 处理日期格式
  const params = {
    ...searchForm.value,
    startDate: searchForm.value.startDate ? new Date(searchForm.value.startDate).toISOString().split('T')[0] : undefined,
    endDate: searchForm.value.endDate ? new Date(searchForm.value.endDate).toISOString().split('T')[0] : undefined
  }

  // 移除空值
  Object.keys(params).forEach(key => {
    if (!params[key]) {
      delete params[key]
    }
  })

  logger.info('搜索参数', params)
  pagination.value.page = 1
  fetchMomentList(params)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    startDate: '',
    endDate: ''
  }
  pagination.value.page = 1
  fetchMomentList()
}

// 页码变化
const handlePageChange = (page) => {
  if (page < 1 || (hasNextPage.value && page > Math.ceil(pagination.value.total / pagination.value.limit))) {
    return
  }
  pagination.value.page = page
  fetchMomentList()
}

// 页面加载时获取列表和统计数据
onMounted(() => {
  logger.info('动态列表页面加载')
  fetchMomentList()
  fetchStats()
})

defineExpose({
  momentList,
  loading,
  pagination,
  stats,
  hasNextPage,
  showPreview,
  previewImages,
  currentPreviewIndex,
  searchForm,
  openImagePreview,
  getImageUrl,
  formatDate,
  handleSearch,
  resetSearch,
  handlePageChange,
  handleDelete
})
</script>
