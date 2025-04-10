<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 消息提示 -->
    <MessageAlert
      v-model="show"
      :message="message"
      :type="type"
    />

    <!-- 个人信息卡片 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-6">个人信息</h2>
      <div v-if="authStore.admin" class="space-y-4">
        <div class="flex items-center">
          <span class="text-gray-600 w-24">用户名：</span>
          <span>{{ authStore.admin.username }}</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-600 w-24">邮箱：</span>
          <span>{{ authStore.admin.email }}</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-600 w-24">角色：</span>
          <span>{{ authStore.admin.roles?.map(role => role.name).join(', ') }}</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-600 w-24">最后登录：</span>
          <span>{{ formatDate(authStore.admin.last_login) }}</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-600 w-24">权限：</span>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="permission in authStore.admin.permissions" 
              :key="permission.code"
              class="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
            >
              {{ permission.name }}
            </span>
          </div>
        </div>
        <!-- 修改密码按钮 -->
        <div class="mt-6">
          <button
            @click="showPasswordModal = true"
            class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            修改密码
          </button>
        </div>
      </div>
      <div v-else class="text-gray-500">加载中...</div>
    </div>

    <!-- 修改密码模态框 -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">修改密码</h2>
          <button @click="showPasswordModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleUpdatePassword" class="space-y-6">
          <!-- 原密码 -->
          <div>
            <label for="oldPassword" class="block text-sm font-medium text-gray-700 mb-2">
              原密码
            </label>
            <input
              id="oldPassword"
              v-model="passwordForm.oldPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errors.oldPassword}"
            />
            <p v-if="errors.oldPassword" class="mt-1 text-sm text-red-600">
              {{ errors.oldPassword }}
            </p>
          </div>

          <!-- 新密码 -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
              新密码
            </label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errors.newPassword}"
            />
            <p v-if="errors.newPassword" class="mt-1 text-sm text-red-600">
              {{ errors.newPassword }}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              密码必须包含大小写字母和数字，长度6-20位
            </p>
          </div>

          <!-- 确认新密码 -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              确认新密码
            </label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errors.confirmPassword}"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- 提交按钮 -->
          <div class="flex gap-4">
            <button
              type="button"
              class="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              @click="showPasswordModal = false"
            >
              取消
            </button>
            <button
              type="submit"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : '确认修改' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMessage } from '@/composables/useMessage'
import { useAuthStore } from '@/stores/auth'
import MessageAlert from '@/components/MessageAlert.vue'
import authService from '@/api/services/auth.service'
import { logger } from '@/utils/logger'

// 获取 auth store
const authStore = useAuthStore()

// 控制密码模态框显示
const showPasswordModal = ref(false)

// 密码表单
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 错误信息
const errors = ref({})

// 提交状态
const isSubmitting = ref(false)

// 使用消息提示组合式函数
const { show, message, type, showMessage } = useMessage()

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

// 获取个人信息
const fetchProfile = async () => {
  try {
    logger.info('开始获取个人信息')
    const success = await authStore.fetchUserInfo()
    if (!success) {
      logger.warn('获取个人信息失败')
      showMessage('获取个人信息失败', 'error')
    } else {
      logger.info('获取个人信息成功', authStore.admin)
    }
  } catch (error) {
    logger.error('获取个人信息失败', error)
    showMessage('获取个人信息失败', 'error')
  }
}

// 验证密码
const validatePassword = () => {
  errors.value = {}
  
  if (!passwordForm.value.oldPassword) {
    errors.value.oldPassword = '请输入原密码'
  }
  
  if (!passwordForm.value.newPassword) {
    errors.value.newPassword = '请输入新密码'
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/.test(passwordForm.value.newPassword)) {
    errors.value.newPassword = '新密码必须包含大小写字母和数字，长度6-20位'
  }
  
  if (!passwordForm.value.confirmPassword) {
    errors.value.confirmPassword = '请确认新密码'
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errors.value.confirmPassword = '两次输入的密码不一致'
  }
  
  if (Object.keys(errors.value).length > 0) {
    logger.warn('密码验证失败', errors.value)
    return false
  }
  return true
}

// 提交修改密码
const handleUpdatePassword = async () => {
  if (!validatePassword()) return
  
  isSubmitting.value = true
  try {
    logger.info('开始修改密码')
    const response = await authService.updatePassword(
      passwordForm.value.oldPassword,
      passwordForm.value.newPassword
    )
    logger.info('修改密码响应', response)
    
    if (response?.code === 200) {
      logger.info('密码修改成功')
      showMessage('密码修改成功', 'success')
      // 清空表单
      passwordForm.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      // 关闭模态框
      showPasswordModal.value = false
    } else {
      const errorMsg = response?.message || '密码修改失败'
      logger.warn('密码修改失败', errorMsg)
      showMessage(errorMsg, 'error')
    }
  } catch (error) {
    logger.error('密码修改失败', error)
    if (error.response?.data?.message) {
      showMessage(error.response.data.message, 'error')
    } else {
      showMessage('密码修改失败', 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

// 页面加载时获取个人信息
onMounted(() => {
  logger.info('个人信息页面加载')
  fetchProfile()
})
</script>