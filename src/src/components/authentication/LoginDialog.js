import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  CircularProgress,
  Box,
} from '@mui/material';
import axios from 'axios';
import SecureLS from 'secure-ls';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ls = new SecureLS({ encodingType: 'aes' });

export default function LoginDialog({ open, onClose }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    if (!validateEmail(emailInput) && emailInput.length > 0) {
      setEmailError('Invalid Email Format');
    } else {
      setEmailError('');
    }
  };

  const isFormValid = () => {
    return email.length > 0 && validateEmail(email) && password.length > 0;
  };

  const handleLogin = async () => {
    if (!isFormValid()) return;
    setLoading(true);
    setAction('login');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/login`, {
        email,
        password,
      });
      const { token, ...userData } = response.data;
      ls.set('token', token);
      ls.set('user', userData);
      login(userData, token);
      setLoading(false);
      onClose();
    } catch (err) {
      setError(err.response?.data.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    setAction('logout');
    setTimeout(() => {
      ls.removeAll();
      setLoading(false);
      onClose();
      navigate('/login');
    }, 1000);
  };

  return (
    <Dialog open={open} onClose={handleLogout}>
      <DialogTitle sx={{ textAlign: 'center' }}>Verify User Session</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress />
            <p>{action === 'login' ? 'Verifying login credentials...' : 'Logging out...'}</p>
          </Box>
        ) : (
          <>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={handleEmailChange}
              margin="normal"
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} color="error" disabled={loading}>
          Logout
        </Button>
        <Button onClick={handleLogin} disabled={!isFormValid() || loading}>
          Log in
        </Button>
      </DialogActions>
    </Dialog>
  );
}
