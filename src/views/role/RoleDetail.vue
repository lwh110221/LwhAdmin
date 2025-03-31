<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">角色详情</h1>
        <router-link
          to="/roles"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          返回列表
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </div>

    <div v-else-if="!roleDetail" class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div class="text-center py-8 text-gray-500">未找到角色信息</div>
    </div>

    <div v-else class="space-y-6">
      <!-- 基本信息 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-lg font-semibold mb-4">基本信息</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-500 mb-1">角色名称</p>
            <p class="font-medium">{{ roleDetail.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">角色编码</p>
            <p class="font-medium">{{ roleDetail.code }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">状态</p>
            <p class="font-medium">
              <span
                :class="{
                  'bg-green-100 text-green-800': roleDetail.status === 1,
                  'bg-red-100 text-red-800': roleDetail.status === 0
                }"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ roleDetail.status === 1 ? '启用' : '禁用' }}
              </span>
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">创建时间</p>
            <p class="font-medium">{{ formatDateTime(roleDetail.created_at) }}</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-sm text-gray-500 mb-1">描述</p>
            <p class="font-medium">{{ roleDetail.description || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 mb-1">使用该角色的管理员数量</p>
            <p class="font-medium">{{ roleDetail.admin_count || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- 权限信息 -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">角色权限</h2>
          <button
            v-if="roleDetail.code !== 'super_admin'"
            @click="showPermissionDialog"
            class="inline-flex items-center px-3 py-1.5 border border-indigo-500 text-indigo-500 hover:bg-indigo-50 rounded-md text-sm font-medium"
          >
            编辑权限
          </button>
        </div>

        <div v-if="roleDetail.permissions && roleDetail.permissions.length > 0" class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="permission in roleDetail.permissions"
              :key="permission.id"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ permission.name }} ({{ permission.code }})
            </span>
          </div>
        </div>
        <div v-else class="py-4 text-gray-500 text-center">
          该角色暂无权限
        </div>
      </div>
    </div>

    <!-- 权限分配对话框 -->
    <div v-if="permissionDialogVisible" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="permissionDialogVisible = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              编辑角色权限: {{ roleDetail.name }}
            </h3>
            
            <div v-if="loadingPermissions" class="py-8 flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            
            <div v-else-if="Object.keys(permissionGroups).length === 0" class="py-4 text-gray-500 text-center">
              暂无可用权限
            </div>
            
            <div v-else class="space-y-6 max-h-96 overflow-y-auto pr-2">
              <div v-for="(group, groupKey) in permissionGroups" :key="groupKey" class="border border-gray-200 rounded-md p-4">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-900">{{ group.name }}</h4>
                  <button
                    type="button"
                    @click="toggleGroupSelection(groupKey)"
                    class="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    {{ isGroupSelected(groupKey) ? '取消全选' : '全选' }}
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div
                    v-for="permission in group.permissions"
                    :key="permission.id"
                    class="flex items-center"
                  >
                    <input
                      :id="`permission-${permission.id}`"
                      type="checkbox"
                      :value="permission.id"
                      v-model="selectedPermissionIds"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label :for="`permission-${permission.id}`" class="ml-2 block text-sm text-gray-900">
                      {{ permission.name }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="updateRolePermissions"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="permissionLoading"
            >
              <span v-if="permissionLoading" class="mr-2">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              确认
            </button>
            <button
              @click="permissionDialogVisible = false"
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
import { useRoute, useRouter } from 'vue-router'
import { roleService } from '@/api'
import { formatDateTime } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const roleId = route.params.id

// 角色详情数据
const roleDetail = ref(null)
const loading = ref(false)

// 权限相关
const permissionDialogVisible = ref(false)
const permissionGroups = ref({})
const selectedPermissionIds = ref([])
const loadingPermissions = ref(false)
const permissionLoading = ref(false)

// 获取角色详情
const fetchRoleDetail = async () => {
  loading.value = true
  try {
    const { data } = await roleService.getRoleDetail(roleId)
    roleDetail.value = data
    
    // 初始化已选权限
    if (data.permissions) {
      selectedPermissionIds.value = data.permissions.map(p => p.id)
    }
  } catch (error) {
    console.error('获取角色详情失败:', error)
    alert('获取角色详情失败')
  } finally {
    loading.value = false
  }
}

// 获取所有权限列表
const fetchAllPermissions = async () => {
  loadingPermissions.value = true
  try {
    const { data } = await roleService.getAllPermissions()
    permissionGroups.value = data
  } catch (error) {
    console.error('获取权限列表失败:', error)
    alert('获取权限列表失败')
  } finally {
    loadingPermissions.value = false
  }
}

// 显示权限对话框
const showPermissionDialog = async () => {
  permissionDialogVisible.value = true
  
  // 如果还没有获取权限列表，则获取
  if (Object.keys(permissionGroups.value).length === 0) {
    await fetchAllPermissions()
  }
  
  // 设置已选权限
  if (roleDetail.value && roleDetail.value.permissions) {
    selectedPermissionIds.value = roleDetail.value.permissions.map(p => p.id)
  } else {
    selectedPermissionIds.value = []
  }
}

// 更新角色权限
const updateRolePermissions = async () => {
  permissionLoading.value = true
  try {
    await roleService.updateRolePermissions(roleId, selectedPermissionIds.value)
    permissionDialogVisible.value = false
    alert('更新角色权限成功')
    
    // 重新获取角色详情
    await fetchRoleDetail()
  } catch (error) {
    console.error('更新角色权限失败:', error)
    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert('更新角色权限失败')
    }
  } finally {
    permissionLoading.value = false
  }
}

// 检查分组是否全部选中
const isGroupSelected = (groupKey) => {
  if (!permissionGroups.value[groupKey]) return false
  
  const groupPermissionIds = permissionGroups.value[groupKey].permissions.map(p => p.id)
  return groupPermissionIds.every(id => selectedPermissionIds.value.includes(id))
}

// 切换分组选择状态
const toggleGroupSelection = (groupKey) => {
  if (!permissionGroups.value[groupKey]) return
  
  const groupPermissionIds = permissionGroups.value[groupKey].permissions.map(p => p.id)
  
  if (isGroupSelected(groupKey)) {
    // 当前分组已全选，取消选择
    selectedPermissionIds.value = selectedPermissionIds.value.filter(id => !groupPermissionIds.includes(id))
  } else {
    // 当前分组未全选，全选
    const newSelection = [...selectedPermissionIds.value]
    
    groupPermissionIds.forEach(id => {
      if (!newSelection.includes(id)) {
        newSelection.push(id)
      }
    })
    
    selectedPermissionIds.value = newSelection
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchRoleDetail()
})
</script> 