import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
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
  FormHelperText,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  DialogContentText,
  DialogActions,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/lab/Autocomplete';
import { Icon as Iconify } from '@iconify/react';
import Logo from '../../components/logo';
import { countries } from '../../components/country/CountriesList';
import { countryCodes } from '../../components/country/countryNumCodes';
import termsAndAgreement from '../../components/agreements/termsAndAgreement';
import VerifyPage from './VerifyPage';
import { mobileNumberLengths } from '../../components/country/countryNumLength';

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

function TermsDialog({ open, onClose, onAgree }) {
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    setIsScrolledToEnd(bottom);
  };

  return (
    <Dialog open={open} onClose={onClose} scroll="paper">
      <DialogTitle>Terms and Conditions</DialogTitle>
      <DialogContent dividers>
        <div
          style={{
            overflowY: 'auto',
            maxHeight: 400,
            whiteSpace: 'pre-line',
          }}
          onScroll={handleScroll}
        >
          <p>{termsAndAgreement}</p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={onAgree} color="primary" disabled={!isScrolledToEnd}>
          Agree to Terms
        </Button>
      </DialogActions>
    </Dialog>
  );
}

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
    mobileNumber: undefined,
    country: '',
    ipAddress: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showIpAddress, setShowIpAddress] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [succesSignup, setSuccesSignup] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [mobileError, setMobileError] = useState(false);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    setIsScrolledToEnd(bottom);
  };

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
    confirmPassword: false,
  });

  const openTermsDialog = () => {
    setIsTermsDialogOpen(true);
  };

  const agreeToTerms = () => {
    setIsTermsDialogOpen(false);
    setIsTermsAccepted(true);
  };

  const validateName = (name) => {
    // Allows only letters, hyphens, apostrophes, and spaces
    const nameRegex = /^[a-zA-Z-' ]+$/;
    return nameRegex.test(name);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const isNameField = ['firstName', 'middleName', 'lastName'].includes(name);

    // Update the form data immediately
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Update field errors based on new input
    setFieldErrors((prevFieldErrors) => {
      const newErrorState = { ...prevFieldErrors };

      // If it's a name field, validate against the name regex
      if (isNameField) {
        newErrorState[name] = !value.trim() || !validateName(value);
      } else {
        // For other fields, you might want to validate differently or not at all
        newErrorState[name] = !value.trim();
      }

      return newErrorState;
    });
  };

  const validateMobileNumber = (country, number) => {
    const expectedLength = mobileNumberLengths[country];
    const actualLength = number.length;

    if (!expectedLength) {
      return 'Unsupported country';
    }
    if (actualLength < expectedLength) {
      return 'Number is too short';
    }
    if (actualLength > expectedLength) {
      return 'Number is too long';
    }

    return '';
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;

    // Validate mobile number with regex
    const mobileRegex = /^[\d+-]+$/;
    if (!mobileRegex.test(value) || value.replace(countryCodes[formData.country] || '', '').trim() === '') {
      setMobileError(true);
      setErrorMessage("Wrong Number format. Please use only digits and optional '+'.");
    } else {
      const errorMessage = validateMobileNumber(formData.country, value);
      if (errorMessage) {
        setMobileError(true);
        setErrorMessage(errorMessage);
      } else {
        setMobileError(false);
        setErrorMessage('');
      }
    }

    setFormData({
      ...formData,
      mobileNumber: value,
    });
  };

  const validateEmailAndCheckExistence = async (email) => {
    let valid = true;
    let message = '';

    // Client-side validation first
    if (!email) {
      valid = false;
      message = 'Email is required';
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        valid = false;
        message = 'Invalid email format';
      }
    }

    // If client-side validation passes, check with the server
    if (valid) {
      try {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/check-email`, {
          params: { email },
        });
      } catch (error) {
        if (error.response && error.response.status === 400) {
          valid = false;
          message = error.response.data.message;
        } else {
          console.error('Error checking email: ', error);
        }
      }
    }

    // Update the state once, based on both checks
    setIsEmailValid(valid);
    setEmailErrorMessage(message);
    setFieldErrors((prev) => ({ ...prev, email: !valid }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmailAndCheckExistence(e.target.value);
  };

  const handleGoogleSignUp = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
    const scope = encodeURIComponent(
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    );

    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}`;
    window.location.href = googleLoginUrl;
  };

  const handleFacebookSignUp = () => {
    const clientId = process.env.REACT_APP_FACEBOOK_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.REACT_APP_FACEBOOK_REDIRECT_URI);
    const scope = encodeURIComponent('email'); // request access to the user's email

    const facebookLoginUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

    window.location.href = facebookLoginUrl;
  };

  const validateForm = () => {
    const newFieldErrors = {
      firstName: !formData.firstName?.trim() || !validateName(formData.firstName),
      middleName: formData.middleName && !validateName(formData.middleName),
      lastName: !formData.lastName?.trim() || !validateName(formData.lastName),
      designation: !formData.designation?.trim(),
      email: !formData.email?.trim(),
      mobileNumber: !formData.mobileNumber?.replace(countryCodes[formData.country] || '', '').trim(),
      country: !formData.country?.trim(),
      ipAddress: !formData.ipAddress?.trim(),
      username: !formData.username?.trim(),
      password: !formData.password?.trim(),
      confirmPassword: formData.password !== formData.confirmPassword,
    };
    setFieldErrors(newFieldErrors);
    return !Object.values(newFieldErrors).includes(true);
  };

  const handleSignup = async () => {
    setPasswordError(false);
    setPasswordHelperText('');

    await validateEmailAndCheckExistence(email);

    const isFormFullyValid = validateForm() && formData.password === formData.confirmPassword;

    if (!validateForm()) {
      // Stop here and do not proceed with signup if form is invalid
      return;
    }

    // If the password is empty, also set an error for confirm password
    if (!formData.password.trim()) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: true }));
    }

    if (isEmailValid && validateForm()) {
      try {
        const submissionData = {
          ...formData,
          mobileNumber: countryCodes[formData.country] + formData.mobileNumber,
        };

        const signupResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, submissionData);

        if (signupResponse.status === 200) {
          // If signup is successful, send the verification email
          try {
            const verificationResponse = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/api/send-verification-email`,
              {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
              }
            );

            if (verificationResponse.status === 200) {
              setErrorMessage('');
              setShowSuccessMessage(true);
              setTimeout(() => {
                setSuccesSignup(true);
              }, 3000);
            }
          } catch (error) {
            console.error('Error while sending verification email:', error);
            setErrorMessage('Failed to send verification email.');
            setErrorDialogOpen(true);
          }
        }
      } catch (error) {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message);
          if (error.response.data.message.includes('Password')) {
            setPasswordError(true);
            setPasswordHelperText(error.response.data.message);
          }
        } else {
          setErrorMessage('An error occurred during signup.');
        }
        setErrorDialogOpen(true);
      }
    } else if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      setFieldErrors((prev) => ({ ...prev, confirmPassword: true }));
    }
  };

  // const handleCloseModal = () => {
  //   setShowSuccessMessage(false);
  //   navigate('/login');
  // };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');

    const newEmail = location.state?.email || emailParam || '';

    setEmail(newEmail);
    setFormData((prev) => ({ ...prev, email: newEmail }));
  }, [location.search, location.state]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const firstNameParam = queryParams.get('firstName');
    const lastNameParam = queryParams.get('lastName');

    if (firstNameParam || lastNameParam) {
      setFormData((prev) => ({
        ...prev,
        firstName: firstNameParam || prev.firstName,
        lastName: lastNameParam || prev.lastName,
      }));
    }
  }, [location.search]);

  useEffect(() => {
    if (formData.country) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        mobileNumber: countryCodes[formData.country] || '',
      }));
    }
  }, [formData.country]);

  useEffect(() => {
    const isValid = Object.keys(formData).some((key) => {
      if (key === 'ipAddress' || !formData[key]) {
        return false;
      }
      return Boolean(formData[key].trim());
    });

    setIsFormValid(isValid);
  }, [formData]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, email }));
  }, [email]);

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
      } finally {
        setShowIpAddress(false);
      }
    };

    fetchIPAddress();
  }, []);

  // useEffect(() => {
  //   if (showSuccessMessage) {
  //     const redirectTimer = setTimeout(() => {
  //       navigate('/login');
  //     }, 5000);
  //     return () => clearTimeout(redirectTimer);
  //   }
  //   return undefined;
  // }, [showSuccessMessage, navigate]);

  return (
    <>
      <Helmet>
        <title> Sign Up | Your App </title>
      </Helmet>
      <StyledRoot>
        <Container maxWidth="sm" sx={{ backgroundColor: '#fff' }}>
          <Logo sx={{ alignSelf: 'center' }} />
          {succesSignup === true ? (
            <VerifyPage email={formData.email} firstName={formData.firstName} lastName={formData.lastName} />
          ) : (
            <StyledContent>
              <Typography variant="h4" gutterBottom>
                Sign Up
              </Typography>
              <Typography variant="body2" sx={{ mb: 5 }}>
                Register now to your Vaas Experience
              </Typography>

              {/* Basic Information Section */}

              <Card sx={{ mb: 3 }}>
                <CardHeader title="Basic Information" />
                <CardContent>
                  <TextField
                    error={fieldErrors.firstName}
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    sx={{ mb: 3 }}
                    helperText={
                      fieldErrors.firstName
                        ? formData.firstName.trim()
                          ? 'First Name contains invalid characters'
                          : 'First Name is required'
                        : ''
                    }
                  />
                  <TextField
                    error={fieldErrors.middleName}
                    fullWidth
                    label="Middle Name (Optional)"
                    variant="outlined"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    sx={{ mb: 3 }}
                    helperText={
                      fieldErrors.middleName && formData.middleName.trim()
                        ? 'Middle Name contains invalid characters'
                        : ''
                    }
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
                    helperText={
                      fieldErrors.lastName
                        ? formData.lastName.trim()
                          ? 'Last Name contains invalid characters'
                          : 'Last Name is required'
                        : ''
                    }
                  />
                  <FormControl fullWidth variant="outlined" sx={{ mb: 3 }} error={fieldErrors.designation}>
                    <InputLabel id="designation-label" error={fieldErrors.designation}>
                      Designation
                    </InputLabel>
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
                    {fieldErrors.designation && <FormHelperText error>Designation is required</FormHelperText>}
                  </FormControl>
                  <Autocomplete
                    error={fieldErrors.country}
                    fullWidth
                    options={countries}
                    getOptionLabel={(option) => option}
                    value={formData.country}
                    onChange={(_, newValue) => setFormData({ ...formData, country: newValue })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country of Location"
                        variant="outlined"
                        sx={{ mb: 3 }}
                        error={fieldErrors.country}
                        helperText={fieldErrors.country && 'Country is required'}
                      />
                    )}
                  />
                </CardContent>
              </Card>

              {/* Contact Information Section */}
              <Card sx={{ mb: 3 }}>
                <CardHeader title="Contact Information" />
                <CardContent>
                  <TextField
                    error={fieldErrors.email}
                    fullWidth
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    sx={{ mb: 3 }}
                    helperText={emailErrorMessage}
                  />
                  <TextField
                    error={fieldErrors.mobileNumber || mobileError}
                    fullWidth
                    label="Mobile Number"
                    variant="outlined"
                    name="mobileNumber"
                    value={formData.mobileNumber?.replace(countryCodes[formData.country] || '', '')}
                    onChange={handleMobileChange}
                    sx={{ mb: 3 }}
                    helperText={
                      (fieldErrors.mobileNumber && 'Mobile Number is required') || (mobileError && errorMessage)
                    }
                    disabled={!formData.country}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {formData.country && countryCodes[formData.country]
                            ? `${countryCodes[formData.country]} |`
                            : ''}
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: !!formData.mobileNumber || !!formData.country,
                    }}
                  />
                </CardContent>
              </Card>

              {/* User Credentials Section */}
              <Card sx={{ mb: 3 }}>
                <CardHeader title="User Credentials" />
                <CardContent>
                  <TextField
                    error={fieldErrors.username}
                    fullWidth
                    label="Username"
                    variant="outlined"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    sx={{ mb: 3 }}
                    helperText={fieldErrors.username && 'Username is required'}
                  />
                  <TextField
                    error={fieldErrors.password || passwordError}
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type={formData.showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    sx={{ mb: 3 }}
                    helperText={passwordHelperText || (fieldErrors.password && 'Password is required')}
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
                  <TextField
                    error={fieldErrors.confirmPassword}
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    type={formData.showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    sx={{ mb: 3 }}
                    helperText={fieldErrors.confirmPassword && 'Passwords do not match'}
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
                </CardContent>
              </Card>
              {/* Accept Terms and Conditions */}
              <FormControlLabel
                control={<Checkbox checked={isTermsAccepted} onChange={() => setIsTermsAccepted((prev) => !prev)} />}
                label={
                  <>
                    I agree to the
                    <Link component="button" onClick={openTermsDialog} sx={{ pl: 1 }}>
                      Terms and Conditions
                    </Link>
                  </>
                }
              />

              <TextField
                error={fieldErrors.ipAddress}
                fullWidth
                label="IP Address"
                variant="outlined"
                name="ipAddress"
                value={formData.ipAddress}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
                disabled={!showIpAddress}
                hidden
              />

              <TermsDialog
                open={isTermsDialogOpen}
                onClose={() => setIsTermsDialogOpen(false)}
                onAgree={agreeToTerms}
              />

              {/* Password Guidelines Dialog */}
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

              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                onClick={handleSignup}
                disabled={!isFormValid || !isTermsAccepted}
              >
                Sign Up
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                startIcon={<Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />}
                onClick={handleGoogleSignUp}
                sx={{ mb: 1 }}
              >
                Sign Up with Google
              </Button>

              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                startIcon={<Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />}
                onClick={handleFacebookSignUp}
              >
                Sign Up with Facebook
              </Button>

              {/* {errorMessage && (
                  <Typography variant="body2" color="error" sx={{ my: 2 }}>
                  {errorMessage}
                   </Typography>
                )} */}
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
          )}
        </Container>
      </StyledRoot>
    </>
  );
}
