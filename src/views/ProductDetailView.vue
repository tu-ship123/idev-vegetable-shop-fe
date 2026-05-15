<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Star, Minus, Plus, ShoppingCart, Heart, Share2, ShieldCheck, Truck, RefreshCcw 
} from 'lucide-vue-next'
import { productApi } from '@/api/productApi'
import ProductCard from '@/components/ProductCard.vue'
import { formatPrice } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const isLoading = ref(true)
const activeTab = ref('description')
const quantity = ref(1)

const fetchProductDetail = async () => {
  isLoading.value = true
  try {
    const res = await productApi.getProductById(route.params.id)
    const p = res.data || res // Dò tìm tầng chứa data
    
    if (!p) throw new Error("Không nhận được dữ liệu sản phẩm")

    product.value = {
      ...p,
      image: p.imageUrl,
      category: p.categoryName,
      rating: 5,
      reviews: 0,
      shortDesc: p.description, 
      specs: [
        { label: 'Đơn vị', value: p.unit || 'N/A' }, // Chống null
        { label: 'Trạng thái', value: p.stockQty > 0 ? 'Còn hàng' : 'Hết hàng' },
        { label: 'Ngày nhập', value: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : 'Mới' } // Chống null ngày tháng
      ],
      related: [] 
    }
  } catch (error) {
    console.error(error)
    router.push('/products')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProductDetail()
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="min-h-screen bg-[#fcfcfc] py-16">
    <div v-if="isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div class="aspect-square bg-gray-100 rounded-[60px]"></div>
        <div class="space-y-8">
          <div class="h-12 bg-gray-100 rounded-2xl w-3/4"></div>
          <div class="h-24 bg-gray-100 rounded-2xl"></div>
          <div class="h-32 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-12 text-[10px] font-black uppercase tracking-[3px] text-gray-400">
        <router-link to="/" class="hover:text-green-600 transition-colors">Trang chủ</router-link>
        <span class="mx-4 text-gray-200">/</span>
        <router-link to="/products" class="hover:text-green-600 transition-colors">Sản phẩm</router-link>
        <span class="mx-4 text-gray-200">/</span>
        <span class="text-gray-900">{{ product.name }}</span>
      </nav>

      <!-- Main Content (VSI-47) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
        <!-- Image Gallery -->
        <div class="relative">
          <div class="aspect-square bg-white rounded-[60px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100 p-12">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-contain" />
          </div>
          <div v-if="product.discount" class="absolute top-8 left-8 bg-red-500 text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-red-200">
            Giảm {{ product.discount }}%
          </div>
        </div>

        <!-- Core Info -->
        <div class="flex flex-col">
          <div class="flex items-center gap-4 mb-6">
            <span class="bg-green-50 text-green-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
              {{ product.category }}
            </span>
            <div class="flex items-center gap-1 text-yellow-400">
              <Star v-for="i in 5" :key="i" :size="16" :fill="i <= Math.floor(product.rating) ? 'currentColor' : 'none'" />
              <span class="text-xs font-black text-gray-400 ml-2">({{ product.reviews }} Đánh giá)</span>
            </div>
          </div>

          <h1 class="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
            {{ product.name }}
          </h1>

          <div class="flex items-end gap-6 mb-10">
            <div class="flex flex-col">
              <span v-if="product.oldPrice" class="text-lg text-gray-300 line-through font-bold">
                {{ formatPrice(product.oldPrice) }}
              </span>
              <span class="text-5xl font-black text-gray-900 leading-none">
                {{ formatPrice(product.price) }}
              </span>
            </div>
            <span class="text-sm font-bold text-gray-400 mb-1">/ Đơn vị (Kg/Túi)</span>
          </div>

          <p class="text-gray-500 text-lg leading-relaxed mb-10 pb-10 border-b border-gray-100">
            {{ product.shortDesc }}
          </p>

          <!-- Actions -->
          <div class="flex flex-col gap-8">
            <div class="flex items-center gap-6">
              <div class="bg-white border border-gray-100 rounded-3xl p-2 flex items-center shadow-sm">
                <button 
                  @click="quantity > 1 && quantity--"
                  class="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <Minus :size="20" />
                </button>
                <input 
                  type="number" 
                  v-model="quantity" 
                  class="w-16 text-center border-none focus:ring-0 font-black text-xl text-gray-900" 
                />
                <button 
                  @click="quantity++"
                  class="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <Plus :size="20" />
                </button>
              </div>
              <button class="flex-1 bg-gray-900 text-white h-16 rounded-[28px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-green-600 shadow-xl shadow-gray-200 transition-all duration-500 group">
                <ShoppingCart :size="20" class="transition-transform group-hover:-translate-y-1" />
                Thêm vào giỏ hàng
              </button>
            </div>

            <div class="flex items-center gap-4">
              <button class="flex-1 border border-gray-100 h-14 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                <Heart :size="16" />
                Yêu thích
              </button>
              <button class="flex-1 border border-gray-100 h-14 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                <Share2 :size="16" />
                Chia sẻ
              </button>
            </div>
          </div>

          <!-- Trust Badges -->
          <div class="mt-12 grid grid-cols-3 gap-4">
            <div class="flex flex-col items-center text-center gap-3 p-4 bg-gray-50/50 rounded-3xl border border-white">
              <ShieldCheck class="text-green-600" :size="24" />
              <span class="text-[9px] font-black uppercase tracking-wider text-gray-400">An toàn 100%</span>
            </div>
            <div class="flex flex-col items-center text-center gap-3 p-4 bg-gray-50/50 rounded-3xl border border-white">
              <Truck class="text-green-600" :size="24" />
              <span class="text-[9px] font-black uppercase tracking-wider text-gray-400">Giao hàng nhanh</span>
            </div>
            <div class="flex flex-col items-center text-center gap-3 p-4 bg-gray-50/50 rounded-3xl border border-white">
              <RefreshCcw class="text-green-600" :size="24" />
              <span class="text-[9px] font-black uppercase tracking-wider text-gray-400">Hoàn trả dễ dàng</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Tabs (VSI-48) -->
      <div class="mb-32">
        <div class="flex justify-center gap-12 mb-16 border-b border-gray-100">
          <button 
            v-for="tab in [{id: 'description', name: 'Mô tả chi tiết'}, {id: 'specs', name: 'Thông số sản phẩm'}, {id: 'reviews', name: `Đánh giá (${product.reviews})`}]"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="pb-8 text-[11px] font-black uppercase tracking-[3px] transition-all relative"
            :class="activeTab === tab.id ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'"
          >
            {{ tab.name }}
            <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-full animate-grow-x"></div>
          </button>
        </div>

        <div class="max-w-4xl mx-auto min-h-[400px]">
          <div v-if="activeTab === 'description'" class="animate-fade-in">
            <div class="prose prose-green max-w-none">
              <p class="text-gray-500 text-lg leading-loose whitespace-pre-line">{{ product.description }}</p>
            </div>
          </div>

          <div v-if="activeTab === 'specs'" class="animate-fade-in">
            <div class="grid grid-cols-1 gap-4">
              <div 
                v-for="spec in product.specs" 
                :key="spec.label"
                class="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl"
              >
                <span class="text-sm font-black text-gray-400 uppercase tracking-widest">{{ spec.label }}</span>
                <span class="text-sm font-bold text-gray-900">{{ spec.value }}</span>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'reviews'" class="text-center py-20 animate-fade-in">
            <div class="text-6xl font-black text-gray-900 mb-4">{{ product.rating }}</div>
            <div class="flex justify-center gap-1 text-yellow-400 mb-8">
              <Star v-for="i in 5" :key="i" :size="24" :fill="i <= 4 ? 'currentColor' : 'none'" />
            </div>
            <p class="text-gray-400 text-sm">Hiện chưa có đánh giá chi tiết cho sản phẩm này.</p>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <section>
        <div class="flex items-end justify-between mb-16">
          <div>
            <p class="text-[10px] font-black text-green-600 uppercase tracking-[4px] mb-4">Gợi ý cho bạn</p>
            <h2 class="text-4xl font-black text-gray-900">SẢN PHẨM TƯƠNG TỰ</h2>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCard 
            v-for="p in product.related" 
            :key="p.id" 
            :product="p" 
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.animate-grow-x {
  animation: growX 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes growX {
  from { width: 0; }
  to { width: 100%; }
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
