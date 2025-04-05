<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">身份统计信息</h1>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      <div v-else>
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="text-gray-500 text-sm mb-1">认证用户总数</div>
            <div class="text-3xl font-bold">{{ stats.total || 0 }}</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="text-gray-500 text-sm mb-1">待审核申请</div>
            <div class="text-3xl font-bold text-orange-500">{{ stats.pendingReview || 0 }}</div>
          </div>
        </div>

        <!-- 身份类型统计表格 -->
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-4">身份类型统计</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">身份类型</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户数量</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="Object.keys(stats.byType || {}).length === 0" class="hover:bg-gray-50">
                  <td colspan="2" class="px-6 py-4 text-center text-gray-500">暂无数据</td>
                </tr>
                <tr v-for="(count, type) in stats.byType" :key="type" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ getIdentityTypeLabel(type) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { identityService } from '@/api'

// 数据
const loading = ref(false)
const stats = ref({
  total: 0,
  byType: {},
  pendingReview: 0
})

// 获取统计信息
const fetchStats = async () => {
  loading.value = true
  try {
    const { data } = await identityService.getIdentityStats()
    stats.value = data
  } catch (error) {
    console.error('获取身份统计信息失败:', error)
    alert('获取身份统计信息失败')
  } finally {
    loading.value = false
  }
}

// 获取身份类型标签
const getIdentityTypeLabel = (type) => {
  const typeMap = {
    'EXPERT': '农业专家',
    'FARMER': '农户',
    'DEALER': '经销商',
    'SUPPLIER': '供应商',
    'BUYER': '采购商',
    'NORMAL': '普通用户',
    'WHOLESALER': '批发商',
    'RETAILER': '零售商',
    'LOGISTICS': '物流商',
    'PROCESSOR': '加工厂'
  }
  return typeMap[type] || type
}

// 生命周期钩子
onMounted(() => {
  fetchStats()
})
</script> 