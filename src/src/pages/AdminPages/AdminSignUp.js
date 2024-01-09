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

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    if (token) {
      const decoded = jwtDecode(token);
      const emailPart = decoded.email.split('@')[0];

      setFormState((prevState) => ({
        ...prevState,
        email: decoded.email,
        mobileNumber: decoded.phoneNumber,
        username: emailPart,
      }));

      // Fetch IP address
      fetch('https://api.ipify.org?format=json')
        .then((res) => res.json())
        .then((data) => {
          setFormState((prevState) => ({
            ...prevState,
            ipAddress: data.ip,
          }));
        })
        .catch((err) => console.error('Error fetching IP:', err));
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Form State before submission:', formState);

    if (!passwordValidation.test(formState.password)) {
      alert(
        'Password must be 8-12 characters long, contain at least one uppercase letter, one number, and one special character.'
      );
      return;
    }

    try {
      setLoading(true); // Start loading
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/admin/signup`, formState);
      console.log('Response:', response.data);
      setLoading(false); // Stop loading
      setShowSuccessDialog(true); // Show success dialog
    } catch (error) {
      console.error('Error during admin signup:', error);
      setLoading(false); // Stop loading in case of error
    }
  };

  // Function to close the dialog and redirect
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate('/admin'); // Redirect to admin login
  };

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
          <Button type="submit" variant="outlined" color="primary" fullWidth disabled={loading}>
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
