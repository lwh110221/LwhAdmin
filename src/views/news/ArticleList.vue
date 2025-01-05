<template>
  <div class="container mx-auto px-4 py-8">
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
            placeholder="搜索标题"
          >
        </div>
        <!-- 分类筛选 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select
            v-model="searchForm.category_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部分类</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <!-- 发布状态 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">发布状态</label>
          <select
            v-model="searchForm.is_published"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option :value="1">已发布</option>
            <option :value="0">未发布</option>
          </select>
        </div>
        <!-- 推荐状态 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">推荐状态</label>
          <select
            v-model="searchForm.is_featured"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option :value="1">已推荐</option>
            <option :value="0">未推荐</option>
          </select>
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

    <!-- 文章列表 -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium">文章列表</h2>
          <router-link
            to="/news/articles/create"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            新建文章
          </router-link>
        </div>

        <!-- 文章列表内容 -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">浏览量</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推荐</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading" class="animate-pulse">
                <td colspan="9" class="px-6 py-4 text-center text-gray-500">
                  加载中...
                </td>
              </tr>
              <tr v-else-if="!articleList.length" class="hover:bg-gray-50">
                <td colspan="9" class="px-6 py-4 text-center text-gray-500">
                  暂无数据
                </td>
              </tr>
              <tr v-for="article in articleList" :key="article.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ article.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center">
                    <img
                      v-if="article.cover_image"
                      :src="getImageUrl(article.cover_image)"
                      class="w-10 h-10 object-cover rounded mr-2"
                      alt="封面图"
                    >
                    {{ article.title }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ article.category_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ article.author }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ article.view_count }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="handleUpdateFeatured(article)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer"
                    :class="article.is_featured ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                  >
                    {{ article.is_featured ? '已推荐' : '未推荐' }}
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="handleUpdatePublish(article)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer"
                    :class="article.is_published ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
                  >
                    {{ article.is_published ? '已发布' : '未发布' }}
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(article.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <router-link
                    :to="`/news/articles/${article.id}/edit`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    编辑
                  </router-link>
                  <button
                    @click="handleDelete(article)"
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
import { useRouter } from 'vue-router'
import { useMessage } from '@/composables/useMessage'
import { newsService } from '@/api'
import { logger } from '@/utils/logger'
import { getImageUrl } from '@/utils/image'

const router = useRouter()
const { showMessage } = useMessage()

// 搜索表单
const searchForm = ref({
  keyword: '',
  category_id: '',
  is_published: '',
  is_featured: ''
})

// 文章列表数据
const articleList = ref([])
const loading = ref(false)
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0
})

// 分类列表
const categories = ref([])

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

// 获取分类列表
const fetchCategories = async () => {
  try {
    logger.info('开始获取新闻分类列表')
    const response = await newsService.getCategoryList()

    if (response?.code === 200) {
      categories.value = response.data
      logger.info('获取新闻分类列表成功', { total: categories.value.length })
    } else {
      logger.warn('获取新闻分类列表失败', response?.message)
    }
  } catch (error) {
    logger.error('获取新闻分类列表失败', error)
  }
}

// 获取文章列表
const fetchArticleList = async (searchParams = {}) => {
  loading.value = true
  try {
    logger.info('开始获取文章列表', {
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...searchParams
    })

    const response = await newsService.getArticleList({
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...searchParams
    })

    if (response?.code === 200) {
      articleList.value = response.data.items
      pagination.value.total = response.data.pagination.total
      logger.info('获取文章列表成功', { total: pagination.value.total })
    } else {
      const errorMsg = response?.message || '获取文章列表失败'
      showMessage(errorMsg, 'error')
      logger.warn('获取文章列表失败', { message: errorMsg, response })
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || '获取文章列表失败'
    showMessage(errorMsg, 'error')
    logger.error('获取文章列表失败', {
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

// 更新推荐状态
const handleUpdateFeatured = async (article) => {
  try {
    logger.info('开始更新文章推荐状态', { articleId: article.id, currentStatus: article.is_featured })
    const newStatus = !article.is_featured
    const response = await newsService.updateArticleFeaturedStatus(article.id, newStatus ? 1 : 0)

    if (response?.code === 200) {
      article.is_featured = newStatus
      showMessage('更新成功', 'success')
      logger.info('更新文章推荐状态成功', { articleId: article.id, newStatus })
    } else {
      showMessage(response?.message || '更新失败', 'error')
      logger.warn('更新文章推荐状态失败', response?.message)
    }
  } catch (error) {
    showMessage('更新失败', 'error')
    logger.error('更新文章推荐状态失败', error)
  }
}

// 更新发布状态
const handleUpdatePublish = async (article) => {
  try {
    logger.info('开始更新文章发布状态', { articleId: article.id, currentStatus: article.is_published })
    const newStatus = !article.is_published
    const response = await newsService.updateArticlePublishStatus(article.id, newStatus ? 1 : 0)

    if (response?.code === 200) {
      article.is_published = newStatus
      showMessage('更新成功', 'success')
      logger.info('更新文章发布状态成功', { articleId: article.id, newStatus })
    } else {
      showMessage(response?.message || '更新失败', 'error')
      logger.warn('更新文章发布状态失败', response?.message)
    }
  } catch (error) {
    showMessage('更新失败', 'error')
    logger.error('更新文章发布状态失败', error)
  }
}

// 删除文章
const handleDelete = async (article) => {
  if (!confirm(`确定要删除文章"${article.title}"吗？`)) {
    return
  }

  try {
    logger.info('开始删除文章', { articleId: article.id })
    const response = await newsService.deleteArticle(article.id)

    if (response?.code === 200) {
      showMessage('删除成功', 'success')
      logger.info('删除文章成功', { articleId: article.id })
      fetchArticleList()
    } else {
      showMessage(response?.message || '删除失败', 'error')
      logger.warn('删除文章失败', response?.message)
    }
  } catch (error) {
    showMessage('删除失败', 'error')
    logger.error('删除文章失败', error)
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
  fetchArticleList(params)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    category_id: '',
    is_published: '',
    is_featured: ''
  }
  pagination.value.page = 1
  fetchArticleList()
}

// 页码变化
const handlePageChange = (page) => {
  if (page < 1 || (hasNextPage.value && page > Math.ceil(pagination.value.total / pagination.value.limit))) {
    return
  }
  pagination.value.page = page
  fetchArticleList()
}

// 页面加载时获取数据
onMounted(() => {
  logger.info('文章列表页面加载')
  fetchCategories()
  fetchArticleList()
})

defineExpose({
  articleList,
  loading,
  pagination,
  categories,
  hasNextPage,
  searchForm,
  getImageUrl,
  formatDate,
  handleSearch,
  resetSearch,
  handlePageChange,
  handleUpdateFeatured,
  handleUpdatePublish,
  handleDelete
})
</script> 