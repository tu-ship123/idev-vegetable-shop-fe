<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  disabled: { type: Boolean, default: false }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outline':
      return 'border-2 border-[#82ae46] text-[#82ae46] hover:bg-[#82ae46] hover:text-white'
    case 'primary':
    default:
      return 'bg-[#82ae46] text-white hover:bg-[#6c9239] shadow-md hover:shadow-lg'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex justify-center items-center px-8 py-3 text-[12px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="variantClasses"
    style="font-family: 'Poppins', sans-serif;"
  >
    <slot />
  </button>
</template>