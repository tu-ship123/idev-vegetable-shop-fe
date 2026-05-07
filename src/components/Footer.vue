<script setup>
import BaseButton from './BaseButton.vue'
import { Leaf } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-white border-t border-gray-100 py-6 w-full mt-auto">
    <div class="px-6 sm:px-10 lg:px-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        <!-- Logo & Description -->
        <div class="lg:col-span-4 pr-0 lg:pr-12">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-green-600 w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl shadow-green-100">
              <Leaf :size="22" class="text-white" />
            </div>
            <span class="text-2xl font-black text-gray-900 tracking-tight">Vegetable Shop</span>
          </div>
          <p class="text-gray-500 text-base leading-relaxed mb-6 max-w-sm">
            Hệ thống cung cấp nông sản sạch tiêu chuẩn VietGAP, kết nối trực tiếp từ nông trại đến bàn ăn của mọi gia đình Việt.
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all text-xs font-black">FB</a>
            <a href="#" class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all text-xs font-black">IG</a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="lg:col-span-2">
          <h4 class="text-gray-900 font-black mb-4 text-xs uppercase tracking-[2px]">Mua sắm</h4>
          <ul class="space-y-3 text-base">
            <li><a href="#" class="text-gray-500 hover:text-green-600 transition-colors font-medium">Rau củ hữu cơ</a></li>
            <li><a href="#" class="text-gray-500 hover:text-green-600 transition-colors font-medium">Trái cây tươi</a></li>
            <li><a href="#" class="text-gray-500 hover:text-green-600 transition-colors font-medium">Combo tiết kiệm</a></li>
          </ul>
        </div>

        <div class="lg:col-span-2">
          <h4 class="text-gray-900 font-black mb-4 text-xs uppercase tracking-[2px]">Thông tin</h4>
          <ul class="space-y-3 text-base">
            <li><a href="#" class="text-gray-500 hover:text-green-600 transition-colors font-medium">Về chúng tôi</a></li>
            <li><a href="#" class="text-gray-500 hover:text-green-600 transition-colors font-medium">Liên hệ</a></li>
          </ul>
        </div>

        <!-- Newsletter Section -->
        <div class="lg:col-span-4 lg:pl-12">
          <h4 class="text-gray-900 font-black mb-4 text-xs uppercase tracking-[2px]">Bản tin</h4>
          <p class="text-gray-500 text-base mb-4">Đăng ký để nhận ưu đãi mới nhất.</p>
          <div class="flex gap-3">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              class="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-green-500/20 outline-none transition-all placeholder:text-gray-400"
            >
            <BaseButton variant="primary" class="!px-8 !rounded-2xl font-black shadow-lg shadow-green-100">
              Gửi
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="mt-8 pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-[13px] text-gray-400 font-medium">
          &copy; 2026 Vegetable Shop. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-image: radial-gradient(#10b98108 1px, transparent 1px);
  background-size: 40px 40px;
}
</style>
