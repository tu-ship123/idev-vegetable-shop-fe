<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { Home } from 'lucide-vue-next'
import bgLogin from '@/assets/images/bg_1.jpg'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({ email: '', password: '' })
const errors = ref({ email: '', password: '' })
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
    if (success) router.push('/')
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main 
    class="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat bg-fixed" :style="{ backgroundImage: `url(${bgLogin})` }" >

    <div class="relative z-10 w-full max-w-md bg-white p-8 sm:p-12 shadow-2xl rounded-sm m-4 animate-fade-in">
      
      <button 
        @click="router.push('/')" 
        class="absolute -top-12 left-0 text-white flex items-center gap-2 hover:text-[#82ae46] transition-colors uppercase text-[11px] font-bold tracking-widest"
      >
        <Home :size="16" /> Trang chủ
      </button>

      <div class="text-center mb-10">
        <h2 class="text-6xl font-bold text-[#82ae46] mb-2" style="font-family: 'Amatic SC', cursive;">Đăng Nhập</h2>
        <p class="text-gray-400 text-xs uppercase tracking-[2px]" style="font-family: 'Poppins', sans-serif;">Chào mừng bạn quay lại</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <BaseInput
          v-model="form.email"
          label="Địa chỉ Email"
          type="email"
          placeholder="Nhập email của bạn"
          :error="errors.email"
        />

        <div class="space-y-2">
          <BaseInput
            v-model="form.password"
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu"
            :error="errors.password"
          />
          <div class="flex justify-end">
            <router-link to="/forgot-password" class="text-[11px] text-[#82ae46] font-bold uppercase tracking-wider hover:underline">
              Quên mật khẩu?
            </router-link>
          </div>
        </div>

        <BaseButton 
          type="submit" 
          variant="primary" 
          class="w-full !py-4 shadow-lg shadow-[#82ae46]/20" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP' }}
        </BaseButton>
      </form>

      <div class="mt-10 text-center border-t border-gray-100 pt-6">
        <p class="text-gray-500 text-sm" style="font-family: 'Poppins', sans-serif;">
          Chưa có tài khoản? 
          <router-link to="/register" class="text-[#82ae46] font-bold hover:underline ml-1">ĐĂNG KÝ NGAY</router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>