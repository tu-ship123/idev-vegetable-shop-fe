// src/api/orderApi.js
import axiosInstance from './apiClient'

export const orderApi = {
  // Gửi request đặt hàng (payload gồm shippingAddress, paymentMethod, note)
  checkout(data) {
    return axiosInstance.post('/orders/checkout', data)
  }
}