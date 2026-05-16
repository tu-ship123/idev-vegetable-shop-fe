<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})

const emit = defineEmits(['update:page'])

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:page', page)
  }
}

// Logic tính toán hiển thị tối đa 5 trang gần nhất
const displayedPages = computed(() => {
  const pages = [];
  const maxDisplayed = 5;
  let start = Math.max(1, props.currentPage - Math.floor(maxDisplayed / 2));
  let end = Math.min(props.totalPages, start + maxDisplayed - 1);

  if (end - start + 1 < maxDisplayed) {
    start = Math.max(1, end - maxDisplayed + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
})
</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <button 
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
      :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'bg-white border border-gray-100 text-gray-900 hover:bg-green-500 hover:text-white shadow-sm'"
    >
      <ChevronLeft :size="20" />
    </button>

    <div class="flex items-center gap-2">
      <span v-if="displayedPages[0] > 1" class="text-gray-400 font-bold px-2"><MoreHorizontal :size="16"/></span>
      
      <button 
        v-for="page in displayedPages" 
        :key="page"
        @click="goToPage(page)"
        class="w-12 h-12 rounded-2xl font-black text-sm transition-all"
        :class="currentPage === page ? 'bg-gray-900 text-white shadow-xl' : 'bg-white border border-gray-100 text-gray-900 hover:bg-green-50'"
      >
        {{ page }}
      </button>

      <span v-if="displayedPages[displayedPages.length - 1] < totalPages" class="text-gray-400 font-bold px-2"><MoreHorizontal :size="16"/></span>
    </div>

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