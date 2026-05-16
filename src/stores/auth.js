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
        const { token, email, fullName, role } = response;
        
        if (token) {
          const userInfo = { email, fullName, role };
          localStorage.setItem('access_token', token);
          localStorage.setItem('user_info', JSON.stringify(userInfo));
          
          this.isLoggedIn = true;
          this.user = userInfo;
          return true;
        }
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        throw error; 
      }
    },

    async register(userData) {
      try {
        await authApi.register(userData);
        return true;
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        throw error;
      }
    },

    async forgotPassword(payload) {
      try {
        await authApi.forgotPassword(payload);
        return true;
      } catch (error) {
        console.error("Lỗi gửi yêu cầu quên mật khẩu:", error);
        throw error;
      }
    },
    
    async resetPassword(payload) {
      try {
        await authApi.resetPassword(payload);
        return true;
      } catch (error) {
        console.error("Lỗi đặt lại mật khẩu:", error);
        throw error;
      }
    },

    // ĐÃ SỬA: Gọi API logout trước khi xóa LocalStorage
    async logout() {
      try {
        if (this.isLoggedIn) {
          await authApi.logout();
        }
      } catch (error) {
        console.error("Lỗi khi gọi API đăng xuất:", error);
      } finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
        this.isLoggedIn = false;
        this.user = null;
      }
    }
  }
})