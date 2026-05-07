<script setup>
import { useCounterStore } from '../stores/counter'
import { Sprout, Truck, ShieldCheck } from 'lucide-vue-next'

const counter = useCounterStore()
</script>

<template>
  <div class="text-center">
    <h2 class="text-4xl font-black text-gray-900 sm:text-6xl font-outfit tracking-tight leading-tight">
      Chào mừng đến với <br>
      <span class="text-green-600 italic">Cửa hàng Rau quả</span>
    </h2>
    <p class="mt-6 text-xl text-gray-500 font-inter max-w-2xl mx-auto leading-relaxed">
      Nền tảng cung cấp nông sản sạch hiện đại, tích hợp công nghệ quản lý thông minh giúp kết nối nông trại trực tiếp đến bàn ăn.
    </p>
    <div class="mt-8 flex justify-center gap-4">
      <button 
        @click="counter.increment"
        class="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
      >
        Lượt click: {{ counter.count }}
      </button>
      <button class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition">
        Xem tài liệu
      </button>
    </div>
  </div>
  
  <section class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
        <Sprout :size="24" />
      </div>
      <h3 class="text-lg font-bold mb-2">Tươi sạch</h3>
      <p class="text-gray-600">Sản phẩm luôn được nhập mới mỗi ngày từ nông trại.</p>
    </div>
    <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
        <Truck :size="24" />
      </div>
      <h3 class="text-lg font-bold mb-2">Giao hàng nhanh</h3>
      <p class="text-gray-600">Cam kết giao hàng trong vòng 2 giờ tại nội thành.</p>
    </div>
    <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
        <ShieldCheck :size="24" />
      </div>
      <h3 class="text-lg font-bold mb-2">An toàn</h3>
      <p class="text-gray-600">Quy trình kiểm tra chất lượng đạt chuẩn VietGAP.</p>
    </div>
  </section>
</template>
