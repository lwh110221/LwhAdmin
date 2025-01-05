<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">后台管理系统</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/profile"
              class="text-gray-600 hover:text-gray-900"
            >
              个人信息
            </router-link>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 侧边栏和主内容区域 -->
    <div class="flex">
      <!-- 侧边栏 -->
      <div class="w-64 min-h-screen bg-white shadow-sm">
        <nav class="mt-5 px-2 space-y-1">
          <router-link
            to="/"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            :class="{ 'bg-gray-100 text-gray-900': $route.path === '/' }"
          >
            首页
          </router-link>
          <router-link
            to="/profile"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            :class="{ 'bg-gray-100 text-gray-900': $route.path === '/profile' }"
          >
            个人信息
          </router-link>
          <router-link
            to="/users"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/users') }"
          >
            用户管理
          </router-link>
          <router-link
            to="/moments"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/moments') }"
          >
            动态管理
          </router-link>
          <router-link
            to="/news/categories"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/news/categories') }"
          >
            新闻分类
          </router-link>
        </nav>
      </div>

      <!-- 主内容区域 -->
      <main class="flex-1 p-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template> 