<script setup>
import { ref } from 'vue'
import UserStats from '@/components/user/UserStats.vue'
import MomentStats from '@/components/moment/MomentStats.vue'

// 组件引用，用于调用刷新方法
const userStatsRef = ref(null)
const momentStatsRef = ref(null)

// 刷新统计数据
const refreshStats = () => {
  userStatsRef.value?.refresh()
  momentStatsRef.value?.refresh()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h1 class="text-xl sm:text-2xl font-bold">控制台</h1>
      <button 
        @click="refreshStats" 
        class="mt-2 sm:mt-0 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        刷新数据
      </button>
    </div>
    
    <!-- 用户统计 -->
    <UserStats ref="userStatsRef" />

    <!-- 动态统计 -->
    <MomentStats ref="momentStatsRef" />
  </div>
</template>
