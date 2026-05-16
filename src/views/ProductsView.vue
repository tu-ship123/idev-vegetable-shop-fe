<script setup>
import { ref, onMounted } from 'vue'
import { LayoutGrid, List, SlidersHorizontal, Search, Filter } from 'lucide-vue-next'
import ProductCard from '@/components/ProductCard.vue'
import ProductFilter from '@/components/ProductFilter.vue'
import Pagination from '@/components/Pagination.vue'
import { productApi } from '@/api/productApi'
import { useCartStore } from '@/stores/cart'

const products = ref([])
const categories = ref([])
const isLoading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const cartStore = useCartStore()

const currentFilters = ref({
  category: 'all',
  maxPrice: 1000000,
  q: ''
})

const fetchProducts = async () => {
  isLoading.value = true
  try {
    const params = {
      page: currentPage.value - 1,
      size: 6,
      categoryId: currentFilters.value.category !== 'all' ? currentFilters.value.category : undefined,
      maxPrice: currentFilters.value.maxPrice,
      name: currentFilters.value.q || undefined,
      sort: 'desc'
    }

    const res = await productApi.getProducts(params)
    // ĐÃ SỬA: Đổi toàn bộ resData thành res
    const beProducts = res.content || res || [] 
    totalPages.value = res.totalPages || 1

    products.value = beProducts.map(p => ({
      ...p,
      image: p.imageUrl,
      category: p.categoryName,
      rating: 5,
      reviews: 0
    }))

    const catRes = await productApi.getCategories()
    // ĐÃ SỬA: Bỏ dò tìm catRes.data, dùng thẳng catRes
    categories.value = Array.isArray(catRes) ? catRes : [] 

  } catch (error) {
    console.error('API fetch failed:', error)
  } finally {
    isLoading.value = false
  }
}

const handleAddToCart = (product) => {
  cartStore.addToCart(product, 1)
  alert(`Đã thêm ${product.name} vào giỏ hàng thành công!`)
}

const handleFilter = (filters) => {
  currentFilters.value = filters
  currentPage.value = 1
  fetchProducts()
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="min-h-screen bg-[#fcfcfc] py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <p class="text-[10px] font-black text-green-600 uppercase tracking-[4px] mb-4">Cửa hàng hữu cơ</p>
          <h1 class="text-4xl md:text-6xl font-black text-gray-900 leading-tight">DANH SÁCH SẢN PHẨM</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            <button class="p-3 bg-gray-900 text-white rounded-xl shadow-lg">
              <LayoutGrid :size="18" />
            </button>
            <button class="p-3 text-gray-400 hover:text-gray-900 transition-colors">
              <List :size="18" />
            </button>
          </div>
          <div class="hidden md:flex items-center gap-2 bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm text-sm font-bold text-gray-900">
            <SlidersHorizontal :size="18" class="text-green-600" />
            Sắp xếp: Mới nhất
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div class="hidden lg:block">
          <ProductFilter :categories="categories" @filter="handleFilter" />
        </div>

        <button class="lg:hidden w-full flex items-center justify-center gap-3 bg-white border border-gray-100 py-4 rounded-2xl text-sm font-bold text-gray-900 shadow-sm mb-8">
          <Filter :size="18" class="text-green-600" />
          Bộ lọc & Tìm kiếm
        </button>

        <div class="lg:col-span-3">
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-pulse">
            <div v-for="i in 6" :key="i" class="h-[450px] bg-gray-100 rounded-[40px]"></div>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <ProductCard 
              v-for="product in products" 
              :key="product.id" 
              :product="product" 
              @add-to-cart="handleAddToCart"
            />
          </div>

          <div v-if="!isLoading && products.length === 0" class="py-32 text-center">
            <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Search :size="48" />
            </div>
            <h3 class="text-xl font-black text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
            <p class="text-gray-400 text-sm">Vui lòng thử lại với các điều kiện lọc khác.</p>
          </div>

          <div v-if="!isLoading && products.length > 0" class="mt-20">
            <Pagination 
              :current-page="currentPage" 
              :total-pages="totalPages" 
              @update:page="currentPage = $event; fetchProducts()" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>