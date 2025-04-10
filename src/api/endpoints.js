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
 * 身份认证管理接口
 */
export const IDENTITY = {
  CERTIFICATION_LIST: '/admin/identities/certifications',
  CERTIFICATION_REVIEW: (id) => `/admin/identities/certifications/${id}/review`,
  STATS: '/admin/identities/stats',
  // 身份类型管理接口
  TYPE_LIST: '/admin/identities/types',
  TYPE_CREATE: '/admin/identities/types',
  TYPE_UPDATE: (code) => `/admin/identities/types/${code}`,
  TYPE_DELETE: (code) => `/admin/identities/types/${code}`
} 

/**
 * 管理员管理接口
 */
export const ADMIN_MANAGE = {
  LIST: '/admin/admins',
  CREATE: '/admin/admins',
  UPDATE_STATUS: (id) => `/admin/admins/${id}/status`,
  UPDATE_ROLES: (id) => `/admin/admins/${id}/roles`,
  DELETE: (id) => `/admin/admins/${id}`
}

/**
 * 角色管理接口
 */
export const ROLE = {
  LIST: '/admin/roles',
  DETAIL: (id) => `/admin/roles/${id}`,
  CREATE: '/admin/roles',
  UPDATE: (id) => `/admin/roles/${id}`,
  DELETE: (id) => `/admin/roles/${id}`,
  UPDATE_PERMISSIONS: (id) => `/admin/roles/${id}/permissions`,
  ALL_PERMISSIONS: '/admin/roles/permissions'
} 

/**
 * 产品分类管理接口
 */
export const PRODUCT_CATEGORY = {
  LIST: '/admin/product/categories',
  CREATE: '/admin/product/categories',
  DELETE: (id) => `/admin/product/categories/${id}`
}

/**
 * 产品管理接口
 */
export const PRODUCT = {
  LIST: '/admin/product/products',
  UPDATE_STATUS: (id) => `/admin/product/products/${id}/status`,
  DELETE: (id) => `/admin/product/products/${id}`
} 