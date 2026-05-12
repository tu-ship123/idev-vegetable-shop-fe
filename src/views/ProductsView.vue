<script setup>
import { ref, onMounted } from 'vue'
import { LayoutGrid, List, SlidersHorizontal, Search, Filter } from 'lucide-vue-next'
import ProductCard from '@/components/ProductCard.vue'
import ProductFilter from '@/components/ProductFilter.vue'
import Pagination from '@/components/Pagination.vue'
import { productApi } from '@/api/productApi'

// Mock Data
import p1 from '@/assets/images/product-1.jpg'
import p2 from '@/assets/images/product-2.jpg'
import p3 from '@/assets/images/product-3.jpg'
import p4 from '@/assets/images/product-4.jpg'
import p5 from '@/assets/images/product-5.jpg'
import p6 from '@/assets/images/product-6.jpg'
import p7 from '@/assets/images/product-7.jpg'
import p8 from '@/assets/images/product-8.jpg'

const products = ref([])
const categories = ref([
  { id: 1, name: 'Rau củ' },
  { id: 2, name: 'Trái cây' },
  { id: 3, name: 'Hạt & Đồ khô' },
  { id: 4, name: 'Nước ép' }
])
const isLoading = ref(true)
const currentPage = ref(1)
const totalPages = ref(5)

const mockProducts = [
  { id: 1, name: 'Ớt Chuông Đà Lạt', category: 'Rau củ', price: 45000, oldPrice: 55000, discount: 18, image: p1 },
  { id: 2, name: 'Dâu Tây Mộc Châu', category: 'Trái cây', price: 120000, oldPrice: 150000, discount: 20, image: p2 },
  { id: 3, name: 'Đậu Hà Lan', category: 'Rau củ', price: 35000, image: p3 },
  { id: 4, name: 'Bắp Cải Tím', category: 'Rau củ', price: 28000, oldPrice: 32000, discount: 12, image: p4 },
  { id: 5, name: 'Cà Chua Bi', category: 'Rau củ', price: 25000, image: p5 },
  { id: 6, name: 'Bông Cải Xanh', category: 'Rau củ', price: 38000, image: p6 },
  { id: 7, name: 'Tỏi Lý Sơn', category: 'Gia vị', price: 150000, image: p7 },
  { id: 8, name: 'Táo Envy', category: 'Trái cây', price: 180000, oldPrice: 210000, discount: 15, image: p8 }
]

const fetchProducts = async () => {
  isLoading.value = true
  try {
    // Fetch products
    const res = await productApi.getProducts({ page: currentPage.value })
    products.value = res.data.items
    totalPages.value = res.data.totalPages

    // Fetch categories (VSI-49)
    const catRes = await productApi.getCategories()
    categories.value = catRes.data
  } catch (error) {
    products.value = mockProducts
    totalPages.value = 3
    console.warn('API fetch failed, using mock data')
  } finally {
    isLoading.value = false
  }
}

const handleFilter = (filters) => {
  console.log('Applying filters:', filters)
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
      
      <!-- Page Header -->
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
        <!-- Sidebar Filter (VSI-45) -->
        <div class="hidden lg:block">
          <ProductFilter :categories="categories" @filter="handleFilter" />
        </div>

        <!-- Mobile Filter Toggle -->
        <button class="lg:hidden w-full flex items-center justify-center gap-3 bg-white border border-gray-100 py-4 rounded-2xl text-sm font-bold text-gray-900 shadow-sm mb-8">
          <Filter :size="18" class="text-green-600" />
          Bộ lọc & Tìm kiếm
        </button>

        <!-- Product Grid (VSI-44) -->
        <div class="lg:col-span-3">
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-pulse">
            <div v-for="i in 6" :key="i" class="h-[450px] bg-gray-100 rounded-[40px]"></div>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <ProductCard 
              v-for="product in products" 
              :key="product.id" 
              :product="product" 
            />
          </div>

          <!-- Empty State -->
          <div v-if="!isLoading && products.length === 0" class="py-32 text-center">
            <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Search :size="48" />
            </div>
            <h3 class="text-xl font-black text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
            <p class="text-gray-400 text-sm">Vui lòng thử lại với các điều kiện lọc khác.</p>
          </div>

          <!-- Pagination (VSI-46) -->
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
