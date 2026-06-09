<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-vue-next'
import axiosInstance from '@/api/apiClient'
import { useToast } from 'vue-toastification'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

const toast = useToast()
const categories = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const form = ref({ id: null, name: '', description: '' })

const fetchCategories = async () => {
  isLoading.value = true
  try {
    const res = await axiosInstance.get('/categories') // API public lấy danh mục
    let finalData = res.data !== undefined ? res.data : res
    if (finalData && finalData.data) finalData = finalData.data
    categories.value = Array.isArray(finalData) ? finalData : []
  } catch (error) {
    toast.error('Lỗi tải danh sách danh mục!')
  } finally {
    isLoading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  form.value = { id: null, name: '', description: '' }
  showModal.value = true
}

const openEditModal = (cat) => {
  isEditing.value = true
  form.value = { ...cat }
  showModal.value = true
}

const saveCategory = async () => {
  isSaving.value = true
  try {
    if (isEditing.value) {
      await axiosInstance.put(`/admin/categories/${form.value.id}`, form.value)
      toast.success('Cập nhật danh mục thành công!')
    } else {
      await axiosInstance.post('/admin/categories', form.value)
      toast.success('Thêm danh mục thành công!')
    }
    showModal.value = false
    fetchCategories()
  } catch (error) {
    toast.error('Có lỗi xảy ra khi lưu dữ liệu!')
  } finally {
    isSaving.value = false
  }
}

const deleteCategory = async (id) => {
  if (!confirm('Xóa danh mục này?')) return
  isSaving.value = true
  try {
    await axiosInstance.delete(`/admin/categories/${id}`)
    toast.success('Xóa danh mục thành công!')
    fetchCategories()
  } catch (error) {
    toast.error('Không thể xóa. Danh mục này có thể đang chứa sản phẩm.')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => fetchCategories())
</script>

<template>
  <div class="space-y-8 relative">
    <LoadingOverlay :isLoading="isSaving" />
    
    <div class="flex justify-end bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <button @click="openAddModal" class="bg-gray-900 hover:bg-[#82ae46] text-white px-6 py-3.5 rounded-2xl font-bold text-sm uppercase flex items-center gap-2 transition-colors">
        <Plus :size="18" /> Thêm danh mục
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
              <th class="py-5 px-6 w-20 text-center">ID</th>
              <th class="py-5 px-6">Tên danh mục</th>
              <th class="py-5 px-6">Mô tả</th>
              <th class="py-5 px-6 w-32 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm font-medium text-gray-700">
            <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="py-4 px-6 text-center font-bold">#{{ cat.id }}</td>
              <td class="py-4 px-6 font-bold text-gray-900">{{ cat.name }}</td>
              <td class="py-4 px-6 text-gray-500">{{ cat.description }}</td>
              <td class="py-4 px-6">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openEditModal(cat)" class="p-2 text-blue-500 hover:bg-blue-50 rounded-xl"><Edit2 :size="16" /></button>
                  <button @click="deleteCategory(cat.id)" class="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 :size="16" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-md rounded-[30px] p-8 relative">
        <button @click="showModal = false" class="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X class="w-6 h-6" /></button>
        <h3 class="text-2xl font-black text-gray-900 mb-6 uppercase">{{ isEditing ? 'Sửa danh mục' : 'Thêm danh mục' }}</h3>
        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Tên danh mục</label>
            <input v-model="form.name" required type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#82ae46] focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Mô tả</label>
            <textarea v-model="form.description" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#82ae46] focus:outline-none"></textarea>
          </div>
          <div class="pt-4">
            <button type="submit" :disabled="isSaving" class="w-full bg-[#82ae46] hover:bg-green-600 text-white py-4 rounded-xl font-bold uppercase transition-colors">Lưu thông tin</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>