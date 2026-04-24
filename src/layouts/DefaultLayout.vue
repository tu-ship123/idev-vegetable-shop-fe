<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold text-primary flex items-center gap-2">
          <span>🥬</span> Vegetable Shop
        </router-link>
        <nav class="hidden md:flex gap-6">
          <router-link to="/" class="text-gray-600 hover:text-primary font-medium transition">Trang chủ</router-link>
          <a href="#" class="text-gray-600 hover:text-primary font-medium transition">Sản phẩm</a>
          <a href="#" class="text-gray-600 hover:text-primary font-medium transition">Cửa hàng</a>
          <a href="#" class="text-gray-600 hover:text-primary font-medium transition">Liên hệ</a>
        </nav>
        <div class="flex items-center gap-4">
          <button class="p-2 text-gray-500 hover:text-primary">
            <span class="sr-only">Search</span>
            🔍
          </button>
          <button class="p-2 text-gray-500 hover:text-primary relative">
            <span class="sr-only">Cart</span>
            🛒
            <span class="absolute top-0 right-0 block h-4 w-4 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center">0</span>
          </button>
          <button class="md:hidden p-2 text-gray-500">
            ☰
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-1">
            <h3 class="text-lg font-bold text-primary mb-4">Vegetable Shop</h3>
            <p class="text-gray-500 text-sm">Cung cấp nông sản sạch, đạt tiêu chuẩn an toàn cho mọi gia đình Việt.</p>
          </div>
          <div>
            <h4 class="font-bold mb-4">Liên kết</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-primary">Về chúng tôi</a></li>
              <li><a href="#" class="hover:text-primary">Chính sách giao hàng</a></li>
              <li><a href="#" class="hover:text-primary">Bảo mật thông tin</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">Hỗ trợ</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-primary">Câu hỏi thường gặp</a></li>
              <li><a href="#" class="hover:text-primary">Hướng dẫn mua hàng</a></li>
              <li><a href="#" class="hover:text-primary">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">Đăng ký bản tin</h4>
            <div class="flex">
              <input type="email" placeholder="Email của bạn" class="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary focus:border-primary">
              <button class="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition">Gửi</button>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-100 text-center text-gray-400 text-xs">
          &copy; 2026 Vegetable Shop. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@reference "../style.css";

.router-link-active {
  @apply text-primary font-bold;
}
</style>
