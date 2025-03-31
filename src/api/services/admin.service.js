import http from '../http'
import { ADMIN_MANAGE, ROLE } from '../endpoints'

/**
 * 管理员管理服务
 */
const adminService = {
  /**
   * 获取管理员列表
   * @param {Object} params - 查询参数
   * @returns {Promise} - 请求结果
   */
  getAdminList(params) {
    return http.get(ADMIN_MANAGE.LIST, { params })
  },
  
  /**
   * 创建管理员
   * @param {Object} adminData - 管理员数据
   * @returns {Promise} - 请求结果
   */
  createAdmin(adminData) {
    return http.post(ADMIN_MANAGE.CREATE, adminData)
  },
  
  /**
   * 更新管理员状态
   * @param {number} adminId - 管理员ID
   * @param {boolean} status - 状态
   * @returns {Promise} - 请求结果
   */
  updateAdminStatus(adminId, status) {
    return http.put(ADMIN_MANAGE.UPDATE_STATUS(adminId), { status })
  },
  
  /**
   * 更新管理员角色
   * @param {number} adminId - 管理员ID
   * @param {Array} roleIds - 角色ID数组
   * @returns {Promise} - 请求结果
   */
  updateAdminRoles(adminId, roleIds) {
    return http.put(ADMIN_MANAGE.UPDATE_ROLES(adminId), { roleIds })
  },
  
  /**
   * 删除管理员
   * @param {number} adminId - 管理员ID
   * @returns {Promise} - 请求结果
   */
  deleteAdmin(adminId) {
    return http.delete(ADMIN_MANAGE.DELETE(adminId))
  },
  
  /**
   * 获取角色列表
   * @returns {Promise} - 请求结果
   */
  getRoleList() {
    return http.get(ROLE.LIST)
  }
}

export default adminService 