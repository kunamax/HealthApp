export const authUtils = {
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  },

  removeToken: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  },

  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  setUserInfo: (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  },

  getAuthHeaders: () => {
    const token = authUtils.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }
};

export const useAuthCheck = () => {
  const checkAuth = () => {
    if (!authUtils.isAuthenticated()) {
      authUtils.removeToken();
      window.location.href = '/login';
    }
  };

  return checkAuth;
};
