<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { Home, ArrowRight, Leaf, ShieldCheck } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)

const validateForm = () => {
  let isValid = true
  errors.value = { name: '', email: '', password: '', confirmPassword: '' }

  if (!form.value.name) {
    errors.value.name = 'Vui lòng nhập họ tên'
    isValid = false
  }

  if (!form.value.email) {
    errors.value.email = 'Vui lòng nhập email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Email không đúng định dạng'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Mật khẩu phải từ 6 ký tự'
    isValid = false
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    const success = await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
    
    if (success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.')
      router.push('/login')
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(-5deg); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-float {
  animation: float 12s ease-in-out infinite;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
</style>

<template>
  <main class="min-h-screen flex items-center justify-center p-0 sm:p-4 bg-gray-50 overflow-hidden relative">
    <!-- Floating background shapes -->
    <div class="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-[120px] animate-float"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-emerald-100/50 rounded-full blur-[100px] animate-float" style="animation-delay: -6s"></div>

    <div class="max-w-5xl w-full bg-white sm:rounded-[40px] shadow-2xl flex flex-col md:flex-row-reverse overflow-hidden min-h-[650px] relative z-10">
      
      <!-- Right Side: Form -->
      <div class="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col relative bg-white/80 backdrop-blur-sm">
        <!-- Back to Home -->
        <button 
          @click="router.push('/')"
          class="absolute top-8 right-8 flex items-center gap-2 text-gray-400 hover:text-green-600 transition-colors group animate-fade-in-up"
        >
          <span class="text-sm font-bold font-outfit uppercase tracking-wider">Trang chủ</span>
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
            <Home :size="20" />
          </div>
        </button>

        <div class="mt-12 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div class="mb-8 animate-fade-in-up delay-100">
            <div class="flex items-center gap-3 mb-4">
              <ShieldCheck class="text-green-600" :size="32" />
              <h2 class="text-3xl font-black text-gray-900 font-outfit">Đăng ký mới</h2>
            </div>
            <p class="text-gray-500 font-inter text-base">Gia nhập cộng đồng người dùng thông thái, lựa chọn nông sản VietGAP.</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-5 animate-fade-in-up delay-200">
            <BaseInput
              v-model="form.name"
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              :error="errors.name"
              class="font-inter"
            />

            <BaseInput
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="ten@vi-du.com"
              :error="errors.email"
              class="font-inter"
            />

            <BaseInput
              v-model="form.password"
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              :error="errors.password"
              class="font-inter"
            />

            <BaseInput
              v-model="form.confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="••••••••"
              :error="errors.confirmPassword"
              class="font-inter"
            />

            <BaseButton
              type="submit"
              variant="primary"
              class="w-full !py-4 !rounded-2xl text-base font-black shadow-lg shadow-green-100 flex items-center justify-center gap-2 group font-outfit"
              :disabled="isLoading"
            >
              <span>{{ isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY' }}</span>
              <ArrowRight v-if="!isLoading" :size="20" class="group-hover:translate-x-1 transition-transform" />
            </BaseButton>
          </form>

          <p class="mt-8 text-center text-gray-500 font-inter text-sm animate-fade-in-up delay-300">
            Đã có tài khoản?
            <router-link to="/login" class="text-green-600 font-black hover:underline underline-offset-4">ĐĂNG NHẬP</router-link>
          </p>
        </div>
      </div>

      <!-- Left Side: Decoration -->
      <div class="hidden md:flex flex-1 bg-green-600 relative overflow-hidden p-12 flex-col justify-end">
        <img 
          src="@/assets/images/login-bg.png" 
          alt="Register illustration"
          class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay hover:scale-110 transition-transform duration-[10s]"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/20 to-transparent"></div>
        
        <div class="relative z-10 text-white max-w-sm animate-fade-in-up delay-400">
          <div class="bg-white/20 backdrop-blur-md p-6 rounded-3xl mb-8 border border-white/20">
            <h4 class="text-xl font-black font-outfit mb-2">Quyền lợi thành viên</h4>
            <ul class="text-green-50 space-y-2 text-sm font-inter">
              <li class="flex items-center gap-2">✓ Tích điểm đổi quà hấp dẫn</li>
              <li class="flex items-center gap-2">✓ Ưu đãi phí vận chuyển</li>
              <li class="flex items-center gap-2">✓ Cập nhật sản phẩm mới nhất</li>
            </ul>
          </div>
          <h3 class="text-3xl font-black font-outfit leading-tight mb-4">
            Đồng hành cùng<br>Nông sản Việt sạch.
          </h3>
        </div>
      </div>

    </div>
  </main>
</template>
