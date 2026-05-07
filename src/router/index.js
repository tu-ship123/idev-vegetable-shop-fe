import { createRouter, createWebHistory } from 'vue-router'

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
        component: () => import('@/views/HomeView.vue'),
        meta: { title: 'Giỏ hàng | Cửa hàng Rau sạch', requiresAuth: true, pageTitle: 'Giỏ hàng' }
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: 'Sản phẩm | Cửa hàng Rau sạch', pageTitle: 'Sản phẩm' }
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
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Đăng ký | Cửa hàng Rau sạch' }
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

// Navigation Guards bảo vệ điều hướng
router.beforeEach((to, from, next) => {
  // Đổi title tab trình duyệt
  document.title = to.meta.title || 'Vegetable Shop'
  
  // Kiểm tra quyền truy cập
  const isAuthenticated = !!localStorage.getItem('access_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
