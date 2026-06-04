// src/api/orderApi.js
import axiosInstance from './apiClient'

export const orderApi = {
  checkout(data) {
    return axiosInstance.post('/orders/checkout', data)
  },
  
  getMyOrders() {
    return axiosInstance.get('/orders/my-orders') 
  },

  // ĐÃ SỬA: Khớp với ReviewController của BE
  submitReview(payload) {
    // payload gồm { productId, rating, comment }
    return axiosInstance.post('/reviews', payload)
  },

  // ĐÃ SỬA: Khớp với AdminController của BE
  getAllOrdersForAdmin() {
    return axiosInstance.get('/admin/orders') 
  },

  // ĐÃ SỬA: Dùng PATCH và truyền Params theo đúng AdminController
  updateOrderStatus(orderId, status) {
    return axiosInstance.patch(`/admin/orders/${orderId}/status`, null, { 
      params: { status } 
    })
  }
}