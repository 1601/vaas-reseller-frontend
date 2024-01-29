import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SecureLS from 'secure-ls';
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
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import defaultProductConfig from './default_product_config.json';

// ----------------------------------------------------------------------

const ls = new SecureLS({ encodingType: 'aes' });

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    try {
      const savedEmail = ls.get('rememberMeEmail');
      const savedPassword = ls.get('rememberMePassword');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error reading from SecureLS:', error);
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (email.trim()) setEmailError(false);
  }, [email]);

  useEffect(() => {
    if (password.trim()) setPasswordError(false);
  }, [password]);

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async () => {
    setLoggingIn(true);
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please supply all required fields');
      setEmailError(!email.trim());
      setPasswordError(!password.trim());
      setDialogOpen(true);
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      setVerificationMessage('Invalid email format');
      setDialogOpen(true);
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/login`, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (rememberMe) {
        ls.set('rememberMeEmail', email);
        ls.set('rememberMePassword', password);
        ls.set('rememberMe', 'true');
      }

      if (role === 'admin') {
        setError('Admins must login to their respective CRM');
        setDialogOpen(true);
        setLoggingIn(false);
        return;
      }

      const verifiedRole = await verifyRole(token);

      if (verifiedRole) {
        localStorage.setItem('role', verifiedRole);
      } else {
        console.error('No role received from verifyRole API');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data));

      const dealerId = response.data._id; 
      const products = await fetchDealerProductConfig(dealerId, 'TNTPH'); 
      if (products.length === 0) {
        await createDefaultProductConfig(dealerId);
      }


      navigate(role === 'admin' ? '/dashboard/admin' : '/dashboard/app', { replace: true });
      setLoggingIn(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Invalid email or password');
      }
      setDialogOpen(true);
      setLoggingIn(false);
    }
  };

  // Fetch Dealer Product Config Function
  async function fetchDealerProductConfig(dealerId, brandName) {
    // console.log(`fetchDealerProductConfig called with dealerId: ${dealerId}, brandName: ${brandName}`);
    try {
      // console.log(`Attempting to fetch product configuration for dealer ${dealerId}, brand ${brandName}`);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/${dealerId}/${brandName}/public`
      );

      if (response.data && response.data.products) {
        // console.log(
        //   `Fetched product configuration for dealer ${dealerId}, brand ${brandName}:`,
        //   response.data.products
        // );
        return response.data.products; // Contains the products with enabled status and current price
      }

      // console.log(`No products found for dealer ${dealerId}, brand ${brandName}`);
      return []; // Return an empty array if the response does not contain products
    } catch (error) {
      console.error(`Error fetching product configuration for dealer ${dealerId}, brand ${brandName}:`, error);
      return []; // Return an empty array in case of an error
    }
  }

  const createDefaultProductConfig = async (dealerId) => {
    try {
        // console.log(`Sending request to create default product config for dealerId: ${dealerId}`);
        // console.log(`Config to be sent:`, defaultProductConfig);
        // console.log(`Endpoint: ${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/create`);

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/create`, {
            dealerId,
            config: defaultProductConfig
        });

        // console.log('Response received:', response);
        // console.log('Default product config created successfully');
    } catch (error) {
        console.error('Error creating default product config:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error Data:', error.response.data);
            console.error('Error Status:', error.response.status);
            console.error('Error Headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error Request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error Message:', error.message);
        }
        console.error('Config:', error.config);
    }
};


  const verifyRole = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/role`, {
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
        <TextField
          error={emailError || !!verificationMessage}
          name="email"
          label="Email address"
          value={email}
          onChange={handleEmailChange}
          helperText={emailErrorMessage || verificationMessage}
        />
        <TextField
          error={passwordError}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText={passwordError && 'Password is required'}
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox name="remember" checked={rememberMe} onChange={handleRememberMeChange} />
          <Typography variant="body2">Remember Me</Typography>
        </div>
        <Link
          variant="subtitle2"
          underline="hover"
          onClick={() => navigate('/forgotpassword')}
          sx={{ cursor: 'pointer' }}
        >
          Forgot password?
        </Link>
      </Stack>
      <Button
        fullWidth
        size="large"
        color="inherit"
        variant="outlined"
        onClick={() => {
          handleLogin();
          if (rememberMe) {
            ls.set('rememberMe', 'true');
          } else {
            ls.remove('rememberMe');
            ls.remove('rememberMeEmail');
            ls.remove('rememberMePassword');
          }
        }}
      >
        Login
      </Button>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
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
      <Dialog open={loggingIn || dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{error ? 'Error' : loggingIn ? 'Logging in...' : 'Notice'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {loggingIn ? 'Please wait while we log you in...' : error || verificationMessage}
          </DialogContentText>
          {loggingIn && <CircularProgress />}
        </DialogContent>
        {!loggingIn && (
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
