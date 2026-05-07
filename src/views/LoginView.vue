<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { Home, ArrowRight, Leaf } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)

const validateForm = () => {
  let isValid = true
  errors.value = { email: '', password: '' }

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
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true
  try {
    const success = await authStore.login({
      email: form.value.email,
      password: form.value.password
    })
    
    if (success) {
      router.push('/')
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
  50% { transform: translateY(-20px) rotate(5deg); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
</style>

<template>
  <main class="min-h-screen flex items-center justify-center p-0 sm:p-4 bg-gray-50 overflow-hidden relative">
    <!-- Floating background shapes -->
    <div class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-[120px] animate-float"></div>
    <div class="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-emerald-100/50 rounded-full blur-[100px] animate-float" style="animation-delay: -5s"></div>

    <div class="max-w-5xl w-full bg-white sm:rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px] relative z-10">
      
      <!-- Left Side: Form -->
      <div class="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col relative bg-white/80 backdrop-blur-sm">
        <!-- Back to Home -->
        <button 
          @click="router.push('/')"
          class="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-green-600 transition-colors group animate-fade-in-up"
        >
          <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
            <Home :size="20" />
          </div>
          <span class="text-sm font-bold font-outfit uppercase tracking-wider">Trang chủ</span>
        </button>

        <div class="mt-16 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div class="mb-10 animate-fade-in-up delay-100">
            <div class="flex items-center gap-3 mb-4">
              <Leaf class="text-green-600" :size="32" />
              <h2 class="text-3xl font-black text-gray-900 font-outfit">Chào mừng!</h2>
            </div>
            <p class="text-gray-500 font-inter text-base">Đăng nhập để tiếp tục hành trình mua sắm thực phẩm sạch của bạn.</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6 animate-fade-in-up delay-200">
            <BaseInput
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="ten@vi-du.com"
              :error="errors.email"
              class="font-inter"
            />

            <div class="space-y-2">
              <BaseInput
                v-model="form.password"
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                :error="errors.password"
                class="font-inter"
              />
              <div class="flex justify-end px-1">
                <router-link to="/forgot-password" class="text-xs text-green-600 hover:text-green-700 font-bold uppercase tracking-wide">
                  Quên mật khẩu?
                </router-link>
              </div>
            </div>

            <BaseButton
              type="submit"
              variant="primary"
              class="w-full !py-4 !rounded-2xl text-base font-black shadow-lg shadow-green-100 flex items-center justify-center gap-2 group font-outfit"
              :disabled="isLoading"
            >
              <span>{{ isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP NGAY' }}</span>
              <ArrowRight v-if="!isLoading" :size="20" class="group-hover:translate-x-1 transition-transform" />
            </BaseButton>
          </form>

          <p class="mt-10 text-center text-gray-500 font-inter text-sm animate-fade-in-up delay-300">
            Chưa có tài khoản?
            <router-link to="/register" class="text-green-600 font-black hover:underline underline-offset-4">TẠO TÀI KHOẢN MỚI</router-link>
          </p>
        </div>
      </div>

      <!-- Right Side: Decoration -->
      <div class="hidden md:flex flex-1 bg-green-600 relative overflow-hidden p-12 flex-col justify-end">
        <img 
          src="@/assets/images/login-bg.png" 
          alt="Login illustration"
          class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay hover:scale-110 transition-transform duration-[10s]"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-800/20 to-transparent"></div>
        
        <div class="relative z-10 text-white max-w-sm animate-fade-in-up delay-400">
          <h3 class="text-4xl font-black font-outfit leading-tight mb-4">
            Rau sạch từ tâm,<br>An tâm mỗi bữa.
          </h3>
          <p class="text-green-100 font-inter text-lg">
            Chúng tôi cam kết mang lại nguồn dinh dưỡng tinh khiết nhất cho gia đình bạn.
          </p>
        </div>
      </div>

    </div>
  </main>
</template>