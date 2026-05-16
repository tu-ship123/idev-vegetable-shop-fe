// src/api/paymentApi.js
import axiosInstance from './apiClient'

export const paymentApi = {
  // Gọi lên BE để tạo URL chuyển hướng sang VNPay
  createVnPayUrl(orderId) {
    return axiosInstance.post('/payments/vnpay/create-url', { orderId })
  },
  
  // Gọi lên BE để xác minh chữ ký (checksum) khi từ VNPay quay về
  verifyReturn(queryString) {
    return axiosInstance.get(`/payments/vnpay/return${queryString}`)
  }
}