/**
 * 格式化日期时间
 * @param {string|Date} date - 要格式化的日期
 * @returns {string} 格式化后的日期字符串
 */
export const formatDateTime = (date) => {
  if (!date) return '-'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const pad = (num) => String(num).padStart(2, '0')
  
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  const seconds = pad(d.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化日期
 * @param {string|Date} date - 要格式化的日期
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date) => {
  if (!date) return '-'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'

  const pad = (num) => String(num).padStart(2, '0')
  
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())

  return `${year}-${month}-${day}`
} 