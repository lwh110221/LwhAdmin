<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 标题和操作按钮 -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">产品分类管理</h2>
      <button
        @click="openCreateDialog"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        新增分类
      </button>
    </div>

    <!-- 分类列表 -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类描述</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排序</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                加载中...
              </td>
            </tr>
            <tr v-else-if="!categoryList.length" class="hover:bg-gray-50">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                暂无数据
              </td>
            </tr>
            <tr v-for="category in categoryList" :key="category.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category.sort_order }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="category.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ category.status ? '启用' : '禁用' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(category.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button
                  @click="handleDelete(category)"
                  class="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 创建分类对话框 -->
    <div
      v-if="showDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-medium mb-4">
          新增产品分类
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 分类名称 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              分类名称
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errors.name}"
            >
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

          <!-- 分类描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              分类描述
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errors.description}"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">
              {{ errors.description }}
            </p>
          </div>

          <!-- 父分类ID -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              父分类ID
            </label>
            <input
              v-model.number="form.parent_id"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <!-- 排序 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              排序
            </label>
            <input
              v-model.number="form.sort_order"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{'border-red-500': errors.sort_order}"
            >
            <p v-if="errors.sort_order" class="mt-1 text-sm text-red-600">
              {{ errors.sort_order }}
            </p>
          </div>

          <!-- 状态 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="1">启用</option>
              <option :value="0">禁用</option>
            </select>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showDialog = false"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : '确定' }}
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
import { productService } from '@/api'
import { logger } from '@/utils/logger'

const { showMessage } = useMessage()

// 分类列表数据
const categoryList = ref([])
const loading = ref(false)

// 对话框控制
const showDialog = ref(false)
const isSubmitting = ref(false)

// 表单数据
const form = ref({
  name: '',
  description: '',
  parent_id: null,
  sort_order: 0,
  status: 1
})

// 表单错误信息
const errors = ref({})

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

// 验证表单
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name) {
    errors.value.name = '请输入分类名称'
  } else if (form.value.name.length < 2 || form.value.name.length > 50) {
    errors.value.name = '分类名称长度必须在2-50个字符之间'
  }
  
  if (form.value.description && form.value.description.length > 200) {
    errors.value.description = '分类描述不能超过200个字符'
  }
  
  if (form.value.sort_order < 0) {
    errors.value.sort_order = '排序不能小于0'
  }
  
  return Object.keys(errors.value).length === 0
}

// 获取分类列表
const fetchCategoryList = async () => {
  loading.value = true
  try {
    const res = await productService.getCategories()
    if (res.code === 200) {
      categoryList.value = res.data.list
    } else {
      showMessage('获取分类列表失败', 'error')
    }
  } catch (error) {
    logger.error('获取分类列表错误', error)
    showMessage('获取分类列表失败', 'error')
  } finally {
    loading.value = false
  }
}

// 打开创建对话框
const openCreateDialog = () => {
  // 重置表单
  form.value = {
    name: '',
    description: '',
    parent_id: null,
    sort_order: 0,
    status: 1
  }
  errors.value = {}
  showDialog.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    const res = await productService.createCategory(form.value)
    if (res.code === 201) {
      showMessage('分类创建成功', 'success')
      showDialog.value = false
      fetchCategoryList() // 刷新列表
    } else {
      showMessage(res.message || '分类创建失败', 'error')
    }
  } catch (error) {
    logger.error('创建分类错误', error)
    showMessage('创建分类失败', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// 删除分类
const handleDelete = async (category) => {
  if (!confirm(`确定要删除"${category.name}"分类吗？`)) return
  
  try {
    const res = await productService.deleteCategory(category.id)
    if (res.code === 200) {
      showMessage('删除成功', 'success')
      fetchCategoryList() // 刷新列表
    } else {
      showMessage(res.message || '删除失败', 'error')
    }
  } catch (error) {
    logger.error('删除分类错误', error)
    if (error.response?.data?.message) {
      showMessage(error.response.data.message, 'error')
    } else {
      showMessage('删除分类失败', 'error')
    }
  }
}

// 页面加载时获取分类列表
onMounted(() => {
  fetchCategoryList()
})
</script> 