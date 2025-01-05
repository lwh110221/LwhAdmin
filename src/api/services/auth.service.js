import http from '../http'
import { AUTH } from '../endpoints'

/**
 * 认证相关服务
 */
export default {
  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise} 登录结果
   */
  login(username, password) {
    return http.post(AUTH.LOGIN, { username, password })
  },

  /**
   * 获取管理员信息
   * @returns {Promise} 管理员信息
   */
  getProfile() {
    return http.get(AUTH.PROFILE)
  },

  /**
   * 修改密码
   * @param {string} oldPassword - 原密码
   * @param {string} newPassword - 新密码
   * @returns {Promise} 修改结果
   */
  updatePassword(oldPassword, newPassword) {
    return http.put(AUTH.PASSWORD, { oldPassword, newPassword })
  }
} 