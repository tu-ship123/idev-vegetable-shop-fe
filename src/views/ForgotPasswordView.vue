<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { Home } from 'lucide-vue-next'
import bgForgot from '@/assets/images/category-1.jpg'

const authStore = useAuthStore()
const router = useRouter()

// Quản lý trạng thái 2 bước
const step = ref(1) // Bước 1: Nhập email | Bước 2: Nhập OTP & Đổi mật khẩu
const isLoading = ref(false)
const error = ref('')

// Biến lưu trữ dữ liệu form
const email = ref('')
const otpCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Hàm xử lý Bước 1: Xin mã OTP
const handleSendOTP = async () => {
  error.value = ''
  if (!email.value) {
    error.value = 'Vui lòng nhập email đã đăng ký'
    return
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    // THÊM ĐOẠN NÀY: Kiểm tra định dạng y như bên trang Đăng nhập
    error.value = 'Email không đúng định dạng'
    return
  }

  isLoading.value = true
  try {
    // Gửi data dưới dạng Object khớp với ForgotPasswordRequest.java
    await authStore.forgotPassword({ email: email.value })
    // Nếu BE trả về 200, chuyển sang bước 2
    step.value = 2 
  } catch (err) {
    console.error(err)
    // Các lỗi 400, 404 đã được axiosInterceptor tự động báo alert, không cần xử lý thêm ở đây
  } finally {
    isLoading.value = false
  }
}

// Hàm xử lý Bước 2: Đổi mật khẩu
const handleResetPassword = async () => {
  error.value = ''
  
  // Validate cơ bản phía FE
  if (!otpCode.value || !newPassword.value || !confirmPassword.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Mật khẩu xác nhận không khớp'
    return
  }
  if (newPassword.value.length < 6) {
    error.value = 'Mật khẩu phải từ 6 ký tự trở lên'
    return
  }

  isLoading.value = true
  try {
    // Gửi data dưới dạng Object khớp với ResetPasswordRequest.java
    await authStore.resetPassword({
      email: email.value,
      otpCode: otpCode.value,
      newPassword: newPassword.value
    })
    
    // Nếu thành công
    alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.')
    router.push('/login')
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main 
    class="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat bg-fixed font-sans" :style="{ backgroundImage: `url(${bgForgot})` }" >
    <div class="absolute inset-0 bg-black/40"></div>

    <div class="relative z-10 w-full max-w-md bg-white p-8 sm:p-10 shadow-2xl rounded-md m-4">
      
      <button @click="router.push('/login')" class="absolute -top-12 left-0 text-white flex items-center gap-2 hover:text-[#82ae46] transition-colors" style="font-family: 'Poppins', sans-serif;">
        <Home :size="18" /> Quay lại đăng nhập
      </button>

      <div v-if="step === 1">
        <div class="text-center mb-8">
          <h2 class="text-5xl font-bold text-[#82ae46] mb-2" style="font-family: 'Amatic SC', cursive;">Quên Mật Khẩu</h2>
          <p class="text-gray-500 text-sm" style="font-family: 'Poppins', sans-serif;">Nhập email để nhận mã OTP khôi phục</p>
        </div>

        <form @submit.prevent="handleSendOTP" class="space-y-6" style="font-family: 'Poppins', sans-serif;">
          <BaseInput
            v-model="email"
            label="Địa chỉ Email"
            type="email"
            placeholder="Email bạn đã đăng ký"
            :error="error"
          />

          <BaseButton type="submit" variant="primary" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'ĐANG GỬI...' : 'NHẬN MÃ OTP' }}
          </BaseButton>
        </form>
      </div>

      <div v-else>
        <div class="text-center mb-6">
          <h2 class="text-5xl font-bold text-[#82ae46] mb-2" style="font-family: 'Amatic SC', cursive;">Đặt Lại Mật Khẩu</h2>
          <p class="text-gray-500 text-sm" style="font-family: 'Poppins', sans-serif;">
            Mã OTP 6 số đã được gửi đến <br><strong class="text-gray-800">{{ email }}</strong>
          </p>
        </div>

        <form @submit.prevent="handleResetPassword" class="space-y-4" style="font-family: 'Poppins', sans-serif;">
          <p v-if="error" class="text-xs text-red-500 text-center italic mb-4">{{ error }}</p>

          <BaseInput
            v-model="otpCode"
            label="Mã OTP"
            type="text"
            placeholder="Nhập mã 6 chữ số"
          />
          
          <BaseInput
            v-model="newPassword"
            label="Mật khẩu mới"
            type="password"
            placeholder="Từ 6 ký tự"
          />
          
          <BaseInput
            v-model="confirmPassword"
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
          />

          <BaseButton type="submit" variant="primary" class="w-full mt-6" :disabled="isLoading">
            {{ isLoading ? 'ĐANG XỬ LÝ...' : 'ĐỔI MẬT KHẨU' }}
          </BaseButton>
          
          <button type="button" @click="step = 1" class="w-full text-center text-[11px] text-gray-500 hover:text-[#82ae46] mt-4 font-bold uppercase tracking-widest transition-colors">
            Sử dụng Email khác
          </button>
        </form>
      </div>

    </div>
  </main>
</template>