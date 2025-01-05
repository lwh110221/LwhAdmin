import http from '../http'
import { MOMENT } from '../endpoints'

/**
 * 动态管理服务
 */
export default {
  /**
   * 获取动态列表
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.limit=10] - 每页条数
   * @param {string} [params.startDate] - 开始日期
   * @param {string} [params.endDate] - 结束日期
   * @returns {Promise} 动态列表
   */
  getList(params = {}) {
    return http.get(MOMENT.LIST, { params })
  },

  /**
   * 删除动态
   * @param {number} momentId - 动态ID
   * @returns {Promise} 操作结果
   */
  deleteMoment(momentId) {
    return http.delete(MOMENT.DELETE(momentId))
  },

  /**
   * 获取动态统计数据
   * @returns {Promise} 统计数据
   */
  getStats() {
    return http.get(MOMENT.STATS)
  }
} 