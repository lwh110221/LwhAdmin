import http from '../http'
import { PRODUCT_CATEGORY, PRODUCT } from '../endpoints'

const productService = {
  /**
   * 获取产品分类列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回分类列表
   */
  getCategories(params = {}) {
    return http.get(PRODUCT_CATEGORY.LIST, { params })
  },

  /**
   * 创建产品分类
   * @param {Object} data - 分类数据
   * @returns {Promise} - 返回创建结果
   */
  createCategory(data) {
    return http.post(PRODUCT_CATEGORY.CREATE, data)
  },

  /**
   * 删除产品分类
   * @param {Number} id - 分类ID
   * @returns {Promise} - 返回删除结果
   */
  deleteCategory(id) {
    return http.delete(PRODUCT_CATEGORY.DELETE(id))
  },

  /**
   * 获取产品列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 返回产品列表
   */
  getProducts(params = {}) {
    return http.get(PRODUCT.LIST, { params })
  },

  /**
   * 更新产品状态（上架/下架）
   * @param {Number} id - 产品ID
   * @param {Number} status - 产品状态：0-下架，1-上架
   * @returns {Promise} - 返回更新结果
   */
  updateProductStatus(id, status) {
    return http.patch(PRODUCT.UPDATE_STATUS(id), { status })
  },

  /**
   * 删除产品
   * @param {Number} id - 产品ID
   * @returns {Promise} - 返回删除结果
   */
  deleteProduct(id) {
    return http.delete(PRODUCT.DELETE(id))
  }
}

export default productService 