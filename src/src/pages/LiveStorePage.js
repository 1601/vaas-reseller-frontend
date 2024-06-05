import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SecureLS from 'secure-ls';
import {
  Container,
  Stack,
  Link,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Collapse,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import BillsImage from '../images/bills-icon-desktop.png';
import LoadImage from '../images/load-icon-desktop.png';
import VoucherImage from '../images/shop-icon-desktop.png';
import tinboLogo from '../images/tinbo-logo-desktop.svg';
import { useStore } from '../StoreContext';

const ls = new SecureLS({ encodingType: 'aes' });

const LiveStorePage = () => {
  const location = useLocation();
  const { storeData, setStoreData } = useStore();
  const [storeUrl, setStoreUrl] = useState('');
  const [previewStoreUrl, setPreviewStoreUrl] = useState(storeUrl);
  const [showNotFoundError, setShowNotFoundError] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [dialogStage, setDialogStage] = useState(1); // 1 for email, 2 for OTP
  const [dialogWidth, setDialogWidth] = useState('md');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionTimedOut, setIsSessionTimedOut] = useState(false);
  const [openTransactionsDialog, setOpenTransactionsDialog] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showOtpSuccessDialog, setShowOtpSuccessDialog] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [platformVariables, setPlatformVariables] = useState({
    enableBills: true,
    enableLoad: true,
    enableGift: true,
  });
  // const [isPreviewBannerOpen, setIsPreviewBannerOpen] = useState(!storeData.isLive);
  const [isPreviewBannerOpen, setIsPreviewBannerOpen] = useState(true);
  const togglePreviewBanner = () => {
    setIsPreviewBannerOpen(!isPreviewBannerOpen);
  };
  const bannerHeight = isPreviewBannerOpen ? 'auto' : '48px';

  const handleOpenLoginDialog = () => {
    setEmail('');
    setOtp('');
    setOtpError(false);
    setOtpErrorMessage('');
    setEmailError(false);
    setEmailErrorMessage('');
    setOpenLoginDialog(true);
  };

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
    setDialogStage(1);
  };

  const handlePreviewBannerClose = () => {
    setIsPreviewBannerOpen(false);
  };

  const handleOpenTransactionsDialog = async () => {
    try {
      setIsLoading(true);
      const guestDetails = ls.get('guestDetails');
      const customerDetailsFromLS = ls.get('customerDetails');
      const jwtToken = customerDetailsFromLS ? customerDetailsFromLS.jwtToken : null;

      const dealerResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}/user`);
      const dealerId = dealerResponse.data.userId;

      let endpoint;
      let headers = {};

      if (guestDetails) {
        endpoint = `/v1/api/customer/purchase/${guestDetails.customerId}/${dealerId}/guest`;
      } else if (customerDetailsFromLS && jwtToken) {
        endpoint = `/v1/api/customer/purchase/${customerDetailsFromLS.customerId}/${dealerId}`;
        headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        };
      } else {
        console.error('No valid session for transactions');
        setIsLoading(false);
        return;
      }

      const transactionsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, { headers });
      setTransactions(transactionsResponse.data.body);

      setIsLoading(false);
      setOpenTransactionsDialog(true);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching transactions:', error);
    }
  };

  const handleEmailSubmit = async () => {
    setEmailError(false);
    setEmailErrorMessage('');

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/customer/otp`, { email });
      setIsLoading(false);
      if (response.data.message === 'OTP sent successfully') {
        setDialogStage(2);
        setLoginErrorMessage('');
      } else {
        console.error('Failed to send OTP');
        setEmailError(true);
        setEmailErrorMessage('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 429) {
        console.error('Too many OTP attempts:', error.response.data.message);
        setEmailError(true);
        setEmailErrorMessage(error.response.data.message);
      } else if (error.response && error.response.status === 404) {
        setEmailError(true);
        setEmailErrorMessage('No customer found with this email');
      } else {
        console.error('Error sending OTP:', error);
        setEmailError(true);
        setEmailErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  // UseEffect for checking of Customer Timeout
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const customerDetails = ls.get('customerDetails');
  //     if (customerDetails && customerDetails.timeOut) {
  //       const currentTime = Date.now();
  //       const timeElapsed = currentTime - customerDetails.timeOut;

  //       // 15 minutes = 900000 milliseconds
  //       if (timeElapsed > 900000) {
  //         ls.remove('customerDetails');
  //         setIsSessionTimedOut(true);
  //         setIsLoggedIn(false);
  //       }
  //     }
  //   }, 1000 * 60);

  //   return () => clearInterval(interval);
  // }, []);

  const SessionTimeoutDialog = () => {
    return (
      <Dialog
        open={isSessionTimedOut}
        onClose={() => setIsSessionTimedOut(false)}
        aria-labelledby="session-timeout-dialog-title"
        aria-describedby="session-timeout-dialog-description"
      >
        <DialogTitle id="session-timeout-dialog-title">{'Customer Session Timeout'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="session-timeout-dialog-description">
            The current session has expired. Please login again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSessionTimedOut(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
    setOtpError(false);
    setOtpErrorMessage('');
    try {
      let storeUrl = window.location.hostname.split('.')[0];

      if (window.location.hostname === 'localhost' || 'sparkledev' || !storeUrl || storeUrl === 'www') {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1 && pathParts[1]) {
          storeUrl = pathParts[1];
        } else {
          console.error('Store URL not found');
          setIsLoading(false);
          return;
        }
      }

      // Verify OTP
      const otpVerificationResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/customer/verify-otp`,
        {
          email,
          otpCode: otp,
        }
      );

      console.log('OTP Verification Response:', otpVerificationResponse.data);

      if (otpVerificationResponse.data.message === 'OTP verified successfully') {
        // Fetch customer details
        const customerResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/${email}`);
        const customerData = customerResponse.data;
        const { token } = customerData;

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(window.atob(base64));
        const { id: customerId } = decodedPayload;

        console.log('Decoded JWT Payload:', decodedPayload);
        console.log('Extracted Customer ID:', customerId);

        // Fetch dealer ID
        const dealerResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}/user`
        );
        const dealerId = dealerResponse.data.userId;

        ls.set('customerDetails', {
          mobileNumber: customerData.mobileNumber,
          email: customerData.customer.email,
          dealerId,
          customerId,
          timeOut: Date.now(),
          jwtToken: token,
        });

        ls.set('customerOTPIdle', Date.now());

        setIsLoggedIn(true);
        setIsLoading(false);
        setShowOtpSuccessDialog(true);
        setTimeout(() => {
          setShowOtpSuccessDialog(false);
          handleCloseLoginDialog();
        }, 3000);
      } else {
        console.error('Failed to verify OTP');
        setIsLoading(false);
        setOtpError(true);
        setOtpErrorMessage('Incorrect OTP. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 400) {
        console.error('OTP verification error:', error.response.data.message);
        setOtpError(true);
        setOtpErrorMessage(error.response.data.message);
      } else {
        setOtpError(true);
        setOtpErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    ls.remove('customerDetails');
    ls.remove('customerOTPIdle');
    ls.remove('guestDetails');
  };

  // Function to validate email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Email is Invalid');
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
  };

  // Update email state and validate email
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  useEffect(() => {
    const guestDetails = ls.get('guestDetails');
    if (guestDetails) {
      setIsLoggedIn(true);
    }
    setIsGuest(!!guestDetails);

    const customerDetails = ls.get('customerDetails');
    if (!guestDetails && customerDetails) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const checkGuestSessionTimeout = () => {
      const guestDetails = ls.get('guestDetails');
      if (guestDetails && guestDetails.timestamp) {
        const currentTime = Date.now();
        const timeElapsed = currentTime - guestDetails.timestamp;

        if (timeElapsed > 600000) {
          ls.remove('guestDetails');
          setIsGuest(false);
          console.log('Guest session expired. Guest details removed.');
        }
      }
    };

    const intervalId = setInterval(checkGuestSessionTimeout, 60000); 

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const updateDialogWidth = () => {
      const dialogElement = document.getElementById('loginDialog');
      if (dialogElement) {
        setDialogWidth(`${dialogElement.clientWidth}px`);
      }
    };

    window.addEventListener('resize', updateDialogWidth);
    updateDialogWidth();

    return () => window.removeEventListener('resize', updateDialogWidth);
  }, []);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const newStoreUrl = `/${pathParts[1]}`;
    setPreviewStoreUrl(newStoreUrl);
  }, [location.pathname]);

  const gradientStyle = storeData
    ? {
        background: `linear-gradient(45deg, ${storeData.primaryColor}, ${storeData.secondaryColor})`,
      }
    : {};

  const queryParams = new URLSearchParams(location.search);
  const notFound = queryParams.get('notFound');
  const user = ls.get('user');

  // Function to extract the storeUrl from the URL
  const extractStoreUrl = () => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Check for subdomain in the hostname
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') {
      return parts[0];
    }

    // Fallback to path segment if no subdomain
    const pathParts = pathname.split('/');
    if (pathParts.length > 1) {
      const excludedPaths = ['topup', 'bills'];
      if (!excludedPaths.includes(pathParts[1])) {
        return pathParts[1];
      }
    }

    return null;
  };

  useEffect(() => {
    const extractedUrl = extractStoreUrl();
    if (extractedUrl) {
      setStoreUrl(extractedUrl);
      setPreviewStoreUrl(`/${extractedUrl}`);
    }
  }, [location]);

  const getSubdomainOrStoreUrl = () => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Check for subdomain in the hostname
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') {
      return parts[0];
    }

    // Fallback to path segment if no subdomain
    const pathParts = pathname.split('/');
    if (pathParts.length > 1 && pathParts[1] !== 'topup' && pathParts[1] !== 'bills') {
      return pathParts[1];
    }

    return null;
  };

  useEffect(() => {
    const subdomainOrStoreUrl = getSubdomainOrStoreUrl();

    if (subdomainOrStoreUrl && !['topup', 'bills'].includes(subdomainOrStoreUrl)) {
      const fetchStoreData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${subdomainOrStoreUrl}`
          );
          setStoreData(response.data);
          if (response.data.platformVariables) {
            setPlatformVariables(response.data.platformVariables);
          }
        } catch (error) {
          console.error('Could not fetch store data', error);
          setStoreData('domainNotFound');
        }
      };
      fetchStoreData();
    }
  }, [location]);

  // Define the base URL
  let baseUrl;
  if (window.location.hostname.includes('lvh.me')) {
    baseUrl = `http://${storeUrl}.lvh.me:3000`;
  } else {
    baseUrl = `https://${storeUrl}.sparkledev.online`;
  }

  useEffect(() => {
    setPreviewStoreUrl(`/${storeUrl}`);
  }, [storeUrl]);

  useEffect(() => {
    if ((!storeData || storeData === 'domainNotFound') && notFound !== 'true') {
      const timer = setTimeout(() => {
        setShowNotFoundError(true);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if ((storeData && storeData !== 'domainNotFound') || notFound === 'true') {
      setShowNotFoundError(false);
    }

    return () => {};
  }, [storeData, notFound]);

  useEffect(() => {
    if (storeData && storeData.storeUrl) {
      const fetchUserId = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeData.storeUrl}/user`
          );
          const userId = response.data.userId;

          ls.set('encryptedUserId', userId);
        } catch (error) {
          console.error('Could not fetch user ID for store', error);
        }
      };
      fetchUserId();
    }
  }, [storeData]);

  const PreviewBanner = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleBanner = () => {
      setIsExpanded((prev) => !prev);
    };

    return (
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, purple, red)' }}>
        <Collapse in={isExpanded} timeout="auto">
          {!storeData.isLive && (
            <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ typography: 'h6', color: 'white' }}>This store is not yet live</Box>
                <Button
                  variant="contained"
                  color="secondary"
                  href={`/dashboard/store`}
                  style={{ pointerEvents: 'all', margin: 'auto' }}
                >
                  Edit Store
                </Button>
                <IconButton
                  color="inherit"
                  aria-label={isExpanded ? 'collapse' : 'expand'}
                  onClick={toggleBanner}
                  sx={{ marginLeft: 'auto' }}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Container>
            </Toolbar>
          )}
        </Collapse>
        {!isExpanded && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '48px',
            }}
          >
            <IconButton color="inherit" aria-label={isExpanded ? 'collapse' : 'expand'} onClick={toggleBanner}>
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        )}
      </AppBar>
    );
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Styles
  const logoContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 0',
  };

  const logoStyle = {
    maxWidth: isMobile ? '150px' : '200px', // Smaller on mobile
    height: 'auto', // maintain aspect ratio
  };

  const linkButtonStyle = {
    margin: '5px',
    background: '#FFFFFF', // White background for visibility
    padding: '10px 15px',
    borderRadius: '5px',
    color: '#000000', // Black color for text
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Shadow for better visibility
    '&:hover': {
      background: '#F5F5F5', // Slightly darker on hover
    },
    textDecoration: 'none', // Remove underline from links
  };

  const transactionButtonStyle = {
    ...linkButtonStyle,
    marginTop: '10px',
    fontWeight: 'bold', // Bold for visibility
  };

  useEffect(() => {
    const pathname = window.location.pathname.split('/')[1];
    const isSpecialPath = ['topup', 'bills'].includes(pathname);
    // if storeData null, set title to 'Loading Store... | VAAS'
    if (storeData === null) {
      setShowNotFoundError(false);
      document.title = 'Loading Store... | VAAS';
    } else if (storeData && storeData.storeName) {
      document.title = `${storeData.storeName} | VAAS`;
    } else if (!isSpecialPath && (!storeData || storeData === 'domainNotFound') && notFound !== 'true') {
      setShowNotFoundError(true);
      document.title = 'Domain Not Found | VAAS';
    } else {
      setShowNotFoundError(false);
      document.title = 'Store Page | VAAS';
    }
  }, [storeData, notFound]);

  const guestDetails = ls.get('guestDetails');

  if (showNotFoundError) {
    return (
      <div
        style={{
          ...gradientStyle,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '3rem',
        }}
      >
        <h1>Domain Not Found</h1>
      </div>
    );
  }

  if (storeData && ((user && user._id === storeData.ownerId) || storeData.isLive)) {
    return (
      <div
        style={{
          ...gradientStyle,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <PreviewBanner />
        <SessionTimeoutDialog />

        <div style={{ flex: 1, textAlign: 'center' }}>
          <Box style={logoContainerStyle}>
            <img
              src={tinboLogo}
              // src={storeData?.storeLogo || 'https://i.ibb.co/Sx8HSXp/download-removebg-preview.png'}
              alt={`${storeData?.storeName || 'Your Store'}'s Logo`}
              style={logoStyle}
            />
          </Box>
          <Typography variant="h4" gutterBottom>
            {storeData.storeName}
          </Typography>

          <Container>
            <Stack direction={'row'} justifyContent={'center'} spacing={2}>
              {platformVariables.enableBills && (
                <Link
                  href={storeUrl === window.location.hostname.split('.')[0] ? '/bills' : `${previewStoreUrl}/bills`}
                  style={linkButtonStyle}
                >
                  <img src={BillsImage} height="50px" alt="Bills" />
                  Bills
                </Link>
              )}
              {platformVariables.enableLoad && (
                <Link
                  href={storeUrl === window.location.hostname.split('.')[0] ? '/topup' : `${previewStoreUrl}/topup`}
                  style={linkButtonStyle}
                >
                  <img src={LoadImage} height="50px" alt="Load" />
                  Load
                </Link>
              )}
              {platformVariables.enableGift && (
                <Link
                  href={storeUrl === window.location.hostname.split('.')[0] ? '/voucher' : `${previewStoreUrl}/voucher`}
                  style={linkButtonStyle}
                >
                  <img src={VoucherImage} height="50px" alt="Vouchers" />
                  Vouchers
                </Link>
              )}
            </Stack>

            {isLoggedIn ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button onClick={handleOpenTransactionsDialog} variant="contained" style={transactionButtonStyle}>
                      {guestDetails ? 'View Guest Transactions' : 'View Transactions'}
                    </Button>
                    <Button onClick={handleLogout} variant="contained" style={transactionButtonStyle}>
                      Logout
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Button onClick={handleOpenLoginDialog} variant="contained" style={transactionButtonStyle}>
                Login first to view Transactions
              </Button>
            )}
          </Container>

          <Dialog
            open={openLoginDialog}
            onClose={handleCloseLoginDialog}
            id="loginDialog"
            maxWidth="md"
            fullWidth
            PaperProps={{ style: { width: dialogWidth } }}
          >
            <DialogTitle>{dialogStage === 1 ? 'Login' : 'OTP Verification'}</DialogTitle>
            <DialogContent>
              {showOtpSuccessDialog ? (
                <DialogContentText>OTP Verified Successfully!</DialogContentText>
              ) : isLoading ? (
                <DialogContentText>{dialogStage === 1 ? 'Sending OTP...' : 'Verifying OTP...'}</DialogContentText>
              ) : dialogStage === 1 ? (
                <>
                  <DialogContentText>Please enter your email to receive OTP.</DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={email}
                    onChange={handleEmailChange}
                    error={emailError}
                    helperText={emailError ? emailErrorMessage : ''}
                  />
                </>
              ) : (
                <>
                  <DialogContentText>Please enter the OTP sent to your email.</DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="otp"
                    label="OTP"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    error={otpError}
                    helperText={otpError ? otpErrorMessage : ''}
                  />
                </>
              )}
              {loginErrorMessage && <DialogContentText style={{ color: 'red' }}>{loginErrorMessage}</DialogContentText>}
            </DialogContent>
            {!isLoading && !showOtpSuccessDialog && (
              <DialogActions>
                <Button onClick={handleCloseLoginDialog}>Cancel</Button>
                {dialogStage === 1 ? (
                  <Button onClick={handleEmailSubmit} disabled={emailError || email === ''}>
                    Submit
                  </Button>
                ) : (
                  <Button onClick={handleOtpSubmit}>Confirm</Button>
                )}
              </DialogActions>
            )}
          </Dialog>

          <Dialog
            open={openTransactionsDialog}
            onClose={() => setOpenTransactionsDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Transactions</DialogTitle>
            <DialogContent>
              {isLoading ? (
                <DialogContentText>Loading transactions...</DialogContentText>
              ) : transactions.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{transaction.productName}</TableCell>
                          <TableCell>{transaction.amount}</TableCell>
                          <TableCell>{transaction.status}</TableCell>
                          <TableCell>
                            {`${new Date(transaction.date).toLocaleDateString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              year: 'numeric',
                            })} ${new Date(transaction.date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <DialogContentText>No transactions found.</DialogContentText>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenTransactionsDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <Outlet />
        </div>
      </div>
    );
  }

  if (storeData && storeData !== 'domainNotFound' && !storeData.isLive) {
    return (
      <div
        style={{
          ...gradientStyle,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '3rem',
        }}
      >
        <h1>Store is currently Offline</h1>
      </div>
    );
  }

  return <></>;
};

export default LiveStorePage;
