import { defineStore } from 'pinia'
import { authApi } from '@/api/authApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: !!localStorage.getItem('access_token'),
    user: JSON.parse(localStorage.getItem('user_info')) || null,
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await authApi.login(credentials);
        
        // Cập nhật lại cách hứng dữ liệu cho khớp với AuthResponse.java
        const { token, email, fullName, role } = response;
        
        if (token) {
          // Gom thông tin lại thành 1 object user để dễ quản lý ở FE
          const userInfo = { email, fullName, role };
          
          localStorage.setItem('access_token', token);
          localStorage.setItem('user_info', JSON.stringify(userInfo));
          
          this.isLoggedIn = true;
          this.user = userInfo;
          return true;
        }
      } catch (error) {
        throw error;
      }
    },
    async register(userData) {
      try {
        await authApi.register(userData);
        return true;
      } catch (error) {
        throw error;
      }
    },

    // ==========================================
    // PHẦN THÊM MỚI: LUỒNG QUÊN MẬT KHẨU 2 BƯỚC
    // ==========================================
    async forgotPassword(payload) {
      try {
        // payload là object { email: '...' }
        await authApi.forgotPassword(payload);
        return true;
      } catch (error) {
        throw error;
      }
    },
    
    async resetPassword(payload) {
      try {
        // payload là object { email, otpCode, newPassword }
        await authApi.resetPassword(payload);
        return true;
      } catch (error) {
        throw error;
      }
    },
    // ==========================================

    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      this.isLoggedIn = false;
      this.user = null;
    }
  }
})