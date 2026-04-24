export const setupInterceptors = (apiClient) => {
  // 1. Chặn bắt luồng Request: Tự động đính kèm Token bảo mật
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config; 
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 2. Chặn bắt luồng Response: Chuyển đổi JSON & Kiểm soát lỗi máy chủ
  apiClient.interceptors.response.use(
    (response) => {
      // Tự động chuyển đổi dữ liệu chuẩn JSON, lược bỏ các lớp bọc thừa của Axios
      return response.data;
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        
        // Kiểm soát lỗi máy chủ thông minh
        switch (status) {
          case 400:
            console.error('Lỗi 400 (Bad Request) - Dữ liệu gửi lên không hợp lệ:', data);
            break;
          case 401:
            console.error('Lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ.');
            // TODO: Bổ sung logic xóa token cũ và đẩy về trang /login
            break;
          case 500:
            console.error('Lỗi 500 (Internal Server Error) - Lỗi từ phía hệ thống máy chủ.');
            break;
          default:
            console.error(`Lỗi ${status}:`, data);
        }
      } else if (error.request) {
        console.error('Không kết nối được đến máy chủ. Vui lòng kiểm tra mạng!');
      }
      
      return Promise.reject(error);
    }
  );
};