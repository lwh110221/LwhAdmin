<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">身份认证管理</h1>
      <div class="flex items-center space-x-2">
        <select 
          v-model="queryParams.status" 
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">全部状态</option>
          <option :value="0">待审核</option>
          <option :value="1">已通过</option>
          <option :value="2">已拒绝</option>
        </select>
        <button 
          @click="fetchCertifications"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <i class="fas fa-search mr-1"></i>
          查询
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mr-3">
            <i class="fas fa-user text-blue-500 text-xl"></i>
          </div>
          <div class="flex-1">
            <div class="text-gray-500 text-sm">认证申请总数</div>
            <div class="text-2xl font-bold mt-1">{{ stats.total || 0 }}</div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="rounded-full w-12 h-12 bg-yellow-100 flex items-center justify-center mr-3">
            <i class="fas fa-clock text-yellow-500 text-xl"></i>
          </div>
          <div class="flex-1">
            <div class="text-gray-500 text-sm">待审核申请</div>
            <div class="text-2xl font-bold mt-1">{{ stats.pendingReview || 0 }}</div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="rounded-full w-12 h-12 bg-green-100 flex items-center justify-center mr-3">
            <i class="fas fa-check-circle text-green-500 text-xl"></i>
          </div>
          <div class="flex-1">
            <div class="text-gray-500 text-sm">身份类型分布</div>
            <div class="text-sm mt-1">
              <span v-for="(count, type) in stats.byType" :key="type" 
                    class="mr-3 inline-block">
                {{ getIdentityTypeLabel(type) }}: <span class="font-bold">{{ count }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 认证列表表格 -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">身份类型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">审核状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">审核信息</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">认证资料</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in certificationList" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.user_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getIdentityTypeLabel(item.identity_type) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(item.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(item.status)">
                  {{ getStatusLabel(item.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <div v-if="item.status !== 0">
                  <div>审核人: {{ item.reviewer_name || '-' }}</div>
                  <div>审核时间: {{ formatDate(item.review_time) }}</div>
                  <div v-if="item.review_comment">意见: {{ item.review_comment }}</div>
                </div>
                <span v-else>-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button 
                  @click="showCertificationData(item)"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  查看资料
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button 
                  v-if="item.status === 0"
                  @click="handleReview(item)"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  审核
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div class="flex items-center">
          <select 
            v-model="queryParams.pageSize"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="handleSizeChange"
          >
            <option :value="10">10条/页</option>
            <option :value="20">20条/页</option>
            <option :value="50">50条/页</option>
            <option :value="100">100条/页</option>
          </select>
          <span class="ml-2 text-sm text-gray-700">
            共 {{ pagination.total }} 条
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="handleCurrentChange(queryParams.page - 1)"
            :disabled="queryParams.page === 1"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            上一页
          </button>
          <span class="text-sm text-gray-700">
            第 {{ queryParams.page }} 页
          </span>
          <button 
            @click="handleCurrentChange(queryParams.page + 1)"
            :disabled="queryParams.page >= Math.ceil(pagination.total / queryParams.pageSize)"
            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 审核对话框 -->
    <div v-if="dialogVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium">身份认证审核</h3>
        </div>
        
        <div class="px-6 py-4" v-if="currentCertification">
          <div class="mb-4">
            <div class="text-gray-500 text-sm mb-1">用户名:</div>
            <div>{{ currentCertification.user_name }}</div>
          </div>
          <div class="mb-4">
            <div class="text-gray-500 text-sm mb-1">身份类型:</div>
            <div>{{ getIdentityTypeLabel(currentCertification.identity_type) }}</div>
          </div>
          <div class="mb-4">
            <div class="text-gray-500 text-sm mb-1">申请时间:</div>
            <div>{{ formatDate(currentCertification.created_at) }}</div>
          </div>
          <div class="mb-4">
            <div class="text-gray-500 text-sm mb-1">认证资料:</div>
            <div v-for="(value, key) in currentCertification.certification_data" :key="key" class="mb-3">
              <div class="text-sm mb-1">{{ getCertificationLabel(key) }}:</div>
              <div v-if="isImageUrl(value)">
                <img 
                  :src="value" 
                  class="w-full h-32 object-cover border rounded cursor-pointer"
                  @click="showImage(value)"
                />
              </div>
              <div v-else class="break-all">{{ value }}</div>
            </div>
          </div>
          <div class="mb-4">
            <div class="text-gray-500 text-sm mb-1">审核结果:</div>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="reviewForm.approved" :value="true" class="form-radio text-blue-600">
                <span class="ml-2">通过</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="reviewForm.approved" :value="false" class="form-radio text-blue-600">
                <span class="ml-2">拒绝</span>
              </label>
            </div>
          </div>
          <div class="mb-4">
            <div class="text-gray-500 text-sm mb-1">审核意见:</div>
            <textarea 
              v-model="reviewForm.comment"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入审核意见（选填）"
            ></textarea>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
          <button 
            @click="dialogVisible = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            取消
          </button>
          <button 
            @click="submitReview"
            :disabled="reviewLoading"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ reviewLoading ? '提交中...' : '提交审核' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <div v-if="previewImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="relative">
        <button 
          @click="previewImage = null"
          class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
        >
          <i class="fas fa-times"></i>
        </button>
        <img :src="previewImage" class="max-w-[90vw] max-h-[90vh] object-contain" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { identityService } from '@/api'
import { formatDateTime } from '@/utils/format'

// 数据
const loading = ref(false)
const certificationList = ref([])
const stats = ref({
  total: 0,
  byType: {},
  pendingReview: 0
})

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  status: ''
})

// 分页信息
const pagination = reactive({
  total: 0,
  page: 1,
  pageSize: 10
})

// 对话框状态
const dialogVisible = ref(false)
const currentCertification = ref(null)
const reviewForm = reactive({
  approved: true,
  comment: ''
})
const reviewLoading = ref(false)
const previewImage = ref(null)

// 获取认证申请列表
const fetchCertifications = async () => {
  loading.value = true
  try {
    const { data } = await identityService.getCertifications({
      ...queryParams,
      status: queryParams.status === '' ? null : queryParams.status
    })
    certificationList.value = data.list
    pagination.total = data.pagination.total
    pagination.page = data.pagination.page
    pagination.pageSize = data.pagination.pageSize
  } catch (error) {
    console.error('获取认证申请列表失败:', error)
    alert('获取认证申请列表失败')
  } finally {
    loading.value = false
  }
}

// 获取统计信息
const fetchStats = async () => {
  try {
    const { data } = await identityService.getIdentityStats()
    stats.value = data
  } catch (error) {
    console.error('获取统计信息失败:', error)
  }
}

// 打开审核对话框
const handleReview = (row) => {
  currentCertification.value = row
  reviewForm.approved = true
  reviewForm.comment = ''
  dialogVisible.value = true
}

// 提交审核
const submitReview = async () => {
  if (currentCertification.value) {
    reviewLoading.value = true
    try {
      await identityService.reviewCertification(
        currentCertification.value.id, 
        reviewForm
      )
      alert(reviewForm.approved ? '认证审核已通过' : '认证审核已拒绝')
      dialogVisible.value = false
      // 重新加载数据
      fetchCertifications()
      fetchStats()
    } catch (error) {
      console.error('审核失败:', error)
      alert('审核失败')
    } finally {
      reviewLoading.value = false
    }
  }
}

// 分页处理
const handleSizeChange = () => {
  queryParams.page = 1
  fetchCertifications()
}

const handleCurrentChange = (page) => {
  if (page < 1 || page > Math.ceil(pagination.total / queryParams.pageSize)) return
  queryParams.page = page
  fetchCertifications()
}

// 图片预览
const showImage = (url) => {
  previewImage.value = url
}

// 显示认证资料
const showCertificationData = (item) => {
  currentCertification.value = item
  dialogVisible.value = true
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return formatDateTime(dateStr)
}

// 获取状态标签
const getStatusLabel = (status) => {
  const statusMap = {
    0: '待审核',
    1: '已通过',
    2: '已拒绝'
  }
  return statusMap[status] || '未知状态'
}

// 获取状态样式
const getStatusClass = (status) => {
  const baseClass = 'px-2 py-1 text-xs font-medium rounded-full'
  const typeMap = {
    0: `${baseClass} bg-yellow-100 text-yellow-800`,
    1: `${baseClass} bg-green-100 text-green-800`,
    2: `${baseClass} bg-red-100 text-red-800`
  }
  return typeMap[status] || `${baseClass} bg-gray-100 text-gray-800`
}

// 获取身份类型标签
const getIdentityTypeLabel = (type) => {
  const typeMap = {
    'EXPERT': '专家',
    'FARMER': '农户',
    'SUPPLIER': '供应商',
    'BUYER': '采购商'
  }
  return typeMap[type] || type
}

// 获取认证资料字段标签
const getCertificationLabel = (key) => {
  const labelMap = {
    'idCard': '身份证',
    'landCertificate': '土地证明',
    'businessLicense': '营业执照',
    'qualificationCertificate': '资质证书',
    'otherDocuments': '其他文件'
  }
  return labelMap[key] || key
}

// 判断是否为图片URL
const isImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url)
}

// 初始化
onMounted(() => {
  fetchCertifications()
  fetchStats()
})
</script> 