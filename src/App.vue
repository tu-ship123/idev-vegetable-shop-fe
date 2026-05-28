<script setup>
import { useToastStore } from '@/stores/toast'
import { storeToRefs } from 'pinia'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-vue-next'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
</script>

<template>
  <router-view />
  
  <!-- Global Toast System -->
  <div class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl border text-sm font-semibold transition-all duration-300"
        :class="{
          'bg-white border-green-100 text-green-800 shadow-green-100/50': toast.type === 'success',
          'bg-white border-red-100 text-red-800 shadow-red-100/50': toast.type === 'error',
          'bg-white border-yellow-100 text-yellow-800 shadow-yellow-100/50': toast.type === 'warning',
          'bg-white border-blue-100 text-blue-800 shadow-blue-100/50': toast.type === 'info'
        }"
      >
        <div class="flex-shrink-0">
          <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 text-green-500" />
          <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-500" />
          <AlertCircle v-else class="w-5 h-5 text-yellow-500" />
        </div>
        
        <div class="flex-grow text-gray-700 text-xs tracking-wide">{{ toast.message }}</div>
        
        <button @click="toastStore.remove(toast.id)" class="text-gray-400 hover:text-gray-600 transition-colors ml-2 text-lg">
          &times;
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style>
/* Reset mặc định cho toàn bộ ứng dụng */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #F4F7F5;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', 'Inter', system-ui, sans-serif;
}

/* Toast Transition */
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

