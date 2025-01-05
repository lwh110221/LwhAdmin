/**
 * 获取完整的图片URL
 * @param {string} path - 图片路径
 * @param {string} [defaultImage] - 默认图片路径
 * @returns {string} 完整的图片URL
 */
export const getImageUrl = (path, defaultImage = '/default-image.png') => {
  if (!path) return defaultImage
  if (path.startsWith('http')) return path
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || ''
  return `${baseUrl}${path}`
} 