import http from '../http'
import { USER } from '../endpoints'

/**
 * 用户管理服务
 */
export default {
  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.limit=10] - 每页条数
   * @param {string} [params.username] - 用户名搜索
   * @param {string} [params.email] - 邮箱搜索
   * @param {string} [params.startDate] - 开始日期
   * @param {string} [params.endDate] - 结束日期
   * @returns {Promise} 用户列表
   */
  getList(params = {}) {
    return http.get(USER.LIST, { params })
  },

  /**
   * 获取用户详情
   * @param {number} userId - 用户ID
   * @returns {Promise} 用户详情
   */
  getDetail(userId) {
    return http.get(USER.DETAIL(userId))
  },

  /**
   * 修改用户状态
   * @param {number} userId - 用户ID
   * @param {boolean} status - 状态(true: 正常, false: 禁用)
   * @returns {Promise} 操作结果
   */
  updateStatus(userId, status) {
    return http.put(USER.UPDATE_STATUS(userId), { status })
  },

  /**
   * 删除用户
   * @param {number} userId - 用户ID
   * @returns {Promise} 操作结果
   */
  deleteUser(userId) {
    return http.delete(USER.DELETE(userId))
  },

  /**
   * 获取用户统计数据
   * @returns {Promise} 统计数据
   */
  getStats() {
    return http.get(USER.STATS)
  }
} 