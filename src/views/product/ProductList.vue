<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 标题和操作按钮 -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">产品管理</h2>
    </div>

    <!-- 搜索筛选区 -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">产品名称</label>
          <input
            v-model="searchParams.title"
            type="text"
            placeholder="输入产品名称搜索"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">产品分类</label>
          <select
            v-model="searchParams.category_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">产品状态</label>
          <select
            v-model="searchParams.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="1">上架中</option>
            <option value="0">已下架</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="flex gap-4">
          <div class="w-1/2">
            <label class="block text-sm font-medium text-gray-700 mb-1">最低价格</label>
            <input
              v-model="searchParams.min_price"
              type="number"
              min="0"
              placeholder="最低价格"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="w-1/2">
            <label class="block text-sm font-medium text-gray-700 mb-1">最高价格</label>
            <input
              v-model="searchParams.max_price"
              type="number"
              min="0"
              placeholder="最高价格"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div class="flex items-end justify-end gap-2">
          <button
            @click="resetSearch"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            重置
          </button>
          <button
            @click="fetchProductList"
            class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 产品列表表格 -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品图片</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">库存</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">销量</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="10" class="px-6 py-4 text-center text-gray-500">
                加载中...
              </td>
            </tr>
            <tr v-else-if="!productList.length" class="hover:bg-gray-50">
              <td colspan="10" class="px-6 py-4 text-center text-gray-500">
                暂无数据
              </td>
            </tr>
            <tr v-for="product in productList" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-12 h-12 overflow-hidden rounded-md">
                  <img
                    v-if="product.images && product.images.length"
                    :src="getImageUrl(product.images[0])"
                    alt="产品图片"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">无图片</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.title }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.category_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{{ product.price }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.stock }} {{ product.unit }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.sales_count }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="product.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ product.status ? '上架中' : '已下架' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(product.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button
                  @click="handleUpdateStatus(product)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  {{ product.status ? '下架' : '上架' }}
                </button>
                <button
                  @click="handleDelete(product)"
                  class="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-500">
          共 {{ pagination.total }} 条记录
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= Math.ceil(pagination.total / pagination.pageSize)"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
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

// 产品列表数据
const productList = ref([])
const loading = ref(false)
const categories = ref([])

// 分页数据
const pagination = ref({
  total: 0,
  page: 1,
  pageSize: 10
})

// 搜索参数
const searchParams = ref({
  title: '',
  category_id: '',
  status: '',
  min_price: '',
  max_price: '',
  page: 1,
  limit: 10
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

// 获取产品列表
const fetchProductList = async () => {
  loading.value = true
  try {
    // 准备请求参数，去掉空值
    const params = {}
    for (const key in searchParams.value) {
      if (searchParams.value[key] !== '' && searchParams.value[key] !== null) {
        params[key] = searchParams.value[key]
      }
    }
    
    const res = await productService.getProducts(params)
    if (res.code === 200) {
      productList.value = res.data.list
      pagination.value = res.data.pagination
      
      // 调试日志：输出第一个产品的图片路径
      if (res.data.list.length > 0 && res.data.list[0].images && res.data.list[0].images.length > 0) {
        console.log('原始图片URL:', res.data.list[0].images[0]);
        console.log('处理后图片URL:', getImageUrl(res.data.list[0].images[0]));
      }
    } else {
      showMessage('获取产品列表失败', 'error')
    }
  } catch (error) {
    logger.error('获取产品列表错误', error)
    showMessage('获取产品列表失败', 'error')
  } finally {
    loading.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res = await productService.getCategories()
    if (res.code === 200) {
      categories.value = res.data.list
    }
  } catch (error) {
    logger.error('获取分类列表错误', error)
  }
}

// 重置搜索条件
const resetSearch = () => {
  searchParams.value = {
    title: '',
    category_id: '',
    status: '',
    min_price: '',
    max_price: '',
    page: 1,
    limit: 10
  }
  fetchProductList()
}

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > Math.ceil(pagination.value.total / pagination.value.pageSize)) return
  
  searchParams.value.page = page
  fetchProductList()
}

// 更新产品状态
const handleUpdateStatus = async (product) => {
  try {
    const newStatus = product.status ? 0 : 1
    const statusText = newStatus ? '上架' : '下架'
    
    if (!confirm(`确定要${statusText}产品"${product.title}"吗？`)) return
    
    const res = await productService.updateProductStatus(product.id, newStatus)
    if (res.code === 200) {
      showMessage(`产品已${statusText}`, 'success')
      fetchProductList() // 刷新列表
    } else {
      showMessage(res.message || `${statusText}失败`, 'error')
    }
  } catch (error) {
    logger.error('更新产品状态错误', error)
    showMessage('操作失败', 'error')
  }
}

// 删除产品
const handleDelete = async (product) => {
  if (!confirm(`确定要删除产品"${product.title}"吗？`)) return
  
  try {
    const res = await productService.deleteProduct(product.id)
    if (res.code === 200) {
      showMessage('删除成功', 'success')
      fetchProductList() // 刷新列表
    } else {
      showMessage(res.message || '删除失败', 'error')
    }
  } catch (error) {
    logger.error('删除产品错误', error)
    if (error.response?.data?.message) {
      showMessage(error.response.data.message, 'error')
    } else {
      showMessage('删除产品失败', 'error')
    }
  }
}

// 处理图片URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // 如果已经是完整URL（以http或https开头），则直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // 从环境变量获取API基础路径
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  // 移除末尾的 /api，因为我们要连接到根域名
  const baseUrl = apiBaseUrl.replace(/\/api$/, '');
  
  // 如果路径已经以 /uploads 开头，则直接拼接
  if (imageUrl.startsWith('/uploads/')) {
    return `${baseUrl}${imageUrl}`;
  }
  
  // 如果只是文件名，则添加 /uploads/ 前缀
  if (!imageUrl.startsWith('/')) {
    return `${baseUrl}/uploads/${imageUrl}`;
  }
  
  // 其他情况，直接拼接
  return `${baseUrl}${imageUrl}`;
}

// 处理图片加载错误
const handleImageError = () => {
  console.error('图片加载失败')
}

// 页面加载时获取产品列表和分类列表
onMounted(() => {
  fetchProductList()
  fetchCategories()
})
</script> 