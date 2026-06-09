<script setup>
import { ref, onMounted, computed } from 'vue'
import { orderApi } from '@/api/orderApi'
import axiosInstance from '@/api/apiClient'
import { Search, Loader2 } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

const toast = useToast()
const orders = ref([])
const isLoading = ref(true)
const isProcessing = ref(false)
const searchQuery = ref('')

const filteredOrders = computed(() => {
  if (!searchQuery.value.trim()) return orders.value
  const query = searchQuery.value.trim().toLowerCase()
  return orders.value.filter(order => 
    order.id.toString().includes(query) ||
    (order.userFullName && order.userFullName.toLowerCase().includes(query)) ||
    (order.paymentMethod && order.paymentMethod.toLowerCase().includes(query))
  )
})

const fetchAllOrders = async () => {
  isLoading.value = true
  try {
    const res = await orderApi.getAllOrdersForAdmin()
    let finalData = res.data !== undefined ? res.data : res
    if (finalData && finalData.data) finalData = finalData.data
    orders.value = Array.isArray(finalData) ? finalData : []
  } catch (error) {
    toast.error('Lỗi lấy danh sách đơn hàng!')
  } finally {
    isLoading.value = false
  }
}

const handleStatusChange = async (orderId, newStatus) => {
  isProcessing.value = true
  try {
    await orderApi.updateOrderStatus(orderId, newStatus)
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = newStatus
      toast.success(`Đã cập nhật đơn hàng #${orderId} thành công!`)
    }
  } catch (error) {
    toast.error('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại!')
  } finally {
    isProcessing.value = false
  }
}

// Gọi API Đối soát VNPAY
const verifyPayment = async (orderId) => {
  isProcessing.value = true
  try {
    // ĐÃ SỬA: Dùng orderApi thay vì gọi axios trực tiếp
    const res = await orderApi.checkVnpayTransaction(orderId)
    const transactions = res.data || res
    
    if (transactions && transactions.length > 0) {
      const latestTx = transactions[transactions.length - 1]
      if (latestTx.status === 'SUCCESS') {
        toast.success(`VNPAY THÀNH CÔNG!\nMã GD: ${latestTx.transactionNo}\nNgân hàng: ${latestTx.bankCode}`)
      } else {
        toast.warning(`Giao dịch THẤT BẠI (Mã lỗi: ${latestTx.status})`)
      }
    } else {
      toast.info('Đơn hàng này CHƯA có bất kỳ giao dịch nào ghi nhận từ VNPAY.')
    }
  } catch (error) {
    console.error('Lỗi API VNPAY:', error) // Bắn log ra console để dễ debug
    toast.error('Lỗi tra cứu giao dịch! Hãy xem Console (F12) để biết chi tiết.')
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => fetchAllOrders())

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
const formatDate = (dateString) => dateString ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateString)) : ''
const getStatusBadgeClass = (status) => {
  const classes = {
    'PENDING': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    'SHIPPING': 'bg-purple-50 text-purple-600 border border-purple-200',
    'DELIVERED': 'bg-green-50 text-green-600 border border-green-200',
    'CANCELLED': 'bg-red-50 text-red-600 border border-red-200'
  }
  return classes[status] || 'bg-gray-50 text-gray-600 border border-gray-200'
}
</script>

<template>
  <div class="space-y-8 relative">
    <LoadingOverlay :isLoading="isProcessing" />

    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex max-w-md">
      <div class="relative flex-1">
        <input v-model="searchQuery" type="text" placeholder="Tìm kiếm mã đơn, khách hàng..." class="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#82ae46]" />
        <Search class="absolute left-4 top-4 text-gray-400 w-5 h-5" />
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[300px]">
      <div v-if="isLoading" class="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
        <Loader2 class="w-8 h-8 text-[#82ae46] animate-spin" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-900 text-white text-xs font-black uppercase tracking-widest border-b border-gray-800">
              <th class="py-5 px-6 w-24 text-center">Mã Đơn</th>
              <th class="py-5 px-6">Khách hàng</th>
              <th class="py-5 px-6">Ngày đặt</th>
              <th class="py-5 px-6 text-right">Tổng thanh toán</th>
              <th class="py-5 px-6 text-center">Hình thức</th>
              <th class="py-5 px-6 text-center">Xử lý trạng thái</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm font-medium text-gray-700">
            <tr v-if="filteredOrders.length === 0 && !isLoading"><td colspan="6" class="py-12 text-center text-gray-400">Không tìm thấy đơn hàng nào.</td></tr>
            <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 px-6 text-center font-black text-gray-900 uppercase">#{{ order.id }}</td>
              <td class="py-4 px-6 font-bold text-gray-900">{{ order.userFullName }}</td>
              <td class="py-4 px-6 text-gray-400">{{ formatDate(order.createdAt) }}</td>
              <td class="py-4 px-6 text-right font-black text-green-600 text-base">{{ formatPrice(order.totalAmount) }}</td>
              <td class="py-4 px-6 text-center">
                <span class="text-xs font-bold block">{{ order.paymentMethod }}</span>
                <span class="text-[10px] font-bold uppercase tracking-wider" :class="order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-amber-500'">
                  ({{ order.paymentStatus === 'PAID' ? 'Đã thu' : 'Chưa thu' }})
                </span>
                <button v-if="order.paymentMethod === 'VNPAY'" @click="verifyPayment(order.id)" class="mt-2 text-[9px] bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded font-bold uppercase w-full">
                  Check VNPAY
                </button>
              </td>
              <td class="py-4 px-6 text-center">
                <select :value="order.status" @change="handleStatusChange(order.id, $event.target.value)" class="px-2 py-1 rounded outline-none" :class="getStatusBadgeClass(order.status)">
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="SHIPPING">Đang giao hàng</option> 
                  <option value="DELIVERED">Đã giao hàng</option>
                  <option value="CANCELLED">Đã hủy đơn</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>