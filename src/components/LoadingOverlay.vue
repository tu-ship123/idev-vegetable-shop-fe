<template>
  <div v-if="isLoading" class="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center backdrop-blur-sm transition-all duration-300">
    <div class="bg-white px-8 py-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl transform scale-100 animate-bounce-in">
      <Loader2 class="w-10 h-10 text-[#82ae46] animate-spin" />
      <span class="font-black text-gray-700 uppercase tracking-widest text-sm">Đang xử lý...</span>
    </div>
  </div>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next'
defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounce-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>