// src/api/cartApi.js
import axiosInstance from './apiClient'

export const cartApi = {
  // Lấy giỏ hàng của user đang đăng nhập
  getCart() {
    return axiosInstance.get('/cart')
  },
  
  // Thêm sản phẩm vào giỏ
  addItem(productId, quantity) {
    return axiosInstance.post('/cart/items', { productId, quantity })
  },
  
  // Cập nhật số lượng
  updateItemQty(cartItemId, quantity) {
    return axiosInstance.put(`/cart/items/${cartItemId}`, { quantity })
  },
  
  // Xóa sản phẩm khỏi giỏ
  removeItem(cartItemId) {
    return axiosInstance.delete(`/cart/items/${cartItemId}`)
  },

  // ĐÃ SỬA: Nhận thêm totalAmount và gửi xuống Backend
  applyCoupon(code, totalAmount) {
    return axiosInstance.post('/cart/coupons/apply', { 
      code: code,
      totalAmount: totalAmount 
    })
  }
}