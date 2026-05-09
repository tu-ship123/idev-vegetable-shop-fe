<script setup>
import { Truck, ShieldCheck, Award, Headphones } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import bgLogin from '@/assets/images/bg_1.jpg'

const router = useRouter()
</script>

<template>
  <div class="w-full">
    
    <section class="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat bg-fixed" :style="{ backgroundImage: `url(${bgLogin})` }">
      <div class="absolute inset-0 bg-black/20"></div>
      
      <div class="relative z-10 text-center text-white px-4 animate-fade-in-up">
        <h1 class="text-6xl md:text-8xl font-bold mb-4" style="font-family: 'Amatic SC', cursive;">CHÚNG TÔI CUNG CẤP<br>RAU CỦ & TRÁI CÂY TƯƠI</h1>
        <p class="text-sm md:text-lg mb-8 uppercase tracking-[3px] font-light">Thực phẩm 100% tươi sạch & hữu cơ</p>
        <button 
          @click="router.push('/products')" 
          class="bg-[#82ae46] text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#6c9239] transition-colors"
        >
          Xem chi tiết
        </button>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          
          <div class="flex flex-col items-center group">
            <div class="w-24 h-24 rounded-full bg-[#f3f6f4] flex items-center justify-center text-[#82ae46] mb-6 group-hover:bg-[#82ae46] group-hover:text-white transition-colors duration-300">
              <Truck :size="40" />
            </div>
            <h3 class="text-sm font-medium uppercase tracking-widest mb-4">Giao hàng miễn phí</h3>
            <p class="text-gray-500 text-sm">Giao hàng tận nơi miễn phí cho mọi đơn hàng trên 500.000đ.</p>
          </div>

          <div class="flex flex-col items-center group">
            <div class="w-24 h-24 rounded-full bg-[#eaf4eb] flex items-center justify-center text-[#82ae46] mb-6 group-hover:bg-[#82ae46] group-hover:text-white transition-colors duration-300">
              <ShieldCheck :size="40" />
            </div>
            <h3 class="text-sm font-medium uppercase tracking-widest mb-4">Luôn tươi sạch</h3>
            <p class="text-gray-500 text-sm">Sản phẩm được thu hoạch và đóng gói cẩn thận mỗi ngày.</p>
          </div>

          <div class="flex flex-col items-center group">
            <div class="w-24 h-24 rounded-full bg-[#f6f2eb] flex items-center justify-center text-[#82ae46] mb-6 group-hover:bg-[#82ae46] group-hover:text-white transition-colors duration-300">
              <Award :size="40" />
            </div>
            <h3 class="text-sm font-medium uppercase tracking-widest mb-4">Chất lượng cao</h3>
            <p class="text-gray-500 text-sm">Đạt tiêu chuẩn VietGAP, không sử dụng thuốc trừ sâu hóa học.</p>
          </div>

          <div class="flex flex-col items-center group">
            <div class="w-24 h-24 rounded-full bg-[#f3eaf2] flex items-center justify-center text-[#82ae46] mb-6 group-hover:bg-[#82ae46] group-hover:text-white transition-colors duration-300">
              <Headphones :size="40" />
            </div>
            <h3 class="text-sm font-medium uppercase tracking-widest mb-4">Hỗ trợ 24/7</h3>
            <p class="text-gray-500 text-sm">Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải đáp thắc mắc.</p>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>