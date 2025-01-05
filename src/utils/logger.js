/**
 * 日志工具
 */

// 日志级别
const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
}

// 获取当前时间戳
const getTimestamp = () => {
  return new Date().toISOString()
}

// 格式化日志内容
const formatLog = (level, message, details = null) => {
  const log = {
    timestamp: getTimestamp(),
    level,
    message
  }

  if (details) {
    if (details instanceof Error) {
      log.error = {
        name: details.name,
        message: details.message,
        stack: details.stack
      }
    } else {
      log.details = details
    }
  }

  return log
}

// 保存日志到本地存储
const saveLog = (log) => {
  try {
    const logs = JSON.parse(localStorage.getItem('app_logs') || '[]')
    logs.push(log)
    // 只保留最近1000条日志
    if (logs.length > 1000) {
      logs.shift()
    }
    localStorage.setItem('app_logs', JSON.stringify(logs))
  } catch (error) {
    console.error('保存日志失败:', error)
  }
}

// 输出日志到控制台
const consoleLog = (level, message, details) => {
  const timestamp = new Date().toLocaleString()
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`
  
  switch (level) {
    case LogLevel.ERROR:
      console.error(prefix, message, details || '')
      break
    case LogLevel.WARN:
      console.warn(prefix, message, details || '')
      break
    case LogLevel.INFO:
      console.info(prefix, message, details || '')
      break
    default:
      console.log(prefix, message, details || '')
  }
}

/**
 * 日志记录器
 */
export const logger = {
  /**
   * 记录调试日志
   * @param {string} message - 日志消息
   * @param {*} [details] - 详细信息
   */
  debug(message, details = null) {
    const log = formatLog(LogLevel.DEBUG, message, details)
    saveLog(log)
    if (import.meta.env.DEV) {
      consoleLog(LogLevel.DEBUG, message, details)
    }
  },

  /**
   * 记录信息日志
   * @param {string} message - 日志消息
   * @param {*} [details] - 详细信息
   */
  info(message, details = null) {
    const log = formatLog(LogLevel.INFO, message, details)
    saveLog(log)
    consoleLog(LogLevel.INFO, message, details)
  },

  /**
   * 记录警告日志
   * @param {string} message - 日志消息
   * @param {*} [details] - 详细信息
   */
  warn(message, details = null) {
    const log = formatLog(LogLevel.WARN, message, details)
    saveLog(log)
    consoleLog(LogLevel.WARN, message, details)
  },

  /**
   * 记录错误日志
   * @param {string} message - 日志消息
   * @param {Error|*} [error] - 错误对象或详细信息
   */
  error(message, error = null) {
    const log = formatLog(LogLevel.ERROR, message, error)
    saveLog(log)
    consoleLog(LogLevel.ERROR, message, error)
  },

  /**
   * 获取所有日志
   * @returns {Array} 日志列表
   */
  getLogs() {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]')
    } catch (error) {
      console.error('获取日志失败:', error)
      return []
    }
  },

  /**
   * 清除日志
   */
  clearLogs() {
    localStorage.removeItem('app_logs')
  }
} 