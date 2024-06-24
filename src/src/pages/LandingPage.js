import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, Grid, AppBar, Toolbar, Card, CardContent, IconButton, Fab, ButtonBase } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faCommentDots, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import 'react-lazy-load-image-component/src/effects/blur.css';
import "../index.css"

// Images
import pinoyFavoritesIcon from '../assets/pinoy-favorites-icon-desktop.png';
import epadalaIcon from '../assets/epadala-icon-desktop.png';
import loadIcon from '../assets/load-icon-desktop.png';
import billsIcon from '../assets/bills-icon-desktop.png';
import ewalletIcon from '../assets/e-wallet-icon-desktop.png';
import foodIcon from '../assets/food-icon-desktop.png';
import shopIcon from '../assets/shop-icon-desktop.png';
import egovIcon from '../assets/e-gov-icon-desktop.png';
import healthWellnessIcon from '../assets/health-wellness-icon-desktop.png';
import entertainmentIcon from '../assets/entertainment-icon-desktop.png';
import shopeePayIcon from '../assets/shopee-pay-icon.png';
import lazadaWalletIcon from '../assets/lazada-wallet-icon.png';
import registerNowBanner from '../assets/register-now-banner-desktop.png';
import topBossingBanner from '../assets/top-bossing-desktop.png';
import tinboLogo from '../assets/tinbo-logo-desktop-header.svg';
import productServicesIcon from '../assets/product-services-icon-desktop.png';
import bossingFavoriteIcon from '../assets/bossing-favorite-icon-desktop.png';
import pgcMobileFooter from '../assets/pgc-mobile-footer.png';
import logoNavCollapse from '../assets/logo-nav-collapse.svg';

const sections = [
  {
    title: "Products & Services",
    items: [
      { title: "Pinay Favorites", image: pinoyFavoritesIcon },
      { title: "ePadala", image: epadalaIcon },
      { title: "Load", image: loadIcon },
      { title: "Bills", image: billsIcon },
      { title: "E-Wallet", image: ewalletIcon },
      { title: "Food", image: foodIcon },
      { title: "Shop", image: shopIcon },
      { title: "Government", image: egovIcon },
      { title: "Health & Wellness", image: healthWellnessIcon },
      { title: "Entertainment", image: entertainmentIcon },
    ]
  },
  {
    title: "Bossing's Favorite Suki",
    items: [
      { title: "ShopeePay", image: shopeePayIcon },
      { title: "Lazada Wallet", image: lazadaWalletIcon },
    ]
  }
];

const Header = () => (
  <AppBar position="sticky" sx={{ backgroundColor: '#FFFFFF', color: '#ff4f00', boxShadow: 'none' }}>
    <Toolbar sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="img" src={tinboLogo} alt="Tinbo Logo" sx={{ height: 50, marginRight: 1 }} />
        {/* <Typography variant="subtitle1" sx={{ color: '#00b4d8' }}>Tindahan Ni Bossing</Typography> */}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box component="img" src={logoNavCollapse} alt="Icon 1" sx={{ height: 24 }} />
        <IconButton>
          <FontAwesomeIcon icon={faCircleQuestion} style={{ fontSize: 24, color: '#ff4f00' }} />
        </IconButton>
        <IconButton>
          <FontAwesomeIcon icon={faCommentDots} style={{ fontSize: 24, color: '#ff4f00' }} />
        </IconButton>
        <Button variant="outlined" color="primary" sx={{ borderColor: '#ff4f00', color: '#ff4f00', marginLeft: 1 }}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/signup';
          }}
        >
          Sign Up
        </Button>
        <Button variant="outlined" color="primary" sx={{ borderColor: '#ff4f00', color: '#ff4f00' }}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/login';
          }}
        >
          Log In
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

const HeroHome = () => (
  <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', py: 5 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Typography variant="h3" sx={{ color: '#ff4f00', fontWeight: 'bold', textAlign: 'left' }}>
      Welcome, Resellers!
      </Typography>
      
      <Button
        component="a"
        href="#"
        sx={{
          backgroundColor: '#ff4f00 !important',
          color: '#ffffff !important',
          padding: '8px 16px',
          borderRadius: '4px',
          textTransform: 'none',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#ff4f00 !important'
          }
        }}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/signup';
        }}
      >
        REGISTER NOW FOR FREE
      </Button>
    </Box>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', gap: 2 }}>
      <Card sx={{ flex: 1 }}>
        <LazyLoadImage
          src={registerNowBanner}
          alt="Register & Get Your Smart Virtual Number"
          effect="blur"
          width="100%"
          height="auto"
        />
      </Card>
      <Card sx={{ flex: 1.5 }}>
        <LazyLoadImage
          src={topBossingBanner}
          alt="Mag-Tinbo Na & Be The Grand Bossing!"
          effect="blur"
          width="100%"
          height="auto"
        />
      </Card>
    </Box>
  </Container>
);

const ProductsServices = () => (
  <Container maxWidth="lg" sx={{ py: 5, borderRadius: 2, boxShadow: 3, backgroundColor: '#f0f0f0' }}>
    <Box sx={{ backgroundColor: '#ff5733', borderRadius: '8px 8px 0 0', px: 3, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" gutterBottom>
          Reseller Services
          </Typography>
          <Typography variant="subtitle1">
          All the services you need to grow your business!
          </Typography>
        </Box>
        <Box component="img" src={productServicesIcon} alt="Products & Services" sx={{ height: 50 }} />
      </Box>
    </Box>
    <Box sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: '0 0 8px 8px' }}>
      <Grid container spacing={4} sx={{ textAlign: 'center' }}>
        {sections[0].items.map((item, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Card sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <LazyLoadImage
                  src={item.image}
                  alt={item.title}
                  effect="blur"
                  width="60%"
                  height="auto"
                  style={{ margin: '0 auto' }}
                />
                <Typography variant="h6" sx={{ color: '#000000', fontWeight: 'bold', mt: 1 }}>
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Container>
);

const FavoriteSuki = () => (
  <Container maxWidth="lg" sx={{ py: 5, borderRadius: 2, boxShadow: 3, backgroundColor: '#f0f0f0' }}>
    <Box sx={{ backgroundColor: '#00b4d8', borderRadius: '8px 8px 0 0', px: 3, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff' }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" gutterBottom>
          Reseller's Favorite Deals
          </Typography>
          <Typography variant="subtitle1">
          Get exclusive deals on top platforms for your customers!
          </Typography>
        </Box>
        <Box component="img" src={bossingFavoriteIcon} alt="Bossing's Favorite Suki" sx={{ height: 50 }} />
      </Box>
    </Box>
    <Box sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: '0 0 8px 8px' }}>
      <Grid container spacing={4} sx={{ textAlign: 'center' }}>
        {sections[1].items.map((item, index) => (
          <Grid item xs={6} key={index}>
            <Card sx={{ backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <LazyLoadImage
                  src={item.image}
                  alt={item.title}
                  effect="blur"
                  width="60%"
                  height="auto"
                  style={{ margin: '0 auto' }}
                />
                <Typography variant="h6" sx={{ color: '#000000', fontWeight: 'bold', mt: 1 }}>
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Container>
);

const Footer = () => (
  <Box sx={{ py: 3, backgroundColor: '#f0f0f0' }}>
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: 1 }}>
        <LazyLoadImage
          src={pgcMobileFooter}
          alt="PLDT Footer Logo"
          effect="blur"
          width="100px"
          height="auto"
        />
        <Typography variant="body2">© 2024 PLDT Global. All rights reserved.</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/terms-and-conditions" sx={{ color: '#00b4d8' }}>Terms and Conditions</Button>
          <Button color="inherit" component={RouterLink} to="/privacy-policy" sx={{ color: '#00b4d8' }}>Privacy Policy</Button>
          <Button color="inherit" component={RouterLink} to="/promo-mechanics" sx={{ color: '#00b4d8' }}>Promo Mechanics</Button>
        </Box>
      </Box>
    </Container>
  </Box>
);

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Fab
      color="primary"
      onClick={scrollToTop}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        backgroundColor: '#ff4f00',
        color: '#ffffff',
        '&:hover': {
          backgroundColor: '#ff4f00'
        },
        display: showButton ? 'flex' : 'none'
      }}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </Fab>
  );
};

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Tinbo</title>
      </Helmet>

      <div className="flex flex-col min-h-screen overflow-hidden" style={{ backgroundColor: "#fff" }}>
        {/*  Site header */}
        <Header />

        {/*  Page content */}
        <main className="flex-grow">
          {/*  Page sections */}
          <HeroHome />
          {/* this section should be color f0f0f0 */}
          <section className="py-5" style={{ backgroundColor: "#f0f0f0" }}>
            <ProductsServices />
            <FavoriteSuki />
          </section>
        </main>

        {/* Site footer */}
        <Footer />

        {/* Scroll to top button */}
        <ScrollToTop />
      </div>
    </>
  );
}
