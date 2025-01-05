<script setup>
import { ref } from 'vue'
import UserStats from '@/components/user/UserStats.vue'
import MomentStats from '@/components/moment/MomentStats.vue'

// 组件引用，用于调用刷新方法
const userStatsRef = ref(null)
const momentStatsRef = ref(null)
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">控制台</h1>
    
    <!-- 用户统计 -->
    <UserStats ref="userStatsRef" />

    <!-- 动态统计 -->
    <MomentStats ref="momentStatsRef" />
  </div>
</template>
