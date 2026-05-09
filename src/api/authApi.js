// Giả định bạn đang export apiClient đã cấu hình interceptors từ một file gốc
// Ví dụ: import apiClient từ file 'axiosClient.js' chứa hàm setupInterceptors
import apiClient from './apiClient'; 

const API_URL = '/v1/auth';

export const authApi = {
  /**
   * Đăng nhập
   * @param {Object} credentials - { email, password }
   */
  login: (credentials) => {
    return apiClient.post(`${API_URL}/login`, credentials);
  },

  /**
   * Đăng ký tài khoản
   * @param {Object} userData - { fullName, email, password }
   */
  register: (userData) => {
    return apiClient.post(`${API_URL}/register`, userData);
  },

  /**
   * Gửi yêu cầu quên mật khẩu (Nhận OTP)
   * @param {Object} data - { email }
   */
  forgotPassword: (data) => {
    return apiClient.post(`${API_URL}/forgot-password`, data);
  },

  /**
   * Đặt lại mật khẩu mới bằng mã OTP
   * @param {Object} data - { email, otpCode, newPassword }
   */
  resetPassword: (data) => {
    return apiClient.post(`${API_URL}/reset-password`, data);
  },

  /**
   * Đăng xuất phía Server (Tùy chọn gọi nếu BE yêu cầu xử lý thêm)
   */
  logout: () => {
    return apiClient.post(`${API_URL}/logout`);
  }
};