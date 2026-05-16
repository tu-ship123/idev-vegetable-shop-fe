<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { orderApi } from '@/api/orderApi'
import { formatPrice } from '@/utils/formatters'
import { paymentApi } from '@/api/paymentApi'
import { MapPin, CreditCard, FileText, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const cartStore = useCartStore()

// State cho Form đặt hàng
const orderForm = ref({
  shippingAddress: '',
  paymentMethod: 'COD', // Mặc định là Thanh toán khi nhận hàng
  note: ''
})

const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMsg = ref('')

// Kiểm tra giỏ hàng trống thì đá về trang sản phẩm
onMounted(() => {
  if (cartStore.items.length === 0) {
    router.push('/products')
  }
})

const handleCheckout = async () => {
  if (!orderForm.value.shippingAddress.trim()) {
    errorMsg.value = 'Vui lòng nhập địa chỉ giao hàng!'
    return
  }

  isSubmitting.value = true
  errorMsg.value = ''

  try {
    const orderPayload = {
      shippingAddress: orderForm.value.shippingAddress,
      paymentMethod: orderForm.value.paymentMethod,
      note: orderForm.value.note
    }

    const orderRes = await orderApi.checkout(orderPayload)
    
    // Tìm orderId từ cục data BE trả về
    const orderData = orderRes.data || orderRes
    const orderId = orderData.id

    // 2. Kiểm tra phương thức thanh toán
    if (orderForm.value.paymentMethod === 'VNPAY') {
      const vnpayRes = await paymentApi.createVnPayUrl(orderId)
      const vnpayData = vnpayRes.data || vnpayRes
      
      if (vnpayData && vnpayData.paymentUrl) {
        cartStore.clearCart() 
        window.location.href = vnpayData.paymentUrl 
        return 
      }
    }

    // 3. Nếu là COD
    isSuccess.value = true
    cartStore.clearCart()
    
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#fcfcfc] py-16 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-12">
        <p class="text-[10px] font-black text-green-600 uppercase tracking-[4px] mb-4">Hoàn tất mua sắm</p>
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 leading-tight">THANH TOÁN ĐƠN HÀNG</h1>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-16">
        
        <div class="space-y-10">
          <div v-if="errorMsg" class="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
            {{ errorMsg }}
          </div>

          <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h2 class="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
              <MapPin class="text-green-600" /> Địa chỉ giao hàng
            </h2>
            <textarea 
              v-model="orderForm.shippingAddress"
              rows="3" 
              placeholder="Nhập địa chỉ nhận hàng chi tiết (Số nhà, Đường, Phường/Xã...)"
              class="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-green-500 transition-all resize-none placeholder:text-gray-400"
            ></textarea>
          </div>

          <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h2 class="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
              <CreditCard class="text-green-600" /> Phương thức thanh toán
            </h2>
            <div class="space-y-4">
              <label class="flex items-center p-5 border border-gray-100 rounded-2xl cursor-pointer hover:border-green-500 transition-colors" :class="{'bg-green-50 border-green-500': orderForm.paymentMethod === 'COD'}">
                <input type="radio" v-model="orderForm.paymentMethod" value="COD" class="text-green-600 focus:ring-green-500">
                <span class="ml-4 text-sm font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
              </label>
              
              <label class="flex items-center p-5 border border-gray-100 rounded-2xl cursor-pointer hover:border-green-500 transition-colors" :class="{'bg-green-50 border-green-500': orderForm.paymentMethod === 'VNPAY'}">
                <input type="radio" v-model="orderForm.paymentMethod" value="VNPAY" class="text-green-600 focus:ring-green-500">
                <span class="ml-4 text-sm font-bold text-gray-900">Thanh toán qua VNPay</span>
              </label>
            </div>
          </div>

          <div class="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
            <h2 class="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
              <FileText class="text-green-600" /> Ghi chú cho đơn hàng
            </h2>
            <textarea 
              v-model="orderForm.note"
              rows="2" 
              placeholder="Giao giờ hành chính, gọi trước khi giao..."
              class="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-green-500 transition-all resize-none placeholder:text-gray-400"
            ></textarea>
          </div>
        </div>

        <div>
          <div class="bg-gray-900 text-white p-10 rounded-[40px] sticky top-24 shadow-2xl shadow-gray-900/20">
            <h3 class="text-xl font-black uppercase tracking-widest mb-8 border-b border-gray-800 pb-6">Đơn hàng của bạn</h3>
            
            <div class="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
              <div v-for="item in cartStore.items" :key="item.product.id" class="flex justify-between items-center">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-white rounded-xl p-1">
                    <img :src="item.product.image" class="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-white line-clamp-1">{{ item.product.name }}</p>
                    <p class="text-xs text-gray-400">SL: {{ item.quantity }}</p>
                  </div>
                </div>
                <span class="text-sm font-black text-green-400">{{ formatPrice(item.product.price * item.quantity) }}</span>
              </div>
            </div>

            <div class="border-t border-gray-800 pt-6 mb-8">
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm text-gray-400">Tạm tính</span>
                <span class="font-bold text-white">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="text-sm text-gray-400">Phí giao hàng</span>
                <span class="font-bold text-green-400">Miễn phí</span>
              </div>
              <div class="flex justify-between items-end mt-6">
                <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng cộng</span>
                <span class="text-4xl font-black text-green-400 leading-none">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
            </div>

            <button 
              @click="handleCheckout"
              :disabled="isSubmitting"
              class="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Đang xử lý...' : 'Xác nhận Đặt hàng' }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <div v-if="isSuccess" class="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
      <div class="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-8 text-green-500">
        <CheckCircle2 :size="64" />
      </div>
      <h2 class="text-5xl font-black text-gray-900 mb-6">ĐẶT HÀNG THÀNH CÔNG!</h2>
      <p class="text-gray-500 mb-12 text-center max-w-md text-lg">
        Cảm ơn bạn đã mua sắm tại Vegetable Shop. Chúng tôi sẽ sớm liên hệ để giao hàng cho bạn.
      </p>
      <button 
        @click="router.push('/')"
        class="bg-gray-900 text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-green-600 transition-colors shadow-xl"
      >
        Quay lại Trang chủ
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>