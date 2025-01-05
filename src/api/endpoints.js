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

/**
 * 新闻文章管理接口
 */
export const NEWS_ARTICLE = {
  LIST: '/admin/news/articles',
  DETAIL: (id) => `/admin/news/articles/${id}`,
  CREATE: '/admin/news/articles',
  UPDATE: (id) => `/admin/news/articles/${id}`,
  DELETE: (id) => `/admin/news/articles/${id}`,
  UPDATE_PUBLISH: (id) => `/admin/news/articles/${id}/publish`,
  UPDATE_FEATURED: (id) => `/admin/news/articles/${id}/featured`,
  UPLOAD: '/admin/news/upload'
} 

/**
 * 日志管理接口
 */
export const LOG = {
  LIST: '/admin/logs',
  STATS: '/admin/logs/stats',
  CLEAN: '/admin/logs/clean'
} 