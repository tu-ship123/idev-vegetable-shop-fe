<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Eye, Search, Filter } from 'lucide-vue-next'

// Giả lập dữ liệu sản phẩm lấy từ ProductService của BE
const products = ref([
  { id: 1, name: 'Táo Mỹ Thượng Hạng', categoryName: 'Trái Cây', price: 89000, stockQty: 45, unit: 'Kg', isActive: true, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150' },
  { id: 2, name: 'Súp Lơ Xanh Đà Lạt', categoryName: 'Rau Củ', price: 35000, stockQty: 120, unit: 'Kg', isActive: true, imageUrl: 'https://images.unsplash.com/photo-1515471204579-47c067e31ff3?w=150' },
  { id: 3, name: 'Cà Rốt Hữu Cơ', categoryName: 'Rau Củ', price: 28000, stockQty: 0, unit: 'Bó', isActive: false, imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b996a6957b?w=150' },
])

const searchQuery = ref('')

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div class="relative flex-1 w-full max-w-md">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tìm kiếm sản phẩm theo tên..."
          class="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#82ae46] focus:ring-1 focus:ring-[#82ae46]"
        />
        <Search class="absolute left-4 top-4 text-gray-400 w-5 h-5" />
      </div>

      <button class="w-full sm:w-auto bg-gray-900 hover:bg-[#82ae46] text-white px-6 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gray-900/10">
        <Plus :size="18" /> Thêm sản phẩm
      </button>
    </div>

    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-900 text-white text-xs font-black uppercase tracking-widest border-b border-gray-800">
              <th class="py-5 px-6 w-20 text-center">Hình</th>
              <th class="py-5 px-6">Tên sản phẩm</th>
              <th class="py-5 px-6">Danh mục</th>
              <th class="py-5 px-6 text-right">Giá bán</th>
              <th class="py-5 px-6 text-center">Tồn kho</th>
              <th class="py-5 px-6 text-center">Trạng thái</th>
              <th class="py-5 px-6 w-32 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm font-medium text-gray-700">
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 px-6 text-center">
                <div class="w-12 h-12 bg-gray-50 rounded-xl border p-1 mx-auto flex items-center justify-center overflow-hidden">
                  <img :src="product.imageUrl" class="w-full h-full object-contain" />
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="font-bold text-gray-900 line-clamp-1">{{ product.name }}</span>
                <span class="text-xs text-gray-400 block mt-0.5">ID: #{{ product.id }}</span>
              </td>
              <td class="py-4 px-6">
                <span class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">{{ product.categoryName }}</span>
              </td>
              <td class="py-4 px-6 text-right font-black text-gray-900">
                {{ formatPrice(product.price) }} <span class="text-xs font-normal text-gray-400">/ {{ product.unit }}</span>
              </td>
              <td class="py-4 px-6 text-center font-bold">
                <span :class="product.stockQty > 0 ? 'text-gray-800' : 'text-red-500 font-black'">
                  {{ product.stockQty > 0 ? `${product.stockQty} ${product.unit}` : 'Hết hàng' }}
                </span>
              </td>
              <td class="py-4 px-6 text-center">
                <span class="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  :class="product.isActive ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'">
                  {{ product.isActive ? 'Kinh doanh' : 'Ngừng bán' }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center justify-center gap-2">
                  <button class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all" title="Xem chi tiết">
                    <Eye :size="16" />
                  </button>
                  <button class="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Sửa">
                    <Edit2 :size="16" />
                  </button>
                  <button class="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Xóa">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>