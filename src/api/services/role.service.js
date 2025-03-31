import http from '../http'
import { ROLE } from '../endpoints'

/**
 * 角色管理服务
 */
const roleService = {
  /**
   * 获取角色列表
   * @returns {Promise} - 请求结果
   */
  getRoleList() {
    return http.get(ROLE.LIST)
  },
  
  /**
   * 获取角色详情
   * @param {number} roleId - 角色ID
   * @returns {Promise} - 请求结果
   */
  getRoleDetail(roleId) {
    return http.get(ROLE.DETAIL(roleId))
  },
  
  /**
   * 创建角色
   * @param {Object} roleData - 角色数据
   * @returns {Promise} - 请求结果
   */
  createRole(roleData) {
    return http.post(ROLE.CREATE, roleData)
  },
  
  /**
   * 更新角色
   * @param {number} roleId - 角色ID
   * @param {Object} roleData - 角色数据
   * @returns {Promise} - 请求结果
   */
  updateRole(roleId, roleData) {
    return http.put(ROLE.UPDATE(roleId), roleData)
  },
  
  /**
   * 删除角色
   * @param {number} roleId - 角色ID
   * @returns {Promise} - 请求结果
   */
  deleteRole(roleId) {
    return http.delete(ROLE.DELETE(roleId))
  },
  
  /**
   * 更新角色权限
   * @param {number} roleId - 角色ID
   * @param {Array} permissionIds - 权限ID数组
   * @returns {Promise} - 请求结果
   */
  updateRolePermissions(roleId, permissionIds) {
    return http.put(ROLE.UPDATE_PERMISSIONS(roleId), { permissionIds })
  },
  
  /**
   * 获取所有权限列表
   * @returns {Promise} - 请求结果
   */
  getAllPermissions() {
    return http.get(ROLE.ALL_PERMISSIONS)
  }
}

export default roleService