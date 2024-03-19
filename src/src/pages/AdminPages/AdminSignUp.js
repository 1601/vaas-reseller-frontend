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
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const PasswordRequirements = ({ password }) => {
    const requirements = [
      { label: '8-12 characters long', test: (pw) => pw.length >= 8 && pw.length <= 12 },
      { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
      { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
      { label: 'One number', test: (pw) => /\d/.test(pw) },
      { label: 'One special character (@$!%*?&)', test: (pw) => /[@$!%*?&]/.test(pw) },
    ];

    return (
      <Box
        sx={{
          mb: 2,
          p: 2,
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          display: isPasswordFocused ? 'block' : 'none',
        }}
      >
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Password must contain:
        </Typography>
        <ul style={{ margin: 0, padding: 0, listStyleType: 'none', paddingLeft: '15px' }}>
          {requirements.map((req, index) => (
            <li key={index} style={{ color: req.test(password) ? 'green' : 'red' }}>
              {req.label}
            </li>
          ))}
        </ul>
      </Box>
    );
  };

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

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/admin/signup`, formState);
      setLoading(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error during admin signup:', error);
      setLoading(false);
      setErrorMessage('Failed to create admin. Please try again later.'); // Customize this message based on your error handling logic
      setShowErrorDialog(true);
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate('/admin');
  };

  const LoadingDialog = () => (
    <Dialog open={loading} onClose={() => {}}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Creating admin...</Typography>
      </Box>
    </Dialog>
  );

  const ErrorDialog = () => (
    <Dialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <Typography>{errorMessage}</Typography>
      </DialogContent>
      <Button onClick={() => setShowErrorDialog(false)}>Close</Button>
    </Dialog>
  );

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

  const handlePasswordFocus = () => setIsPasswordFocused(true);
  const handlePasswordBlur = () => setIsPasswordFocused(false);

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
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            error={isPasswordTouched && !passwordValid}
          />
          {isPasswordFocused && <PasswordRequirements password={formState.password} />}
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

      <LoadingDialog />
      <ErrorDialog />
    </Container>
  );
};

export default AdminSignUp;
