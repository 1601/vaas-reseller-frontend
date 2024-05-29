import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { styled } from '@mui/material/styles';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Icon as Iconify } from '@iconify/react';
import Logo from '../../components/logo';
import PasswordRequestDialog from '../../components/loading/PasswordRequestDialog';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(2, 0),
}));

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const requirements = [
    { label: '8-12 characters long', test: (pw) => pw.length >= 8 && pw.length <= 12 },
    { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
    { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
    { label: 'One number', test: (pw) => /[0-9]/.test(pw) },
    { label: 'One special character (!@#$%^&*)', test: (pw) => /[!@#$%^&*]/.test(pw) },
  ];

  useEffect(() => {
    const isValid = requirements.every((req) => req.test(newPassword));
    setIsPasswordValid(isValid);
  }, [newPassword]);

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!token) {
        setErrorMessage('Invalid token');
        setIsTokenValid(false);
        setDialogOpen(true);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const tokenExpirationDate = new Date(decodedToken.exp * 1000);
        const isExpired = tokenExpirationDate < new Date();

        if (isExpired) {
          setErrorMessage('Password request expired.');
          setIsTokenValid(false);
          setDialogOpen(true);
          return;
        }

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/check-token`, { token });

        if (response.data.used) {
          setErrorMessage('Password request expired.');
          setIsTokenValid(false);
          setDialogOpen(true);
        }
      } catch (error) {
        setErrorMessage('Invalid password reset token.');
        setIsTokenValid(false);
        setDialogOpen(true);
      }
    };

    checkTokenValidity();
  }, [token]);

  function PasswordRequirements({ password }) {
    return (
      <Box
        sx={{
          mb: 2,
          p: 2,
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#fff',
          zIndex: 1,
        }}
      >
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Password must contain:
        </Typography>
        <ul style={{ margin: 0, padding: 0, listStyleType: 'disc', marginLeft: '20px' }}>
          {requirements.map((req, index) => (
            <li key={index} style={{ color: req.test(password) ? 'green' : 'red' }}>
              {req.label}
            </li>
          ))}
        </ul>
      </Box>
    );
  }

  const handleChangePassword = async () => {
    let isValid = true;
    setFieldError('');
    setErrorMessage('');
    setSuccessMessage('');

    if (!newPassword.trim()) {
      setNewPasswordError('New password is required');
      isValid = false;
    }
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirmation password is required');
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (!isValid) {
      setDialogOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/password`, {
        token,
        password: newPassword,
      });

      if (response.status === 200) {
        setErrorMessage('');
        setSuccessMessage('Password has been updated successfully. Redirecting to login...');
        setDialogOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setSuccessMessage('');
        setErrorMessage('Failed to update password. Please try again.');
        setDialogOpen(true);
      }
    } catch (error) {
      setSuccessMessage('');
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
        setDialogOpen(true);
      } else {
        setErrorMessage('An error occurred. Please try again.');
        setDialogOpen(true);
      }
      console.error('Error updating password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);

    const passwordMeetsRequirements = requirements.every((req) => req.test(password));
    setIsPasswordValid(passwordMeetsRequirements);

    setNewPasswordError(password.trim() ? '' : 'New password is required');
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleProceedToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>Reset Password | Your App</title>
      </Helmet>
      <StyledRoot>
        <Container maxWidth="sm" sx={{ backgroundColor: '#fff' }}>
          <Logo sx={{ alignSelf: 'center' }} />
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Reset Password
            </Typography>

            <TextField
              fullWidth
              label="New Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={handlePasswordChange}
              sx={{ mb: 3 }}
              error={Boolean(newPasswordError)}
              helperText={newPasswordError}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {isPasswordFocused && <PasswordRequirements password={newPassword} />}

            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError(e.target.value.trim() ? '' : 'Confirmation password is required');
              }}
              sx={{ mb: 3 }}
              error={Boolean(confirmPasswordError)}
              helperText={confirmPasswordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              onClick={handleChangePassword}
              disabled={!isPasswordValid || !newPassword || !confirmPassword}
            >
              Change Password
            </Button>

            {successMessage && (
              <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                {successMessage}
              </Typography>
            )}

            {errorMessage && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
          </StyledContent>
        </Container>
      </StyledRoot>
      <Dialog open={dialogOpen}>
        <DialogTitle>{isTokenValid ? 'Password Change' : 'Invalid or Expired Token'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {newPasswordError || confirmPasswordError || errorMessage || successMessage || fieldError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!isTokenValid ? (
            <Button onClick={handleProceedToLogin} color="primary">
              Proceed to Login
            </Button>
          ) : (
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <PasswordRequestDialog open={isLoading} />
    </>
  );
}
