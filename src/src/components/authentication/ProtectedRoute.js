import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginDialog from './LoginDialog';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      setOpenLoginDialog(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated()) {
    return <LoginDialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)} />;
  }

  return children;
};
