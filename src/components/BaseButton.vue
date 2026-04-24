<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // primary, secondary, danger, outline
  disabled: { type: Boolean, default: false }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    case 'secondary':
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500'
    case 'outline':
      return 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500'
    case 'primary':
    default:
      return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="variantClasses"
  >
    <slot /> </button>
</template>