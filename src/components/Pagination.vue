<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:page'])

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:page', page)
  }
}
</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <!-- Prev -->
    <button 
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
      :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'bg-white border border-gray-100 text-gray-900 hover:bg-green-500 hover:text-white shadow-sm'"
    >
      <ChevronLeft :size="20" />
    </button>

    <!-- Page Numbers -->
    <div class="flex items-center gap-2">
      <button 
        v-for="page in totalPages" 
        :key="page"
        @click="goToPage(page)"
        class="w-12 h-12 rounded-2xl font-black text-sm transition-all"
        :class="currentPage === page ? 'bg-gray-900 text-white shadow-xl' : 'bg-white border border-gray-100 text-gray-900 hover:bg-green-50'"
      >
        {{ page }}
      </button>
    </div>

    <!-- Next -->
    <button 
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
      :class="currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'bg-white border border-gray-100 text-gray-900 hover:bg-green-500 hover:text-white shadow-sm'"
    >
      <ChevronRight :size="20" />
    </button>
  </div>
</template>
