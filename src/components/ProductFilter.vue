<script setup>
import { ref } from 'vue'
import { Search, Filter, X } from 'lucide-vue-next'
import { formatPrice } from '@/utils/formatters'

const props = defineProps({
  categories: {
    type: Array,
    required: true
    // ĐÃ XÓA: default rỗng
  }
})

// ĐÃ SỬA: Bỏ 'search' do không sử dụng
const emit = defineEmits(['filter'])

const searchQuery = ref('')
const selectedCategory = ref('all')
const priceRange = ref(1000000) // Khởi tạo với giá trị max

const applyFilters = () => {
  emit('filter', {
    category: selectedCategory.value,
    maxPrice: priceRange.value,
    q: searchQuery.value
  })
}
</script>

<template>
  <div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm sticky top-24">
    <div class="mb-10">
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 font-outfit">Tìm kiếm</p>
      <div class="relative">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Bạn đang tìm gì..."
          class="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-green-500 transition-all placeholder:text-gray-300"
          @input="applyFilters"
        />
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" :size="20" />
      </div>
    </div>

    <div class="mb-10">
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 font-outfit">Danh mục</p>
      <div class="space-y-2">
        <button 
          v-for="cat in [{id: 'all', name: 'Tất cả'}, ...(categories || [])]" 
          :key="cat.id"
          @click="selectedCategory = cat.id; applyFilters()"
          class="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group"
          :class="selectedCategory === cat.id ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'text-gray-500 hover:bg-green-50 hover:text-green-600'"
        >
          <span class="text-sm font-bold">{{ cat.name }}</span>
          <div 
            class="w-2 h-2 rounded-full transition-all"
            :class="selectedCategory === cat.id ? 'bg-green-400' : 'bg-gray-100 group-hover:bg-green-200'"
          ></div>
        </button>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-6">
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-[3px] font-outfit">Khoảng giá</p>
        <span class="text-sm font-black text-green-600">Dưới {{ formatPrice(priceRange) }}</span>
      </div>
      <input 
        v-model="priceRange"
        type="range" 
        min="0" 
        max="1000000" 
        step="10000"
        class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600"
        @change="applyFilters"
      />
      <div class="flex justify-between mt-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
        <span>0đ</span>
        <span>1.000.000đ</span>
      </div>
    </div>

    <button 
      @click="searchQuery = ''; selectedCategory = 'all'; priceRange = 1000000; applyFilters()"
      class="w-full mt-10 py-4 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-all border border-dashed border-gray-100 rounded-2xl"
    >
      <X :size="14" />
      Xóa bộ lọc
    </button>
  </div>
</template>