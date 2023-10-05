import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import {
  Button,
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCloseDialog = () => {
    setError('');
    setVerificationMessage('');
    setDialogOpen(false);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
        email,
        password,
      });

      const { token, username, _id, role, email: userEmail, isActive } = response.data;

      if (isActive === false) {
        setIsVerified(false);
        setVerificationMessage('Email not yet verified. Please proceed to verification');
        return;
      }

      const verifiedRole = await verifyRole(token);

      if (verifiedRole) {
        localStorage.setItem('role', verifiedRole);
        console.log('Role saved to localStorage:', verifiedRole);
      } else {
        console.error('No role received from verifyRole API');
      }

      // Check if the email is active or not
      if (isActive === false) {
        setIsVerified(false);
        setVerificationMessage('Email not yet verified. Please proceed to verification');
        return;
      }

      // Save token and user info to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data));

      // Navigate to the appropriate dashboard based on role
      navigate(role === 'admin' ? '/dashboard/admin' : '/dashboard/app', { replace: true });
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data) {
        // Update to handle custom error messages from server
        setError(error.response.data.message);
      } else {
        setError('Invalid email or password');
      }
    }
  };

  const verifyRole = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/verifyRole`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.role;
    } catch (error) {
      console.error('Could not verify user role', error);
      return null;
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link
          variant="subtitle2"
          underline="hover"
          onClick={() => navigate('/forgotpassword')}
          sx={{ cursor: 'pointer' }}
        >
          Forgot password?
        </Link>
      </Stack>

      <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleLogin}>
        Login
      </Button>

      {!isVerified && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {verificationMessage}
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Dialog open={Boolean(error || verificationMessage)} onClose={handleCloseDialog}>
        <DialogTitle>{error ? 'Error' : 'Notice'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{error || verificationMessage}</DialogContentText>
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
