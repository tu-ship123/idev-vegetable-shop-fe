// src/api/adminApi.js
import axiosInstance from './apiClient'

export const adminApi = {
  // Lấy các chỉ số tổng quan (Tổng doanh thu, Số đơn, Số user...)
  getDashboardStats() {
    return axiosInstance.get('/admin/stats')
  },
  
  // Lấy mảng dữ liệu để vẽ biểu đồ theo tháng
  getChartData() {
    return axiosInstance.get('/admin/charts')
  }
}