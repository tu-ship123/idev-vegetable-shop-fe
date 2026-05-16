<script setup>
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/formatters'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const cartStore = useCartStore()
const router = useRouter()

const proceedToCheckout = () => {
  router.push('/checkout')
}

// Gọi lấy dữ liệu giỏ hàng mới nhất từ Database nếu đã đăng nhập
onMounted(() => {
  if (typeof cartStore.fetchDbCart === 'function') {
    cartStore.fetchDbCart()
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#fcfcfc] py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-12">
        <p class="text-[10px] font-black text-green-600 uppercase tracking-[4px] mb-4">Giỏ hàng của bạn</p>
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 leading-tight">KIỂM TRA SẢN PHẨM</h1>
      </div>

      <div v-if="!cartStore.items || cartStore.items.length === 0" class="py-32 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
        <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <ShoppingBag :size="48" />
        </div>
        <h3 class="text-2xl font-black text-gray-900 mb-4">Giỏ hàng đang trống</h3>
        <p class="text-gray-400 mb-8">Có vẻ như bạn chưa chọn mua sản phẩm nào.</p>
        <button @click="router.push('/products')" class="bg-gray-900 text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-green-600 transition-colors shadow-xl shadow-gray-200">
          Tiếp tục mua sắm
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div class="lg:col-span-2 space-y-6">
          <div 
            v-for="item in cartStore.items" 
            :key="item.product.id"
            class="bg-white p-6 rounded-[30px] border border-gray-100 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-50 p-2">
              <img :src="item.product.image" :alt="item.product.name" class="w-full h-full object-contain" />
            </div>
            
            <div class="flex-1 text-center sm:text-left">
              <h3 class="text-lg font-black text-gray-900 mb-1 line-clamp-1">{{ item.product.name }}</h3>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {{ formatPrice(item.product.price) }} / {{ item.product.unit || 'Kg' }}
              </p>
            </div>

            <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div class="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                <button 
                  @click="cartStore.updateQuantity(item.cartItemId, item.product.id, item.quantity - 1)"
                  class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all"
                  :disabled="item.quantity <= 1"
                >
                  <Minus :size="16" />
                </button>
                <input 
                  type="number" 
                  :value="item.quantity"
                  readonly
                  class="w-12 text-center bg-transparent border-none focus:ring-0 text-sm font-black text-gray-900 p-0" 
                />
                <button 
                  @click="cartStore.updateQuantity(item.cartItemId, item.product.id, item.quantity + 1)"
                  class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all"
                >
                  <Plus :size="16" />
                </button>
              </div>

              <div class="w-28 text-right font-black text-green-600 text-lg">
                {{ formatPrice(item.product.price * item.quantity) }}
              </div>

              <button 
                @click="cartStore.removeFromCart(item.cartItemId, item.product.id)"
                class="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-gray-900 text-white rounded-[40px] p-8 sticky top-24 shadow-2xl shadow-gray-900/20">
            <h3 class="text-xl font-black uppercase tracking-widest mb-8 border-b border-gray-800 pb-6">Tổng đơn hàng</h3>
            
            <div class="space-y-4 mb-8">
              <div class="flex justify-between items-center text-gray-400">
                <span class="text-sm font-medium">Tạm tính ({{ cartStore.totalItems }} sp)</span>
                <span class="font-bold text-white">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
              <div class="flex justify-between items-center text-gray-400">
                <span class="text-sm font-medium">Phí giao hàng</span>
                <span class="font-bold text-green-400">Miễn phí</span>
              </div>
            </div>

            <div class="border-t border-gray-800 pt-6 mb-8 flex justify-between items-end">
              <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Tổng cộng</span>
              <span class="text-3xl font-black text-green-400 leading-none">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <button 
              @click="proceedToCheckout"
              class="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all group"
            >
              Thanh toán ngay
              <ArrowRight :size="18" class="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Khóa và ẩn các mũi tên tăng giảm mặc định của input number */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>