import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Import Pinia Auth Store

const routes = [
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
      }
    ]
  },
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

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Vegetable Shop'
  
  // SỬ DỤNG PINIA ĐỂ ĐỒNG BỘ TRẠNG THÁI ĐĂNG NHẬP
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isLoggedIn
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login') && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router