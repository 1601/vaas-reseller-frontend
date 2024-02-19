import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SecureLS from 'secure-ls';
import {
  Container,
  Stack,
  Link,
  Button,
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
} from '@mui/material';
import axios from 'axios';
import BillsImage from '../images/logos/bills.svg';
import LoadImage from '../images/logos/load.svg';
import VoucherImage from '../images/logos/voucher.svg';
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
  const [customerFound, setCustomerFound] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openTransactionsDialog, setOpenTransactionsDialog] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showOtpSuccessDialog, setShowOtpSuccessDialog] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [platformVariables, setPlatformVariables] = useState({
    enableBills: true,
    enableLoad: true,
    enableGift: true,
  });

  const handleOpenLoginDialog = () => {
    setOpenLoginDialog(true);
  };

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
    setDialogStage(1);
  };

  const handleOpenTransactionsDialog = async () => {
    try {
      setIsLoading(true);
      const dealerResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}/user`);
      const dealerId = dealerResponse.data.userId;

      let customerId;

      // Check if customerDetails exist in secure-ls
      const customerDetailsFromLS = ls.get('customerDetails');

      if (customerDetailsFromLS) {
        // If customerDetails exist in secure-ls, use them
        customerId = customerDetailsFromLS.customerId;
      } else {
        // If customerDetails not in secure-ls, fetch it from the backend
        const customerResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/${email}`);
        customerId = customerResponse.data._id;

        // Store customerDetails in secure-ls for future use
        ls.set('customerDetails', customerResponse.data);
      }

      // Fetch transactions
      const transactionsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/purchase/${customerId}/${dealerId}`
      );
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
      if (error.response && error.response.status === 404) {
        setEmailError(true);
        setEmailErrorMessage('No customer found with this email');
      } else {
        console.error('Error sending OTP:', error);
        setEmailError(true);
        setEmailErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleOtpSubmit = async () => {
    setIsLoading(true);
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

        // console.log('Store URL:', storeUrl);

        // Fetch dealer ID
        const dealerResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}/user`
        );
        const dealerId = dealerResponse.data.userId;

        ls.set('customerDetails', {
          mobileNumber: customerData.mobileNumber,
          email: customerData.email,
          dealerId,
          customerId: customerData._id,
        });

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
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error during OTP verification or fetching customer details:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    ls.remove('customerDetails');
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
    const customerDetails = ls.get('customerDetails');
    if (customerDetails) {
      setIsLoggedIn(true);
    }
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

  useEffect(() => {
    const pathname = window.location.pathname.split('/')[1];
    const isSpecialPath = ['topup', 'bills'].includes(pathname);

    if (storeData && storeData.storeName) {
      document.title = `${storeData.storeName} | VAAS`;
    } else if (!isSpecialPath && (!storeData || storeData === 'domainNotFound') && notFound !== 'true') {
      setShowNotFoundError(true);
      document.title = 'Domain Not Found | VAAS';
    } else {
      setShowNotFoundError(false);
      document.title = 'Store Page | VAAS';
    }
  }, [storeData, notFound]);

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
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        {/* banner to alert the user that this is a preview only if the storeData is not yet live and the owner is the user.id -
        the preview is always there but I should be able to interact still on the UI */}
        <div
          style={{
            display: storeData.isLive ? 'none' : 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: 0.3,
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            fontSize: '1.5rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1>Preview Only</h1>
            <h3>This store is not yet live</h3>
            <Button variant="outlined" color="inherit" href={`/dashboard/store`} style={{ pointerEvents: 'all' }}>
              Edit Store
            </Button>
          </div>
        </div>
        <Outlet />
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center', 
              height: '100%', 
              width: '100%', 
            }}
          >
            <img
              src={storeData ? storeData.storeLogo : '/vortex_logo_black.png'}
              alt={`${storeData ? storeData.storeName : 'Your Store'}'s Logo`}
              style={{
                maxWidth: '400px',
                maxHeight: '400px',
                margin: '0',
              }}
            />
          </div>
          <h1>{storeData.storeName}</h1>
          {/* <h1>{`${location.pathname}`}</h1> */}

          <Container>
            {/* Using Flexbox to Center the Items */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '16px',
                '@media (max-width: 600px)': {
                  flexDirection: 'column',
                  alignItems: 'center',
                },
              }}
            >
              {platformVariables.enableBills && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Link
                    href={storeUrl === window.location.hostname.split('.')[0] ? '/bills' : `${previewStoreUrl}/bills`}
                  >
                    <img src={BillsImage} height="100px" alt="Home" />
                    <div className="menu--text">Bills</div>
                  </Link>
                </div>
              )}
              {platformVariables.enableLoad && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Link
                    href={storeUrl === window.location.hostname.split('.')[0] ? '/topup' : `${previewStoreUrl}/topup`}
                  >
                    <img src={LoadImage} height="100px" alt="Express" />
                    <div className="menu--text">Load</div>
                  </Link>
                </div>
              )}
              {platformVariables.enableGift && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Link
                    href={
                      storeUrl === window.location.hostname.split('.')[0] ? '/voucher' : `${previewStoreUrl}/voucher`
                    }
                  >
                    <img src={VoucherImage} height="100px" alt="Express" />
                    <div className="menu--text">Vouchers</div>
                  </Link>
                </div>
              )}
            </div>

            <Stack m={3} direction={'column'} alignItems={'center'} justifyContent={'center'}>
              {isLoggedIn ? (
                <>
                  <Link
                    onClick={handleOpenTransactionsDialog}
                    style={{ cursor: 'pointer', textDecoration: 'underline', marginBottom: '10px' }}
                  >
                    View Transactions
                  </Link>
                  <Link onClick={handleLogout} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                    Logout
                  </Link>
                </>
              ) : (
                <Link onClick={handleOpenLoginDialog} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                  Login first to view Transactions
                </Link>
              )}
            </Stack>
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
