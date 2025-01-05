<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-medium">{{ isEdit ? '编辑文章' : '创建文章' }}</h2>
        <button
          @click="$router.back()"
          class="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          返回
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 标题 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入文章标题"
          >
        </div>

        <!-- 分类 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select
            v-model="formData.category_id"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择分类</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- 作者和来源 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">作者</label>
            <input
              v-model="formData.author"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入作者"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">来源</label>
            <input
              v-model="formData.source"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入来源"
            >
          </div>
        </div>

        <!-- 封面图 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">封面图</label>
          <div class="flex items-center space-x-4">
            <div
              v-if="formData.cover_image"
              class="relative w-32 h-32"
            >
              <img
                :src="getImageUrl(formData.cover_image)"
                class="w-full h-full object-cover rounded"
                alt="封面图"
              >
              <button
                @click="formData.cover_image = ''"
                class="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div
              v-if="!formData.cover_image"
              class="relative"
            >
              <input
                ref="coverImageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleCoverImageUpload"
              >
              <button
                type="button"
                @click="$refs.coverImageInput.click()"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                上传封面图
              </button>
            </div>
          </div>
        </div>

        <!-- 摘要 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">摘要</label>
          <textarea
            v-model="formData.summary"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入文章摘要"
          ></textarea>
        </div>

        <!-- 内容编辑器 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">内容</label>
          <div class="border border-gray-300 rounded-md">
            <QuillEditor
              v-model:content="formData.content"
              :options="editorOptions"
              @ready="handleEditorReady"
              contentType="html"
              class="h-96"
            />
          </div>
        </div>

        <!-- 发布选项 -->
        <div class="flex items-center space-x-6">
          <label class="inline-flex items-center">
            <input
              v-model="formData.is_published"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
            <span class="ml-2 text-sm text-gray-600">立即发布</span>
          </label>
          <label class="inline-flex items-center">
            <input
              v-model="formData.is_featured"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
            <span class="ml-2 text-sm text-gray-600">推荐文章</span>
          </label>
        </div>

        <!-- 提交按钮 -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$router.back()"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            取消
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? '提交中...' : (isEdit ? '保存' : '创建') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useMessage } from '@/composables/useMessage'
import { newsService } from '@/api'
import { logger } from '@/utils/logger'
import { getImageUrl } from '@/utils/image'

const route = useRoute()
const router = useRouter()
const { showMessage } = useMessage()

// 是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 表单数据
const formData = ref({
  title: '',
  category_id: '',
  author: '',
  source: '',
  cover_image: '',
  summary: '',
  content: '',
  is_published: false,
  is_featured: false
})

// 分类列表
const categories = ref([])

// 提交状态
const submitting = ref(false)

// 编辑器配置
const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image']
      ],
      handlers: {
        image: function() {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', 'image/*')
          input.click()
          input.onchange = async () => {
            const file = input.files[0]
            if (file) {
              await handleImageUpload(file)
            }
          }
        }
      }
    }
  },
  placeholder: '请输入文章内容'
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

// 获取文章详情
const fetchArticleDetail = async () => {
  if (!isEdit.value) return

  try {
    logger.info('开始获取文章详情', { articleId: route.params.id })
    const response = await newsService.getArticleDetail(route.params.id)

    if (response?.code === 200) {
      const article = response.data
      formData.value = {
        title: article.title,
        category_id: article.category_id,
        author: article.author || '',
        source: article.source || '',
        cover_image: article.cover_image || '',
        summary: article.summary || '',
        content: article.content || '',
        is_published: !!article.is_published,
        is_featured: !!article.is_featured
      }
      logger.info('获取文章详情成功', { articleId: route.params.id })
    } else {
      showMessage(response?.message || '获取文章详情失败', 'error')
      logger.warn('获取文章详情失败', response?.message)
      router.back()
    }
  } catch (error) {
    showMessage('获取文章详情失败', 'error')
    logger.error('获取文章详情失败', error)
    router.back()
  }
}

// 处理封面图上传
const handleCoverImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    logger.info('开始上传封面图', { fileName: file.name, fileSize: file.size })
    const uploadFormData = new FormData()
    uploadFormData.append('image', file)

    const response = await newsService.uploadImage(uploadFormData)

    if (response?.code === 200) {
      formData.value.cover_image = response.data.url
      showMessage('上传成功', 'success')
      logger.info('封面图上传成功', { url: response.data.url })
    } else {
      showMessage(response?.message || '上传失败', 'error')
      logger.warn('封面图上传失败', response?.message)
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || '上传失败'
    showMessage(errorMsg, 'error')
    logger.error('封面图上传失败', {
      error: {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      }
    })
  }

  // 清空文件输入框
  event.target.value = ''
}

// 处理编辑器图片上传
const handleImageUpload = async (file) => {
  try {
    logger.info('开始上传编辑器图片', { fileName: file.name, fileSize: file.size })
    const uploadFormData = new FormData()
    uploadFormData.append('image', file)

    const response = await newsService.uploadImage(uploadFormData)

    if (response?.code === 200) {
      const url = response.data.url
      // 获取编辑器实例并插入图片
      const range = quill.getSelection(true)
      quill.insertEmbed(range.index, 'image', getImageUrl(url))
      quill.setSelection(range.index + 1)
      logger.info('编辑器图片上传成功', { url })
    } else {
      showMessage(response?.message || '图片上传失败', 'error')
      logger.warn('编辑器图片上传失败', response?.message)
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || '上传失败'
    showMessage(errorMsg, 'error')
    logger.error('编辑器图片上传失败', {
      error: {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      }
    })
  }
}

// 编辑器实例
let quill = null

// 编辑器准备就绪
const handleEditorReady = (editor) => {
  quill = editor
}

// 提交表单
const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true

  try {
    logger.info('开始提交文章', {
      isEdit: isEdit.value,
      articleId: route.params.id,
      formData: formData.value
    })

    const submitData = { ...formData.value }
    const response = isEdit.value
      ? await newsService.updateArticle(route.params.id, submitData)
      : await newsService.createArticle(submitData)

    if (response?.code === 200) {
      showMessage(`${isEdit.value ? '更新' : '创建'}成功`, 'success')
      logger.info(`文章${isEdit.value ? '更新' : '创建'}成功`, {
        articleId: isEdit.value ? route.params.id : response.data?.id,
        mode: isEdit.value ? '更新' : '创建'
      })
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push('/news/articles')
      }, 1500)
    } else {
      showMessage(response?.message || `${isEdit.value ? '更新' : '创建'}失败`, 'error')
      logger.warn(`文章${isEdit.value ? '更新' : '创建'}失败`, {
        message: response?.message,
        formData: submitData
      })
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || `${isEdit.value ? '更新' : '创建'}失败`
    showMessage(errorMsg, 'error')
    logger.error(`文章${isEdit.value ? '更新' : '创建'}失败`, {
      error: {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      },
      formData: formData.value
    })
  } finally {
    submitting.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  logger.info('文章编辑页面加载', { isEdit: isEdit.value })
  fetchCategories()
  if (isEdit.value) {
    fetchArticleDetail()
  }
})
</script>

<style>
.ql-editor {
  min-height: 200px;
}
</style> 