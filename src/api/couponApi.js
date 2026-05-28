// src/api/couponApi.js
import axiosInstance from './apiClient'

export const couponApi = {
  // Gửi mã giảm giá lên BE để kiểm tra tính hợp lệ và lấy mức giảm
  applyCoupon(code) {
    return axiosInstance.post('/cart/coupons/apply', { code })
  }
}