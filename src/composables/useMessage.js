import { ref } from 'vue'

export function useMessage(duration = 3000) {
  const show = ref(false)
  const message = ref('')
  const type = ref('info')

  const showMessage = (content, messageType = 'info') => {
    message.value = content
    type.value = messageType
    show.value = true

    setTimeout(() => {
      show.value = false
    }, duration)
  }

  return {
    show,
    message,
    type,
    showMessage
  }
} 