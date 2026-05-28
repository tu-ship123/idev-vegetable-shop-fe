<script setup>
import { ref, onMounted } from 'vue'
import { orderApi } from '@/api/orderApi'
import { Package, Clock, CheckCircle2, XCircle, Star, X, Loader2 } from 'lucide-vue-next'

const orders = ref([])
const isLoading = ref(true)

// ================= STATE CHO MODAL ĐÁNH GIÁ =================
const showReviewModal = ref(false)
const isSubmittingReview = ref(false)
const selectedItem = ref(null)
const reviewForm = ref({
  rating: 5,
  comment: ''
})

// ================= LẤY DỮ LIỆU ĐƠN HÀNG =================
const fetchMyOrders = async () => {
  isLoading.value = true
  try {
    const res = await orderApi.getMyOrders()
    orders.value = res.data || res
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử đơn hàng:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMyOrders()
})

// ================= TIỆN ÍCH =================
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

// Cấu hình màu sắc cho từng loại trạng thái đơn hàng
const getStatusConfig = (status) => {
  const configs = {
    'PENDING': { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', text: 'Chờ xử lý', icon: Clock },
    'PROCESSING': { color: 'text-blue-600 bg-blue-50 border-blue-200', text: 'Đang chuẩn bị', icon: Package },
    'SHIPPED': { color: 'text-purple-600 bg-purple-50 border-purple-200', text: 'Đang giao hàng', icon: Package },
    'DELIVERED': { color: 'text-green-600 bg-green-50 border-green-200', text: 'Đã giao hàng', icon: CheckCircle2 },
    'CANCELLED': { color: 'text-red-600 bg-red-50 border-red-200', text: 'Đã hủy', icon: XCircle }
  }
  return configs[status] || { color: 'text-gray-600 bg-gray-50 border-gray-200', text: status, icon: Package }
}

// ================= XỬ LÝ ĐÁNH GIÁ =================
const openReviewModal = (item) => {
  selectedItem.value = item
  reviewForm.value = { rating: 5, comment: '' }
  showReviewModal.value = true
}

const submitReview = async () => {
  if (!reviewForm.value.comment.trim()) return
  
  isSubmittingReview.value = true
  try {
    await orderApi.submitReview(selectedItem.value.productId, reviewForm.value)
    // Cập nhật state nội bộ để ẩn nút đánh giá
    selectedItem.value.isReviewed = true
    showReviewModal.value = false
  } catch (error) {
    alert('Có lỗi xảy ra khi gửi đánh giá')
  } finally {
    isSubmittingReview.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#fcfcfc] py-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 leading-tight uppercase tracking-widest">Lịch sử đơn hàng</h1>
        <p class="text-sm font-medium text-gray-500 mt-2">Theo dõi và đánh giá các sản phẩm bạn đã mua</p>
      </div>

      <!-- Trạng thái Loading -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <Loader2 class="w-10 h-10 animate-spin text-green-500" />
      </div>

      <!-- Trạng thái Chưa có đơn hàng -->
      <div v-else-if="orders.length === 0" class="bg-white p-16 rounded-[40px] text-center border border-gray-100 shadow-sm">
        <Package class="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h3 class="text-2xl font-black text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
        <p class="text-gray-500 mb-8">Bạn chưa thực hiện giao dịch nào trên hệ thống.</p>
        <router-link to="/products" class="bg-green-500 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-green-600 transition-colors">
          Bắt đầu mua sắm
        </router-link>
      </div>

      <!-- Danh sách đơn hàng -->
      <div v-else class="space-y-8">
        <div v-for="order in orders" :key="order.id" class="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm transition-hover hover:shadow-md">
          
          <!-- Header đơn hàng -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-100 gap-4">
            <div>
              <p class="text-sm text-gray-500 font-medium">Đơn hàng <span class="text-gray-900 font-bold uppercase">#{{ order.id }}</span></p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(order.createdAt) }}</p>
            </div>
            
            <div class="flex items-center px-4 py-2 rounded-full border" :class="getStatusConfig(order.status).color">
              <component :is="getStatusConfig(order.status).icon" class="w-4 h-4 mr-2" />
              <span class="text-xs font-bold uppercase tracking-wider">{{ getStatusConfig(order.status).text }}</span>
            </div>
          </div>

          <!-- Danh sách sản phẩm trong đơn -->
          <div class="py-6 space-y-6">
            <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-2 border border-gray-100">
                  <img :src="item.productImageUrl || 'https://via.placeholder.com/150'" class="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 line-clamp-1">{{ item.productName || 'Sản phẩm' }}</h4>
                  <p class="text-xs text-gray-500 mt-1">SL: {{ item.quantity }} x <span class="text-gray-900 font-medium">{{ formatPrice(item.unitPrice) }}</span></p>
                </div>
              </div>
              
              <!-- Nút Đánh giá: Chỉ hiện khi đơn đã giao và sản phẩm chưa được đánh giá -->
              <div v-if="order.status === 'DELIVERED'">
                <button 
                  v-if="!item.isReviewed"
                  @click="openReviewModal(item)"
                  class="border border-green-500 text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Đánh giá
                </button>
                <span v-else class="text-xs font-bold text-gray-400 flex items-center gap-1">
                  <CheckCircle2 class="w-4 h-4" /> Đã đánh giá
                </span>
              </div>
            </div>
          </div>

          <!-- Footer đơn hàng -->
          <div class="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-end gap-4">
            <div>
              <p class="text-xs text-gray-500 uppercase tracking-widest">Thanh toán</p>
              <p class="font-bold text-gray-900 text-sm mt-1">
                {{ order.paymentMethod === 'VNPAY' ? 'Chuyển khoản VNPay' : 'Thanh toán khi nhận hàng' }}
                <span :class="order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-yellow-600'">
                  ({{ order.paymentStatus === 'PAID' ? 'Đã trả' : 'Chưa trả' }})
                </span>
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500 uppercase tracking-widest">Tổng tiền</p>
              <p class="text-2xl font-black text-green-600">{{ formatPrice(order.totalAmount) }}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- ================= MODAL ĐÁNH GIÁ ================= -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div class="bg-white w-full max-w-md rounded-[30px] p-8 relative scale-in">
        <button @click="showReviewModal = false" class="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
          <X class="w-6 h-6" />
        </button>

        <h3 class="text-2xl font-black text-gray-900 mb-2">Đánh giá sản phẩm</h3>
        <p class="text-sm text-gray-500 mb-8">{{ selectedItem?.productName }}</p>

        <!-- Chọn Sao -->
        <div class="flex justify-center gap-2 mb-8">
          <button 
            v-for="star in 5" :key="star"
            @click="reviewForm.rating = star"
            class="focus:outline-none transition-transform hover:scale-110"
          >
            <Star 
              class="w-10 h-10 transition-colors" 
              :class="star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'" 
            />
          </button>
        </div>

        <!-- Ô nhập nhận xét -->
        <textarea 
          v-model="reviewForm.comment"
          rows="4"
          placeholder="Hãy chia sẻ cảm nhận của bạn về độ tươi ngon của sản phẩm nhé..."
          class="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none mb-6 placeholder:text-gray-400"
        ></textarea>

        <button 
          @click="submitReview"
          :disabled="isSubmittingReview || !reviewForm.comment.trim()"
          class="w-full bg-gray-900 hover:bg-green-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Loader2 v-if="isSubmittingReview" class="w-5 h-5 animate-spin" />
          <span v-else>Gửi đánh giá</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
</style>