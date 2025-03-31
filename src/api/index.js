import http from './http'
import authService from './services/auth.service'
import userService from './services/user.service'
import momentService from './services/moment.service'
import newsService from './services/news.service'
import identityService from './services/identity.service'
import adminService from './services/admin.service'
import roleService from './services/role.service'

export {
  http,
  authService,
  userService,
  momentService,
  newsService,
  identityService,
  adminService,
  roleService
}

export * from './endpoints' 