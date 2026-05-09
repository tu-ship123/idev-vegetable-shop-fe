<script setup>
import { Twitter, Facebook, Instagram } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-white pt-20 pb-10 border-t border-gray-100" style="font-family: 'Poppins', sans-serif;">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <h4 class="text-gray-900 font-bold mb-8 uppercase tracking-widest text-sm">Vegefoods</h4>
        <p class="text-gray-500 text-[14px] leading-relaxed">Nông sản sạch hữu cơ mang đến sức khỏe vàng cho gia đình bạn.</p>
        <div class="flex gap-4 mt-6">
          <Facebook :size="18" class="text-gray-400 hover:text-[#82ae46] cursor-pointer" />
          <Twitter :size="18" class="text-gray-400 hover:text-[#82ae46] cursor-pointer" />
          <Instagram :size="18" class="text-gray-400 hover:text-[#82ae46] cursor-pointer" />
        </div>
      </div>
      <div>
        <h4 class="text-gray-900 font-bold mb-8 uppercase tracking-widest text-sm">Danh mục</h4>
        <ul class="text-gray-500 text-[14px] space-y-3">
          <li><a href="#" class="hover:text-[#82ae46]">Rau củ tươi</a></li>
          <li><a href="#" class="hover:text-[#82ae46]">Trái cây sạch</a></li>
          <li><a href="#" class="hover:text-[#82ae46]">Combo ưu đãi</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-gray-900 font-bold mb-8 uppercase tracking-widest text-sm">Hỗ trợ</h4>
        <ul class="text-gray-500 text-[14px] space-y-3">
          <li><a href="#" class="hover:text-[#82ae46]">Vận chuyển</a></li>
          <li><a href="#" class="hover:text-[#82ae46]">Chính sách đổi trả</a></li>
          <li><a href="#" class="hover:text-[#82ae46]">Bảo mật</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-gray-900 font-bold mb-8 uppercase tracking-widest text-sm">Liên hệ</h4>
        <p class="text-gray-500 text-[14px]">TP. Hồ Chí Minh, Việt Nam<br>+84 123 456 789<br>info@vegefoods.com</p>
      </div>
    </div>
  </footer>
</template>