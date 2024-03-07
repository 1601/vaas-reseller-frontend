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
  DialogActions,
  DialogContentText,
  CircularProgress,
} from '@mui/material';
// components
import Iconify from '../../../components/iconify';

const ls = new SecureLS({ encodingType: 'aes' });

export default function LoginFormAdmin() {
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
  const [isGeneratingOTP, setIsGeneratingOTP] = useState(false);

  const [otp, setOtp] = useState('');
  const [openOTPDialog, setOpenOTPDialog] = useState(false);
  const [incorrectOTPDialog, setIncorrectOTPDialog] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [tempLoginData, setTempLoginData] = useState(null);

  useEffect(() => {
    try {
      const savedEmail = ls.get('rememberMeEmail');
      const savedPassword = ls.get('rememberMePassword');
      const remembered = ls.get('rememberMe');
      if (remembered) {
        setEmail(savedEmail || '');
        setPassword(savedPassword || '');
        setRememberMe(remembered);
      }
    } catch (error) {
      console.error('Error reading from SecureLS:', error);
    }
  }, []);

  const handleCloseOtpDialog = () => {
    setOtp('');
    setOtpError('');
    setOpenOTPDialog(false);
  }

  const handleIncorrectOTPDialog = () => {
    setOtp('');
    setOtpError('');
    setIncorrectOTPDialog(false)
  }

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCloseDialog = () => {
    setOtp('');
    setOtpError('');
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
    // setLoggingIn(true);
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please supply all required fields');
      setEmailError(!email.trim());
      setPasswordError(!password.trim());
      setDialogOpen(true);
      setLoggingIn(false);
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      setVerificationMessage('Invalid email format');
      setDialogOpen(true);
      setLoggingIn(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/login`, {
        email,
        password,
      });

      const { token, role } = response.data;

      setTempLoginData(response.data);

      if (role !== 'admin') {
        setError('Dealers must login through the dealer portal');
        setDialogOpen(true);
        setLoggingIn(false);
        return;
      }
      // Open OTP dialog for further verification
      sendOTP(email);

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

  const sendOTP = async (email) => {
    setIsGeneratingOTP(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/admin/otp`, { email });
      setOpenOTPDialog(true);
      setIsGeneratingOTP(false);
      // console.log(response.data.message);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setIsGeneratingOTP(false);
    }
  };

  const handleOTPSubmit = async (otp) => {
    // console.log('Submitting OTP. Email:', email, 'OTP Code:', otp); // Log the email and OTP

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/admin/verify-otp`, {
        email,
        otpCode: otp,
      });

      // console.log('OTP Verification Response:', response); // Log the response for debugging

      if (response.status === 200) {
        if (tempLoginData) {
          const { token, role } = tempLoginData;

          const verifiedRole = await verifyRole(token);

          if (verifiedRole) {
            ls.set('role', verifiedRole);
          } else {
            console.error('No role received from verifyRole API');
          }

          if (rememberMe) {
            ls.set('rememberMeEmail', email);
            ls.set('rememberMePassword', password);
            ls.set('rememberMe', true);
          } else {
            ls.remove('rememberMe');
            ls.remove('rememberMeEmail');
            ls.remove('rememberMePassword');
          }

          ls.set('token', token);
          ls.set('role', role);
          ls.set('user', tempLoginData);

          navigate('/dashboard/admin/home');
        }
        navigate('/dashboard/admin/home');
      } else {
        // Handle incorrect OTP
        console.error('Incorrect OTP:', response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setOtpError(error.response.data.message);
        setIncorrectOTPDialog(true);
      } else {
        console.error('Error verifying OTP:', error);
      }
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
        {/* <Link
          variant="subtitle2"
          underline="hover"
          onClick={() => navigate('/forgotpassword')}
          sx={{ cursor: 'pointer' }}
        >
          Forgot password?
        </Link> */}
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

      {/* OTP Generation Status Dialog */}
      <Dialog open={isGeneratingOTP} onClose={() => setIsGeneratingOTP(false)}>
        <DialogTitle>Generating OTP...</DialogTitle>
        <DialogContent>
          <CircularProgress />
          <DialogContentText>Please wait while your OTP is being generated.</DialogContentText>
        </DialogContent>
      </Dialog>

      {/* OTP Error Dialog */}
      <Dialog open={incorrectOTPDialog} onClose={handleIncorrectOTPDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{otpError}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIncorrectOTPDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* OTP Dialog */}
      <Dialog open={openOTPDialog} onClose={() => setOpenOTPDialog(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="otp"
            label="OTP"
            type="text"
            fullWidth
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOtpDialog}>Cancel</Button>
          <Button onClick={() => handleOTPSubmit(otp)}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
