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
        // Giả sử API trả về { token: '...', user: {...} }
        const { token, user } = response;
        
        if (token) {
          localStorage.setItem('access_token', token);
          localStorage.setItem('user_info', JSON.stringify(user || {}));
          this.isLoggedIn = true;
          this.user = user || {};
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
    async forgotPassword(email) {
      try {
        await authApi.forgotPassword(email);
        return true;
      } catch (error) {
        throw error;
      }
    },
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      this.isLoggedIn = false;
      this.user = null;
    }
  }
})