import axios from 'axios'
import { setupInterceptors } from '../interceptors/axiosInterceptor'
import config from '../config'

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Thiết lập interceptors
setupInterceptors(axiosInstance)

export default axiosInstance
