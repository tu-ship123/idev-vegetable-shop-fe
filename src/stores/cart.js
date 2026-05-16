// src/stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { cartApi } from '@/api/cartApi'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref(JSON.parse(localStorage.getItem('cart_items')) || [])
  const dbCartId = ref(null)

  // Getters tính toán (Tương thích cả Offline lẫn DTO của Backend)
  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))

  // Hàm kiểm tra trạng thái đăng nhập (Có token là đã đăng nhập)
  const isLoggedIn = () => !!localStorage.getItem('token')

  // Lấy giỏ hàng từ Database và ép kiểu về giống LocalStorage để UI không bị lỗi
  const fetchDbCart = async () => {
    if (!isLoggedIn()) return
    try {
      const res = await cartApi.getCart()
      const cartData = res.data || res
      dbCartId.value = cartData.id
      
      // Map CartItemDTO của BE thành cấu trúc Frontend đang dùng
      items.value = (cartData.items || []).map(item => ({
        cartItemId: item.id, // ID sinh ra từ bảng cart_items của BE
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
      await fetchDbCart() // Refresh lại data mới nhất từ BE
    } else {
      // Offline mode
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
      // Offline mode
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
      // Offline mode
      const item = items.value.find(item => item.product.id === productId)
      if (item) item.quantity = quantity
      localStorage.setItem('cart_items', JSON.stringify(items.value))
    }
  }

  // 🚀 ĐỒNG BỘ: Chạy hàm này ngay sau khi người dùng Đăng nhập thành công!
  const syncCartToDb = async () => {
    if (!isLoggedIn()) return
    try {
      const localItems = JSON.parse(localStorage.getItem('cart_items')) || []
      // Bắn từng món trong LocalStorage lên Backend
      for (const item of localItems) {
        await cartApi.addItem(item.product.id, item.quantity)
      }
      // Xóa LocalStorage đi vì đã đẩy lên DB an toàn
      localStorage.removeItem('cart_items') 
      // Kéo giỏ hàng mới nhất về
      await fetchDbCart()
    } catch (error) {
      console.error('Lỗi đồng bộ giỏ hàng:', error)
    }
  }

  return { 
    items, totalItems, totalPrice, 
    addToCart, removeFromCart, updateQuantity, fetchDbCart, syncCartToDb 
  }
})