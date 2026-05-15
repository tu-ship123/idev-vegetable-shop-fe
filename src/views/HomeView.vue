<script setup>
import { ref, onMounted } from 'vue'
import { Truck, ShieldCheck, Award, Headphones, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import ProductCard from '@/components/ProductCard.vue'
import { productApi } from '@/api/productApi'

// Import images
import bg1 from '@/assets/images/bg_1.jpg'
import bg2 from '@/assets/images/bg_2.jpg'
import bg3 from '@/assets/images/bg_3.jpg'

const router = useRouter()
const featuredProducts = ref([])
const isLoading = ref(true)

const slides = [
  {
    image: bg1,
    title: 'RAU CỦ TƯƠI SẠCH',
    subtitle: 'THỰC PHẨM 100% HỮU CƠ',
    desc: 'Chúng tôi cung cấp các loại rau củ tươi sạch nhất từ các nông trại đạt chuẩn VietGAP.'
  },
  {
    image: bg2,
    title: 'TRÁI CÂY NHẬP KHẨU',
    subtitle: 'CHẤT LƯỢNG HÀNG ĐẦU',
    desc: 'Thưởng thức hương vị tươi ngon từ các loại trái cây cao cấp trên thế giới.'
  },
  {
    image: bg3,
    title: 'NÔNG SẢN VIỆT',
    subtitle: 'GIÁ TRỊ TỪ ĐẤT MẸ',
    desc: 'Ủng hộ nông sản Việt với chất lượng xuất khẩu và giá cả hợp lý nhất.'
  }
]

onMounted(async () => {
  try {
    const res = await productApi.getFeaturedProducts()
    
    // Bọc lót lấy mảng sản phẩm nổi bật
    const resData = res.data || res
    const beProducts = Array.isArray(resData) ? resData : (resData.content || [])
    
    featuredProducts.value = beProducts.map(p => ({
      ...p,
      image: p.imageUrl,
      category: p.categoryName,
      rating: 5,
      reviews: 0
    }))
  } catch (error) {
    console.error('Failed to load featured products:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="w-full bg-[#fcfcfc]">
    <!-- Hero Slider -->
    <section class="h-screen relative group">
      <swiper
        :modules="[Autoplay, EffectFade, Navigation, Pagination]"
        :effect="'fade'"
        :navigation="{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }"
        :pagination="{ clickable: true }"
        :autoplay="{ delay: 5000, disableOnInteraction: false }"
        class="h-full w-full"
      >
        <swiper-slide v-for="(slide, index) in slides" :key="index">
          <div class="relative h-full w-full overflow-hidden">
            <!-- Background Image -->
            <div 
              class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] scale-110 group-hover:scale-100"
              :style="{ backgroundImage: `url(${slide.image})` }"
            ></div>
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/30 bg-gradient-to-r from-black/40 to-transparent"></div>
            
            <!-- Content -->
            <div class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div class="max-w-2xl text-white">
                <p class="text-sm md:text-lg font-black uppercase tracking-[5px] mb-4 animate-fade-in text-green-400">
                  {{ slide.subtitle }}
                </p>
                <h1 class="text-6xl md:text-9xl font-black mb-8 leading-tight animate-slide-up" style="font-family: 'Amatic SC', cursive;">
                  {{ slide.title }}
                </h1>
                <p class="text-base md:text-xl mb-10 text-gray-200 font-medium leading-relaxed animate-slide-up delay-200">
                  {{ slide.desc }}
                </p>
                <div class="flex gap-4 animate-slide-up delay-300">
                  <button 
                    @click="router.push('/products')" 
                    class="bg-[#82ae46] text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white hover:text-[#82ae46] transition-all duration-500 shadow-xl shadow-black/20"
                  >
                    Mua sắm ngay
                  </button>
                  <button 
                    class="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/20 transition-all duration-500"
                  >
                    Tìm hiểu thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>

        <!-- Custom Navigation -->
        <button class="swiper-button-prev-custom absolute left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#82ae46] hover:border-transparent">
          <ChevronLeft :size="24" />
        </button>
        <button class="swiper-button-next-custom absolute right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#82ae46] hover:border-transparent">
          <ChevronRight :size="24" />
        </button>
      </swiper>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div class="flex flex-col items-center text-center group cursor-default">
            <div class="w-20 h-20 rounded-[35%] bg-green-50 flex items-center justify-center text-[#82ae46] mb-8 group-hover:bg-[#82ae46] group-hover:text-white transition-all duration-500 rotate-6 group-hover:rotate-0">
              <Truck :size="32" />
            </div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-3 text-gray-900">Giao hàng miễn phí</h3>
            <p class="text-gray-400 text-sm leading-relaxed">Cho đơn hàng từ 500.000đ.</p>
          </div>

          <div class="flex flex-col items-center text-center group cursor-default">
            <div class="w-20 h-20 rounded-[35%] bg-green-50 flex items-center justify-center text-[#82ae46] mb-8 group-hover:bg-[#82ae46] group-hover:text-white transition-all duration-500 -rotate-6 group-hover:rotate-0">
              <ShieldCheck :size="32" />
            </div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-3 text-gray-900">Luôn tươi sạch</h3>
            <p class="text-gray-400 text-sm leading-relaxed">Thu hoạch trực tiếp mỗi ngày.</p>
          </div>

          <div class="flex flex-col items-center text-center group cursor-default">
            <div class="w-20 h-20 rounded-[35%] bg-green-50 flex items-center justify-center text-[#82ae46] mb-8 group-hover:bg-[#82ae46] group-hover:text-white transition-all duration-500 rotate-12 group-hover:rotate-0">
              <Award :size="32" />
            </div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-3 text-gray-900">Chất lượng cao</h3>
            <p class="text-gray-400 text-sm leading-relaxed">Đạt chuẩn VietGAP & GlobalGAP.</p>
          </div>

          <div class="flex flex-col items-center text-center group cursor-default">
            <div class="w-20 h-20 rounded-[35%] bg-green-50 flex items-center justify-center text-[#82ae46] mb-8 group-hover:bg-[#82ae46] group-hover:text-white transition-all duration-500 -rotate-12 group-hover:rotate-0">
              <Headphones :size="32" />
            </div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-3 text-gray-900">Hỗ trợ 24/7</h3>
            <p class="text-gray-400 text-sm leading-relaxed">Tư vấn nhiệt tình, chu đáo.</p>
          </div>

        </div>
      </div>
    </section>

    <!-- Featured Products Section (VSI-43) -->
    <section class="py-24 bg-[#fcfcfc]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-16">
          <div class="max-w-xl">
            <p class="text-[10px] font-black text-green-600 uppercase tracking-[4px] mb-4">Danh sách tuyển chọn</p>
            <h2 class="text-4xl md:text-5xl font-black text-gray-900 leading-tight">SẢN PHẨM NỔI BẬT TRONG TUẦN</h2>
          </div>
          <button 
            @click="router.push('/products')" 
            class="hidden md:flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-[#82ae46] transition-colors group"
          >
            Xem tất cả 
            <ArrowRight :size="16" class="transition-transform group-hover:translate-x-2" />
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>
        
        <div class="mt-16 text-center md:hidden">
          <button @click="router.push('/products')" class="w-full bg-white border border-gray-100 text-gray-900 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm">
            Xem toàn bộ cửa hàng
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 1s ease-out forwards; }
.animate-slide-up { animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

:deep(.swiper-pagination-bullet) {
  width: 30px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
}
:deep(.swiper-pagination-bullet-active) {
  background: #82ae46;
  width: 50px;
}
</style>