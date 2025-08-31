// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users',
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    USERS: '/api/users',
    DAILY_REPORTS: '/api/dailyreports',
    CREATE_DAILY_REPORT: '/api/dailyreports',
    MY_DAILY_REPORTS: '/api/dailyreports/my',
    SPORT_REPORTS: '/api/sportreports',
    CREATE_SPORT_REPORTS: '/api/sportreports',
    MY_SPORT_REPORTS: '/api/sportreports/my'
  },
  
  getUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,
};
