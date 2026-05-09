import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // Thêm dòng này
import { fileURLToPath, URL } from 'node:url' // Thêm dòng này

export default defineConfig({
  plugins: [vue(), tailwindcss(), ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // Định nghĩa @ trỏ vào thư mục src
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Trỏ đến máy chủ Spring Boot của bạn
        changeOrigin: true, // Cho phép đánh lừa BE rằng request đến từ cùng domain
        // Không cần rewrite vì BE của bạn cũng bắt đầu bằng /api
      }
    }
  }
})
