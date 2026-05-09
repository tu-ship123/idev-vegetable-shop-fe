<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { Home } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({ name: '', email: '', password: '', confirmPassword: '' })
const errors = ref({ name: '', email: '', password: '', confirmPassword: '' })
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
      fullName: form.value.name,
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

<template>
  <main class="min-h-screen flex items-center justify-center relative bg-[url('https://themewagon.github.io/vegefoods/images/bg_2.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
    <div class="absolute inset-0 bg-black/40"></div>

    <div class="relative z-10 w-full max-w-lg bg-white p-8 sm:p-12 shadow-2xl rounded-sm m-4 animate-fade-in">
      
      <button 
        @click="router.push('/')" 
        class="absolute -top-12 left-0 text-white flex items-center gap-2 hover:text-[#82ae46] transition-colors uppercase text-[11px] font-bold tracking-widest"
      >
        <Home :size="16" /> Trang chủ
      </button>

      <div class="text-center mb-8">
        <h2 class="text-6xl font-bold text-[#82ae46] mb-2" style="font-family: 'Amatic SC', cursive;">Đăng Ký</h2>
        <p class="text-gray-400 text-xs uppercase tracking-[2px]" style="font-family: 'Poppins', sans-serif;">Gia nhập cộng đồng rau sạch</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <BaseInput
          v-model="form.name"
          label="Họ và tên"
          placeholder="Nhập họ và tên"
          :error="errors.name"
        />

        <BaseInput
          v-model="form.email"
          label="Địa chỉ Email"
          type="email"
          placeholder="Nhập email của bạn"
          :error="errors.email"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            v-model="form.password"
            label="Mật khẩu"
            type="password"
            placeholder="Mật khẩu"
            :error="errors.password"
          />
          <BaseInput
            v-model="form.confirmPassword"
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            :error="errors.confirmPassword"
          />
        </div>

        <BaseButton 
          type="submit" 
          variant="primary" 
          class="w-full !py-4 mt-4 shadow-lg shadow-[#82ae46]/20" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'ĐANG XỬ LÝ...' : 'TẠO TÀI KHOẢN' }}
        </BaseButton>
      </form>

      <div class="mt-8 text-center border-t border-gray-100 pt-6">
        <p class="text-gray-500 text-sm" style="font-family: 'Poppins', sans-serif;">
          Đã có tài khoản? 
          <router-link to="/login" class="text-[#82ae46] font-bold hover:underline ml-1">ĐĂNG NHẬP</router-link>
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