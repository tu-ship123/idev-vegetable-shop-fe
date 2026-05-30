<script setup>
import { ref, onMounted } from 'vue'
import { orderApi } from '@/api/orderApi'
import { Clock, Package, CheckCircle2, XCircle, FileText, Search } from 'lucide-vue-next'

const orders = ref([
  // Data mẫu khi chưa kết nối API, khi chạy thật sẽ bị đè bởi dữ liệu BE
  { id: 1, userFullName: 'Nguyễn Văn B', createdAt: '2026-05-30T09:00:00', totalAmount: 245000, paymentMethod: 'VNPAY', paymentStatus: 'PAID', status: 'PENDING' },
  { id: 2, userFullName: 'Trần Thị C', createdAt: '2026-05-29T14:30:00', totalAmount: 115000, paymentMethod: 'COD', paymentStatus: 'UNPAID', status: 'PROCESSING' }
])
const isLoading = ref(false)
const searchQuery = ref('')

const fetchAllOrders = async () => {
  isLoading.value = true
  try {
    const res = await orderApi.getAllOrdersForAdmin()
    orders.value = res.data || res
  } catch (error) {
    console.error('Lỗi lấy danh sách đơn hàng hệ thống:', error)
  } finally {
    isLoading.value = false
  }
}

// Hàm gọi API đổi trạng thái đơn hàng trực tiếp xuống DB
const handleStatusChange = async (orderId, newStatus) => {
  try {
    await orderApi.updateOrderStatus(orderId, newStatus)
    // Cập nhật cục bộ mảng orders để UI đổi màu nhãn lập tức mà không cần reload trang
    const order = orders.value.find(o => o.id === orderId)
    if (order) order.status = newStatus
  } catch (error) {
    alert('Không thể cập nhật trạng thái đơn hàng!')
  }
}

onMounted(() => {
  fetchAllOrders()
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateString))
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'PENDING': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
    'PROCESSING': 'bg-blue-50 text-blue-600 border border-blue-200',
    'SHIPPED': 'bg-purple-50 text-purple-600 border border-purple-200',
    'DELIVERED': 'bg-green-50 text-green-600 border border-green-200',
    'CANCELLED': 'bg-red-50 text-red-600 border border-red-200'
  }
  return classes[status] || 'bg-gray-50 text-gray-600 border border-gray-200'
}
</script>

<template>
  <div class="space-y-8">
    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex max-w-md">
      <div class="relative flex-1">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm kiếm mã đơn, tên khách hàng..."
          class="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#82ae46]"
        />
        <Search class="absolute left-4 top-4 text-gray-400 w-5 h-5" />
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
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
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 px-6 text-center font-black text-gray-900 uppercase">
                #{{ order.id }}
              </td>
              <td class="py-4 px-6 font-bold text-gray-900">
                {{ order.userFullName }}
              </td>
              <td class="py-4 px-6 text-gray-400">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="py-4 px-6 text-right font-black text-green-600 text-base">
                {{ formatPrice(order.totalAmount) }}
              </td>
              <td class="py-4 px-6 text-center">
                <span class="text-xs font-bold block">{{ order.paymentMethod }}</span>
                <span class="text-[10px] font-bold uppercase tracking-wider" :class="order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-amber-500'">
                  ({{ order.paymentStatus === 'PAID' ? 'Đã thu' : 'Chưa thu' }})
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <select 
                  :value="order.status"
                  @change="handleStatusChange(order.id, $event.target.value)"
                  class="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl outline-none border cursor-pointer transition-colors"
                  :class="getStatusBadgeClass(order.status)"
                >
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="PROCESSING">Đang chuẩn bị</option>
                  <option value="SHIPPED">Đang giao hàng</option>
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