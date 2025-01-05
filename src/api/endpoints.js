/**
 * API 接口路径配置
 */

export const AUTH = {
  LOGIN: '/admin/auth/login',
  PROFILE: '/admin/auth/profile',
  PASSWORD: '/admin/auth/password'
} 

/**
 * 用户管理接口
 */
export const USER = {
  LIST: '/admin/users',
  DETAIL: (id) => `/admin/users/${id}`,
  UPDATE_STATUS: (id) => `/admin/users/${id}/status`,
  DELETE: (id) => `/admin/users/${id}`,
  STATS: '/admin/users/stats/overview'
}

/**
 * 动态管理接口
 */
export const MOMENT = {
  LIST: '/admin/moments',
  DELETE: (id) => `/admin/moments/${id}`,
  STATS: '/admin/moments/stats/overview'
} 

/**
 * 新闻分类管理接口
 */
export const NEWS_CATEGORY = {
  LIST: '/admin/news/categories',
  CREATE: '/admin/news/categories',
  UPDATE: (id) => `/admin/news/categories/${id}`,
  DELETE: (id) => `/admin/news/categories/${id}`
} 