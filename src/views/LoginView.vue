<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter, useRoute } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { Home, Leaf, ShieldCheck, Truck, Eye, EyeOff } from 'lucide-vue-next'
import bgAuth from '@/assets/images/bg_1.jpg'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()

const activeTab = ref(route.query.tab === 'register' ? 'register' : 'login') 
const isLoading = ref(false)

const showLoginPwd = ref(false)
const showRegPwd = ref(false)
const showRegConfirmPwd = ref(false)

// ĐÃ SỬA: Thêm trường phone vào Form Đăng ký
const loginForm = ref({ email: '', password: '' })
const loginErrors = ref({ email: '', password: '', general: '' })
const regForm = ref({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
const regErrors = ref({ name: '', email: '', phone: '', password: '', confirmPassword: '', general: '' })

const handleLogin = async () => {
  loginErrors.value = { email: '', password: '', general: '' }
  let hasError = false
  
  if (!loginForm.value.email) {
    loginErrors.value.email = 'Vui lòng nhập email'
    hasError = true
  }
  if (!loginForm.value.password) {
    loginErrors.value.password = 'Vui lòng nhập mật khẩu'
    hasError = true
  }
  
  if (hasError) return

  isLoading.value = true
  try {
    const success = await authStore.login(loginForm.value)
    if (success) {
      await cartStore.syncCartToDb() // Đồng bộ giỏ hàng offline lên DB
      router.push('/')
    }
  } catch (error) {
    console.error("Lỗi đăng nhập chi tiết:", error)
    loginErrors.value.general = error.response?.data?.message || 'Email hoặc mật khẩu không chính xác.'
  } finally { isLoading.value = false }
}

const handleRegister = async () => {
  regErrors.value = { name: '', email: '', phone: '', password: '', confirmPassword: '', general: '' }
  let hasError = false

  if (!regForm.value.name.trim()) {
    regErrors.value.name = 'Vui lòng nhập họ và tên'
    hasError = true
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regForm.value.email.trim()) {
    regErrors.value.email = 'Vui lòng nhập email'
    hasError = true
  } else if (!emailRegex.test(regForm.value.email.trim())) {
    regErrors.value.email = 'Email không đúng định dạng'
    hasError = true
  }

  const phone = regForm.value.phone.trim()
  if (!phone) {
    regErrors.value.phone = 'Vui lòng nhập số điện thoại'
    hasError = true
  } else if (!phone.startsWith('0')) {
    regErrors.value.phone = 'Số điện thoại phải bắt đầu bằng số 0'
    hasError = true
  } else if (!/^\d+$/.test(phone)) {
    regErrors.value.phone = 'Số điện thoại chỉ được chứa ký số (không chứa chữ hoặc ký tự đặc biệt)'
    hasError = true
  } else if (phone.length < 10 || phone.length > 11) {
    regErrors.value.phone = 'Số điện thoại phải gồm 10 hoặc 11 chữ số'
    hasError = true
  }

  if (!regForm.value.password) {
    regErrors.value.password = 'Vui lòng nhập mật khẩu'
    hasError = true
  } else if (regForm.value.password.length < 6) {
    regErrors.value.password = 'Mật khẩu phải từ 6 ký tự trở lên'
    hasError = true
  }

  if (!regForm.value.confirmPassword) {
    regErrors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    hasError = true
  } else if (regForm.value.password !== regForm.value.confirmPassword) {
    regErrors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
    hasError = true
  }

  if (hasError) return

  isLoading.value = true
  try {
    // ĐÃ SỬA: Map trường phone vào phoneNumber để gửi xuống Backend
    const success = await authStore.register({
      fullName: regForm.value.name,
      email: regForm.value.email,
      phoneNumber: regForm.value.phone,
      password: regForm.value.password
    })
    if (success) {
      await cartStore.syncCartToDb() // Đồng bộ giỏ hàng offline lên DB
      // Đăng ký xong là có token rồi, cho bay thẳng về Trang chủ luôn!
      router.push('/') 
    }
  } catch (error) {
    console.error("Lỗi đăng ký chi tiết:", error)
    regErrors.value.general = error.response?.data?.message || 'Đăng ký không thành công. Email hoặc số điện thoại có thể đã tồn tại.'
  } finally { isLoading.value = false }
}

</script>

<template>
  <main 
    class="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat bg-fixed p-4 overflow-hidden"
    :style="{ backgroundImage: `url(${bgAuth})` }"
  >
    <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

    <div class="relative z-10 w-full max-w-4xl min-h-[500px] md:h-[620px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[24px] overflow-hidden animate-fade-in py-10 md:py-0">
      
      <div class="md:absolute inset-0 flex" style="font-family: 'Poppins', sans-serif;">
        
        <div 
          class="w-full md:w-1/2 h-full flex flex-col justify-center px-6 sm:px-14 transition-all duration-500"
          :class="{'hidden md:flex': activeTab !== 'register'}"
        >
          <form v-show="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-4 w-full">
            
            <div class="text-center mb-6">
              <h3 class="text-5xl md:text-6xl font-bold text-[#82ae46] tracking-wide mb-2 uppercase" style="font-family: 'Amatic SC', cursive;">Đăng Ký</h3>
              <p class="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-medium">Gia nhập cộng đồng rau sạch</p>
            </div>
            
            <BaseInput v-model="regForm.name" label="HỌ VÀ TÊN" placeholder="Nhập họ và tên" :error="regErrors.name" />
            
            <div class="grid grid-cols-2 gap-3">
              <BaseInput v-model="regForm.email" label="ĐỊA CHỈ EMAIL" type="email" placeholder="Nhập email" :error="regErrors.email" />
              <BaseInput v-model="regForm.phone" label="SỐ ĐIỆN THOẠI" type="tel" placeholder="Nhập SĐT" :error="regErrors.phone" />
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <div class="relative">
                <BaseInput v-model="regForm.password" label="MẬT KHẨU" :type="showRegPwd ? 'text' : 'password'" placeholder="••••••••" :error="regErrors.password" />
                <button type="button" @click="showRegPwd = !showRegPwd" class="absolute right-2 top-[32px] p-2 text-gray-400 hover:text-[#82ae46] transition-colors z-10">
                  <Eye v-if="!showRegPwd" :size="16" />
                  <EyeOff v-else :size="16" />
                </button>
              </div>
              <div class="relative">
                <BaseInput v-model="regForm.confirmPassword" label="XÁC NHẬN" :type="showRegConfirmPwd ? 'text' : 'password'" placeholder="••••••••" :error="regErrors.confirmPassword" />
                <button type="button" @click="showRegConfirmPwd = !showRegConfirmPwd" class="absolute right-2 top-[32px] p-2 text-gray-400 hover:text-[#82ae46] transition-colors z-10">
                  <Eye v-if="!showRegConfirmPwd" :size="16" />
                  <EyeOff v-else :size="16" />
                </button>
              </div>
            </div>

            <!-- BÁO LỖI TỔNG QUAN ĐĂNG KÝ -->
            <p v-if="regErrors.general" class="text-xs text-red-500 italic text-center mt-2">{{ regErrors.general }}</p>

            <div class="flex gap-4 mt-4">
              <BaseButton type="submit" variant="primary" class="flex-1 !py-3.5 !rounded-full shadow-lg shadow-[#82ae46]/30 uppercase tracking-[0.2em] text-[11px] font-bold" :disabled="isLoading">
                TẠO TÀI KHOẢN
              </BaseButton>
              <BaseButton type="button" @click="activeTab = 'login'" variant="outline" class="flex-1 !py-3.5 !rounded-full uppercase tracking-[0.2em] text-[12px] font-bold" :disabled="isLoading">
                ĐĂNG NHẬP
              </BaseButton>
            </div>

            <div class="pt-6 text-center">
              <button type="button" @click="router.push('/')" class="md:hidden mt-6 text-[10px] text-gray-400 font-bold hover:text-[#82ae46] uppercase tracking-[2px] flex items-center justify-center gap-1 mx-auto">
                <Home :size="14" /> VỀ TRANG CHỦ
              </button>
            </div>
          </form>
        </div>

        <div 
          class="w-full md:w-1/2 h-full flex flex-col justify-center px-6 sm:px-14 transition-all duration-500"
          :class="{'hidden md:flex': activeTab !== 'login'}"
        >
          <form v-show="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-6 w-full">
            
            <div class="text-center mb-8">
              <h3 class="text-5xl md:text-6xl font-bold text-[#82ae46] tracking-wide mb-2 uppercase" style="font-family: 'Amatic SC', cursive;">Đăng Nhập</h3>
              <p class="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-medium">Chào mừng bạn quay lại</p>
            </div>

            <BaseInput v-model="loginForm.email" label="ĐỊA CHỈ EMAIL" type="email" placeholder="Nhập email của bạn" :error="loginErrors.email" />
            
            <div class="space-y-1 relative">
              <router-link to="/forgot-password" class="absolute right-0 top-0 text-[9px] text-[#82ae46] font-bold uppercase tracking-[0.15em] z-20 hover:underline">
                QUÊN MẬT KHẨU?
              </router-link>
              <div class="relative">
                <BaseInput v-model="loginForm.password" label="MẬT KHẨU" :type="showLoginPwd ? 'text' : 'password'" placeholder="Nhập mật khẩu" :error="loginErrors.password" />
                <button type="button" @click="showLoginPwd = !showLoginPwd" class="absolute right-2 top-[30px] p-2 text-gray-400 hover:text-[#82ae46] transition-colors z-10">
                  <Eye v-if="!showLoginPwd" :size="18" />
                  <EyeOff v-else :size="18" />
                </button>
              </div>
            </div>

            <!-- BÁO LỖI TỔNG QUAN ĐĂNG NHẬP -->
            <p v-if="loginErrors.general" class="text-xs text-red-500 italic text-center mt-2">{{ loginErrors.general }}</p>

            <div class="flex gap-4 mt-2">
              <BaseButton type="submit" variant="primary" class="flex-1 !py-3.5 !rounded-full shadow-lg shadow-[#82ae46]/30 uppercase tracking-[0.2em] text-[11px] font-bold" :disabled="isLoading">
                ĐĂNG NHẬP
              </BaseButton>
              <BaseButton type="button" @click="activeTab = 'register'" variant="outline" class="flex-1 !py-3.5 !rounded-full uppercase tracking-[0.2em] text-[13px] font-black" :disabled="isLoading">
                ĐĂNG KÝ
              </BaseButton>
            </div>

            <div class="pt-8 text-center mt-2">
              <button type="button" @click="router.push('/')" class="md:hidden mt-6 text-[10px] text-gray-400 font-bold hover:text-[#82ae46] uppercase tracking-[2px] flex items-center justify-center gap-1 mx-auto">
                <Home :size="14" /> VỀ TRANG CHỦ
              </button>
            </div>
          </form>
        </div>
      </div>

      <div 
        class="hidden md:flex absolute top-0 left-0 w-1/2 h-full bg-[#82ae46] transition-all duration-[800ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] z-20 flex-col justify-center items-center text-white p-12 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.2)]"
        :style="{ transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)' }"
      >
        <div class="absolute inset-0 pointer-events-none">
          <Leaf :size="400" class="absolute -top-20 -left-20 opacity-10 animate-pulse-slow" />
          <Leaf :size="200" class="absolute bottom-10 right-10 opacity-5 rotate-180" />
        </div>

        <div class="relative z-30 flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center mb-8 shadow-inner animate-bounce-slow">
            <Leaf :size="32" class="text-white" />
          </div>

          <h1 class="text-6xl font-bold tracking-widest uppercase mb-4" style="font-family: 'Amatic SC', cursive;">Vegefoods</h1>
          
          <p class="text-[14px] font-light leading-relaxed max-w-[260px] opacity-90 mb-10" style="font-family: 'Poppins', sans-serif;">
            Mang cả nông trại tươi sạch <br>đến tận bàn ăn gia đình bạn.
          </p>

          <div class="space-y-4 text-[11px] font-bold tracking-[0.2em] uppercase" style="font-family: 'Poppins', sans-serif;">
            <div class="flex items-center justify-center gap-3 bg-black/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10">
              <Truck :size="14"/> <span>Giao hàng 2 giờ</span>
            </div>
            <div class="flex items-center justify-center gap-3 bg-black/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10">
              <ShieldCheck :size="14"/> <span>Chuẩn hữu cơ</span>
            </div>
          </div>
        </div>

        <button @click="router.push('/')" class="absolute bottom-10 text-white/70 hover:text-white flex items-center gap-2 text-[10px] uppercase font-bold tracking-[3px] transition-all">
          <Home :size="14" /> TRANG CHỦ
        </button>
      </div>

    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.animate-pulse-slow {
  animation: pulse 4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.15; transform: scale(1.05); }
}

.animate-bounce-slow {
  animation: bounceCustom 3s ease-in-out infinite;
}
@keyframes bounceCustom {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>