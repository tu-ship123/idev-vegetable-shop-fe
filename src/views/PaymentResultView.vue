<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/api/apiClient' // Dùng axiosInstance thay vì paymentApi để gọi thẳng
import { CheckCircle2, XCircle, Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const status = ref('loading') // 'loading', 'success', 'error'
const message = ref('Đang xác minh giao dịch...')
const countdown = ref(5)

onMounted(async () => {
  // Lấy params an toàn bằng Vue Router thay vì window.location.search
  const vnpayParams = route.query

  if (Object.keys(vnpayParams).length === 0) {
    status.value = 'error'
    message.value = 'Không tìm thấy thông tin giao dịch.'
    return
  }

  // Lấy dữ liệu xong thì mới giấu URL trên trình duyệt cho đẹp
  if (window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname)
  }

  try {
    // Gọi API Return của Backend (/api/v1/payments/vnpay/return)
    const res = await axiosInstance.get('/payments/vnpay/return', {
      params: vnpayParams
    })
    
    const data = res.data || res
    
    // Bắt chuẩn biến 'success' từ VNPayReturnResponse của Backend
    if (data.success === true) {
      status.value = 'success'
      message.value = data.message || 'Thanh toán thành công! Cảm ơn bạn đã mua hàng.'
      
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
          router.push('/orders') // Chuyển về trang Lịch sử đơn hàng
        }
      }, 1000)

    } else {
      status.value = 'error'
      message.value = data.message || 'Giao dịch bị hủy hoặc thanh toán thất bại.'
    }
  } catch (error) {
    console.error('Lỗi xác minh VNPAY:', error)
    status.value = 'error'
    message.value = 'Có lỗi xảy ra khi kết nối với máy chủ.'
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#fcfcfc] flex items-center justify-center py-16">
    <div class="bg-white p-12 rounded-[40px] shadow-xl max-w-lg w-full text-center border border-gray-100">
      
      <div v-if="status === 'loading'" class="flex flex-col items-center animate-pulse">
        <Loader2 class="w-20 h-20 text-green-500 animate-spin mb-6" />
        <h2 class="text-2xl font-black text-gray-900 mb-2">Đang xử lý giao dịch</h2>
        <p class="text-gray-500">Vui lòng không đóng trình duyệt lúc này...</p>
      </div>

      <div v-else-if="status === 'success'" class="flex flex-col items-center animate-fade-in">
        <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-500">
          <CheckCircle2 :size="48" />
        </div>
        <h2 class="text-3xl font-black text-gray-900 mb-4 uppercase tracking-widest">Thành công!</h2>
        <p class="text-gray-500 mb-8">{{ message }}<br/><span class="text-sm font-bold text-green-600 mt-2 block">Tự động chuyển trang sau {{ countdown }}s...</span></p>
        <button @click="router.push('/orders')" class="w-full bg-gray-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-green-600 transition-colors">
          Xem đơn hàng
        </button>
      </div>

      <div v-else class="flex flex-col items-center animate-fade-in">
        <div class="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
          <XCircle :size="48" />
        </div>
        <h2 class="text-3xl font-black text-gray-900 mb-4 uppercase tracking-widest">Thất bại!</h2>
        <p class="text-gray-500 mb-8">{{ message }}</p>
        <button @click="router.push('/checkout')" class="w-full border-2 border-gray-100 text-gray-900 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
          Thử thanh toán lại
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>