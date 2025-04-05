<template>
  <div class="space-y-6">
    <h1 class="text-xl sm:text-2xl font-bold">用户管理</h1>

    <!-- 搜索表单 -->
    <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 class="text-lg font-medium mb-4">搜索条件</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <!-- 用户名 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input
            v-model="searchForm.username"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入用户名"
          >
        </div>
        <!-- 邮箱 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input
            v-model="searchForm.email"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入邮箱"
          >
        </div>
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

    <!-- 用户列表 -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
          <h2 class="text-lg font-medium">用户列表</h2>
          <!-- 用户统计 -->
          <div v-if="stats" class="flex flex-wrap gap-2 sm:gap-4">
            <div class="text-sm">
              <span class="text-gray-500">总用户数：</span>
              <span class="font-medium">{{ stats.totalUsers }}</span>
            </div>
            <div class="text-sm">
              <span class="text-gray-500">今日新增：</span>
              <span class="font-medium text-green-600">{{ stats.newUsersToday }}</span>
            </div>
            <div class="text-sm">
              <span class="text-gray-500">本月活跃：</span>
              <span class="font-medium text-blue-600">{{ stats.activeUsersThisMonth }}</span>
            </div>
          </div>
        </div>
        
        <!-- 响应式表格 -->
        <ResponsiveTable
          :columns="columns"
          :items="userList"
          :loading="loading"
        >
          <!-- 自定义状态列 -->
          <template #status="{ item }">
            <button
              @click="handleUpdateStatus(item)"
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer"
              :class="item.status ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'"
            >
              {{ item.status ? '正常' : '禁用' }}
            </button>
          </template>
          
          <!-- 自定义操作列 -->
          <template #actions="{ item }">
            <div class="space-x-2">
              <button
                @click="viewDetail(item.id)"
                class="text-blue-600 hover:text-blue-900"
              >
                查看
              </button>
              <button
                @click="handleDelete(item)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </div>
          </template>
        </ResponsiveTable>
        
        <!-- 分页 -->
        <div class="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div class="text-sm text-gray-700">
            共 {{ pagination.total }} 条记录
          </div>
          <div class="flex justify-center sm:justify-end space-x-2">
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
import { useRouter } from 'vue-router'
import { useMessage } from '@/composables/useMessage'
import { userService } from '@/api'
import { logger } from '@/utils/logger'
import ResponsiveTable from '@/components/common/ResponsiveTable.vue'

const router = useRouter()
const { showMessage } = useMessage()

// 搜索表单
const searchForm = ref({
  username: '',
  email: '',
  startDate: '',
  endDate: ''
})

// 用户列表数据
const userList = ref([])
const loading = ref(false)
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0
})

// 统计数据
const stats = ref(null)

// 表格列定义
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'username', label: '用户名' },
  { key: 'email', label: '邮箱' },
  { key: 'points', label: '积分' },
  { 
    key: 'status', 
    label: '状态',
  },
  { 
    key: 'created_at', 
    label: '创建时间',
    formatter: (item) => formatDate(item.created_at)
  },
  { key: 'actions', label: '操作' }
]

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

// 获取用户统计数据
const fetchStats = async () => {
  try {
    logger.info('开始获取用户统计数据')
    const response = await userService.getStats()

    if (response?.code === 200) {
      stats.value = response.data
      logger.info('获取用户统计数据成功', stats.value)
    } else {
      logger.warn('获取用户统计数据失败', response?.message)
    }
  } catch (error) {
    logger.error('获取用户统计数据失败', error)
  }
}

// 获取用户列表
const fetchUserList = async (searchParams = {}) => {
  loading.value = true
  try {
    logger.info('开始获取用户列表', {
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...searchParams
    })

    const response = await userService.getList({
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...searchParams
    })

    if (response?.code === 200) {
      userList.value = response.data.items
      pagination.value.total = response.data.pagination.total
      logger.info('获取用户列表成功', { total: pagination.value.total })
    } else {
      const errorMsg = response?.message || '获取用户列表失败'
      showMessage(errorMsg, 'error')
      logger.warn('获取用户列表失败', { message: errorMsg, response })
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || '获取用户列表失败'
    showMessage(errorMsg, 'error')
    logger.error('获取用户列表失败', {
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

// 修改用户状态
const handleUpdateStatus = async (user) => {
  try {
    logger.info('开始修改用户状态', { userId: user.id, currentStatus: user.status })
    // 切换状态（true -> false 或 false -> true）
    const newStatus = !user.status
    const response = await userService.updateStatus(user.id, newStatus)

    if (response?.code === 200) {
      user.status = newStatus
      showMessage('状态修改成功', 'success')
      logger.info('修改用户状态成功', { userId: user.id, newStatus })
    } else {
      showMessage(response?.message || '状态修改失败', 'error')
      logger.warn('修改用户状态失败', response?.message)
    }
  } catch (error) {
    showMessage('状态修改失败', 'error')
    logger.error('修改用户状态失败', error)
  }
}

// 删除用户
const handleDelete = async (user) => {
  if (!confirm(`确定要删除用户 "${user.username}" 吗？`)) {
    return
  }

  try {
    logger.info('开始删除用户', { userId: user.id })
    const response = await userService.deleteUser(user.id)

    if (response?.code === 200) {
      showMessage('删除成功', 'success')
      logger.info('删除用户成功', { userId: user.id })
      // 重新加载列表
      fetchUserList()
      // 重新获取统计数据
      fetchStats()
    } else {
      showMessage(response?.message || '删除失败', 'error')
      logger.warn('删除用户失败', response?.message)
    }
  } catch (error) {
    showMessage('删除失败', 'error')
    logger.error('删除用户失败', error)
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
  fetchUserList(params)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    username: '',
    email: '',
    startDate: '',
    endDate: ''
  }
  pagination.value.page = 1
  fetchUserList()
}

// 页码变化
const handlePageChange = (page) => {
  if (page < 1 || (hasNextPage.value && page > Math.ceil(pagination.value.total / pagination.value.limit))) {
    return
  }
  pagination.value.page = page
  fetchUserList()
}

// 查看详情
const viewDetail = (userId) => {
  router.push(`/users/${userId}`)
}

// 页面加载时获取列表和统计数据
onMounted(() => {
  logger.info('用户列表页面加载')
  fetchUserList()
  fetchStats()
})
</script> 