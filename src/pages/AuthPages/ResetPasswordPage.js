import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import {
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

  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

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

    // Check for matching passwords
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (!isValid) {
      setDialogOpen(true);
      return;
    }

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
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
              onChange={(e) => {
                setNewPassword(e.target.value);
                setNewPasswordError(e.target.value.trim() ? '' : 'New password is required');
              }}
              sx={{ mb: 3 }}
              error={Boolean(newPasswordError)}
              helperText={newPasswordError}
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
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleChangePassword}>
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
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{ newPasswordError || confirmPasswordError || errorMessage || successMessage || fieldError}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
