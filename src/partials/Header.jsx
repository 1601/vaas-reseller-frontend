import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Container, Button, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import VortexBlackLogo from '../assets/vortex_logo_black.png';

function Header() {

  const [top, setTop] = useState(true);

  // detect whether user has scrolled the page down by 10px 
  useEffect(() => {
    const scrollHandler = () => {
        // eslint-disable-next-line
      window.pageYOffset > 10 ? setTop(false) : setTop(true)
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);  

  return (
    <AppBar
      position="fixed"
      className={`transition duration-300 ease-in-out ${!top && 'backdrop-blur-sm shadow-lg'}`}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Site branding */}
          <MuiLink component={Link} to="/" underline="none" color="inherit">
            <img src={VortexBlackLogo} height="50" alt="Logo" style={{ height: '5em' }} />
          </MuiLink>

          {/* Site navigation */}
          <nav style={{ flexGrow: 1 }}>
            <ul style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', alignItems: 'center' }}>
              <li>
                <MuiLink component={Link} to="/signin" color="inherit" underline="none">
                  Log in
                </MuiLink>
              </li>
              <li>
                <Button
                  component={Link}
                  to="/onboarding"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  Apply as Retailer
                </Button>
              </li>
              {/* <li>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  color="secondary"
                  disableElevation
                >
                  Sign up
                </Button>
              </li> */}
            </ul>
          </nav>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
