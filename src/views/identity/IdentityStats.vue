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
        <div class="grid grid-cols-3 gap-6 mb-6">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="text-gray-500 text-sm mb-1">认证用户总数</div>
            <div class="text-3xl font-bold">{{ stats.total || 0 }}</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div class="text-gray-500 text-sm mb-1">待审核申请</div>
            <div class="text-3xl font-bold text-orange-500">{{ stats.pendingReview || 0 }}</div>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-4">身份类型分布</h2>
          <div class="h-80" ref="chartContainer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { identityService } from '@/api'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { 
  TitleComponent, 
  TooltipComponent, 
  LegendComponent, 
  GridComponent 
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册必要的组件
echarts.use([
  TitleComponent, 
  TooltipComponent, 
  LegendComponent, 
  GridComponent,
  PieChart,
  CanvasRenderer
])

// 数据
const loading = ref(false)
const stats = ref({
  total: 0,
  byType: {},
  pendingReview: 0
})
const chartContainer = ref(null)
let chart = null

// 获取统计信息
const fetchStats = async () => {
  loading.value = true
  try {
    const { data } = await identityService.getIdentityStats()
    stats.value = data
    renderChart()
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
    'EXPERT': '专家',
    'FARMER': '农户',
    'SUPPLIER': '供应商',
    'BUYER': '采购商'
  }
  return typeMap[type] || type
}

// 渲染图表
const renderChart = () => {
  if (!chartContainer.value) return
  
  // 如果图表实例已存在，先销毁
  if (chart) {
    chart.dispose()
  }
  
  // 初始化图表
  chart = echarts.init(chartContainer.value)
  
  // 准备图表数据
  const chartData = Object.entries(stats.value.byType || {}).map(([type, count]) => ({
    name: getIdentityTypeLabel(type),
    value: count
  }))
  
  // 图表配置
  const option = {
    title: {
      text: '身份类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: chartData.map(item => item.name)
    },
    series: [
      {
        name: '身份类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData
      }
    ]
  }
  
  // 设置图表配置并渲染
  chart.setOption(option)
}

// 窗口大小变化时重新调整图表大小
const handleResize = () => {
  if (chart) {
    chart.resize()
  }
}

// 生命周期钩子
onMounted(() => {
  fetchStats()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script> 