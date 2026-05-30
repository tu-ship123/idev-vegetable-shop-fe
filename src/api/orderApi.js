// src/api/orderApi.js
import axiosInstance from './apiClient'

export const orderApi = {
  // Gửi request đặt hàng (payload gồm shippingAddress, paymentMethod, note)
  checkout(data) {
    return axiosInstance.post('/orders/checkout', data)
  },

  // ĐÃ THÊM: Lấy danh sách lịch sử đơn hàng của user đang đăng nhập
  getMyOrders() {
    return axiosInstance.get('/orders') 
  },

  // ĐÃ THÊM: Gửi đánh giá cho 1 sản phẩm
  submitReview(productId, payload) {
    return axiosInstance.post(`/products/${productId}/reviews`, payload)
  }, // <--- THÊM DẤU PHẨY Ở ĐÂY NÀY!

  // ĐÃ THÊM: Admin lấy TẤT CẢ đơn hàng hệ thống
  getAllOrdersForAdmin() {
    return axiosInstance.get('/orders/admin') 
  },

  // ĐÃ THÊM: Admin cập nhật trạng thái đơn (PENDING -> PROCESSING -> SHIPPED...)
  updateOrderStatus(orderId, status) {
    return axiosInstance.put(`/orders/${orderId}/status`, { status })
  }
}