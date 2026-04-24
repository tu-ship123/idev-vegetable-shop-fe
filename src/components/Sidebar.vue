<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseButton from './BaseButton.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const menuItems = [
  { name: 'Trang chủ', path: '/', icon: '🏠' },
  { name: 'Sản phẩm', path: '/products', icon: '🥦' },
  { name: 'Đơn hàng', path: '/orders', icon: '📦' },
  { name: 'Khách hàng', path: '/customers', icon: '👥' },
  { name: 'Khuyến mãi', path: '/promotions', icon: '🎁' },
]

const isActive = (path) => route.path === path

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="w-80 bg-white border-r border-gray-100 h-[calc(100vh-80px)] sticky top-20 hidden lg:flex flex-col overflow-y-auto z-40">
    <div class="flex-1 p-8 space-y-10">
      <!-- User Profile (Integrated with Pinia) -->
      <div class="px-2">
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-5 border border-green-100/50 relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-green-200/20 rounded-full blur-2xl transition-all duration-700"></div>
          <div class="relative z-10 flex items-center gap-4">
            <div class="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">
              {{ authStore.isLoggedIn ? '👤' : '🥬' }}
            </div>
            <div>
              <p class="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-0.5">
                {{ authStore.isLoggedIn ? 'Thành viên' : 'Khách hàng' }}
              </p>
              <p class="text-sm font-black text-gray-900">
                {{ authStore.user?.name || 'Chào bạn!' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Group -->
      <div>
        <p class="px-4 text-[10px] font-black text-gray-300 uppercase tracking-[3px] mb-6">Menu Điều Hướng</p>
        <nav class="space-y-2.5">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 relative"
            :class="[
              isActive(item.path) 
                ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 translate-x-2' 
                : 'text-gray-500 hover:bg-green-50 hover:text-green-600 hover:translate-x-2'
            ]"
          >
            <div v-if="isActive(item.path)" class="absolute left-0 w-1.5 h-6 bg-green-500 rounded-full"></div>
            <span class="text-2xl transition-transform duration-500 group-hover:scale-110">{{ item.icon }}</span>
            <span class="text-[15px] font-bold tracking-tight">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>

      <!-- System Group -->
      <div>
        <p class="px-4 text-[10px] font-black text-gray-300 uppercase tracking-[3px] mb-6">Hệ Thống</p>
        <div class="space-y-2.5">
          <a href="#" class="group flex items-center gap-4 px-5 py-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-300">
            <span class="text-2xl grayscale group-hover:grayscale-0 transition-all">⚙️</span>
            <span class="text-[15px] font-bold tracking-tight">Cài đặt</span>
          </a>
          <a href="#" class="group flex items-center gap-4 px-5 py-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-2xl transition-all duration-300">
            <span class="text-2xl grayscale group-hover:grayscale-0 transition-all">🎧</span>
            <span class="text-[15px] font-bold tracking-tight">Trợ giúp</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Action -->
    <div class="p-8 border-t border-gray-50 bg-gray-50/30">
      <BaseButton 
        v-if="authStore.isLoggedIn"
        @click="handleLogout"
        variant="outline" 
        class="w-full !py-4 !rounded-2xl !border-transparent !bg-white !text-gray-900 shadow-sm hover:!text-red-600 transition-all flex items-center justify-center gap-3"
      >
        <span class="font-bold text-sm">Đăng xuất</span>
        <span class="text-lg">🚪</span>
      </BaseButton>
      <BaseButton 
        v-else
        @click="router.push('/login')"
        variant="primary" 
        class="w-full !py-4 !rounded-2xl shadow-lg shadow-green-100"
      >
        Đăng nhập ngay
      </BaseButton>
    </div>
  </aside>
</template>

<style scoped>
aside::-webkit-scrollbar { width: 0px; }
aside { scrollbar-width: none; }
</style>
