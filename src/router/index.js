import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/layouts/AdminLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import UserList from '@/views/user/UserList.vue'
import UserDetail from '@/views/user/UserDetail.vue'
import MomentList from '@/views/moment/MomentList.vue'
import CategoryList from '@/views/news/CategoryList.vue'
import ArticleList from '@/views/news/ArticleList.vue'

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
        },
        {
          path: 'moments',
          name: 'moment-list',
          component: MomentList,
          meta: {
            requiresAuth: true,
            title: '动态列表',
            permission: 'moment:list'
          }
        },
        {
          path: 'news/categories',
          name: 'news-category-list',
          component: CategoryList,
          meta: {
            requiresAuth: true,
            title: '新闻分类',
            permission: 'news:category:manage'
          }
        },
        {
          path: 'news/articles',
          name: 'news-article-list',
          component: ArticleList,
          meta: {
            requiresAuth: true,
            title: '新闻文章',
            permission: 'news:article:manage'
          }
        },
        {
          path: 'news/articles/create',
          name: 'news-article-create',
          component: () => import('@/views/news/ArticleEdit.vue'),
          meta: {
            requiresAuth: true,
            title: '创建文章',
            permission: 'news:article:manage'
          }
        },
        {
          path: 'news/articles/:id/edit',
          name: 'news-article-edit',
          component: () => import('@/views/news/ArticleEdit.vue'),
          meta: {
            requiresAuth: true,
            title: '编辑文章',
            permission: 'news:article:manage'
          }
        },
        {
          path: 'identities/certifications',
          name: 'identity-certification-list',
          component: () => import('@/views/identity/CertificationList.vue'),
          meta: {
            requiresAuth: true,
            title: '身份认证管理',
            permission: 'identity:certification:list'
          }
        },
        {
          path: 'identities/stats',
          name: 'identity-stats',
          component: () => import('@/views/identity/IdentityStats.vue'),
          meta: {
            requiresAuth: true,
            title: '身份统计信息',
            permission: 'identity:stats'
          }
        },
        {
          path: 'identities/types',
          name: 'identity-type-list',
          component: () => import('@/views/identity/TypeList.vue'),
          meta: {
            requiresAuth: true,
            title: '身份类型管理',
            permission: 'identity:type:manage'
          }
        },
        {
          path: 'admins/list',
          name: 'admin-list',
          component: () => import('@/views/admin/AdminList.vue'),
          meta: {
            requiresAuth: true,
            title: '管理员列表',
            permission: 'admin:list',
            roles: ['super_admin'] // 仅超级管理员可访问
          }
        },
        {
          path: 'roles',
          name: 'role-list',
          component: () => import('@/views/role/RoleList.vue'),
          meta: {
            requiresAuth: true,
            title: '角色管理',
            permission: 'admin:list',
            roles: ['super_admin'] // 仅超级管理员可访问
          }
        },
        {
          path: 'roles/:id',
          name: 'role-detail',
          component: () => import('@/views/role/RoleDetail.vue'),
          meta: {
            requiresAuth: true,
            title: '角色详情',
            permission: 'admin:list',
            roles: ['super_admin'] // 仅超级管理员可访问
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
  } else if (to.meta.roles && Array.isArray(to.meta.roles)) {
    // 检查角色权限
    const hasRole = to.meta.roles.some(requiredRole => {
      if (!authStore.admin?.roles) return false
      
      return authStore.admin.roles.some(userRole => 
        typeof userRole === 'string'
          ? userRole === requiredRole
          : userRole.name === '超级管理员' || userRole.code === requiredRole
      )
    })
    
    if (!hasRole) {
      next('/') // 没有权限，跳转首页
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
