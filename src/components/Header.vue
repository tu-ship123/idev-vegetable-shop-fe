<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseButton from './BaseButton.vue'

const authStore = useAuthStore()
const router = useRouter()
const searchQuery = ref('')
</script>

<template>
  <header class="bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-[60] border-b border-gray-100 w-full">
    <div class="px-6 sm:px-8 lg:px-10 flex justify-between items-center h-20">
      <!-- Logo Section -->
      <div class="flex items-center gap-10">
        <router-link to="/" class="group flex items-center gap-3">
          <div class="bg-green-600 w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl shadow-green-100 group-hover:rotate-[10deg] transition-all duration-500">
            <span class="text-2xl">🥬</span>
          </div>
          <div class="flex flex-col">
            <span class="text-2xl font-black text-gray-900 tracking-tight leading-none">Vegetable Shop</span>
            <span class="text-[10px] text-green-600 font-bold tracking-[3px] uppercase mt-1">Cửa hàng rau sạch</span>
          </div>
        </router-link>
      </div>

      <!-- Search Bar -->
      <div class="hidden md:flex flex-grow max-w-2xl mx-12">
        <div class="relative w-full">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm rau củ quả tươi sạch..."
            class="w-full bg-gray-50 border-none rounded-2xl px-12 py-3.5 text-sm focus:bg-white focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300"
          />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        </div>
      </div>

      <!-- User Actions -->
      <div class="flex items-center gap-4 sm:gap-6">
        <!-- Cart -->
        <button class="flex items-center gap-3 px-4 py-2.5 bg-gray-900 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg group">
          <span class="text-xl">🛒</span>
          <div class="hidden sm:flex flex-col items-start leading-tight">
            <span class="text-[10px] font-bold text-gray-400 uppercase">Giỏ hàng</span>
            <span class="text-sm font-bold">0đ</span>
          </div>
        </button>

        <!-- Profile/Login -->
        <div v-if="authStore.isLoggedIn" class="flex items-center gap-3">
          <div class="h-11 w-11 rounded-2xl bg-green-100 flex items-center justify-center text-xl cursor-pointer">
            👤
          </div>
        </div>
        <BaseButton 
          v-else 
          @click="router.push('/login')"
          variant="primary" 
          class="!px-6 !rounded-xl"
        >
          Đăng nhập
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<style scoped>
header { transition: all 0.3s ease; }
</style>
