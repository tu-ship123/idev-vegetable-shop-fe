import axios from 'axios'
import { setupInterceptors } from '../interceptors/axiosInterceptor'
// Bạn có thể xóa dòng import config nếu không dùng đến nữa
// import config from '../config'

const axiosInstance = axios.create({
  // ĐÃ SỬA: Gõ cứng đường dẫn tương đối để bắt buộc chạy qua Proxy của Vite
  baseURL: '/api/v1', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Thiết lập interceptors
setupInterceptors(axiosInstance)

export default axiosInstance