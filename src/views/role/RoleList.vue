<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">角色管理</h1>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <!-- 操作按钮 -->
      <div class="mb-4">
        <button
          @click="showCreateDialog"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <i class="fas fa-plus mr-1"></i>
          创建角色
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
                名称
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                编码
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                描述
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                管理员数量
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                权限数量
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
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
            <tr v-else-if="roleList.length === 0">
              <td colspan="8" class="px-6 py-4">
                <div class="flex justify-center text-gray-500">暂无数据</div>
              </td>
            </tr>
            <tr v-for="role in roleList" :key="role.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ role.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ role.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ role.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ role.description || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ role.admin_count || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ role.permission_count || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  :class="{
                    'bg-green-100 text-green-800': role.status === 1,
                    'bg-red-100 text-red-800': role.status === 0
                  }"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ role.status === 1 ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex space-x-2">
                  <router-link
                    :to="`/roles/${role.id}`"
                    class="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  >
                    详情
                  </router-link>
                  <button
                    v-if="!['super_admin', 'admin'].includes(role.code)"
                    @click="showEditDialog(role)"
                    class="text-blue-600 hover:text-blue-900 cursor-pointer"
                  >
                    编辑
                  </button>
                  <button
                    v-if="!['super_admin', 'admin'].includes(role.code)"
                    @click="handleDelete(role)"
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
    </div>

    <!-- 创建角色对话框 -->
    <div v-if="createDialogVisible" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="createDialogVisible = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">创建角色</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">角色名称 <span class="text-red-500">*</span></label>
                <input
                  v-model="roleForm.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="请输入角色名称"
                />
                <div v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">角色编码 <span class="text-red-500">*</span></label>
                <input
                  v-model="roleForm.code"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="请输入角色编码，如 editor"
                />
                <div class="mt-1 text-xs text-gray-500">角色编码必须以小写字母开头，只能包含小写字母、数字和下划线</div>
                <div v-if="formErrors.code" class="mt-1 text-sm text-red-600">{{ formErrors.code }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">角色描述</label>
                <textarea
                  v-model="roleForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="请输入角色描述"
                ></textarea>
                <div v-if="formErrors.description" class="mt-1 text-sm text-red-600">{{ formErrors.description }}</div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="submitRoleForm"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="formLoading"
            >
              <span v-if="formLoading" class="mr-2">
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

    <!-- 编辑角色对话框 -->
    <div v-if="editDialogVisible" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="editDialogVisible = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">编辑角色</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">角色名称 <span class="text-red-500">*</span></label>
                <input
                  v-model="roleForm.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="请输入角色名称"
                />
                <div v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">角色编码</label>
                <div class="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md">
                  {{ roleForm.code }}
                </div>
                <div class="mt-1 text-xs text-gray-500">角色编码不可修改</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">角色描述</label>
                <textarea
                  v-model="roleForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="请输入角色描述"
                ></textarea>
                <div v-if="formErrors.description" class="mt-1 text-sm text-red-600">{{ formErrors.description }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <div class="flex items-center space-x-4">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="roleForm.status"
                      :value="1"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">启用</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      v-model="roleForm.status"
                      :value="0"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">禁用</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="submitRoleForm"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="formLoading"
            >
              <span v-if="formLoading" class="mr-2">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              确认
            </button>
            <button
              @click="editDialogVisible = false"
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
import { ref, reactive, onMounted } from 'vue'
import { roleService } from '@/api'
import { useRouter } from 'vue-router'

const router = useRouter()

// 角色列表数据
const roleList = ref([])
const loading = ref(false)

// 对话框控制
const createDialogVisible = ref(false)
const editDialogVisible = ref(false)
const formLoading = ref(false)

// 角色表单
const roleForm = reactive({
  id: null,
  name: '',
  code: '',
  description: '',
  status: 1
})

// 表单错误
const formErrors = reactive({
  name: '',
  code: '',
  description: ''
})

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    const { data } = await roleService.getRoleList()
    roleList.value = data
  } catch (error) {
    console.error('获取角色列表失败:', error)
    alert('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 显示创建角色对话框
const showCreateDialog = () => {
  // 重置表单
  roleForm.id = null
  roleForm.name = ''
  roleForm.code = ''
  roleForm.description = ''
  roleForm.status = 1

  // 清除错误
  resetFormErrors()

  createDialogVisible.value = true
}

// 显示编辑角色对话框
const showEditDialog = (role) => {
  // 设置表单数据
  roleForm.id = role.id
  roleForm.name = role.name
  roleForm.code = role.code
  roleForm.description = role.description || ''
  roleForm.status = role.status

  // 清除错误
  resetFormErrors()

  editDialogVisible.value = true
}

// 重置表单错误
const resetFormErrors = () => {
  formErrors.name = ''
  formErrors.code = ''
  formErrors.description = ''
}

// 验证表单
const validateForm = (isCreate = true) => {
  let isValid = true
  resetFormErrors()

  // 验证角色名称
  if (!roleForm.name.trim()) {
    formErrors.name = '请输入角色名称'
    isValid = false
  } else if (roleForm.name.length < 2 || roleForm.name.length > 50) {
    formErrors.name = '角色名称长度应在2-50字符之间'
    isValid = false
  }

  // 仅在创建角色时验证编码
  if (isCreate) {
    if (!roleForm.code.trim()) {
      formErrors.code = '请输入角色编码'
      isValid = false
    } else if (roleForm.code.length < 2 || roleForm.code.length > 50) {
      formErrors.code = '角色编码长度应在2-50字符之间'
      isValid = false
    } else if (!/^[a-z][a-z0-9_]*$/.test(roleForm.code)) {
      formErrors.code = '角色编码必须以小写字母开头，只能包含小写字母、数字和下划线'
      isValid = false
    }
  }

  // 验证角色描述
  if (roleForm.description && roleForm.description.length > 200) {
    formErrors.description = '角色描述不能超过200字符'
    isValid = false
  }

  return isValid
}

// 提交角色表单
const submitRoleForm = async () => {
  const isCreate = roleForm.id === null
  if (!validateForm(isCreate)) {
    return
  }

  formLoading.value = true
  try {
    if (isCreate) {
      // 创建角色
      await roleService.createRole({
        name: roleForm.name,
        code: roleForm.code,
        description: roleForm.description
      })
      createDialogVisible.value = false
      alert('创建角色成功')
    } else {
      // 更新角色
      await roleService.updateRole(roleForm.id, {
        name: roleForm.name,
        description: roleForm.description,
        status: roleForm.status
      })
      editDialogVisible.value = false
      alert('更新角色成功')
    }
    
    // 刷新角色列表
    fetchRoleList()
  } catch (error) {
    console.error(`${isCreate ? '创建' : '更新'}角色失败:`, error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert(`${isCreate ? '创建' : '更新'}角色失败`)
    }
  } finally {
    formLoading.value = false
  }
}

// 删除角色
const handleDelete = async (role) => {
  if (!confirm(`确定删除角色 "${role.name}" 吗？此操作不可恢复！`)) {
    return
  }

  try {
    await roleService.deleteRole(role.id)
    alert('删除角色成功')
    fetchRoleList()
  } catch (error) {
    console.error('删除角色失败:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert('删除角色失败')
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchRoleList()
})
</script>