import React, { createContext, useContext, useState, useEffect } from 'react';
import SecureLS from 'secure-ls';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();
const ls = new SecureLS({ encodingType: 'aes' });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedToken = ls.get('token');
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          if (decodedToken.exp * 1000 < Date.now()) {
            setTokenExpired(true);
          } else {
            setUser(ls.get('user'));
            setTokenExpired(false);
          }
        } catch (error) {
          console.error("Error decoding token: ", error);
          setTokenExpired(true); 
        }
      }
    };

    checkTokenExpiration(); 
    const intervalId = setInterval(checkTokenExpiration, 10000); 
    return () => clearInterval(intervalId);
  }, []);

  const login = (userData, token) => {
    ls.set('token', token);
    ls.set('user', userData);
    setUser(userData);
    setTokenExpired(false); 
  };

  const logout = () => {
    ls.remove('token');
    ls.remove('user');
    setUser(null);
    setTokenExpired(false);
  };

  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};