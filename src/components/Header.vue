<script setup>
import { ref, onMounted } from 'vue'
import { ShoppingCart, User, Search, Menu, LogOut, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const isMobileMenuOpen = ref(false)
const showSearchInput = ref(false)
const searchVal = ref('')
const searchInputRef = ref(null)

const toggleSearch = () => {
  if (showSearchInput.value) {
    triggerSearch()
  } else {
    showSearchInput.value = true
    setTimeout(() => {
      searchInputRef.value?.focus()
    }, 100)
  }
}

const triggerSearch = () => {
  if (searchVal.value.trim()) {
    router.push({ path: '/products', query: { q: searchVal.value.trim() } })
    showSearchInput.value = false
    searchVal.value = ''
  } else {
    showSearchInput.value = false
  }
}

const handleBlur = () => {
  setTimeout(() => {
    if (!searchVal.value.trim()) {
      showSearchInput.value = false
    }
  }, 200)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  isMobileMenuOpen.value = false 
}

const navigateTo = (path) => {
  router.push(path)
  isMobileMenuOpen.value = false
}

onMounted(() => {
  if (authStore.isLoggedIn) {
    cartStore.fetchDbCart()
  }
})
</script>

<template>
  <header class="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-50" style="font-family: 'Poppins', sans-serif;">
    <div class="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
      <router-link to="/" class="text-[#82ae46] text-4xl font-bold uppercase tracking-tighter" style="font-family: 'Amatic SC', cursive;">
        Vegefoods
      </router-link>

      <nav class="hidden lg:flex items-center gap-8 text-[13px] font-medium uppercase tracking-[2px]">
        <router-link to="/" class="hover:text-[#82ae46] transition-colors" exact-active-class="text-[#82ae46]">Trang chủ</router-link>
        <router-link to="/products" class="hover:text-[#82ae46] transition-colors" active-class="text-[#82ae46]">Cửa hàng</router-link>
        <!-- ĐÃ THÊM: Menu Đơn hàng cho Máy tính -->
        <router-link v-if="authStore.isLoggedIn" to="/orders" class="hover:text-[#82ae46] transition-colors" active-class="text-[#82ae46]">Đơn hàng</router-link>
        <a href="#" class="hover:text-[#82ae46]">Liên hệ</a>
      </nav>

      <div class="flex items-center gap-5 text-gray-800">
        <!-- Cụm tìm kiếm toàn cục trượt mở premium -->
        <div class="relative flex items-center">
          <transition name="slide-fade">
            <input 
              v-if="showSearchInput"
              ref="searchInputRef"
              v-model="searchVal"
              @keyup.enter="triggerSearch"
              @blur="handleBlur"
              type="text"
              placeholder="Tìm sản phẩm..."
              class="w-36 sm:w-44 bg-gray-50 border border-gray-100 rounded-full py-1.5 px-4 mr-2 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#82ae46]/20 focus:border-[#82ae46] transition-all"
            />
          </transition>
          <Search 
            :size="18" 
            class="cursor-pointer hover:text-[#82ae46] transition-all duration-300 hover:scale-110" 
            @click="toggleSearch"
          />
        </div>
        
        <router-link to="/cart" class="flex items-center gap-1 cursor-pointer hover:text-[#82ae46]">
          <ShoppingCart :size="18" />
          <span class="text-[11px] font-bold">[{{ cartStore.totalItems }}]</span>
        </router-link>

        <div v-if="authStore.isLoggedIn" class="hidden lg:flex items-center gap-4 border-l pl-5 border-gray-100">
          <div class="flex items-center gap-2 cursor-pointer hover:text-[#82ae46]">
            <User :size="18" />
            <span class="text-[11px] font-bold uppercase">
              {{ authStore.user?.fullName || 'Tài khoản' }}
            </span>
          </div>
          <button @click="handleLogout" class="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors" title="Đăng xuất">
            <LogOut :size="16" /> Thoát
          </button>
        </div>
        <div v-else class="hidden lg:flex items-center gap-4 border-l pl-5 border-gray-100">
          <button @click="router.push('/login')" class="text-[11px] font-bold uppercase tracking-widest hover:text-[#82ae46]">
            Đăng nhập
          </button>
          <span class="text-gray-300">|</span>
          <button @click="router.push('/login?tab=register')" class="text-[11px] font-bold uppercase tracking-widest hover:text-[#82ae46]">
            Đăng ký
          </button>
        </div>

        <Menu :size="24" class="lg:hidden cursor-pointer hover:text-[#82ae46]" @click="isMobileMenuOpen = true" />
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[100] lg:hidden" style="font-family: 'Poppins', sans-serif;">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="isMobileMenuOpen = false"></div>
      
      <div class="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col animate-slide-left">
        <div class="p-6 border-b flex justify-between items-center bg-gray-50">
          <span class="text-3xl font-bold text-[#82ae46] uppercase" style="font-family: 'Amatic SC', cursive;">Menu</span>
          <button @click="isMobileMenuOpen = false" class="text-gray-400 hover:text-red-500 bg-white p-2 rounded-full shadow-sm">
            <X :size="20" />
          </button>
        </div>
        
        <div class="flex flex-col py-2 px-6 gap-2 text-sm font-bold uppercase tracking-wider text-gray-700 mt-4">
          <button @click="navigateTo('/')" class="text-left hover:text-[#82ae46] py-4 border-b border-gray-50 transition-colors">Trang chủ</button>
          <button @click="navigateTo('/products')" class="text-left hover:text-[#82ae46] py-4 border-b border-gray-50 transition-colors">Cửa hàng</button>
          <!-- ĐÃ THÊM: Menu Đơn hàng cho Mobile -->
          <button v-if="authStore.isLoggedIn" @click="navigateTo('/orders')" class="text-left hover:text-[#82ae46] py-4 border-b border-gray-50 transition-colors">Đơn hàng</button>
          <button @click="navigateTo('/cart')" class="text-left flex justify-between items-center hover:text-[#82ae46] py-4 border-b border-gray-50 transition-colors">
            Giỏ hàng 
            <span class="bg-[#82ae46] text-white px-3 py-1 rounded-full text-xs shadow-md">{{ cartStore.totalItems }}</span>
          </button>
        </div>

        <div class="mt-auto p-6 border-t bg-gray-50">
          <div v-if="authStore.isLoggedIn" class="flex flex-col gap-5">
            <div class="flex items-center gap-3 text-gray-800 font-bold text-sm">
              <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                <User :size="18" class="text-[#82ae46]" />
              </div>
              <span class="truncate">{{ authStore.user?.fullName || 'Tài khoản' }}</span>
            </div>
            <button @click="handleLogout" class="flex items-center justify-center gap-2 bg-white border border-gray-200 text-red-500 w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-50 hover:border-red-100 transition-all shadow-sm">
              <LogOut :size="16" /> Đăng xuất
            </button>
          </div>
          
          <button v-else @click="navigateTo('/login')" class="w-full bg-[#82ae46] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-green-200 hover:bg-green-600 transition-all">
            Đăng nhập tài khoản
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.animate-slide-left {
  animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Hiệu ứng slide-fade cho ô tìm kiếm */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(15px);
  opacity: 0;
}
</style>