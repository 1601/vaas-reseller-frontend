import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from '@mui/material';

const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

const AdminSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    password: '',
    email: '',
    mobileNumber: '',
    designation: 'Admin',
    username: '',
    ipAddress: '',
    country: 'not_applicable',
  });
  const [isRestricted, setIsRestricted] = useState(false);

  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    if (!token) {
      setIsRestricted(true);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (!decoded.uniqueKey) {
        setIsRestricted(true);
        return;
      }
      const emailPart = decoded.email.split('@')[0];
      setFormState((prevState) => ({
        ...prevState,
        email: decoded.email,
        mobileNumber: decoded.mobileNumber,
        username: emailPart,
      }));
      fetch('https://api.ipify.org?format=json')
        .then((res) => res.json())
        .then((data) => {
          setFormState((prevState) => ({
            ...prevState,
            ipAddress: data.ip,
          }));
        })
        .catch((err) => console.error('Error fetching IP:', err));
    } catch (error) {
      setIsRestricted(true);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordValid) {
      alert('Please input all required fields.');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/admin/signup`, formState);
      console.log('Response:', response.data);
      setLoading(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error during admin signup:', error);
      setLoading(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate('/admin');
  };

  const validatePassword = (password) => {
    const errors = [];
    let generalError = 'Password must contain: ';

    if (!/.{8,12}/.test(password)) {
      errors.push('8-12 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('one uppercase letter.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('one lowercase letter.');
    }
    if (!/\d/.test(password)) {
      errors.push('one number.');
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('one special character.');
    }

    generalError += errors.join(' ');

    setPasswordError(errors.length > 0 ? generalError : '');
    setPasswordValid(errors.length === 0);
  };

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });

    if (e.target.name === 'password') {
      if (!isPasswordTouched) setIsPasswordTouched(true);
      validatePassword(e.target.value);
    }
  };

  const isFormFilled = () => {
    return formState.firstName && formState.lastName && formState.password && formState.email && formState.mobileNumber;
  };

  if (isRestricted) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <Card sx={{ p: 4, mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" style={{ fontWeight: 'bold', color: 'red', textTransform: 'uppercase' }}>
              Restricted Access
            </Typography>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Card sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Admin Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={formState.firstName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formState.lastName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            error={isPasswordTouched && !passwordValid}
            helperText={isPasswordTouched && !passwordValid && passwordError}
          />
          <TextField
            label="Email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="Mobile Number"
            name="mobileNumber"
            value={formState.mobileNumber}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            disabled
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            fullWidth
            disabled={loading || !passwordValid || !isFormFilled()}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </form>
      </Card>

      <Dialog open={showSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>{'Success'}</DialogTitle>
        <DialogContent>
          <Typography>Successfully created a new Admin Account.</Typography>
        </DialogContent>
        <Button onClick={handleCloseSuccessDialog}>Proceed to Login</Button>
      </Dialog>
    </Container>
  );
};

export default AdminSignUp;
