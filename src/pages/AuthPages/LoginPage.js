import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';
// sections
import { LoginForm } from '../../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
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

const StyledFooter = styled('div')({
  alignSelf: 'flex-end',
  mb: 2,
});

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();
  const location = useLocation();
  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get('token');

    if (tokenFromURL) {
      localStorage.setItem('token', tokenFromURL);

      // Extract email from the token
      const decodedToken = jwtDecode(tokenFromURL);
      const { email } = decodedToken;

      // Fetch user details by email
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/email?email=${email}`)
        .then((response) => {
          const { firstName, lastName, testBalance, accountBalance, accountStatus, _id } = response.data;

          // Save user details in localStorage as 'user'
          localStorage.setItem(
            'user',
            JSON.stringify({
              _id,
              firstName,
              lastName,
              email,
              testBalance,
              accountBalance,
              accountStatus,
            })
          );

          // Navigate to the desired page (e.g., dashboard)
          navigate('/dashboard/app');
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
    }
  }, [location, navigate]);

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

  return (
    <>
      <Helmet>
        <title> Login | VAAS </title>
      </Helmet>

      <StyledRoot>
        {/* {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )} */}

        <Container maxWidth="sm" sx={{ backgroundColor: '#fff' }}>
          <Logo
            sx={{
              alignSelf: 'center',
              // position: 'fixed',
              // top: { xs: 16, sm: 24, md: 40 },
              // left: { xs: 16, sm: 24, md: 40 },
            }}
          />
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Login
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Continue to Vortex {''}
              {/* <Link variant="subtitle2">Get started</Link> */}
            </Typography>

            <LoginForm />

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <Stack direction="column" spacing={2}>
              <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleGoogleLogin}>
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
                Continue with Google
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
                Continue with Facebook
              </Button>

              {/* <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
              </Button> */}
            </Stack>
            <Stack direction="row" spacing={2}>
              <Typography variant="body2" sx={{ mb: 5 }}>
                Don't have a Vortex ID?
                <Link variant="subtitle2" onClick={() => navigate('/signup')} sx={{ cursor: 'pointer', ml: 1 }}>
                  Sign Up
                </Link>
              </Typography>
            </Stack>

            {/* <Typography variant="body2" sx={{ mt: 0.25 }}>
              Not yet Verified?
              <Link variant="subtitle2" onClick={() => navigate('/verify')} sx={{ cursor: 'pointer', ml: 1 }}>
                Verify
              </Link>
            </Typography> */}
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              <Link variant="subtitle2" component="button" onClick={() => handleNavigation('/help')}>
                Help
              </Link>{' '}
              {' | '}
              <Link variant="subtitle2" component="button" onClick={() => handleNavigation('/data-privacy-policy')}>
                Privacy
              </Link>{' '}
              {' | '}
              <Link variant="subtitle2" component="button" onClick={() => handleNavigation('/terms-and-conditions')}>
                Terms of Service
              </Link>
            </Typography>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
