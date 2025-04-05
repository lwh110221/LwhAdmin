<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

// 控制侧边栏在移动端的显示隐藏
const sidebarOpen = ref(false)
// 控制新闻管理子菜单的展开收起
const newsExpanded = ref(false)
// 控制用户管理子菜单的展开收起
const userExpanded = ref(false)
// 控制身份认证管理子菜单的展开收起
const identityExpanded = ref(false)
// 控制管理员管理子菜单的展开收起
const adminExpanded = ref(false)
// 屏幕尺寸
const screenWidth = ref(window.innerWidth)
// 是否为移动设备
const isMobile = computed(() => screenWidth.value < 768)

// 监听窗口大小变化
const handleResize = () => {
  screenWidth.value = window.innerWidth
  if (screenWidth.value >= 768) {
    sidebarOpen.value = true
  } else {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始化侧边栏状态
  if (screenWidth.value >= 768) {
    sidebarOpen.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 判断当前是否在新闻管理相关页面
const isInNewsPages = computed(() => {
  return router.currentRoute.value.path.startsWith('/news')
})

// 判断当前是否在用户管理相关页面
const isInUserPages = computed(() => {
  return router.currentRoute.value.path.startsWith('/users') || router.currentRoute.value.path.startsWith('/moments')
})

// 判断当前是否在身份认证管理相关页面
const isInIdentityPages = computed(() => {
  return router.currentRoute.value.path.startsWith('/identities')
})

// 判断当前是否在管理员管理相关页面
const isInAdminPages = computed(() => {
  return router.currentRoute.value.path.startsWith('/admins')
})

// 判断当前用户是否是超级管理员
const isSuperAdmin = computed(() => {
  if (!authStore.admin || !authStore.admin.roles) return false
  return authStore.admin.roles.some(role => 
    typeof role === 'string' 
      ? role === 'super_admin'
      : role.name === '超级管理员'
  )
})

// 如果当前在相关页面，自动展开对应菜单
if (isInNewsPages.value) {
  newsExpanded.value = true
}

if (isInUserPages.value) {
  userExpanded.value = true
}

if (isInIdentityPages.value) {
  identityExpanded.value = true
}

if (isInAdminPages.value) {
  adminExpanded.value = true
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// 在移动端点击菜单项后自动关闭侧边栏
const handleMenuClick = () => {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm sticky top-0 z-10">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- 移动端菜单按钮 -->
            <button 
              v-if="isMobile" 
              @click="sidebarOpen = !sidebarOpen" 
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  v-if="sidebarOpen" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12" 
                />
                <path 
                  v-else 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
            <div class="flex-shrink-0 flex items-center ml-2 sm:ml-0">
              <h1 class="text-lg sm:text-xl font-bold">后台管理系统</h1>
            </div>
          </div>
          <div class="flex items-center space-x-2 sm:space-x-4">
            <button
              @click="handleLogout"
              class="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 侧边栏和主内容区域 -->
    <div class="flex flex-col sm:flex-row">
      <!-- 侧边栏遮罩层 -->
      <div 
        v-if="sidebarOpen && isMobile" 
        @click="sidebarOpen = false"
        class="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity"
      ></div>

      <!-- 侧边栏 -->
      <div 
        v-if="sidebarOpen" 
        class="fixed sm:relative z-30 w-64 transform sm:transform-none transition-all duration-300 ease-in-out bg-white shadow-sm h-full overflow-y-auto"
        :class="{'translate-x-0': sidebarOpen, '-translate-x-full': !sidebarOpen}"
      >
        <nav class="mt-5 px-2 space-y-1">
          <router-link
            to="/"
            @click="handleMenuClick"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            :class="{ 'bg-gray-100 text-gray-900': $route.path === '/' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            首页
          </router-link>
          <router-link
            to="/profile"
            @click="handleMenuClick"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            :class="{ 'bg-gray-100 text-gray-900': $route.path === '/profile' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            个人信息
          </router-link>
          
          <!-- 用户管理 -->
          <div class="space-y-1">
            <button
              @click="userExpanded = !userExpanded"
              class="w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              :class="{ 'bg-gray-100 text-gray-900': isInUserPages }"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                用户管理
              </span>
              <svg 
                class="h-5 w-5 transform transition-transform duration-200" 
                :class="{ 'rotate-180': userExpanded }"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- 用户管理子菜单 -->
            <div v-if="userExpanded" class="pl-10 space-y-1">
              <router-link
                to="/users"
                @click="handleMenuClick"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/users') }"
              >
                用户列表
              </router-link>
              <router-link
                to="/moments"
                @click="handleMenuClick"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/moments') }"
              >
                动态管理
              </router-link>
            </div>
          </div>
          
          <!-- 新闻管理 -->
          <div class="space-y-1">
            <button
              @click="newsExpanded = !newsExpanded"
              class="w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              :class="{ 'bg-gray-100 text-gray-900': isInNewsPages }"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                新闻管理
              </span>
              <svg 
                class="h-5 w-5 transform transition-transform duration-200" 
                :class="{ 'rotate-180': newsExpanded }"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- 新闻管理子菜单 -->
            <div v-if="newsExpanded" class="pl-10 space-y-1">
              <router-link
                to="/news/categories"
                @click="handleMenuClick"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/news/categories') }"
              >
                新闻分类
              </router-link>
              <router-link
                to="/news/articles"
                @click="handleMenuClick"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/news/articles') }"
              >
                新闻文章
              </router-link>
            </div>
          </div>
          
          <!-- 身份认证管理 -->
          <div class="space-y-1">
            <button
              @click="identityExpanded = !identityExpanded"
              class="w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              :class="{ 'bg-gray-100 text-gray-900': isInIdentityPages }"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                身份认证管理
              </span>
              <svg 
                class="h-5 w-5 transform transition-transform duration-200" 
                :class="{ 'rotate-180': identityExpanded }"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- 身份认证管理子菜单 -->
            <div v-if="identityExpanded" class="pl-10 space-y-1">
              <router-link
                to="/identities/certifications"
                @click="handleMenuClick"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/identities/certifications') }"
              >
                认证申请管理
              </router-link>
              <router-link
                to="/identities/types"
                @click="handleMenuClick"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/identities/types') }"
              >
                身份类型管理
              </router-link>
              <router-link
                to="/identities/stats"
                @click="handleMenuClick"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/identities/stats') }"
              >
                认证统计信息
              </router-link>
            </div>
          </div>

          <!-- 管理员管理（仅超级管理员可见） -->
          <div v-if="isSuperAdmin" class="space-y-1">
            <button
              @click="adminExpanded = !adminExpanded"
              class="w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              :class="{ 'bg-gray-100 text-gray-900': isInAdminPages }"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-3 h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                管理员管理
              </span>
              <svg 
                class="h-5 w-5 transform transition-transform duration-200" 
                :class="{ 'rotate-180': adminExpanded }"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- 管理员管理子菜单 -->
            <div v-if="adminExpanded" class="pl-10 space-y-1">
              <router-link
                to="/admins/list"
                @click="handleMenuClick"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/admins/list') }"
              >
                管理员列表
              </router-link>
              <router-link
                to="/roles"
                @click="handleMenuClick"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/roles') }"
              >
                角色管理
              </router-link>
            </div>
          </div>
        </nav>
      </div>

      <!-- 主内容区域 -->
      <main class="flex-1 p-4 sm:p-6 md:p-8 pt-4 sm:pt-6">
        <div class="max-w-7xl mx-auto">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
@media (max-width: 768px) {
  .transform-none {
    transform: none;
  }
}
</style> 