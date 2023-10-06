import axios from 'axios';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Link,
  Container,
  Typography,
  Button,
  TextField,
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
  padding: theme.spacing(2, 0),
}));

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleRequestPasswordChange = async () => {
    // Clear previous messages
    setFieldError('');
    setErrorMessage('');
    setSuccessMessage('');

    // Check for missing email
    if (!email.trim()) {
      setFieldError('Please fill up all required fields.');
      setDialogOpen(true);
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/send-password-change-email`, {
        email,
      });

      if (response.status === 200) {
        setSuccessMessage('Password change request sent! Redirecting to login...');
        setDialogOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setDialogOpen(true);
      if (error.response && error.response.data && error.response.data.message.includes('unregistered')) {
        setErrorMessage('Email is either unregistered or not activated');
      } else {
        setErrorMessage('Error sending password change request.');
      }
      console.error('Error sending password change request:', error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Helmet>
        <title> Forgot Password | Your App </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="sm" sx={{ backgroundColor: '#fff' }}>
          <Logo sx={{ alignSelf: 'center' }} />
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Forgot Password
            </Typography>

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              error={Boolean(fieldError)}
              helperText={fieldError}
            />
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleRequestPasswordChange}>
              Request Password Change
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

            <Typography variant="body2" sx={{ mt: 3 }}>
              Remembered your password?
              <Link variant="subtitle2" onClick={() => navigate('/login')} sx={{ cursor: 'pointer', ml: 1 }}>
                Login
              </Link>
            </Typography>
          </StyledContent>
        </Container>
      </StyledRoot>
      {/* Dialog for form field errors */}
      <Dialog open={Boolean(fieldError) && dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{fieldError}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for backend errors */}
      <Dialog open={Boolean(errorMessage) && dialogOpen} onClose={handleCloseDialog}>
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

      {/* Dialog for success messages */}
      <Dialog open={Boolean(successMessage) && dialogOpen} onClose={handleCloseDialog}>
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
