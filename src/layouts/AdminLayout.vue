<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

// 控制新闻管理子菜单的展开收起
const newsExpanded = ref(false)
// 控制用户管理子菜单的展开收起
const userExpanded = ref(false)
// 控制身份认证管理子菜单的展开收起
const identityExpanded = ref(false)
// 控制管理员管理子菜单的展开收起
const adminExpanded = ref(false)

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
          
          <!-- 用户管理 -->
          <div class="space-y-1">
            <button
              @click="userExpanded = !userExpanded"
              class="w-full group flex items-center justify-between px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              :class="{ 'bg-gray-100 text-gray-900': isInUserPages }"
            >
              <span>用户管理</span>
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
            <div v-if="userExpanded" class="pl-4 space-y-1">
              <router-link
                to="/users"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/users') }"
              >
                用户列表
              </router-link>
              <router-link
                to="/moments"
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
              <span>新闻管理</span>
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
            <div v-if="newsExpanded" class="pl-4 space-y-1">
              <router-link
                to="/news/categories"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/news/categories') }"
              >
                新闻分类
              </router-link>
              <router-link
                to="/news/articles"
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
              <span>身份认证管理</span>
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
            <div v-if="identityExpanded" class="pl-4 space-y-1">
              <router-link
                to="/identities/certifications"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/identities/certifications') }"
              >
                认证申请管理
              </router-link>
              <router-link
                to="/identities/stats"
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
              <span>管理员管理</span>
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
            <div v-if="adminExpanded" class="pl-4 space-y-1">
              <router-link
                to="/admins/list"
                class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                :class="{ 'bg-gray-100 text-gray-900': $route.path.startsWith('/admins/list') }"
              >
                管理员列表
              </router-link>
              <router-link
                to="/roles"
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
      <main class="flex-1 p-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template> 