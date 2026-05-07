import apiClient from './apiClient'

export const authApi = {
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },
  register(userData) {
    return apiClient.post('/auth/register', userData)
  },
  forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email })
  }
}
