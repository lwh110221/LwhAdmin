<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">管理员列表</h1>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <!-- 搜索表单 -->
      <div class="flex flex-wrap items-end mb-4 gap-4">
        <div class="w-full md:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input
            v-model="queryParams.username"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="请输入用户名"
          />
        </div>
        <div class="w-full md:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input
            v-model="queryParams.email"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="请输入邮箱"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="handleQuery"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-search mr-1"></i>
            查询
          </button>
          <button
            @click="resetQuery"
            class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            重置
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="mb-4">
        <button
          @click="showCreateDialog"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <i class="fas fa-plus mr-1"></i>
          创建管理员
        </button>
      </div>

      <!-- 表格 -->
      <div class="overflow-x-auto mt-4">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户名
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                邮箱
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                角色
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最后登录
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="8" class="px-6 py-4">
                <div class="flex justify-center">加载中...</div>
              </td>
            </tr>
            <tr v-else-if="adminList.length === 0">
              <td colspan="8" class="px-6 py-4">
                <div class="flex justify-center text-gray-500">暂无数据</div>
              </td>
            </tr>
            <tr v-for="admin in adminList" :key="admin.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ admin.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ admin.username }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ admin.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="role in admin.roles" 
                    :key="role"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ role }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  :class="{
                    'bg-green-100 text-green-800': admin.status === 1,
                    'bg-red-100 text-red-800': admin.status === 0
                  }"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ admin.status === 1 ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(admin.last_login) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(admin.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex space-x-2">
                  <button
                    v-if="currentAdmin.id !== admin.id"
                    @click="toggleStatus(admin)"
                    :class="{
                      'text-green-600 hover:text-green-900': admin.status === 0,
                      'text-red-600 hover:text-red-900': admin.status === 1
                    }"
                    class="cursor-pointer"
                  >
                    {{ admin.status === 1 ? '禁用' : '启用' }}
                  </button>
                  <button
                    v-if="currentAdmin.id !== admin.id"
                    @click="showRoleDialog(admin)"
                    class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  >
                    角色
                  </button>
                  <button
                    v-if="currentAdmin.id !== admin.id"
                    @click="handleDelete(admin)"
                    class="text-red-600 hover:text-red-900 cursor-pointer"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-500">
          总计 <span class="font-medium">{{ pagination.total }}</span> 条数据
        </div>
        <div class="flex justify-center">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              @click="handlePageChange(pagination.page - 1)"
              :disabled="pagination.page === 1"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 1 }"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="sr-only">上一页</span>
              <i class="fas fa-chevron-left"></i>
            </button>
            <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              {{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.limit) }}
            </span>
            <button
              @click="handlePageChange(pagination.page + 1)"
              :disabled="pagination.page >= Math.ceil(pagination.total / pagination.limit)"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.page >= Math.ceil(pagination.total / pagination.limit) }"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="sr-only">下一页</span>
              <i class="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- 创建管理员对话框 -->
    <div v-if="createDialogVisible" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="createDialogVisible = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">创建管理员</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  v-model="createForm.username"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="请输入用户名"
                />
                <div v-if="createFormErrors.username" class="mt-1 text-sm text-red-600">{{ createFormErrors.username }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  v-model="createForm.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="请输入邮箱"
                />
                <div v-if="createFormErrors.email" class="mt-1 text-sm text-red-600">{{ createFormErrors.email }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  v-model="createForm.password"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="请输入密码，至少6位，包含大小写字母和数字"
                />
                <div v-if="createFormErrors.password" class="mt-1 text-sm text-red-600">{{ createFormErrors.password }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
                <div class="space-y-2">
                  <div v-for="role in roleOptions" :key="role.id" class="flex items-center">
                    <input
                      :id="`role-${role.id}`"
                      type="checkbox"
                      :value="role.id"
                      v-model="createForm.roleIds"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label :for="`role-${role.id}`" class="ml-2 block text-sm text-gray-900">
                      {{ role.name }} ({{ role.code }})
                    </label>
                  </div>
                </div>
                <div v-if="createFormErrors.roleIds" class="mt-1 text-sm text-red-600">{{ createFormErrors.roleIds }}</div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="createAdmin"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="createLoading"
            >
              <span v-if="createLoading" class="mr-2">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              确认
            </button>
            <button
              @click="createDialogVisible = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 角色分配对话框 -->
    <div v-if="roleDialogVisible" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="roleDialogVisible = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">分配角色: {{ currentAdmin.username }}</h3>
            <div class="space-y-4">
              <div>
                <div class="space-y-2">
                  <div v-for="role in roleOptions" :key="role.id" class="flex items-center">
                    <input
                      :id="`role-edit-${role.id}`"
                      type="checkbox"
                      :value="role.id"
                      v-model="roleForm.roleIds"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label :for="`role-edit-${role.id}`" class="ml-2 block text-sm text-gray-900">
                      {{ role.name }} ({{ role.code }})
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="updateAdminRoles"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="roleLoading"
            >
              <span v-if="roleLoading" class="mr-2">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              确认
            </button>
            <button
              @click="roleDialogVisible = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { adminService } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { formatDateTime } from '@/utils/format'

// 获取当前登录管理员信息
const authStore = useAuthStore()
const currentAdmin = computed(() => authStore.admin || {})

// 查询参数
const queryParams = reactive({
  username: '',
  email: '',
  page: 1,
  limit: 10
})

// 管理员列表数据
const adminList = ref([])
const loading = ref(false)
const pagination = reactive({
  total: 0,
  page: 1,
  limit: 10
})

// 角色选项
const roleOptions = ref([])

// 创建管理员相关
const createDialogVisible = ref(false)
const createForm = reactive({
  username: '',
  email: '',
  password: '',
  roleIds: []
})
const createFormErrors = reactive({
  username: '',
  email: '',
  password: '',
  roleIds: ''
})
const createLoading = ref(false)

// 角色对话框相关
const roleDialogVisible = ref(false)
const roleForm = reactive({
  roleIds: []
})
const roleLoading = ref(false)

// 获取管理员列表
const fetchAdminList = async () => {
  loading.value = true
  try {
    const { data } = await adminService.getAdminList({
      ...queryParams,
      page: pagination.page,
      limit: pagination.limit
    })
    
    adminList.value = data.items.map(admin => ({
      ...admin,
      roles: admin.roles || []
    }))
    pagination.total = data.pagination.total
    pagination.page = data.pagination.page
    pagination.limit = data.pagination.limit
  } catch (error) {
    console.error('获取管理员列表失败:', error)
    alert('获取管理员列表失败')
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const fetchRoleList = async () => {
  try {
    const { data } = await adminService.getRoleList()
    roleOptions.value = data
  } catch (error) {
    console.error('获取角色列表失败:', error)
    alert('获取角色列表失败')
  }
}

// 查询处理
const handleQuery = () => {
  pagination.page = 1
  fetchAdminList()
}

// 重置查询
const resetQuery = () => {
  queryParams.username = ''
  queryParams.email = ''
  pagination.page = 1
  fetchAdminList()
}

// 分页处理
const handlePageChange = (page) => {
  if (page < 1 || page > Math.ceil(pagination.total / pagination.limit)) {
    return
  }
  pagination.page = page
  fetchAdminList()
}

// 验证创建表单
const validateCreateForm = () => {
  let isValid = true
  
  // 重置错误信息
  createFormErrors.username = ''
  createFormErrors.email = ''
  createFormErrors.password = ''
  createFormErrors.roleIds = ''
  
  // 验证用户名
  if (!createForm.username.trim()) {
    createFormErrors.username = '请输入用户名'
    isValid = false
  }
  
  // 验证邮箱
  if (!createForm.email.trim()) {
    createFormErrors.email = '请输入邮箱'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email)) {
    createFormErrors.email = '邮箱格式不正确'
    isValid = false
  }
  
  // 验证密码
  if (!createForm.password) {
    createFormErrors.password = '请输入密码'
    isValid = false
  } else if (createForm.password.length < 6) {
    createFormErrors.password = '密码长度不能少于6位'
    isValid = false
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(createForm.password)) {
    createFormErrors.password = '密码必须包含大小写字母和数字'
    isValid = false
  }
  
  // 验证角色
  if (createForm.roleIds.length === 0) {
    createFormErrors.roleIds = '请至少选择一个角色'
    isValid = false
  }
  
  return isValid
}

// 显示创建对话框
const showCreateDialog = () => {
  // 重置表单
  createForm.username = ''
  createForm.email = ''
  createForm.password = ''
  createForm.roleIds = []
  
  // 清除错误信息
  createFormErrors.username = ''
  createFormErrors.email = ''
  createFormErrors.password = ''
  createFormErrors.roleIds = ''
  
  createDialogVisible.value = true
}

// 创建管理员
const createAdmin = async () => {
  if (!validateCreateForm()) {
    return
  }
  
  createLoading.value = true
  try {
    await adminService.createAdmin(createForm)
    createDialogVisible.value = false
    alert('创建管理员成功')
    fetchAdminList()
  } catch (error) {
    console.error('创建管理员失败:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert('创建管理员失败')
    }
  } finally {
    createLoading.value = false
  }
}

// 切换管理员状态
const toggleStatus = async (admin) => {
  if (confirm(`确定${admin.status === 1 ? '禁用' : '启用'}该管理员吗？`)) {
    try {
      await adminService.updateAdminStatus(admin.id, admin.status === 0)
      alert(`${admin.status === 1 ? '禁用' : '启用'}管理员成功`)
      fetchAdminList()
    } catch (error) {
      console.error('更新管理员状态失败:', error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert('操作失败')
      }
    }
  }
}

// 显示角色对话框
const showRoleDialog = (admin) => {
  // 设置当前管理员和角色
  currentAdmin.value = admin
  
  // 初始化已选角色
  roleForm.roleIds = []
  
  // 根据管理员当前角色设置已选项
  if (admin.roles && admin.roles.length > 0) {
    // 将角色名称转换为角色ID
    const selectedRoleIds = roleOptions.value
      .filter(role => admin.roles.includes(role.name))
      .map(role => role.id)
    
    roleForm.roleIds = selectedRoleIds
  }
  
  roleDialogVisible.value = true
}

// 更新管理员角色
const updateAdminRoles = async () => {
  roleLoading.value = true
  try {
    await adminService.updateAdminRoles(currentAdmin.value.id, roleForm.roleIds)
    roleDialogVisible.value = false
    alert('更新角色成功')
    fetchAdminList()
  } catch (error) {
    console.error('更新角色失败:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert('更新角色失败')
    }
  } finally {
    roleLoading.value = false
  }
}

// 删除管理员
const handleDelete = async (admin) => {
  if (confirm(`确定删除管理员 ${admin.username} 吗？此操作不可恢复！`)) {
    try {
      await adminService.deleteAdmin(admin.id)
      alert('删除管理员成功')
      fetchAdminList()
    } catch (error) {
      console.error('删除管理员失败:', error)
      if (error.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert('删除管理员失败')
      }
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchAdminList()
  fetchRoleList()
})
</script> 