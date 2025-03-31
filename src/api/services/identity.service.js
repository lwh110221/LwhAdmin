import http from '../http'
import { IDENTITY } from '../endpoints'

/**
 * 获取身份认证申请列表
 * @param {Object} params - 查询参数
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=10] - 每页条数
 * @param {number} [params.status] - 状态筛选(0-待审核,1-已通过,2-已拒绝)
 * @returns {Promise<Object>} 认证申请列表及分页信息
 */
export const getCertifications = (params = {}) => {
  return http.get(IDENTITY.CERTIFICATION_LIST, { params })
}

/**
 * 审核身份认证申请
 * @param {number} certificationId - 认证申请ID
 * @param {Object} data - 审核信息
 * @param {boolean} data.approved - 是否通过认证
 * @param {string} [data.comment] - 审核意见
 * @returns {Promise<Object>} 审核结果
 */
export const reviewCertification = (certificationId, data) => {
  return http.put(IDENTITY.CERTIFICATION_REVIEW(certificationId), data)
}

/**
 * 获取身份统计信息
 * @returns {Promise<Object>} 身份统计信息
 */
export const getIdentityStats = () => {
  return http.get(IDENTITY.STATS)
}

export default {
  getCertifications,
  reviewCertification,
  getIdentityStats
} 