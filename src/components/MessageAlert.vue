<template>
  <Teleport to="body">
    <div
      v-if="modelValue" 
      class="fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg transition-all duration-300 z-50"
      :class="{
        'bg-green-500 text-white': type === 'success',
        'bg-red-500 text-white': type === 'error',
        'bg-yellow-500 text-white': type === 'warning',
        'bg-blue-500 text-white': type === 'info'
      }"
    >
      {{ message }}
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  }
})

defineEmits(['update:modelValue'])
</script> 