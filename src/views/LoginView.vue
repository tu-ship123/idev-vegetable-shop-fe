<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { Home, Leaf, ShieldCheck, Truck } from 'lucide-vue-next'
import bgAuth from '@/assets/images/bg_1.jpg'

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('login') 
const isLoading = ref(false)

// ================= STATE FORM & LOGIC =================
const loginForm = ref({ email: '', password: '' })
const loginErrors = ref({ email: '', password: '' })
const regForm = ref({ name: '', email: '', password: '', confirmPassword: '' })
const regErrors = ref({ name: '', email: '', password: '', confirmPassword: '' })

const handleLogin = async () => {
  loginErrors.value = { email: '', password: '' }
  if (!loginForm.value.email || !loginForm.value.password) {
    if(!loginForm.value.email) loginErrors.value.email = 'Vui lòng nhập email'
    if(!loginForm.value.password) loginErrors.value.password = 'Vui lòng nhập mật khẩu'
    return
  }
  isLoading.value = true
  try {
    const success = await authStore.login(loginForm.value)
    if (success) router.push('/')
  } finally { isLoading.value = false }
}

const handleRegister = async () => {
  regErrors.value = { name: '', email: '', password: '', confirmPassword: '' }
  if (regForm.value.password !== regForm.value.confirmPassword) {
    regErrors.value.confirmPassword = 'Mật khẩu không khớp'
    return
  }
  isLoading.value = true
  try {
    const success = await authStore.register({
      fullName: regForm.value.name,
      email: regForm.value.email,
      password: regForm.value.password
    })
    if (success) {
      activeTab.value = 'login'
      loginForm.value.email = regForm.value.email
    }
  } finally { isLoading.value = false }
}
</script>

<template>
  <main 
    class="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat bg-fixed p-4 overflow-hidden"
    :style="{ backgroundImage: `url(${bgAuth})` }"
  >
    <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

    <div class="relative z-10 w-full max-w-4xl h-[620px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[24px] overflow-hidden animate-fade-in">
      
      <div class="absolute inset-0 flex" style="font-family: 'Poppins', sans-serif;">
        
        <div class="w-1/2 h-full flex flex-col justify-center px-10 sm:px-14">
          <form v-show="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-4 w-full">
            
            <div class="text-center mb-6">
              <h3 class="text-6xl font-bold text-[#82ae46] tracking-wide mb-2 uppercase" style="font-family: 'Amatic SC', cursive;">Đăng Ký</h3>
              <p class="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-medium">Gia nhập cộng đồng rau sạch</p>
            </div>
            
            <BaseInput v-model="regForm.name" label="HỌ VÀ TÊN" placeholder="Nhập họ và tên" :error="regErrors.name" />
            <BaseInput v-model="regForm.email" label="ĐỊA CHỈ EMAIL" type="email" placeholder="Nhập email của bạn" :error="regErrors.email" />
            
            <div class="grid grid-cols-2 gap-3">
              <BaseInput v-model="regForm.password" label="MẬT KHẨU" type="password" placeholder="••••••••" :error="regErrors.password" />
              <BaseInput v-model="regForm.confirmPassword" label="XÁC NHẬN" type="password" placeholder="••••••••" :error="regErrors.confirmPassword" />
            </div>

            <BaseButton type="submit" variant="primary" class="w-full !py-3.5 !rounded-full shadow-lg mt-4 shadow-[#82ae46]/30 uppercase tracking-[0.2em] text-[11px] font-bold" :disabled="isLoading">
              TẠO TÀI KHOẢN
            </BaseButton>

            <div class="pt-6 text-center">
              <p class="text-[11px] text-gray-500 tracking-wider">
                Đã có tài khoản? 
                <button type="button" @click="activeTab = 'login'" class="text-[#82ae46] font-bold hover:underline ml-1 uppercase">
                  ĐĂNG NHẬP
                </button>
              </p>
            </div>
          </form>
        </div>

        <div class="w-1/2 h-full flex flex-col justify-center px-10 sm:px-14">
          <form v-show="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-6 w-full">
            
            <div class="text-center mb-8">
              <h3 class="text-6xl font-bold text-[#82ae46] tracking-wide mb-2 uppercase" style="font-family: 'Amatic SC', cursive;">Đăng Nhập</h3>
              <p class="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-medium">Chào mừng bạn quay lại</p>
            </div>

            <BaseInput v-model="loginForm.email" label="ĐỊA CHỈ EMAIL" type="email" placeholder="Nhập email của bạn" :error="loginErrors.email" />
            
            <div class="space-y-1 relative">
              <router-link to="/forgot-password" class="absolute right-0 top-0 text-[9px] text-[#82ae46] font-bold uppercase tracking-[0.15em] z-10 hover:underline">
                QUÊN MẬT KHẨU?
              </router-link>
              <BaseInput v-model="loginForm.password" label="MẬT KHẨU" type="password" placeholder="Nhập mật khẩu" :error="loginErrors.password" />
            </div>

            <BaseButton type="submit" variant="primary" class="w-full !py-3.5 !rounded-full shadow-lg shadow-[#82ae46]/30 uppercase tracking-[0.2em] text-[11px] font-bold mt-2" :disabled="isLoading">
              ĐĂNG NHẬP
            </BaseButton>

            <div class="pt-8 text-center mt-2">
              <p class="text-[11px] text-gray-500 tracking-wider">
                Chưa có tài khoản? 
                <button type="button" @click="activeTab = 'register'" class="text-[#82ae46] font-bold hover:underline ml-1 uppercase">
                  ĐĂNG KÝ NGAY
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div 
        class="absolute top-0 left-0 w-1/2 h-full bg-[#82ae46] transition-all duration-[800ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] z-20 flex flex-col justify-center items-center text-white p-12 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.2)]"
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