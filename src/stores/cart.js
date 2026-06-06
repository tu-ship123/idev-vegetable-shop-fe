// src/stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api/cartApi'

export const useCartStore = defineStore('cart', () => {
  // State cơ bản
  const items = ref(JSON.parse(localStorage.getItem('cart_items')) || [])
  const dbCartId = ref(null)

  // ================= THÊM STATE CHO MÃ GIẢM GIÁ =================
  const appliedCoupon = ref(null)
  const couponError = ref('')
  const isApplyingCoupon = ref(false)

  // ================= GETTERS TÍNH TIỀN REAL-TIME =================
  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  
  // Tạm tính (Giữ nguyên tên totalPrice để không hỏng code cũ của bạn)
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))
  const subTotal = computed(() => totalPrice.value)

  // ĐÃ SỬA: Tính số tiền được giảm khớp với cấu trúc ApplyCouponResponse của Backend
  const discountAmount = computed(() => {
    if (!appliedCoupon.value) return 0
    // Nếu BE trả về giảm theo phần trăm
    if (appliedCoupon.value.discountPercentage && appliedCoupon.value.discountPercentage > 0) {
      return (subTotal.value * appliedCoupon.value.discountPercentage) / 100
    }
    // Nếu BE trả về giảm số tiền cố định
    return appliedCoupon.value.discountAmount || 0
  })

  // Tổng tiền cuối cùng phải trả
  const finalTotal = computed(() => {
    const total = subTotal.value - discountAmount.value
    return total > 0 ? total : 0
  })

  const isLoggedIn = () => !!localStorage.getItem('access_token') || !!localStorage.getItem('token')

  const fetchDbCart = async () => {
    if (!isLoggedIn()) return
    try {
      const res = await cartApi.getCart()
      const cartData = res.data || res
      dbCartId.value = cartData.id
      items.value = (cartData.items || []).map(item => ({
        cartItemId: item.id, 
        product: {
          id: item.productId, name: item.productName, price: item.productPrice, image: item.productImageUrl
        },
        quantity: item.quantity
      }))
    } catch (error) {
      console.error('Lỗi tải giỏ hàng từ DB:', error)
    }
  }

  const addToCart = async (product, quantity = 1) => {
    if (isLoggedIn()) {
      await cartApi.addItem(product.id, quantity)
      await fetchDbCart()
    } else {
      const existingItem = items.value.find(item => item.product.id === product.id)
      if (existingItem) existingItem.quantity += quantity
      else items.value.push({ product, quantity })
      localStorage.setItem('cart_items', JSON.stringify(items.value))
    }
  }

  const removeFromCart = async (cartItemId, productId) => {
    if (isLoggedIn() && cartItemId) {
      await cartApi.removeItem(cartItemId)
      await fetchDbCart()
    } else {
      items.value = items.value.filter(item => item.product.id !== productId)
      localStorage.setItem('cart_items', JSON.stringify(items.value))
    }
  }

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

  // ================= HÀM XỬ LÝ MÃ GIẢM GIÁ =================
  const applyCouponCode = async (code) => {
    if (!code) {
      couponError.value = 'Vui lòng nhập mã giảm giá'
      return false
    }
    isApplyingCoupon.value = true
    couponError.value = ''
    try {
      // ĐÃ SỬA: Gọi từ cartApi và truyền thêm tổng tiền (subTotal.value)
      const response = await cartApi.applyCoupon(code, subTotal.value)
      appliedCoupon.value = response.data || response
      return true
    } catch (error) {
      appliedCoupon.value = null
      couponError.value = error.response?.data?.message || 'Mã giảm giá không hợp lệ hoặc chưa đạt điều kiện'
      return false
    } finally {
      isApplyingCoupon.value = false
    }
  }

  const removeCoupon = () => {
    appliedCoupon.value = null
    couponError.value = ''
  }

  const clearCart = () => {
    items.value = []
    localStorage.removeItem('cart_items')
    removeCoupon() // Xóa sạch mã giảm giá khi thanh toán xong
  }

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
    items, totalItems, totalPrice, subTotal, discountAmount, finalTotal, // Các biến số liệu
    appliedCoupon, couponError, isApplyingCoupon, // Các biến trạng thái Coupon
    addToCart, removeFromCart, updateQuantity, fetchDbCart, syncCartToDb, clearCart,
    applyCouponCode, removeCoupon // Hàm action
  }
})