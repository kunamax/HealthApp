import { useState } from 'react';
import { authUtils } from '../utils/auth';
import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const apiCall = async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const headers = authUtils.getAuthHeaders();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        if (!authUtils.isAuthenticated()) {
          logout();
          throw new Error('Session expired. Please log in again.');
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return { success: true, data };
    } catch (err) {
      console.error('API call error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const get = (url) => apiCall(url);
  
  const post = (url, data) => apiCall(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  const put = (url, data) => apiCall(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  const del = (url) => apiCall(url, {
    method: 'DELETE',
  });

  return {
    loading,
    error,
    apiCall,
    get,
    post,
    put,
    delete: del,
  };
};

export const useProfile = () => {
  const { get, loading, error } = useApi();

  const fetchProfile = async () => {
    return await get('http://localhost:5000/api/users/profile');
  };

  return {
    fetchProfile,
    loading,
    error,
  };
};
