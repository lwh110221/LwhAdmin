<template>
  <div class="responsive-table">
    <!-- 桌面端表格显示 -->
    <div v-if="!isMobile" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading" class="animate-pulse">
            <td :colspan="columns.length" class="px-6 py-4 text-center text-gray-500">
              加载中...
            </td>
          </tr>
          <tr v-else-if="!items.length" class="hover:bg-gray-50">
            <td :colspan="columns.length" class="px-6 py-4 text-center text-gray-500">
              暂无数据
            </td>
          </tr>
          <tr v-for="(item, index) in items" :key="index" class="hover:bg-gray-50">
            <td 
              v-for="column in columns" 
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
              :class="column.cellClass"
            >
              <slot :name="column.key" :item="item" :column="column">
                {{ getItemValue(item, column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 移动端卡片显示 -->
    <div v-else class="grid grid-cols-1 gap-4">
      <div v-if="loading" class="animate-pulse space-y-4">
        <div 
          v-for="i in 3" 
          :key="i" 
          class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        >
          <div class="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
      <div 
        v-else-if="!items.length"
        class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center text-gray-500 py-8"
      >
        暂无数据
      </div>
      <div
        v-for="(item, index) in items"
        :key="index"
        class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
      >
        <div class="space-y-3">
          <div 
            v-for="column in columns" 
            :key="column.key"
            class="flex items-start justify-between"
          >
            <span class="text-sm font-medium text-gray-500">{{ column.label }}</span>
            <div class="text-sm text-right flex-1 ml-4">
              <slot :name="column.key" :item="item" :column="column">
                {{ getItemValue(item, column) }}
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // 表格列定义
  columns: {
    type: Array,
    required: true
  },
  // 数据项
  items: {
    type: Array,
    required: true
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  }
})

// 屏幕尺寸
const screenWidth = ref(window.innerWidth)
// 是否为移动设备
const isMobile = computed(() => screenWidth.value < 768)

// 监听窗口大小变化
const handleResize = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 获取数据项的值
const getItemValue = (item, column) => {
  if (column.formatter && typeof column.formatter === 'function') {
    return column.formatter(item)
  }
  
  if (column.key.includes('.')) {
    const keys = column.key.split('.')
    let value = item
    for (const key of keys) {
      if (value === null || value === undefined) return ''
      value = value[key]
    }
    return value
  }
  
  return item[column.key]
}
</script> 