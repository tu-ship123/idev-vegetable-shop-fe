import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' 
import { fileURLToPath, URL } from 'node:url' 

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) 
    }
  },
  server: {
    port: 5173, 
    proxy: {
      '/api': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
        // THÊM ĐOẠN CONFIGURE NÀY ĐỂ CAN THIỆP SÂU VÀO REQUEST
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Xóa header Origin để lừa Spring Boot đây là request nội bộ
            proxyReq.removeHeader('Origin')
          })
        }
      }
    }
  }
})