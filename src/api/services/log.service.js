import http from '../http'
import { LOG } from '../endpoints'
import { logger } from '@/utils/logger'

/**
 * 日志管理服务
 */
export default {
  /**
   * 获取操作日志列表
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.limit=10] - 每页条数
   * @param {string} [params.keyword] - 搜索关键词
   * @param {string} [params.start_time] - 开始时间
   * @param {string} [params.end_time] - 结束时间
   * @param {string} [params.type] - 日志类型
   * @param {string} [params.level] - 日志级别
   * @returns {Promise} 日志列表
   */
  getLogList(params = {}) {
    logger.info('获取操作日志列表', { params })
    return http.get(LOG.LIST, { params })
  },

  /**
   * 获取日志统计数据
   * @returns {Promise} 统计数据
   */
  getLogStats() {
    logger.info('获取日志统计数据')
    return http.get(LOG.STATS)
  },

  /**
   * 清理日志
   * @param {Object} params - 清理参数
   * @param {string} [params.start_time] - 开始时间
   * @param {string} [params.end_time] - 结束时间
   * @param {string} [params.type] - 日志类型
   * @param {string} [params.level] - 日志级别
   * @returns {Promise} 清理结果
   */
  cleanLogs(params = {}) {
    logger.info('清理日志', { params })
    return http.post(LOG.CLEAN, params)
  }
} 