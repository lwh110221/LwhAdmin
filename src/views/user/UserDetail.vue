<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 返回按钮 -->
    <div class="mb-6">
      <button
        @click="router.back()"
        class="flex items-center text-blue-600 hover:text-blue-800"
      >
        <span class="mr-2">←</span>
        返回列表
      </button>
    </div>

    <!-- 用户详情 -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6">用户详情</h2>
      <div v-if="loading" class="space-y-4 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div v-else-if="userDetail" class="space-y-6">
        <!-- 基本信息 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-center">
              <span class="text-gray-600 w-24">用户ID：</span>
              <span>{{ userDetail.id }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 w-24">用户名：</span>
              <span>{{ userDetail.username }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 w-24">邮箱：</span>
              <span>{{ userDetail.email }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 w-24">积分：</span>
              <span>{{ userDetail.points }}</span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex items-center">
              <span class="text-gray-600 w-24">状态：</span>
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="userDetail.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ userDetail.status ? '正常' : '禁用' }}
              </span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-600 w-24">创建时间：</span>
              <span>{{ formatDate(userDetail.created_at) }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-gray-600 w-24">个人简介：</span>
              <span class="flex-1">{{ userDetail.bio || '暂无' }}</span>
            </div>
          </div>
        </div>

        <!-- 最近动态 -->
        <div class="mt-8">
          <h3 class="text-lg font-medium mb-4">最近动态</h3>
          <div v-if="!userDetail.recent_moments?.length" class="text-gray-500">
            暂无动态
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="moment in userDetail.recent_moments"
              :key="moment.id"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="text-sm text-gray-600 mb-2">
                {{ formatDate(moment.created_at) }}
              </div>
              <div class="text-gray-900">
                {{ moment.content }}
              </div>
              <div v-if="moment.images?.length" class="mt-2 flex flex-wrap gap-2">
                <img
                  v-for="image in moment.images"
                  :key="image"
                  :src="image"
                  alt="动态图片"
                  class="w-20 h-20 object-cover rounded"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">
        获取用户信息失败
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from '@/composables/useMessage'
import { userService } from '@/api'
import { logger } from '@/utils/logger'

const router = useRouter()
const route = useRoute()
const { showMessage } = useMessage()

// 用户详情数据
const userDetail = ref(null)
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

// 获取用户详情
const fetchUserDetail = async () => {
  const userId = route.params.id
  if (!userId) {
    showMessage('用户ID不能为空', 'error')
    router.push('/users')
    return
  }

  loading.value = true
  try {
    logger.info('开始获取用户详情', { userId })
    const response = await userService.getDetail(userId)

    if (response?.code === 200) {
      userDetail.value = response.data
      logger.info('获取用户详情成功', { username: userDetail.value.username })
    } else {
      showMessage(response?.message || '获取用户详情失败', 'error')
      logger.warn('获取用户详情失败', response?.message)
    }
  } catch (error) {
    showMessage('获取用户详情失败', 'error')
    logger.error('获取用户详情失败', error)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取详情
onMounted(() => {
  logger.info('用户详情页面加载')
  fetchUserDetail()
})
</script> 