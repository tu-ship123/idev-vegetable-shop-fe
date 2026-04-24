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
  }
})
