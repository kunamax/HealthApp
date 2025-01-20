import React, { createContext, useContext, useState, useEffect } from 'react';
import { authUtils } from '../utils/auth';
import { API_CONFIG } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = authUtils.isAuthenticated();
      const userInfo = authUtils.getUserInfo();
      
      setIsAuthenticated(authenticated);
      setUser(userInfo);
      setLoading(false);

      if (!authenticated && userInfo) {
        authUtils.removeToken();
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (!data.token || !data.user) {
          throw new Error('Invalid response format from server');
        }
        
        authUtils.setToken(data.token);
        authUtils.setUserInfo(data.user);
        
        setIsAuthenticated(true);
        setUser(data.user);
        
        return { success: true, user: data.user };
      } else {
        let errorMessage = 'Nieprawidłowe dane logowania';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.title || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Błąd połączenia z serwerem' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, user: data };
      } else {
        let errorMessage = 'Wystąpił błąd podczas rejestracji';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Błąd połączenia z serwerem' 
      };
    }
  };

  const logout = () => {
    authUtils.removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    authUtils.setUserInfo(updatedUserData);
    setUser(updatedUserData);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
