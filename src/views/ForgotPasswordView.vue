<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { ChevronLeft, MailCheck } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const error = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)

const validateEmail = () => {
  error.value = ''
  if (!email.value) {
    error.value = 'Vui lòng nhập email'
    return false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Email không đúng định dạng'
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateEmail()) return

  isLoading.value = true
  try {
    const success = await authStore.forgotPassword(email.value)
    if (success) {
      isSubmitted.value = true
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 relative overflow-hidden">
      <!-- Decoration -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full blur-3xl"></div>
      
      <!-- Navigation Buttons -->
      <div class="absolute top-6 left-6 right-6 flex justify-between items-center">
        <button 
          @click="router.push('/login')"
          class="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all group flex items-center gap-2"
        >
          <ChevronLeft :size="20" class="group-hover:-translate-x-1 transition-transform" />
          <span class="text-xs font-bold font-outfit uppercase tracking-wider hidden sm:inline">Quay lại</span>
        </button>

        <button 
          @click="router.push('/')"
          class="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-green-600 transition-all group flex items-center gap-2"
        >
          <span class="text-xs font-bold font-outfit uppercase tracking-wider hidden sm:inline">Trang chủ</span>
          <Home :size="20" />
        </button>
      </div>

      <div v-if="!isSubmitted">
        <div class="text-center mb-10 mt-4">
          <div class="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-6">
            <MailCheck :size="32" />
          </div>
          <h2 class="text-3xl font-black text-gray-900 tracking-tight font-outfit">Quên mật khẩu?</h2>
          <p class="mt-4 text-gray-500 leading-relaxed font-inter text-base max-w-[280px] mx-auto">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu mới.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8">
          <BaseInput
            v-model="email"
            label="Địa chỉ Email"
            type="email"
            placeholder="example@gmail.com"
            :error="error"
            class="font-inter"
          />

          <BaseButton
            type="submit"
            variant="primary"
            class="w-full !py-4 !rounded-2xl text-base font-bold shadow-lg shadow-green-100 font-inter uppercase tracking-wider"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Đang gửi...' : 'Gửi yêu cầu' }}
          </BaseButton>
        </form>
      </div>

      <div v-else class="text-center py-6">
        <div class="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center text-green-600 mx-auto mb-8 animate-bounce">
          <MailCheck :size="40" />
        </div>
        <h2 class="text-3xl font-black text-gray-900 tracking-tight">Kiểm tra Email</h2>
        <p class="mt-4 text-gray-500 leading-relaxed mb-10">
          Chúng tôi đã gửi link đặt lại mật khẩu đến <span class="font-bold text-gray-900">{{ email }}</span>. Vui lòng kiểm tra hộp thư của bạn.
        </p>
        <BaseButton
          @click="router.push('/login')"
          variant="outline"
          class="w-full !py-4 !rounded-2xl font-bold"
        >
          Quay lại Đăng nhập
        </BaseButton>
      </div>
    </div>
  </main>
</template>
