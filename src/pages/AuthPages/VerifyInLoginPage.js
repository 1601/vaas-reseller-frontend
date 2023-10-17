import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Divider,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
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
  padding: theme.spacing(12, 0),
}));

export default function VerifyInLoginPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [countdown, setCountdown] = useState(180);
  const [allowResend, setAllowResend] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [codeErrorMsg, setCodeErrorMsg] = useState('');
  const location = useLocation();
  const userEmail = location.state?.email || '';
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);

    if (countdown === 0) {
      setAllowResend(true);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  const resendCode = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/resend-verification-email`, {
        email,
      });
      setCountdown(180);
      setAllowResend(false);
    } catch (error) {
      console.error('Error while resending verification email:', error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  const verifyEmail = async () => {
    let isValid = true;
    setEmailError(false);
    setCodeError(false);
    setFieldError('');
    // Check for missing fields
    if (!email.trim()) {
      setEmailErrorMsg('Email is required');
      isValid = false;
    }
    if (!code.trim()) {
      setCodeErrorMsg('Verification code is required');
      isValid = false;
    }

    if (!isValid) {
      setFieldError('Please fill out all fields.');
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/verify`, {
        email,
        code,
      });

      if (response.status === 200) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/updateUserStatus`, {
          email,
        });

        setSuccessMessage('Successful Verification. Proceeding to profile page...');
        setTimeout(() => {
          setFieldError('');
          setErrorMessage('');
          navigate('/dashboard/profile');
        }, 3000);
      } else {
        setErrorMessage('Invalid email or verification code.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      if (error.response && error.response.status === 400) {
        setCodeErrorMsg('Invalid email or verification code.');
      } else {
        setErrorMessage('An error occurred during verification.');
      }
    }
  };

  const handleCloseDialog = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setFieldError('');
  };

  return (
    <>
      <Helmet>
        <title> Email Verification | VAAS </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="sm" sx={{ backgroundColor: '#fff' }}>
          {/* <Logo sx={{ alignSelf: 'center' }} /> */}

          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Email Verification
            </Typography>

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailErrorMsg(e.target.value.trim() ? '' : 'Email is required'); // Clear or set error message
              }}
              sx={{ mb: 3 }}
              error={!!emailErrorMsg}
            />
            <TextField
              fullWidth
              label="Verification Code"
              variant="outlined"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setCodeErrorMsg(e.target.value.trim() ? '' : 'Verification code is required');
              }}
              sx={{ mb: 3 }}
              error={!!codeErrorMsg}
              helperText={codeErrorMsg}
            />
            {errorMessage && (
              <Typography variant="body2" color="error" sx={{ mb: 5 }}>
                {errorMessage}
              </Typography>
            )}
            {successMessage && (
              <Typography variant="body2" color="success" sx={{ mb: 5 }}>
                {successMessage}
              </Typography>
            )}

            <Button
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              onClick={verifyEmail}
              style={{ opacity: 1, backgroundColor: '#3f51b5', color: 'white' }}
            >
              Verify
            </Button>

            <Divider sx={{ my: 3 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ textAlign: 'right' }}>
                {allowResend ? (
                  <Typography
                    variant="body2"
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: '#3f51b5',
                      },
                    }}
                    onClick={resendCode}
                  >
                    Resend Verification Code
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    Resend code in {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}
                    {countdown % 60}
                  </Typography>
                )}
              </div>
            </div>
          </StyledContent>
        </Container>
      </StyledRoot>

      {/* Dialog for backend errors */}
      <Dialog open={Boolean(errorMessage)} onClose={handleCloseDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for success message */}
      <Dialog open={Boolean(successMessage)} onClose={handleCloseDialog}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <DialogContentText>{successMessage}</DialogContentText>
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
