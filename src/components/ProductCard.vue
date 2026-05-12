<script setup>
import { ShoppingCart, Eye, Heart } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const navigateToDetail = () => {
  router.push(`/products/${props.product.id}`)
}
</script>

<template>
  <div class="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-green-100 transition-all duration-500 hover:shadow-2xl hover:shadow-green-900/5 relative">
    <!-- Badges -->
    <div v-if="product.discount" class="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-200">
      -{{ product.discount }}%
    </div>
    
    <!-- Image Section -->
    <div class="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" @click="navigateToDetail">
      <img 
        :src="product.image" 
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      <!-- Overlay Actions -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div class="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <button class="w-11 h-11 rounded-2xl bg-white text-gray-900 shadow-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all">
            <ShoppingCart :size="18" />
          </button>
          <button @click.stop="navigateToDetail" class="w-11 h-11 rounded-2xl bg-white text-gray-900 shadow-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-all">
            <Eye :size="18" />
          </button>
          <button class="w-11 h-11 rounded-2xl bg-white text-gray-900 shadow-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
            <Heart :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div class="p-6">
      <div class="flex flex-col gap-1 mb-4">
        <p class="text-[10px] font-bold text-green-600 uppercase tracking-widest">{{ product.category }}</p>
        <h3 
          class="text-lg font-black text-gray-900 hover:text-green-600 cursor-pointer transition-colors line-clamp-1"
          @click="navigateToDetail"
        >
          {{ product.name }}
        </h3>
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <span v-if="product.oldPrice" class="text-xs text-gray-400 line-through font-medium">
            {{ formatPrice(product.oldPrice) }}
          </span>
          <span class="text-xl font-black text-gray-900">
            {{ formatPrice(product.price) }}
          </span>
        </div>
        
        <button class="text-[11px] font-black text-green-600 uppercase tracking-widest hover:text-green-700 transition-colors">
          Mua ngay +
        </button>
      </div>
    </div>
  </div>
</template>
