<script setup>
import { onMounted, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: 'Thông báo' }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

// Khóa cuộn trang khi mở modal
onMounted(() => {
  if (props.isOpen) document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>
        
        <div class="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 text-left shadow-xl transition-all sm:my-8">
          
          <div class="flex items-center justify-between mb-4 border-b pb-3">
            <h3 class="text-lg font-medium leading-6 text-gray-900">{{ title }}</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-2 text-sm text-gray-500">
            <slot name="body">Nội dung mặc định của modal...</slot>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <slot name="footer">
              <BaseButton variant="secondary" @click="closeModal">Đóng</BaseButton>
              <BaseButton variant="primary">Xác nhận</BaseButton>
            </slot>
          </div>
          
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Hiệu ứng mượt mà khi mở/đóng modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>