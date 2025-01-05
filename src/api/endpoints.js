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
  DETAIL: (id) => `/admin/users/${id}`
} 