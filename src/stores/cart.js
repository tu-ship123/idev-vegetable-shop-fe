// src/stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api/cartApi'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref(JSON.parse(localStorage.getItem('cart_items')) || [])
  const dbCartId = ref(null)

  // Getters tính toán
  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))

  // ĐÃ SỬA: Đồng bộ tên biến 'access_token' khớp với auth.js
  const isLoggedIn = () => !!localStorage.getItem('access_token') || !!localStorage.getItem('token')

  // Lấy giỏ hàng từ Database
  const fetchDbCart = async () => {
    if (!isLoggedIn()) return
    try {
      const res = await cartApi.getCart()
      const cartData = res.data || res
      dbCartId.value = cartData.id
      
      items.value = (cartData.items || []).map(item => ({
        cartItemId: item.id, 
        product: {
          id: item.productId,
          name: item.productName,
          price: item.productPrice,
          image: item.productImageUrl
        },
        quantity: item.quantity
      }))
    } catch (error) {
      console.error('Lỗi tải giỏ hàng từ DB:', error)
    }
  }

  // Thêm vào giỏ
  const addToCart = async (product, quantity = 1) => {
    if (isLoggedIn()) {
      await cartApi.addItem(product.id, quantity)
      await fetchDbCart() // Refresh data từ BE
    } else {
      const existingItem = items.value.find(item => item.product.id === product.id)
      if (existingItem) existingItem.quantity += quantity
      else items.value.push({ product, quantity })
      localStorage.setItem('cart_items', JSON.stringify(items.value))
    }
  }

  // Xóa khỏi giỏ
  const removeFromCart = async (cartItemId, productId) => {
    if (isLoggedIn() && cartItemId) {
      await cartApi.removeItem(cartItemId)
      await fetchDbCart()
    } else {
      items.value = items.value.filter(item => item.product.id !== productId)
      localStorage.setItem('cart_items', JSON.stringify(items.value))
    }
  }

  // Cập nhật số lượng
  const updateQuantity = async (cartItemId, productId, quantity) => {
    if (quantity < 1) return
    if (isLoggedIn() && cartItemId) {
      await cartApi.updateItemQty(cartItemId, quantity)
      await fetchDbCart()
    } else {
      const item = items.value.find(item => item.product.id === productId)
      if (item) item.quantity = quantity
      localStorage.setItem('cart_items', JSON.stringify(items.value))
    }
  }

  // ĐÃ THÊM: Hàm xóa trắng giỏ hàng sau khi thanh toán thành công
  const clearCart = () => {
    items.value = []
    localStorage.removeItem('cart_items')
    // Không cần gọi API xóa DB vì Backend (OrderService) đã tự động dọn DB rồi
  }

  // Đồng bộ giỏ hàng khi vừa đăng nhập
  const syncCartToDb = async () => {
    if (!isLoggedIn()) return
    try {
      const localItems = JSON.parse(localStorage.getItem('cart_items')) || []
      for (const item of localItems) {
        await cartApi.addItem(item.product.id, item.quantity)
      }
      localStorage.removeItem('cart_items') 
      await fetchDbCart()
    } catch (error) {
      console.error('Lỗi đồng bộ giỏ hàng:', error)
    }
  }

  return { 
    items, totalItems, totalPrice, 
    addToCart, removeFromCart, updateQuantity, fetchDbCart, syncCartToDb,
    clearCart // Bắt buộc export hàm này ra cho CheckoutView gọi
  }
})