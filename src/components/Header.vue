<script setup>
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  // Gọi action logout từ Pinia để xóa token và user info
  authStore.logout()
  // Đưa người dùng về trang đăng nhập
  router.push('/login')
}
</script>

<template>
  <header class="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-50">
    <div class="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
      <router-link to="/" class="text-[#82ae46] text-4xl font-bold uppercase tracking-tighter" style="font-family: 'Amatic SC', cursive;">
        Vegefoods
      </router-link>

      <nav class="hidden lg:flex items-center gap-8 text-[13px] font-medium uppercase tracking-[2px]">
        <router-link to="/" class="hover:text-[#82ae46] transition-colors" exact-active-class="text-[#82ae46]">Trang chủ</router-link>
        <router-link to="/products" class="hover:text-[#82ae46] transition-colors" active-class="text-[#82ae46]">Cửa hàng</router-link>
        <a href="#" class="hover:text-[#82ae46]">Liên hệ</a>
      </nav>

      <div class="flex items-center gap-5 text-gray-800">
        <Search :size="18" class="cursor-pointer hover:text-[#82ae46]" />
        
        <div class="flex items-center gap-1 cursor-pointer hover:text-[#82ae46]">
          <ShoppingCart :size="18" />
          <span class="text-[11px] font-bold">[0]</span>
        </div>

        <div v-if="authStore.isLoggedIn" class="flex items-center gap-4 border-l pl-5 border-gray-100">
          <div class="flex items-center gap-2 cursor-pointer hover:text-[#82ae46]">
            <User :size="18" />
            <span class="text-[11px] font-bold uppercase hidden sm:inline">
              {{ authStore.user?.fullName || 'Tài khoản' }}
            </span>
          </div>
          
          <button 
            @click="handleLogout" 
            class="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors"
            title="Đăng xuất"
          >
            <LogOut :size="16" />
            <span class="hidden sm:inline">Thoát</span>
          </button>
        </div>

        <button 
          v-else 
          @click="router.push('/login')" 
          class="text-[11px] font-bold uppercase tracking-widest hover:text-[#82ae46] border-l pl-5 border-gray-100"
        >
          Đăng nhập
        </button>

        <Menu :size="20" class="lg:hidden cursor-pointer" />
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Đảm bảo font chữ đồng bộ với template Vegefoods */
header {
  font-family: 'Poppins', sans-serif;
}
</style>