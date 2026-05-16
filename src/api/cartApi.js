// src/api/cartApi.js
import axiosInstance from './apiClient'

export const cartApi = {
  // Lấy giỏ hàng của user đang đăng nhập
  getCart() {
    return axiosInstance.get('/cart')
  },
  
  // Thêm sản phẩm vào giỏ (Khớp với AddToCartRequest của BE)
  addItem(productId, quantity) {
    return axiosInstance.post('/cart/items', { productId, quantity })
  },
  
  // Cập nhật số lượng (Sử dụng ID của CartItem)
  updateItemQty(cartItemId, quantity) {
    return axiosInstance.put(`/cart/items/${cartItemId}`, { quantity })
  },
  
  // Xóa sản phẩm khỏi giỏ (Sử dụng ID của CartItem)
  removeItem(cartItemId) {
    return axiosInstance.delete(`/cart/items/${cartItemId}`)
  }
}