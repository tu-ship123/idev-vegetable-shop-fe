<script setup>
import { ref, onMounted } from 'vue'
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-vue-next'
// Import các module cốt lõi của Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar } from 'vue-chartjs'
import { adminApi } from '@/api/adminApi'

// Đăng ký các module biểu đồ
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

// ================= STATE DỮ LIỆU TRỐNG (Chờ API) =================
const stats = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalUsers: 0,
  totalProducts: 0
})

// Dữ liệu cho Biểu đồ Đường (Xu hướng doanh thu)
const revenueChartData = ref({
  labels: [],
  datasets: [{
    label: 'Doanh thu (VNĐ)',
    backgroundColor: '#82ae46',
    borderColor: '#82ae46',
    data: [],
    tension: 0.4,
    fill: false
  }]
})

// Dữ liệu cho Biểu đồ Cột (Số lượng đơn hàng)
const orderChartData = ref({
  labels: [],
  datasets: [{
    label: 'Số lượng đơn',
    backgroundColor: '#f59e0b',
    borderRadius: 6,
    data: []
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
}

// ================= GỌI API THẬT =================
onMounted(async () => {
  try {
    // 1. Giữ nguyên gọi API lấy stats (nếu nó vẫn lên số)
    const statRes = await adminApi.getDashboardStats()
    stats.value = statRes.data || statRes

    // 2. GỌI API CHART
    const chartRes = await adminApi.getChartData()
    let data = chartRes.data || chartRes 

    // NẾU BACKEND TRẢ VỀ DỮ LIỆU RỖNG (0 hoặc null), ta "bơm" dữ liệu giả để test UI
    if (!data.revenues || data.revenues.every(v => v == 0)) {
       console.warn("Backend trả về dữ liệu rỗng, đang dùng Mock Data để test UI...")
       data = {
         months: ["Tháng 1/2026", "Tháng 2/2026", "Tháng 3/2026", "Tháng 4/2026", "Tháng 5/2026", "Tháng 6/2026"],
         revenues: [500000, 1200000, 800000, 2000000, 1500000, 3000000],
         orderCounts: [2, 5, 3, 8, 6, 12]
       }
    }

    const { months, revenues, orderCounts } = data

    // 3. Gán dữ liệu vào biểu đồ
    revenueChartData.value = {
      labels: months,
      datasets: [{ ...revenueChartData.value.datasets[0], data: revenues }]
    }

    orderChartData.value = {
      labels: months,
      datasets: [{ ...orderChartData.value.datasets[0], data: orderCounts }]
    }
    
  } catch (error) {
    console.error('Lỗi tải dữ liệu Dashboard:', error)
  }
})
</script>

<template>
  <div class="space-y-8">
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng doanh thu</p>
          <h3 class="text-2xl font-black text-gray-900">{{ formatPrice(stats.totalRevenue) }}</h3>
        </div>
        <div class="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <DollarSign :size="24" />
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng đơn hàng</p>
          <h3 class="text-2xl font-black text-gray-900">{{ stats.totalOrders }} <span class="text-sm text-gray-400 font-medium">đơn</span></h3>
        </div>
        <div class="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <ShoppingBag :size="24" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Khách hàng</p>
          <h3 class="text-2xl font-black text-gray-900">{{ stats.totalUsers }} <span class="text-sm text-gray-400 font-medium">người</span></h3>
        </div>
        <div class="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Users :size="24" />
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sản phẩm</p>
          <h3 class="text-2xl font-black text-gray-900">{{ stats.totalProducts }} <span class="text-sm text-gray-400 font-medium">mặt hàng</span></h3>
        </div>
        <div class="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Package :size="24" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 class="text-lg font-black text-gray-900 mb-6 uppercase tracking-wider border-b border-gray-50 pb-4">Xu hướng doanh thu</h3>
        <div class="h-72 w-full">
          <Line :data="revenueChartData" :options="chartOptions" />
        </div>
      </div>

      <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 class="text-lg font-black text-gray-900 mb-6 uppercase tracking-wider border-b border-gray-50 pb-4">Thống kê đơn hàng</h3>
        <div class="h-72 w-full">
          <Bar :data="orderChartData" :options="chartOptions" />
        </div>
      </div>

    </div>
  </div>
</template>