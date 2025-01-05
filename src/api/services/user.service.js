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
  }
} 