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
  }
}