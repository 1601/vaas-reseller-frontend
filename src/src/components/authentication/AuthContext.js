import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
import jwtDecode from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import intervalManager from '../intervalManager';

const AuthContext = createContext();
const ls = new SecureLS({ encodingType: 'aes' });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [newLoginDialogOpen, setNewLoginDialogOpen] = useState(false);
  const [tokenExpiredDialogOpen, setTokenExpiredDialogOpen] = useState(false);
  const { setTrackedInterval, clearAllIntervals } = intervalManager();
  const location = useLocation();
  let isCheckingTokenExpiration = false;
  let intervalId;

  const checkTokenExpiration = async () => {
    const storedToken = ls.get('token');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        if (decodedToken.exp * 1000 < Date.now()) {
          setTokenExpired(true);
          setTokenExpiredDialogOpen(true);
          clearAllIntervals(intervalId);
        } else {
          const isValid = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/verify-token`, {
            token: storedToken,
          });
          if (!isValid.data.isValid) {
            setTokenExpired(true);
            setTokenExpiredDialogOpen(true);
            clearAllIntervals(intervalId);
          } else {
            setUser(ls.get('user'));
            setTokenExpired(false);
          }
        }
      } catch (error) {
        console.error('Error checking token validity:', error);
        setTokenExpired(true);
        setTokenExpiredDialogOpen(true);
      }
    }
  };

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard') && !newLoginDialogOpen && !tokenExpiredDialogOpen) {
      intervalId = setTrackedInterval(checkTokenExpiration, 600000);
    }

    return () => {
      if (intervalId) {
        clearAllIntervals(intervalId);
      }
    };
  }, [location.pathname, newLoginDialogOpen, tokenExpiredDialogOpen]);

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response) {
        const status = error.response.status;

        if ([403].includes(status) && !isCheckingTokenExpiration) {
          isCheckingTokenExpiration = true;
          await checkTokenExpiration();
          isCheckingTokenExpiration = false;
        }

        if (status === 401) {
          isCheckingTokenExpiration = true;
          if (error.response.data.message === 'Token is invalid due to new login.') {
            if (!tokenExpiredDialogOpen) {
              setNewLoginDialogOpen(true);
            }
          } else if (
            error.response.data.message === 'Token is expired.' ||
            error.message.includes('TokenExpiredError: jwt expired')
          ) {
            if (!newLoginDialogOpen) {
              setTokenExpiredDialogOpen(true);
            }
          }
        }
      }
      return Promise.reject(error);
    }
  );

  const login = (userData, token) => {
    clearAllIntervals();
    ls.set('token', token);
    ls.set('user', userData);
    setUser(userData);
    setTokenExpired(false);
    setNewLoginDialogOpen(false);
    setTokenExpiredDialogOpen(false);
    isCheckingTokenExpiration = false;
  };

  const logout = () => {
    ls.remove('token');
    ls.remove('user');
    setUser(null);
    setTokenExpired(false);
    setNewLoginDialogOpen(false);
    setTokenExpiredDialogOpen(false);
    clearAllIntervals();
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        tokenExpired,
        newLoginDialogOpen,
        setNewLoginDialogOpen,
        tokenExpiredDialogOpen,
        setTokenExpiredDialogOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
