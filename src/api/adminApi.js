// src/api/adminApi.js
import axiosInstance from './apiClient'

export const adminApi = {
  // ĐÃ SỬA: Khớp với đường dẫn trong AdminController
  getDashboardStats() {
    return axiosInstance.get('/admin/dashboard/stats')
  },
  
  // API này BE chưa làm, cứ để tạm đây
  getChartData() {
    return axiosInstance.get('/admin/dashboard/charts')
  }
}