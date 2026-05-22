<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { paymentApi } from '@/api/paymentApi'
import { formatPrice } from '@/utils/formatters'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const status = ref('loading') // 'loading', 'success', 'error'
const message = ref('Đang xác minh giao dịch...')

// Lưu trữ thông tin chi tiết hóa đơn/giao dịch để hiển thị cho khách hàng
const orderId = ref(null)
const transactionNo = ref('')
const amount = ref(0)
const bankCode = ref('')

onMounted(async () => {
  // Lấy toàn bộ tham số URL mà VNPay ném về (ví dụ: ?vnp_Amount=...&vnp_BankCode=...)
  const queryString = window.location.search
  
  if (!queryString) {
    status.value = 'error'
    message.value = 'Không tìm thấy thông tin giao dịch.'
    return
  }

  try {
    // Gọi API Return của Backend để xác minh chữ ký bảo mật
    const res = await paymentApi.verifyReturn(queryString)
    const data = res.data || res
    
    // Gán dữ liệu hóa đơn trả về từ server
    orderId.value = data.orderId
    transactionNo.value = data.transactionNo
    amount.value = data.amount
    bankCode.value = data.bankCode

    // Kiểm tra kết quả giao dịch: thành công nếu checksum đúng + ResponseCode là 00 hoặc đơn hàng đã PAID
    if (data.success === true || data.paymentStatus === 'PAID') {
      status.value = 'success'
      message.value = data.message || 'Thanh toán thành công! Cảm ơn bạn đã mua hàng.'
    } else {
      status.value = 'error'
      message.value = data.message || 'Giao dịch bị hủy hoặc thanh toán thất bại.'
    }
  } catch (error) {
    status.value = 'error'
    message.value = 'Có lỗi xảy ra khi xác minh giao dịch với máy chủ.'
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
        <p class="text-gray-500 mb-6">{{ message }}</p>

        <!-- Chi tiết hóa đơn thanh toán thành công -->
        <div class="w-full bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-3 text-sm border border-gray-100">
          <div class="flex justify-between">
            <span class="text-gray-400 font-medium">Mã đơn hàng:</span>
            <span class="font-bold text-gray-900">#{{ orderId }}</span>
          </div>
          <div v-if="transactionNo" class="flex justify-between">
            <span class="text-gray-400 font-medium">Mã giao dịch VNPay:</span>
            <span class="font-bold text-gray-900">{{ transactionNo }}</span>
          </div>
          <div v-if="amount" class="flex justify-between">
            <span class="text-gray-400 font-medium">Số tiền:</span>
            <span class="font-bold text-green-600 text-base">{{ formatPrice(amount) }}</span>
          </div>
          <div v-if="bankCode" class="flex justify-between">
            <span class="text-gray-400 font-medium">Ngân hàng:</span>
            <span class="font-bold text-gray-900 uppercase">{{ bankCode }}</span>
          </div>
        </div>

        <button @click="router.push('/')" class="w-full bg-gray-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-green-600 transition-colors">
          Về trang chủ
        </button>
      </div>

      <div v-else class="flex flex-col items-center animate-fade-in">
        <div class="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
          <XCircle :size="48" />
        </div>
        <h2 class="text-3xl font-black text-gray-900 mb-4 uppercase tracking-widest">Thất bại!</h2>
        <p class="text-gray-500 mb-6">{{ message }}</p>

        <!-- Chi tiết hóa đơn khi gặp lỗi -->
        <div v-if="orderId" class="w-full bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-3 text-sm border border-gray-100">
          <div class="flex justify-between">
            <span class="text-gray-400 font-medium">Mã đơn hàng:</span>
            <span class="font-bold text-gray-900">#{{ orderId }}</span>
          </div>
          <div v-if="transactionNo" class="flex justify-between">
            <span class="text-gray-400 font-medium">Mã giao dịch VNPay:</span>
            <span class="font-bold text-gray-900">{{ transactionNo }}</span>
          </div>
        </div>

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