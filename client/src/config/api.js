// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000',
  ENDPOINTS: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users',
    PROFILE: '/api/users/profile',
    USERS: '/api/users',
  },
  
  getUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,
};
