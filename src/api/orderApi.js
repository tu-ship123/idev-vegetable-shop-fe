// src/api/orderApi.js
import axiosInstance from './apiClient'

export const orderApi = {
  checkout(data) {
    return axiosInstance.post('/orders/checkout', data)
  },
  
  getMyOrders() {
    return axiosInstance.get('/orders/my-orders') 
  },

  submitReview(payload) {
    return axiosInstance.post('/reviews', payload)
  },

  getAllOrdersForAdmin() {
    return axiosInstance.get('/admin/orders') 
  },

  updateOrderStatus(orderId, status) {
    return axiosInstance.patch(`/admin/orders/${orderId}/status`, null, { 
      params: { status } 
    })
  },

  checkVnpayTransaction(orderId) {
    return axiosInstance.get(`/admin/payments/transactions/order/${orderId}`)
  }
}