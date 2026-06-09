import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Import Pinia Auth Store
import { useCartStore } from '@/stores/cart' // Import Pinia Cart Store

const routes = [
  // ================= 1. ROUTE DÀNH CHO KHÁCH (USER) =================
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: 'Trang chủ | Cửa hàng Rau sạch', pageTitle: 'Bảng điều khiển' }
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('@/views/CartView.vue'),
        meta: { title: 'Giỏ hàng | Cửa hàng Rau sạch', pageTitle: 'Giỏ hàng' }
      },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('@/views/CheckoutView.vue'),
        meta: { title: 'Thanh toán | Cửa hàng Rau sạch', requiresAuth: true, pageTitle: 'Thanh toán' } 
      },
      {
        path: 'payment-result',
        name: 'payment-result',
        component: () => import('@/views/PaymentResultView.vue'),
        meta: { title: 'Kết quả thanh toán | Cửa hàng Rau sạch' }
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/ProductsView.vue'),
        meta: { title: 'Sản phẩm | Cửa hàng Rau sạch', pageTitle: 'Sản phẩm' }
      },
      {
        path: 'products/:id',
        name: 'product-detail',
        component: () => import('@/views/ProductDetailView.vue'),
        meta: { title: 'Chi tiết sản phẩm | Cửa hàng Rau sạch', pageTitle: 'Chi tiết sản phẩm' }
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/OrderHistoryView.vue'),
        meta: { title: 'Lịch sử mua hàng | Cửa hàng Rau sạch', requiresAuth: true, pageTitle: 'Lịch sử mua hàng' }
      }
    ]
  },

  // ================= 2. ROUTE DÀNH CHO ADMIN =================
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }, // BẮT BUỘC PHẢI LÀ ADMIN
    children: [
      { 
        path: '', 
        name: 'admin-dashboard', 
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: { title: 'Thống kê | Admin', pageTitle: 'Tổng quan hệ thống' } 
      },
      { 
        path: 'products', 
        name: 'admin-products', 
        component: () => import('@/views/admin/ProductManageView.vue'),
        meta: { title: 'Quản lý Sản phẩm | Admin', pageTitle: 'Quản lý Sản phẩm' } 
      },
      { 
        path: 'orders', 
        name: 'admin-orders', 
        component: () => import('@/views/admin/OrderManageView.vue'),
        meta: { title: 'Quản lý Đơn hàng | Admin', pageTitle: 'Quản lý Đơn hàng' } 
      },
      // ĐÃ THÊM: Route quản lý danh mục
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('@/views/admin/CategoryManageView.vue'),
        meta: { title: 'Quản lý Danh mục | Admin', pageTitle: 'Quản lý Danh mục' }
      },
      // ĐÃ THÊM: Route quản lý mã giảm giá
      {
        path: 'coupons',
        name: 'admin-coupons',
        component: () => import('@/views/admin/CouponManageView.vue'),
        meta: { title: 'Quản lý Mã giảm giá | Admin', pageTitle: 'Quản lý Mã giảm giá' }
      }
    ]
  },

  // ================= 3. ROUTE CHUNG (AUTH & ERROR) =================
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Đăng nhập | Cửa hàng Rau sạch' }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: { title: 'Quên mật khẩu | Cửa hàng Rau sạch' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error',
    component: () => import('@/views/ErrorView.vue'),
    meta: { title: '404 - Không tìm thấy trang' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// ================= BỨC TƯỜNG LỬA (ROUTER GUARD) =================
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Vegetable Shop'
  
  // Sử dụng Pinia để đồng bộ trạng thái đăng nhập
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isLoggedIn
  const isAdmin = authStore.user?.role === 'ADMIN' // Kiểm tra role của User
  
  // 1. Chặn nếu trang yêu cầu đăng nhập mà khách chưa đăng nhập
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // 2. Chặn nếu trang yêu cầu quyền Admin mà tài khoản đang đăng nhập chỉ là User
  else if (to.meta.requiresAdmin && !isAdmin) {
    alert('Truy cập bị từ chối! Bạn không có quyền quản trị viên.')
    next({ name: 'home' }) // Đá về trang chủ
  }
  // 3. Chặn không cho vào checkout khi giỏ hàng trống
  else if (to.name === 'checkout') {
    const cartStore = useCartStore()
    if (cartStore.items.length === 0) {
      next({ name: 'products' }) 
    } else {
      next()
    }
  } 
  // 4. Đã đăng nhập thì không cho vào trang Login nữa
  else if ((to.name === 'login') && isAuthenticated) {
    next({ name: 'home' })
  } 
  // 5. Hợp lệ hết thì cho đi tiếp
  else {
    next()
  }
})

export default router