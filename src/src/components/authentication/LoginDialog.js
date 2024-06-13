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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import SecureLS from 'secure-ls';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ls = new SecureLS({ encodingType: 'aes' });

export default function LoginDialog({ open, onClose }) {
  const navigate = useNavigate();
  const {
    login,
    logout,
    newLoginDialogOpen,
    setNewLoginDialogOpen,
    tokenExpiredDialogOpen,
    setTokenExpiredDialogOpen,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isFormValid = () => {
    return email.length > 0 && validateEmail(email) && password.length > 0 && !emailError;
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
      setEmail('');
      setPassword('');
      setError('');
      setLoading(false);
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.response?.data.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    setAction('logout');
    setTimeout(() => {
      logout();
      setEmail('');
      setPassword('');
      setError('');
      setLoading(false);
      onClose();
      navigate('/login');
    }, 1000);
  };

  return (
    <>
      <Dialog open={newLoginDialogOpen} disableBackdropClick disableEscapeKeyDown>
        <DialogTitle>New Session Detected</DialogTitle>
        <DialogContent>
          <p>Your session has been logged out because your account was accessed from another location.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={tokenExpiredDialogOpen} disableBackdropClick disableEscapeKeyDown onClose={handleLogout}>
        <DialogTitle sx={{ textAlign: 'center' }}>Verify User Session</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <p>You have been detected to have Multiple Sessions or have been Inactive. Please relogin</p>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress />
              <p>{action === 'login' ? 'Verifying login credentials...' : 'Logging out...'}</p>
            </Box>
          ) : (
            <>
              <TextField
                label="Email Address"
                name="sessionEmail"
                type="email"
                fullWidth
                value={email}
                onChange={handleEmailChange}
                margin="normal"
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                name="sessionPass"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
    </>
  );
}
