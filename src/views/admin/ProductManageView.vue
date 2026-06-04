<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Eye, Search, Loader2, X } from 'lucide-vue-next'
import axiosInstance from '@/api/apiClient'

const products = ref([])
const isLoading = ref(true)
const searchQuery = ref('')

// ================= STATE CHO MODAL THÊM/SỬA =================
const showModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const productForm = ref({
  id: null,
  name: '',
  categoryId: 1, // Mặc định ID danh mục
  price: 0,
  unit: 'Kg',
  stockQty: 0,
  imageUrl: '',
  isActive: true
})

// ================= TIỆN ÍCH =================
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
}

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/150x150/f9fafb/a1a1aa?text=No+Image'
}

// ================= API: LẤY DANH SÁCH =================
const fetchProducts = async () => {
  isLoading.value = true
  try {
    const res = await axiosInstance.get('/products', {
      params: { page: 0, size: 50, sort: 'desc' }
    })
    
    // BÍ QUYẾT LÀ Ở ĐÂY: Nếu res.data bị undefined do interceptor, ta lấy thẳng biến res
    let finalData = res.data !== undefined ? res.data : res
    
    // Nếu BE tiếp tục bọc trong một class chung (ví dụ ApiResponse)
    if (finalData && finalData.data) {
      finalData = finalData.data
    }
    
    // Nếu BE trả về đối tượng phân trang Page<ProductDTO> của Spring Boot
    if (finalData && finalData.content) {
      finalData = finalData.content
    }
    
    // Kiểm tra chốt hạ và gán vào UI
    if (Array.isArray(finalData)) {
      products.value = finalData
    } else {
      console.warn("Dữ liệu cuối cùng không phải mảng:", finalData)
      products.value = []
    }
    
  } catch (error) {
    console.error('Lỗi tải danh sách sản phẩm:', error)
  } finally {
    isLoading.value = false
  }
}

// ================= API: THÊM & SỬA =================
const openAddModal = () => {
  isEditing.value = false
  productForm.value = { id: null, name: '', categoryId: 1, price: 0, unit: 'Kg', stockQty: 0, imageUrl: '', isActive: true }
  showModal.value = true
}

const openEditModal = (product) => {
  isEditing.value = true
  // Copy dữ liệu sản phẩm vào form
  productForm.value = { ...product, categoryId: product.categoryId || 1 }
  showModal.value = true
}

const saveProduct = async () => {
  isSaving.value = true
  try {
    if (isEditing.value) {
      // Gọi API Sửa (Theo AdminController)
      await axiosInstance.put(`/admin/products/${productForm.value.id}`, productForm.value)
      alert('Cập nhật sản phẩm thành công!')
    } else {
      // Gọi API Thêm (Theo AdminController)
      await axiosInstance.post('/admin/products', productForm.value)
      alert('Thêm sản phẩm thành công!')
    }
    showModal.value = false
    fetchProducts() // Tải lại danh sách
  } catch (error) {
    console.error('Lỗi khi lưu sản phẩm:', error)
    alert('Có lỗi xảy ra khi lưu dữ liệu!')
  } finally {
    isSaving.value = false
  }
}

// ================= API: XÓA =================
const deleteProduct = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.')) return
  
  try {
    await axiosInstance.delete(`/admin/products/${id}`)
    alert('Xóa sản phẩm thành công!')
    fetchProducts() // Tải lại danh sách sau khi xóa
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error)
    alert('Không thể xóa sản phẩm. Có thể do sản phẩm đang có đơn hàng.')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="space-y-8 relative">
    
    <!-- HEADER -->
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

      <button @click="openAddModal" class="w-full sm:w-auto bg-gray-900 hover:bg-[#82ae46] text-white px-6 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gray-900/10">
        <Plus :size="18" /> Thêm sản phẩm
      </button>
    </div>

    <!-- BẢNG SẢN PHẨM -->
    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[300px]">
      
      <div v-if="isLoading" class="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
        <Loader2 class="w-8 h-8 text-[#82ae46] animate-spin" />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-900 text-white text-xs font-black uppercase tracking-widest border-b border-gray-800">
              <th class="py-5 px-6 w-20 text-center">Hình</th>
              <th class="py-5 px-6">Tên sản phẩm</th>
              <th class="py-5 px-6 text-center">Danh mục</th>
              <th class="py-5 px-6 text-right">Giá bán</th>
              <th class="py-5 px-6 text-center">Tồn kho</th>
              <th class="py-5 px-6 text-center">Trạng thái</th>
              <th class="py-5 px-6 w-32 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm font-medium text-gray-700">
            <tr v-if="products.length === 0 && !isLoading">
              <td colspan="7" class="py-12 text-center text-gray-400">Không có sản phẩm nào.</td>
            </tr>
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 px-6 text-center">
                <div class="w-12 h-12 bg-gray-50 rounded-xl border p-1 mx-auto flex items-center justify-center overflow-hidden">
                  <img :src="product.imageUrl || 'https://placehold.co/150x150/f9fafb/a1a1aa?text=No+Image'" @error="handleImageError" class="w-full h-full object-contain" />
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="font-bold text-gray-900 line-clamp-1">{{ product.name }}</span>
                <span class="text-xs text-gray-400 block mt-0.5">ID: #{{ product.id }}</span>
              </td>
              <td class="py-4 px-6 text-center">
                <span class="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {{ product.categoryName || `DM ${product.categoryId}` || 'Khác' }}
                </span>
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
                  <button @click="openEditModal(product)" class="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Sửa">
                    <Edit2 :size="16" />
                  </button>
                  <button @click="deleteProduct(product.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Xóa">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================= MODAL THÊM / SỬA ================= -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-2xl rounded-[30px] p-8 relative">
        <button @click="showModal = false" class="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
          <X class="w-6 h-6" />
        </button>

        <h3 class="text-2xl font-black text-gray-900 mb-6 uppercase tracking-wider">
          {{ isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới' }}
        </h3>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Tên sản phẩm -->
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tên sản phẩm</label>
              <input v-model="productForm.name" required type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#82ae46]" placeholder="Vd: Táo Mỹ..." />
            </div>

            <!-- Giá & Số lượng -->
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Giá bán (VNĐ)</label>
              <input v-model.number="productForm.price" required type="number" min="0" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#82ae46]" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tồn kho</label>
              <input v-model.number="productForm.stockQty" required type="number" min="0" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#82ae46]" />
            </div>

            <!-- Đơn vị & ID Danh mục -->
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Đơn vị (Kg, Hộp...)</label>
              <input v-model="productForm.unit" required type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#82ae46]" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">ID Danh mục</label>
              <input v-model.number="productForm.categoryId" required type="number" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#82ae46]" placeholder="1, 2, 3..." />
            </div>

            <!-- Link Ảnh -->
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Link Ảnh (URL)</label>
              <input v-model="productForm.imageUrl" type="url" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#82ae46]" placeholder="https://..." />
            </div>
          </div>

          <!-- Trạng thái -->
          <div class="pt-2 flex items-center gap-3">
            <input v-model="productForm.isActive" type="checkbox" id="isActive" class="w-5 h-5 text-[#82ae46] border-gray-300 rounded focus:ring-[#82ae46]" />
            <label for="isActive" class="text-sm font-bold text-gray-700 cursor-pointer">Đang kinh doanh (Hiển thị cho khách hàng)</label>
          </div>

          <div class="pt-6 border-t border-gray-100 flex gap-4">
            <button type="submit" :disabled="isSaving" class="flex-1 bg-[#82ae46] hover:bg-green-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-colors flex justify-center items-center">
              <Loader2 v-if="isSaving" class="w-5 h-5 animate-spin" />
              <span v-else>Lưu thông tin</span>
            </button>
            <button type="button" @click="showModal = false" class="px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold uppercase tracking-widest transition-colors">
              Hủy
            </button>
          </div>
        </form>

      </div>
    </div>

  </div>
</template>