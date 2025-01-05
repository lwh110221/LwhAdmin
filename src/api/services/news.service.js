import http from '../http'
import { NEWS_CATEGORY } from '../endpoints'

/**
 * 新闻分类管理服务
 */
export default {
  /**
   * 获取分类列表
   * @returns {Promise} 分类列表
   */
  getCategoryList() {
    return http.get(NEWS_CATEGORY.LIST)
  },

  /**
   * 创建分类
   * @param {Object} data - 分类数据
   * @param {string} data.name - 分类名称
   * @param {string} data.code - 分类代码
   * @param {number} [data.sort_order] - 排序
   * @param {number} [data.status] - 状态(0-禁用,1-启用)
   * @returns {Promise} 创建结果
   */
  createCategory(data) {
    return http.post(NEWS_CATEGORY.CREATE, data)
  },

  /**
   * 更新分类
   * @param {number} categoryId - 分类ID
   * @param {Object} data - 分类数据
   * @param {string} [data.name] - 分类名称
   * @param {string} data.code - 分类代码
   * @param {number} [data.sort_order] - 排序
   * @param {number} data.status - 状态(0-禁用,1-启用)
   * @returns {Promise} 更新结果
   */
  updateCategory(categoryId, data) {
    return http.put(NEWS_CATEGORY.UPDATE(categoryId), data)
  },

  /**
   * 删除分类
   * @param {number} categoryId - 分类ID
   * @returns {Promise} 删除结果
   */
  deleteCategory(categoryId) {
    return http.delete(NEWS_CATEGORY.DELETE(categoryId))
  }
} 