<script setup>
import { Home } from 'lucide-vue-next'
import bgError from '@/assets/images/bg_3.jpg'
</script>

<template>
  <main 
    class="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat bg-fixed" :style="{ backgroundImage: `url(${bgError})` }" >
    <div class="absolute inset-0 bg-black/50"></div>
    
    <div class="relative z-10 text-center text-white px-4 animate-fade-in">
      <h1 class="text-9xl font-bold mb-2 text-[#82ae46]" style="font-family: 'Amatic SC', cursive; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
        404
      </h1>
      <h2 class="text-4xl md:text-5xl font-bold mb-4" style="font-family: 'Amatic SC', cursive;">
        Ôi không! Lạc đường rồi.
      </h2>
      <p class="text-sm md:text-base mb-10 font-light tracking-wide text-gray-200" style="font-family: 'Poppins', sans-serif;">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.
      </p>
      
      <router-link 
        to="/" 
        class="bg-[#82ae46] text-white px-8 py-3 rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-[#6c9239] transition-colors shadow-lg shadow-[#82ae46]/30 inline-flex items-center gap-2"
        style="font-family: 'Poppins', sans-serif;"
      >
        <Home :size="18" /> Quay về Trang chủ
      </router-link>
    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>