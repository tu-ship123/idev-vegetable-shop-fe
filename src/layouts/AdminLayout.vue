<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
// ĐÃ THÊM: List và Ticket vào thư viện icon
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store, List, Ticket } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex font-['Poppins']">
    <aside class="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-20">
      <div class="h-20 flex items-center justify-center border-b border-gray-800">
        <span class="text-3xl font-bold text-[#82ae46] uppercase tracking-widest font-['Amatic_SC']">Vege Admin</span>
      </div>
      
      <nav class="flex-1 p-4 space-y-2 mt-4">
        <router-link to="/admin" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm" :class="route.name === 'admin-dashboard' ? 'bg-[#82ae46] text-white shadow-lg shadow-green-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
          <LayoutDashboard :size="20" /> Tổng quan
        </router-link>
        
        <router-link to="/admin/products" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm" :class="route.name === 'admin-products' ? 'bg-[#82ae46] text-white shadow-lg shadow-green-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
          <Package :size="20" /> Sản phẩm
        </router-link>
        
        <router-link to="/admin/orders" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm" :class="route.name === 'admin-orders' ? 'bg-[#82ae46] text-white shadow-lg shadow-green-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
          <ShoppingCart :size="20" /> Đơn hàng
        </router-link>

        <router-link to="/admin/categories" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm" :class="route.name === 'admin-categories' ? 'bg-[#82ae46] text-white shadow-lg shadow-green-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
          <List :size="20" /> Danh mục
        </router-link>

        <router-link to="/admin/coupons" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm" :class="route.name === 'admin-coupons' ? 'bg-[#82ae46] text-white shadow-lg shadow-green-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
          <Ticket :size="20" /> Mã giảm giá
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <button @click="router.push('/')" class="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-colors mb-2">
          <Store :size="20" /> Về Website
        </button>
        <button @click="handleLogout" class="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white transition-colors">
          <LogOut :size="20" /> Đăng xuất
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      
      <header class="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
        <h2 class="text-xl font-black text-gray-800 uppercase tracking-widest">
          {{ route.meta.pageTitle || 'Bảng điều khiển' }}
        </h2>
        
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm font-bold text-gray-900">{{ authStore.user?.fullName || 'Admin' }}</p>
            <p class="text-xs text-[#82ae46] font-bold uppercase tracking-wider">Quản trị viên</p>
          </div>
          <div class="w-12 h-12 bg-green-50 text-[#82ae46] border border-green-200 rounded-full flex items-center justify-center font-black text-lg">
            {{ authStore.user?.fullName?.charAt(0) || 'A' }}
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>