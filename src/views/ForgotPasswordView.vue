<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { Home, Leaf, ShieldCheck, Truck, ArrowLeft } from 'lucide-vue-next'
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
    error.value = 'Email không đúng định dạng'
    return
  }

  isLoading.value = true
  try {
    await authStore.forgotPassword({ email: email.value })
    step.value = 2 
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Hàm xử lý Bước 2: Đổi mật khẩu
const handleResetPassword = async () => {
  error.value = ''
  
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
    await authStore.resetPassword({
      email: email.value,
      otpCode: otpCode.value,
      newPassword: newPassword.value
    })
    
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
    class="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat bg-fixed p-4 overflow-hidden" 
    :style="{ backgroundImage: `url(${bgForgot})` }" 
  >
    <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

    <div class="relative z-10 w-full max-w-4xl h-[620px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[24px] overflow-hidden flex animate-fade-in">
      
      <div class="hidden md:flex w-1/2 h-full bg-[#82ae46] relative p-12 flex-col justify-center items-center text-white overflow-hidden shrink-0">
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
            Khôi phục truy cập để tiếp tục mua sắm <br>thực phẩm sạch cho gia đình.
          </p>

          <div class="space-y-4 text-[11px] font-bold tracking-[0.2em] uppercase" style="font-family: 'Poppins', sans-serif;">
            <div class="flex items-center justify-center gap-3 bg-black/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10">
              <Truck :size="14"/> <span>Giao hàng 2 giờ</span>
            </div>
            <div class="flex items-center justify-center gap-3 bg-black/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10">
              <ShieldCheck :size="14"/> <span>Bảo mật 100%</span>
            </div>
          </div>
        </div>

        <button @click="router.push('/')" class="absolute bottom-10 text-white/70 hover:text-white flex items-center gap-2 text-[10px] uppercase font-bold tracking-[3px] transition-all">
          <Home :size="14" /> TRANG CHỦ
        </button>
      </div>

      <div class="w-full md:w-1/2 h-full flex flex-col justify-center px-10 sm:px-14 relative bg-white shrink-0" style="font-family: 'Poppins', sans-serif;">
        <transition name="form-fade" mode="out-in">
          
          <div v-if="step === 1" :key="'step1'" class="w-full">
            <div class="text-center mb-8">
              <h2 class="text-6xl font-bold text-[#82ae46] tracking-wide mb-2 uppercase" style="font-family: 'Amatic SC', cursive;">Quên Mật Khẩu</h2>
              <p class="text-[9px] text-gray-400 uppercase tracking-[0.25em] font-medium">Nhập email để nhận mã OTP khôi phục</p>
            </div>

            <form @submit.prevent="handleSendOTP" class="space-y-6 w-full">
              <BaseInput
                v-model="email"
                label="ĐỊA CHỈ EMAIL"
                type="email"
                placeholder="Nhập email đã đăng ký"
                :error="error"
              />

              <BaseButton type="submit" variant="primary" class="w-full !py-3.5 !rounded-full shadow-lg shadow-[#82ae46]/30 uppercase tracking-[0.2em] text-[11px] font-bold mt-4" :disabled="isLoading">
                {{ isLoading ? 'ĐANG GỬI...' : 'NHẬN MÃ OTP' }}
              </BaseButton>

              <div class="pt-8 text-center mt-4">
                <button type="button" @click="router.push('/login')" class="text-[11px] text-gray-500 hover:text-[#82ae46] font-bold tracking-wider uppercase inline-flex items-center gap-2 transition-colors">
                  <ArrowLeft :size="14" /> QUAY LẠI ĐĂNG NHẬP
                </button>
              </div>
            </form>
          </div>

          <div v-else :key="'step2'" class="w-full">
            <div class="text-center mb-6">
              <h2 class="text-6xl font-bold text-[#82ae46] tracking-wide mb-2 uppercase" style="font-family: 'Amatic SC', cursive;">Đổi Mật Khẩu</h2>
              <p class="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-medium leading-relaxed">
                Mã OTP 6 số đã được gửi đến <br><span class="text-[#82ae46] font-bold text-[10px]">{{ email }}</span>
              </p>
            </div>

            <form @submit.prevent="handleResetPassword" class="space-y-4 w-full">
              <p v-if="error" class="text-[11px] text-red-500 text-center italic mb-2">{{ error }}</p>

              <BaseInput
                v-model="otpCode"
                label="MÃ OTP"
                type="text"
                placeholder="Nhập mã 6 chữ số"
              />
              
              <BaseInput
                v-model="newPassword"
                label="MẬT KHẨU MỚI"
                type="password"
                placeholder="Từ 6 ký tự"
              />
              
              <BaseInput
                v-model="confirmPassword"
                label="XÁC NHẬN MẬT KHẨU"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
              />

              <BaseButton type="submit" variant="primary" class="w-full !py-3.5 !rounded-full shadow-lg shadow-[#82ae46]/30 uppercase tracking-[0.2em] text-[11px] font-bold mt-6" :disabled="isLoading">
                {{ isLoading ? 'ĐANG XỬ LÝ...' : 'ĐỔI MẬT KHẨU' }}
              </BaseButton>
              
              <div class="pt-6 text-center">
                <button type="button" @click="step = 1" class="text-[10px] text-gray-400 hover:text-[#82ae46] font-bold tracking-[0.15em] uppercase transition-colors">
                  SỬ DỤNG EMAIL KHÁC
                </button>
              </div>
            </form>
          </div>

        </transition>
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

/* Hoạt ảnh lá rơi bên nền xanh */
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

/* Hiệu ứng trượt ngang siêu mượt giữa Step 1 và Step 2 */
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-fade-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.form-fade-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>