import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Link,
  Container,
  Typography,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/lab/Autocomplete';
import { Icon as Iconify } from '@iconify/react';
import Logo from '../../components/logo';
import { countries } from '../../components/country/CountriesList';

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

export default function SignUpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    designation: '',
    email: '',
    mobileNumber: '',
    country: '',
    ipAddress: '',
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    designation: false,
    email: false,
    mobileNumber: false,
    country: false,
    ipAddress: false,
    username: false,
    password: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Reset error state on typing
    setFieldErrors({
      ...fieldErrors,
      [name]: false,
    });
  };

  const validateForm = () => {
    const newFieldErrors = {
      firstName: !formData.firstName.trim(),
      middleName: !formData.middleName.trim(),
      lastName: !formData.lastName.trim(),
      designation: !formData.designation.trim(),
      email: !formData.email.trim(),
      mobileNumber: !formData.mobileNumber.trim(),
      country: !formData.country.trim(),
      ipAddress: !formData.ipAddress.trim(),
      username: !formData.username.trim(),
      password: !formData.password.trim(),
    };
    setFieldErrors(newFieldErrors);
    return !Object.values(newFieldErrors).includes(true);
  };

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const handleSignup = async () => {
    console.log(formData);
    if (!validateForm()) {
      setShowErrorDialog(true);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, formData);
      setErrorMessage('');
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/verify');
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred during signup.');
      }
      setErrorDialogOpen(true); // Open the error dialog
    }
  };

  const handleCloseModal = () => {
    setShowSuccessMessage(false);
    navigate('/login');
  };

  // Update formData.email whenever email changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, email }));
  }, [email]);

  // Update location state for email
  useEffect(() => {
    const newEmail = location.state?.email || '';
    setEmail(newEmail);
    setFormData((prev) => ({ ...prev, email: newEmail }));
  }, [location.state]);

  // Fetching IP Address
  useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fetch-ip`);
        setFormData((prevFormData) => ({
          ...prevFormData,
          ipAddress: response.data.ipAddress,
        }));
      } catch (error) {
        console.error('Error fetching IP address: ', error);
      }
    };

    fetchIPAddress();
  }, []);

  useEffect(() => {
    if (showSuccessMessage) {
      const redirectTimer = setTimeout(() => {
        navigate('/login');
      }, 5000);
      return () => clearTimeout(redirectTimer);
    }
    return undefined;
  }, [showSuccessMessage, navigate]);

  return (
    <>
      <Helmet>
        <title> Sign Up | Your App </title>
      </Helmet>
      <StyledRoot>
        <Container maxWidth="sm" sx={{ backgroundColor: '#fff' }}>
          <Logo sx={{ alignSelf: 'center' }} />
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign Up
            </Typography>
            <Typography variant="body2" sx={{ mb: 5 }}>
              Register to Your App
            </Typography>
            <TextField
              error={fieldErrors.firstName}
              fullWidth
              label="First Name"
              variant="outlined"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />
            <TextField
              error={fieldErrors.middleName}
              fullWidth
              label="Middle Name"
              variant="outlined"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />
            <TextField
              error={fieldErrors.lastName}
              fullWidth
              label="Last Name"
              variant="outlined"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
              <InputLabel id="designation-label">Designation</InputLabel>
              <Select
                error={fieldErrors.designation}
                labelId="designation-label"
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
              >
                <MenuItem value={'Mr.'}>Mr.</MenuItem>
                <MenuItem value={'Ms.'}>Ms.</MenuItem>
                <MenuItem value={'Mrs.'}>Mrs.</MenuItem>
              </Select>
            </FormControl>
            <TextField
              error={fieldErrors.email}
              fullWidth
              label="Email"
              variant="outlined"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              error={fieldErrors.mobileNumber}
              fullWidth
              label="Mobile Number"
              variant="outlined"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />
            <Autocomplete
              error={fieldErrors.country}
              fullWidth
              options={countries}
              getOptionLabel={(option) => option}
              value={formData.country}
              onChange={(_, newValue) => setFormData({ ...formData, country: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="Country of Location" variant="outlined" sx={{ mb: 3 }} />
              )}
            />
            <TextField
              error={fieldErrors.ipAddress}
              fullWidth
              label="IP Address"
              variant="outlined"
              name="ipAddress"
              value={formData.ipAddress}
              // onChange={handleInputChange}
              sx={{ mb: 3 }}
              disabled
            />
            <TextField
              error={fieldErrors.username}
              fullWidth
              label="Username"
              variant="outlined"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />
            <TextField
              error={fieldErrors.password}
              fullWidth
              label="Password"
              variant="outlined"
              type={formData.showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                      edge="end"
                    >
                      <Iconify icon={formData.showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* Password Guidelines Dialog */}
            {/* Error Dialog */}
            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
              <DialogTitle>Error</DialogTitle>
              <DialogContent>
                <DialogContentText>{errorMessage}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setErrorDialogOpen(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)}>
              <DialogTitle>Error</DialogTitle>
              <DialogContent>
                <DialogContentText>Please supply all required fields</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowErrorDialog(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleSignup}>
              Sign Up
            </Button>
            {errorMessage && (
              <Typography variant="body2" color="error" sx={{ my: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <Dialog open={showSuccessMessage} onClose={() => setShowSuccessMessage(false)}>
              <DialogTitle>Successful Sign-Up!</DialogTitle>
              <DialogContent>
                <DialogContentText>Redirecting to Email Verification...</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowSuccessMessage(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" sx={{ mb: 5 }}>
              Already have an account?
              <Link variant="subtitle2" onClick={() => navigate('/login')} sx={{ cursor: 'pointer', ml: 1 }}>
                Login
              </Link>
            </Typography>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
