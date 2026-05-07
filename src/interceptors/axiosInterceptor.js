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
            console.error('Lỗi 400 (Bad Request):', data);
            alert(data.message || 'Dữ liệu không hợp lệ hoặc tài khoản đã tồn tại!');
            break;
          case 401:
            console.error('Lỗi 401 (Unauthorized) - Token hết hạn hoặc sai mật khẩu.');
            alert('Phiên đăng nhập hết hạn hoặc sai thông tin. Vui lòng đăng nhập lại.');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_info');
            window.location.href = '/login';
            break;
          case 403:
            console.error('Lỗi 403 (Forbidden) - Bạn không có quyền truy cập tài nguyên này.');
            alert('Bạn không có quyền truy cập!');
            break;
          case 404:
            console.error('Lỗi 404 (Not Found) - Tài nguyên yêu cầu không tồn tại.');
            break;
          case 500:
            console.error('Lỗi 500 (Internal Server Error) - Lỗi từ phía hệ thống máy chủ.');
            alert('Lỗi hệ thống máy chủ, vui lòng thử lại sau.');
            break;
          case 503:
            console.error('Lỗi 503 (Service Unavailable) - Máy chủ đang bảo trì hoặc quá tải.');
            break;
          case 504:
            console.error('Lỗi 504 (Gateway Timeout) - Máy chủ không phản hồi kịp thời.');
            break;
          default:
            console.error(`Lỗi ${status}:`, data);
        }
      } else if (error.request) {
        console.error('Không kết nối được đến máy chủ. Vui lòng kiểm tra mạng!');
        alert('Không kết nối được máy chủ, vui lòng kiểm tra mạng!');
      }
      
      return Promise.reject(error);
    }
  );
};