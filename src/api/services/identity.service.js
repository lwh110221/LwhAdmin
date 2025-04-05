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

/**
 * 获取所有身份类型
 * @returns {Promise<Object>} 身份类型列表
 */
export const getIdentityTypes = () => {
  return http.get(IDENTITY.TYPE_LIST)
}

/**
 * 创建身份类型
 * @param {Object} data - 身份类型数据
 * @param {string} data.code - 身份类型代码
 * @param {string} data.name - 身份类型名称
 * @param {boolean} [data.isDefault] - 是否为默认身份
 * @param {boolean} [data.needCertification] - 是否需要认证
 * @param {number} [data.validityDays] - 认证有效期(天)
 * @param {string[]} [data.requiredFields] - 认证所需字段
 * @param {string} [data.description] - 认证要求描述
 * @returns {Promise<Object>} 创建结果
 */
export const createIdentityType = (data) => {
  return http.post(IDENTITY.TYPE_CREATE, data)
}

/**
 * 更新身份类型
 * @param {string} code - 身份类型代码
 * @param {Object} data - 更新数据
 * @param {string} [data.name] - 身份类型名称
 * @param {boolean} [data.isDefault] - 是否为默认身份
 * @param {boolean} [data.needCertification] - 是否需要认证
 * @param {number} [data.validityDays] - 认证有效期(天)
 * @param {string[]} [data.requiredFields] - 认证所需字段
 * @param {string} [data.description] - 认证要求描述
 * @returns {Promise<Object>} 更新结果
 */
export const updateIdentityType = (code, data) => {
  return http.put(IDENTITY.TYPE_UPDATE(code), data)
}

/**
 * 删除身份类型
 * @param {string} code - 身份类型代码
 * @returns {Promise<Object>} 删除结果
 */
export const deleteIdentityType = (code) => {
  return http.delete(IDENTITY.TYPE_DELETE(code))
}

export default {
  getCertifications,
  reviewCertification,
  getIdentityStats,
  getIdentityTypes,
  createIdentityType,
  updateIdentityType,
  deleteIdentityType
} 