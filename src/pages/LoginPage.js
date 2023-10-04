import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';

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
              <Button fullWidth size="large" color="inherit" variant="outlined">
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

            <Typography variant="body2" sx={{ mt: 0.25 }}>
              Not yet Verified?
              <Link variant="subtitle2" onClick={() => navigate('/verify')} sx={{ cursor: 'pointer', ml: 1 }}>
                Verify
              </Link>
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              <Link variant="subtitle2">Help</Link> {' | '}
              <Link variant="subtitle2">Privacy</Link> {' | '}
              <Link variant="subtitle2">Terms of Service</Link>
            </Typography>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
