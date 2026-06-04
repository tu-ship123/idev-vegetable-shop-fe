// src/api/cartApi.js
import axiosInstance from './apiClient'

export const cartApi = {
  getCart() {
    return axiosInstance.get('/cart')
  },
  
  addItem(productId, quantity) {
    return axiosInstance.post('/cart/items', { productId, quantity })
  },
  
  updateItemQty(cartItemId, quantity) {
    return axiosInstance.put(`/cart/items/${cartItemId}`, { quantity })
  },
  
  removeItem(cartItemId) {
    return axiosInstance.delete(`/cart/items/${cartItemId}`)
  },

  // ĐÃ THÊM: Gọi API áp dụng mã giảm giá của BE
  applyCoupon(code) {
    return axiosInstance.post('/cart/coupons/apply', { code })
  }
}