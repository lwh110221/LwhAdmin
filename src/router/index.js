import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/layouts/AdminLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import UserList from '@/views/user/UserList.vue'
import UserDetail from '@/views/user/UserDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: { requiresAuth: true }
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: { 
            requiresAuth: true,
            title: '个人信息'
          }
        },
        {
          path: 'users',
          name: 'user-list',
          component: UserList,
          meta: {
            requiresAuth: true,
            title: '用户列表',
            permission: 'user:list'
          }
        },
        {
          path: 'users/:id',
          name: 'user-detail',
          component: UserDetail,
          meta: {
            requiresAuth: true,
            title: '用户详情',
            permission: 'user:detail'
          }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated()) {
    next('/')
  } else {
    next()
  }
})

export default router
