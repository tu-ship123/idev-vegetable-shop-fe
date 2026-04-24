import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Trang chủ | Cửa hàng Rau sạch' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Đăng nhập | Cửa hàng Rau sạch' }
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

// Tự động đổi title tab trình duyệt khi chuyển route
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Vegetable Shop'
  next()
})

export default router
