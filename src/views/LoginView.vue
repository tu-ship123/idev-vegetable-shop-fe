<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = () => {
  // Giả lập đăng nhập thành công
  authStore.login({ name: 'Khách hàng', role: 'USER' })
  router.push('/')
}
</script>

<template>
  <main class="login">
    <h2>Đăng nhập</h2>
    <button @click="handleLogin">Đăng nhập ngay</button>
  </main>
</template>