<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-vue-next'
import axiosInstance from '@/api/apiClient'
import { useToast } from 'vue-toastification'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

const toast = useToast()
const coupons = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const form = ref({
  id: null, code: '', discountPercentage: 0, discountAmount: 0, minOrderAmount: 0, expirationDate: '', isActive: true
})

const fetchCoupons = async () => {
  isLoading.value = true
  try {
    const res = await axiosInstance.get('/admin/coupons')
    let finalData = res.data !== undefined ? res.data : res
    if (finalData && finalData.data) finalData = finalData.data
    coupons.value = Array.isArray(finalData) ? finalData : []
  } catch (error) {
    toast.error('Lỗi tải danh sách mã giảm giá!')
  } finally {
    isLoading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  form.value = { id: null, code: '', discountPercentage: 0, discountAmount: 0, minOrderAmount: 0, expirationDate: '', isActive: true }
  showModal.value = true
}

const openEditModal = (coupon) => {
  isEditing.value = true
  form.value = { ...coupon }
  if(form.value.expirationDate) form.value.expirationDate = form.value.expirationDate.substring(0, 16) // Format date cho input datetime-local
  showModal.value = true
}

const saveCoupon = async () => {
  isSaving.value = true
  try {
    if (isEditing.value) {
      await axiosInstance.put(`/admin/coupons/${form.value.id}`, form.value)
      toast.success('Cập nhật mã giảm giá thành công!')
    } else {
      await axiosInstance.post('/admin/coupons', form.value)
      toast.success('Thêm mã giảm giá thành công!')
    }
    showModal.value = false
    fetchCoupons()
  } catch (error) {
    toast.error('Có lỗi xảy ra. Kiểm tra lại dữ liệu!')
  } finally {
    isSaving.value = false
  }
}

const deleteCoupon = async (id) => {
  if (!confirm('Xóa mã giảm giá này?')) return
  isSaving.value = true
  try {
    await axiosInstance.delete(`/admin/coupons/${id}`)
    toast.success('Xóa mã giảm giá thành công!')
    fetchCoupons()
  } catch (error) {
    toast.error('Lỗi khi xóa mã giảm giá!')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => fetchCoupons())
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
const formatDate = (date) => date ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date)) : ''
</script>

<template>
  <div class="space-y-8 relative">
    <LoadingOverlay :isLoading="isSaving" />
    
    <div class="flex justify-end bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <button @click="openAddModal" class="bg-gray-900 hover:bg-[#82ae46] text-white px-6 py-3.5 rounded-2xl font-bold text-sm uppercase flex items-center gap-2 transition-colors">
        <Plus :size="18" /> Thêm Mã (Coupon)
      </button>
    </div>

    <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative min-h-[300px]">
      <div v-if="isLoading" class="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
        <Loader2 class="w-8 h-8 text-[#82ae46] animate-spin" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-900 text-white text-xs font-black uppercase tracking-widest border-b border-gray-800">
              <th class="py-5 px-6">Mã (Code)</th>
              <th class="py-5 px-6 text-right">Giảm tiền</th>
              <th class="py-5 px-6 text-center">Giảm %</th>
              <th class="py-5 px-6 text-right">Đơn tối thiểu</th>
              <th class="py-5 px-6">Hạn dùng</th>
              <th class="py-5 px-6 text-center">Trạng thái</th>
              <th class="py-5 px-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm font-medium text-gray-700">
            <tr v-for="cp in coupons" :key="cp.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 px-6 font-black text-gray-900 uppercase tracking-wider">{{ cp.code }}</td>
              <td class="py-4 px-6 text-right font-bold text-green-600">{{ formatPrice(cp.discountAmount) }}</td>
              <td class="py-4 px-6 text-center font-bold">{{ cp.discountPercentage }}%</td>
              <td class="py-4 px-6 text-right">{{ formatPrice(cp.minOrderAmount) }}</td>
              <td class="py-4 px-6 text-gray-500 text-xs">{{ formatDate(cp.expirationDate) }}</td>
              <td class="py-4 px-6 text-center">
                <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase" :class="cp.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'">
                  {{ cp.isActive ? 'Hoạt động' : 'Đã khóa' }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(cp)" class="p-2 text-blue-500 hover:bg-blue-50 rounded-xl"><Edit2 :size="16" /></button>
                  <button @click="deleteCoupon(cp.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 :size="16" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-2xl rounded-[30px] p-8 relative">
        <button @click="showModal = false" class="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X class="w-6 h-6" /></button>
        <h3 class="text-2xl font-black text-gray-900 mb-6 uppercase">{{ isEditing ? 'Sửa Mã Giảm Giá' : 'Thêm Mã Mới' }}</h3>
        <form @submit.prevent="saveCoupon" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Mã Coupon (VD: SALE10)</label>
              <input v-model="form.code" required type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 uppercase focus:outline-none focus:border-[#82ae46]" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Đơn tối thiểu áp dụng</label>
              <input v-model.number="form.minOrderAmount" required type="number" min="0" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#82ae46]" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Giảm số tiền cố định (VNĐ)</label>
              <input v-model.number="form.discountAmount" type="number" min="0" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#82ae46]" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Hoặc Giảm theo %</label>
              <input v-model.number="form.discountPercentage" type="number" min="0" max="100" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#82ae46]" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Hạn sử dụng</label>
              <input v-model="form.expirationDate" required type="datetime-local" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#82ae46]" />
            </div>
          </div>
          <div class="pt-2 flex items-center gap-3">
            <input v-model="form.isActive" type="checkbox" id="isActiveCp" class="w-5 h-5 text-[#82ae46] rounded focus:ring-[#82ae46]" />
            <label for="isActiveCp" class="text-sm font-bold text-gray-700 cursor-pointer">Kích hoạt mã này</label>
          </div>
          <div class="pt-6">
            <button type="submit" :disabled="isSaving" class="w-full bg-[#82ae46] hover:bg-green-600 text-white py-4 rounded-xl font-bold uppercase transition-colors">Lưu thông tin</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>