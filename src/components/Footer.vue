<script setup>
import BaseButton from './BaseButton.vue'
</script>

<template>
  <footer class="bg-white border-t border-gray-100 py-16 w-full mt-auto">
    <div class="px-6 sm:px-10 lg:px-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
        <!-- Logo & Description -->
        <div class="lg:col-span-4 pr-0 lg:pr-12">
          <div class="flex items-center gap-3 mb-8">
            <div class="bg-green-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
              <span class="text-xl">🥬</span>
            </div>
            <span class="text-2xl font-black text-gray-900 tracking-tight">Vegetable Shop</span>
          </div>
          <p class="text-gray-500 text-[15px] leading-relaxed mb-8">
            Hệ thống cung cấp nông sản sạch tiêu chuẩn VietGAP, kết nối trực tiếp từ nông trại đến bàn ăn của mọi gia đình Việt.
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all">FB</a>
            <a href="#" class="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all">IG</a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="lg:col-span-2">
          <h4 class="text-gray-900 font-black mb-8 text-xs uppercase tracking-[2px]">Mua sắm</h4>
          <ul class="space-y-4 text-[15px]">
            <li><a href="#" class="text-gray-500 hover:text-green-600 transition-colors">Rau củ hữu cơ</a></li>
            <li><a href="#" class="text-gray-500 hover:text-green-600 transition-colors">Trái cây tươi</a></li>
            <li><a href="#" class="text-gray-500 hover:text-green-600 transition-colors">Combo tiết kiệm</a></li>
          </ul>
        </div>

        <div class="lg:col-span-2">
          <h4 class="text-gray-900 font-black mb-8 text-xs uppercase tracking-[2px]">Thông tin</h4>
          <ul class="space-y-4 text-[15px]">
            <li><a href="#" class="text-gray-500 hover:text-green-600 transition-colors">Về chúng tôi</a></li>
            <li><a href="#" class="text-gray-500 hover:text-green-600 transition-colors">Liên hệ</a></li>
          </ul>
        </div>

        <!-- Newsletter Section -->
        <div class="lg:col-span-4 lg:pl-12">
          <h4 class="text-gray-900 font-black mb-8 text-xs uppercase tracking-[2px]">Bản tin</h4>
          <p class="text-gray-500 text-[15px] mb-8">Đăng ký để nhận ưu đãi và thông tin mới nhất.</p>
          <div class="flex gap-2">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              class="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
            >
            <BaseButton variant="primary" class="!px-6 !rounded-2xl font-bold">
              Gửi
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="mt-20 pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-[13px] text-gray-400">
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
