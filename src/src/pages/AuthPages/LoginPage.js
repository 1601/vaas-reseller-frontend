import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import SecureLS from 'secure-ls';
import { styled, useTheme } from '@mui/material/styles';
import {
  Button,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Link,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Checkbox,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Icon as Iconify } from '@iconify/react';
import { allBanner } from '../../api/public/banner';
import Logo from '../../components/logo';
import defaultProductConfig from '../../sections/auth/login/default_product_config.json';

const StyledContent = styled('div')(({ theme }) => ({
  marginLeft: '100px',
  marginRight: '100px',
  [theme.breakpoints.down('lg')]: {
    marginLeft: '40px',
    marginRight: '40px',
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '10px',
    marginRight: '10px',
  },
  minHeight: 'min-content',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
}));

const ls = new SecureLS({ encodingType: 'aes' });

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [banners, setBanners] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get('token');

    document.title = 'Login | VAAS';

    if (tokenFromURL) {
      ls.set('token', tokenFromURL);

      // Extract email from the token
      const decodedToken = jwtDecode(tokenFromURL);
      const { email } = decodedToken;

      // Fetch user details by email
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/email?email=${email}`)
        .then((response) => {
          const { firstName, lastName, testBalance, accountBalance, accountStatus, _id } = response.data;

          // Save user details in secureLS as 'user'
          ls.set('user', response.data);

          // Navigate to the desired page (e.g., dashboard)
          navigate('/dashboard/app');
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
    }
  }, [location, navigate]);

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

  // Fetching of Banner
  useEffect(() => {
    const fetchAllBanner = async () => {
      try {
        const bannersResponse = await allBanner();
        setBanners(bannersResponse.data.body);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllBanner();
  }, []);

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
        ls.set('rememberMe', true);
      } else {
        ls.remove('rememberMe');
        ls.remove('rememberMeEmail');
        ls.remove('rememberMePassword');
      }

      if (role === 'admin') {
        setError('Admins must login to their respective CRM');
        setDialogOpen(true);
        setLoggingIn(false);
        return;
      }

      if (role === 'reseller') {
        setError('Resellers must login to their dealer login CRM');
        setDialogOpen(true);
        setLoggingIn(false);
        return;
      }

      const verifiedRole = await verifyRole(token);

      if (verifiedRole) {
        ls.set('role', verifiedRole);
      } else {
        console.error('No role received from verifyRole API');
      }

      ls.set('token', token);
      ls.set('user', response.data);

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

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1, // Adjust the number of slides shown
    nextArrow: <ChevronRight />,
    prevArrow: <ChevronLeft />,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 5000,
  };

  const isXs = useMediaQuery(theme.breakpoints.up('xs')); // You can adjust the breakpoint
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const imageStyles = {
    width: '100%',
    borderRadius: '15px',
    objectFit: 'cover',
    ...(isXs && {
      height: '22vh',
    }),
    ...(isSm && {
      height: '30vh',
    }),
    ...(isMd && {
      height: '80vh',
    }),
  };

  const containerStyles = {
    backgroundColor: '#fff',
    p: { xs: 2, sm: 3, md: 4 },
    height: 'max-content',
    alignSelf: 'center',
    ...(isMd && {
      borderRadius: '20px',
    }),
  };

  const ssoStyles = {
    fontSize: '.8rem',
    maxWidth: '100%',
  };

  const formContainer = {
    overflowY: 'hidden',
    maxHeight: 'max-content',
    whiteSpace: 'pre-line',
    mb: 1,
    ...(isSm && {
      overflowY: 'hidden',
      maxHeight: 'max-content',
    }),
    ...(isMd && {
      overflowY: 'auto',
      maxHeight: 250,
    }),
  };

  const signUpText = {
    ...(isXs && {
      marginTop: '30px',
      fontSize: '1.6rem',
    }),
    ...(isMd && {
      marginTop: '0px',
      fontSize: '2rem',
    }),
  };

  const containerStyle = {
    ...(isXs && {
      padding: '0px',
    }),
    ...(isMd && {
      padding: '24px 16px',
    }),
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
        config: defaultProductConfig,
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

  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
    const scope = encodeURIComponent(
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    );

    const state = encodeURIComponent(window.location.origin);

    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}&state=${state}`;

    window.location.href = googleLoginUrl;
  };

  const handleFacebookLogin = () => {
    const clientId = process.env.REACT_APP_FACEBOOK_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${window.location.origin}${process.env.REACT_APP_FACEBOOK_REDIRECT_URI}`);
    const state = encodeURIComponent(window.location.origin); // Optional: A string that represents app state. It will be passed back to you at the redirect URI.

    // Define the scope of access that the application is requesting.
    const scope = encodeURIComponent('email,public_profile');

    // Construct the Facebook OAuth URL
    const facebookLoginUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&response_type=code`;

    // Redirect the user to the Facebook OAuth page
    window.location.href = facebookLoginUrl;
  };

  return (
    <>
      <title> Login | VAAS </title>
      <Container maxWidth={false} style={containerStyle}>
        <Box sx={containerStyles}>
          {isXs === true && isMd === false && (
            <Logo sx={{ alignSelf: 'center', width: ['80%', '80%', '100%'], mx: 'auto', display: 'block', mb: 4 }} />
          )}
          <Grid container alignItems="start">
            <Grid item xs={12} sm={12} md={6}>
              <div style={imageStyles}>
                <Slider {...settings}>
                  {banners &&
                    banners.map((data, index) => (
                      <div
                        style={{
                          width: '100%',
                          height: '100vh',
                        }}
                        key={index}
                      >
                        <img src={data.url} alt={`Slide ${index}`} style={imageStyles} />
                      </div>
                    ))}
                </Slider>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <StyledContent>
                {isMd === true && (
                  <Logo sx={{ alignSelf: 'center', width: '50%', height: 'auto', mx: 'auto', display: 'block' }} />
                )}
                <Typography variant="h6" gutterBottom style={signUpText}>
                  Login
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Continue to Vortex
                </Typography>
                <Box sx={formContainer}>
                  <Box sc={{ mb: 5 }}>
                    <Grid container>
                      <Grid item xs={12} mt={2} sm={12} md={12}>
                        <TextField
                          error={emailError || !!verificationMessage}
                          fullWidth
                          sx={{ mb: 2 }}
                          variant="outlined"
                          name="email"
                          label="Email"
                          value={email}
                          onChange={handleEmailChange}
                          helperText={emailErrorMessage || verificationMessage}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12}>
                        <TextField
                          error={passwordError}
                          fullWidth
                          sx={{ mb: 1 }}
                          variant="outlined"
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
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 0.5 }}>
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
                  sx={{ mt: 1.5 }}
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

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    OR
                  </Typography>
                </Divider>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Button
                      fullWidth
                      size="large"
                      color="inherit"
                      variant="outlined"
                      onClick={handleGoogleLogin}
                      startIcon={<Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />}
                      sx={ssoStyles}
                    >
                      <Typography sx={ssoStyles}>Continue with Google</Typography>
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Button
                      fullWidth
                      size="large"
                      color="inherit"
                      variant="outlined"
                      onClick={handleFacebookLogin}
                      startIcon={<Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />}
                    >
                      <Typography sx={ssoStyles}>Continue with Facebook</Typography>
                    </Button>
                  </Grid>
                </Grid>

                {/* Error Dialog */}
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

                <Typography variant="body2" sx={{ mt: 3 }}>
                  Don't have a Vortex ID?
                  <Link variant="subtitle2" onClick={() => navigate('/signup')} sx={{ cursor: 'pointer', ml: 1 }}>
                    Sign Up
                  </Link>
                </Typography>

                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                  <Link variant="subtitle2" component="button" onClick={() => handleNavigation('/help')}>
                    Help
                  </Link>{' '}
                  {' | '}
                  <Link variant="subtitle2" component="button" onClick={() => handleNavigation('/data-privacy-policy')}>
                    Privacy
                  </Link>{' '}
                  {' | '}
                  <Link
                    variant="subtitle2"
                    component="button"
                    onClick={() => handleNavigation('/terms-and-conditions')}
                  >
                    Terms of Service
                  </Link>
                </Typography>
              </StyledContent>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
