<script setup>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F4F7F5] font-sans selection:bg-green-100 selection:text-green-800 overflow-x-hidden">
    <!-- Header - Full Width -->
    <Header />

    <div class="flex flex-1 w-full relative">
      <!-- Sidebar - Fixed Width, Full Height under Header -->
      <Sidebar />

      <!-- Main Content - Filling remaining space -->
      <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <!-- Top Bar inside Main (Optional but adds premium feel) -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">Bảng điều khiển</h1>
            <div class="flex items-center gap-2 mt-1">
              <span class="flex h-2 w-2 rounded-full bg-green-500"></span>
              <p class="text-gray-500 text-xs font-medium uppercase tracking-wider">Hệ thống đang hoạt động ổn định</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="flex -space-x-2">
              <div class="h-8 w-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-[10px] font-bold">NV</div>
              <div class="h-8 w-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold">QT</div>
              <div class="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">+5</div>
            </div>
            <button class="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-xl">📅</button>
            <button class="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-xl">🔔</button>
          </div>
        </div>

        <!-- Vùng hiển thị nội dung chính - White Card Style -->
        <div class="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 min-h-[calc(100vh-280px)] overflow-hidden">
          <router-view v-slot="{ Component }">
            <transition 
              name="page" 
              mode="out-in"
              enter-active-class="transition duration-400 ease-out"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-4"
            >
              <div class="p-8">
                <component :is="Component" />
              </div>
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <!-- Footer - Full Width -->
    <Footer />

    <!-- Floating Bubble -->
    <button class="fixed bottom-10 right-10 w-16 h-16 bg-green-600 text-white rounded-2xl shadow-2xl shadow-green-200 flex items-center justify-center text-3xl hover:scale-110 hover:rotate-6 transition-all z-50">
      💬
    </button>
  </div>
</template>

<style>
/* Global smooth page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  filter: blur(4px);
}

.page-leave-to {
  opacity: 0;
  filter: blur(4px);
}

/* Base style resets for full screen */
body {
  margin: 0;
  padding: 0;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f8fafc;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
