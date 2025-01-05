import http from '../http'
import { NEWS_CATEGORY, NEWS_ARTICLE } from '../endpoints'
import { logger } from '@/utils/logger'

/**
 * 新闻管理服务
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
  },

  /**
   * 获取文章列表
   * @param {Object} params - 查询参数
   * @param {number} [params.page=1] - 页码
   * @param {number} [params.limit=10] - 每页条数
   * @param {number} [params.category_id] - 分类ID
   * @param {number} [params.is_published] - 发布状态(0-未发布,1-已发布)
   * @param {string} [params.keyword] - 搜索关键词
   * @param {number} [params.is_featured] - 是否推荐(0-未推荐,1-已推荐)
   * @param {number} [params.status] - 文章状态(0-禁用,1-启用)
   * @returns {Promise} 文章列表
   */
  getArticleList(params = {}) {
    return http.get(NEWS_ARTICLE.LIST, { params })
  },

  /**
   * 获取文章详情
   * @param {number} articleId - 文章ID
   * @returns {Promise} 文章详情
   */
  getArticleDetail(articleId) {
    return http.get(NEWS_ARTICLE.DETAIL(articleId))
  },

  /**
   * 创建文章
   * @param {Object} data - 文章数据
   * @param {number} data.category_id - 分类ID
   * @param {string} data.title - 文章标题
   * @param {string|Object} data.content - 文章内容(HTML或Quill Delta格式)
   * @param {string} [data.summary] - 文章摘要
   * @param {string} [data.cover_image] - 封面图片
   * @param {string} [data.author] - 作者
   * @param {string} [data.source] - 来源
   * @param {number} [data.is_featured] - 是否推荐(0-未推荐,1-已推荐)
   * @param {number} [data.is_published] - 是否发布(0-未发布,1-已发布)
   * @param {string} [data.publish_time] - 发布时间
   * @returns {Promise} 创建结果
   */
  createArticle(data) {
    return http.post(NEWS_ARTICLE.CREATE, data)
  },

  /**
   * 更新文章
   * @param {number} articleId - 文章ID
   * @param {Object} data - 文章数据
   * @param {number} [data.category_id] - 分类ID
   * @param {string} [data.title] - 文章标题
   * @param {string|Object} [data.content] - 文章内容(HTML或Quill Delta格式)
   * @param {string} [data.summary] - 文章摘要
   * @param {string} [data.cover_image] - 封面图片
   * @param {string} [data.author] - 作者
   * @param {string} [data.source] - 来源
   * @param {number} [data.is_featured] - 是否推荐(0-未推荐,1-已推荐)
   * @param {number} [data.is_published] - 是否发布(0-未发布,1-已发布)
   * @param {string} [data.publish_time] - 发布时间
   * @param {number} [data.status] - 状态(0-禁用,1-启用)
   * @returns {Promise} 更新结果
   */
  updateArticle(articleId, data) {
    return http.put(NEWS_ARTICLE.UPDATE(articleId), data)
  },

  /**
   * 删除文章
   * @param {number} articleId - 文章ID
   * @returns {Promise} 删除结果
   */
  deleteArticle(articleId) {
    return http.delete(NEWS_ARTICLE.DELETE(articleId))
  },

  /**
   * 更新文章发布状态
   * @param {number} articleId - 文章ID
   * @param {number} isPublished - 发布状态(0-未发布,1-已发布)
   * @returns {Promise} 更新结果
   */
  updateArticlePublishStatus(articleId, isPublished) {
    return http.put(NEWS_ARTICLE.UPDATE_PUBLISH(articleId), { is_published: isPublished })
  },

  /**
   * 更新文章推荐状态
   * @param {number} articleId - 文章ID
   * @param {number} isFeatured - 推荐状态(0-未推荐,1-已推荐)
   * @returns {Promise} 更新结果
   */
  updateArticleFeaturedStatus(articleId, isFeatured) {
    return http.put(NEWS_ARTICLE.UPDATE_FEATURED(articleId), { is_featured: isFeatured })
  },

  /**
   * 上传图片
   * @param {FormData} formData - 包含图片文件的表单数据，字段名为 'image'
   * @returns {Promise} 上传结果
   */
  uploadImage(formData) {
    return http.post(NEWS_ARTICLE.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // 添加上传进度处理
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          logger.info('图片上传进度', { percentCompleted })
        }
      }
    })
  }
} 