import http from './http'
import authService from './services/auth.service'
import userService from './services/user.service'
import momentService from './services/moment.service'
import newsService from './services/news.service'
import logService from './services/log.service'

export {
  http,
  authService,
  userService,
  momentService,
  newsService,
  logService
}

export * from './endpoints' 