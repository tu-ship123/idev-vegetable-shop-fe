import axiosInstance from './apiClient'

export const productApi = {
  // Lấy danh sách danh mục
  getCategories() {
    return axiosInstance.get('/categories')
  },

  // Lấy danh sách sản phẩm với lọc và phân trang
  getProducts(params) {
    return axiosInstance.get('/products', { params })
  },

  // Lấy chi tiết sản phẩm
  getProductById(id) {
    return axiosInstance.get(`/products/${id}`)
  },

  // Lấy sản phẩm nổi bật cho trang chủ (lấy 4 SP mới nhất)
  getFeaturedProducts() {
    return axiosInstance.get('/products/featured')
  }
}