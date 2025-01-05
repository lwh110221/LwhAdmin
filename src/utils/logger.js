import fs from 'fs'
import path from 'path'

class Logger {
  constructor() {
    this.logDir = 'logs'
    this.errorLogFile = path.join(this.logDir, 'error.log')
    this.ensureLogDirectory()
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir)
    }
  }

  formatMessage(level, message, error = null) {
    const timestamp = new Date().toISOString()
    let logMessage = `[${timestamp}] [${level}] ${message}\n`
    
    if (error) {
      logMessage += `Stack: ${error.stack}\n`
    }
    
    return logMessage
  }

  async writeLog(message) {
    try {
      await fs.promises.appendFile(this.errorLogFile, message)
    } catch (err) {
      console.error('写入日志文件失败:', err)
    }
  }

  error(message, error = null) {
    const logMessage = this.formatMessage('错误', message, error)
    this.writeLog(logMessage)
    console.error(message, error)
  }

  warn(message) {
    const logMessage = this.formatMessage('警告', message)
    this.writeLog(logMessage)
    console.warn(message)
  }

  info(message) {
    const logMessage = this.formatMessage('信息', message)
    this.writeLog(logMessage)
    console.info(message)
  }
}

export const logger = new Logger() 