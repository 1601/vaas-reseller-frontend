import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  AppBar,
  Box,
  Toolbar,
  IconButton,
  useMediaQuery,
  Collapse,
  Grid,
  InputAdornment,
  Checkbox,
} from '@mui/material';
import { Icon as Iconify } from '@iconify/react';
import { styled, useTheme } from '@mui/material/styles';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import BillsImage from '../images/bills-icon-desktop.png';
import LoadImage from '../images/load-icon-desktop.png';
import VoucherImage from '../images/shop-icon-desktop.png';
import tinboLogo from '../images/tinbo-logo-desktop.svg';
import { useStore } from '../StoreContext';

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

const filter = createFilterOptions();
const ls = new SecureLS({ encodingType: 'aes' });

const LiveStorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { storeData, setStoreData } = useStore();
  const [storeUrl, setStoreUrl] = useState('');
  const [previewStoreUrl, setPreviewStoreUrl] = useState(storeUrl);
  const [showNotFoundError, setShowNotFoundError] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [dialogStage, setDialogStage] = useState(1); // 1 for email, 2 for OTP
  const [dialogWidth, setDialogWidth] = useState('md');

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reseller, setReseller] = useState(null);
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
  const [isPreviewBannerOpen, setIsPreviewBannerOpen] = useState(true);
  const togglePreviewBanner = () => {
    setIsPreviewBannerOpen(!isPreviewBannerOpen);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmailNew = (email) => {
    // const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Email is Invalid');
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    return emailRegex.test(email);
  };

  useEffect(() => {
    console.log('Email:', email);
    console.log('Password:', password);
    console.log(validateEmailNew(email));
    setIsFormValid(validateEmailNew(email) && password);
  }, [email, password]);

  useEffect(() => {
    const reseller = ls.get('userStore');
    if (reseller) {
      setReseller(reseller);
      setIsLoggedIn(true);
    }
  }, []);

  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  // };
  
  const isXs = useMediaQuery(theme.breakpoints.up('xs')); 
  const isSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

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

 const handleLogin = async ({
    email,
    password,
    rememberMe,
    setLoggingIn,
    setError,
    setDialogOpen,
    setVerificationMessage,
    navigate,
  }) => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please supply all required fields');
      setDialogOpen(true);
      return;
    }
  
    if (!validateEmailNew(email)) {
      setError(true);
      setVerificationMessage('Invalid email format');
      setDialogOpen(true);
      return;
    }
  
    const storeUrl = getStoreUrlFromPath();
  
    try {
      setLoggingIn(true);
      const storeResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}/user`);
      const ownerId = storeResponse.data.userId;
  
      const validateResellerResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/reseller/login`,
        {
          email,
          ownerId,
        }
      );
  
      if (!validateResellerResponse.data.isValid) {
        setError('This reseller does not belong to the specified dealer.');
        setDialogOpen(true);
        setLoggingIn(false);
        return;
      }
  
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
  
      if (role === 'dealer') {
        setError('Dealers must login to their respective CRM');
        setDialogOpen(true);
        setLoggingIn(false);
        return;
      }
  
      const verifiedRole = await verifyRole(token);
  
      if (verifiedRole) {
        ls.set('roleStore', verifiedRole);
      } else {
        console.error('No role received from verifyRole API');
      }
  
      const userData = {
        ...response.data, 
        storeUrl, 
      };
  
      ls.set('tokenStore', token);
      ls.set('userStore', userData);
      setReseller(userData);
      setIsLoggedIn(true);
  
      const dealerId = response.data._id;
  
      // navigate(role === 'admin' ? '/dashboard/admin' : '/dashboard/app', { replace: true });
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
  
const getStoreUrlFromPath = () => {
  const pathSegments = location.pathname.split('/');
  const storeUrl = pathSegments[1];
  return storeUrl;
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
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };


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

  const handleOpenTransactionsDialog = async () => {
    try {
      setIsLoading(true);
      const guestDetails = ls.get('guestDetails');
      const customerDetailsFromLS = ls.get('customerDetails');
      const customerToken = ls.get('customerToken');
      const jwtToken = customerDetailsFromLS && customerDetailsFromLS.jwtToken ? customerDetailsFromLS.jwtToken : customerToken;      

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
    ls.remove('userStore');
    ls.remove('tokenStore');
    ls.remove('roleStore');
    ls.remove('currentCustomer');
    setCustomerUser(null);
    setReseller(null);
    ls.remove('customerDetails');
    ls.remove('customerOTPIdle');
    ls.remove('guestDetails');
  };

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

  const extractStoreUrl = () => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') {
      return parts[0];
    }

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

    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[0] !== 'www') {
      return parts[0];
    }

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

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const logoContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 0',
  };

  const logoStyle = {
    maxWidth: isMobile ? '150px' : '200px',
    height: 'auto',
  };

  const linkButtonStyle = {
    margin: '5px',
    background: '#FFFFFF',
    padding: '10px 15px',
    borderRadius: '5px',
    color: '#000000',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    '&:hover': {
      background: '#F5F5F5',
    },
    textDecoration: 'none',
  };

  const transactionButtonStyle = {
    ...linkButtonStyle,
    marginTop: '10px',
    fontWeight: 'bold',
  };

  useEffect(() => {
    const pathname = window.location.pathname.split('/')[1];
    const isSpecialPath = ['topup', 'bills'].includes(pathname);
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
  const [customerList, setCustomerList] = useState([]);
  const [customerUser, setCustomerUser] = useState(ls.get('currentCustomer'));
  const [openCustomer, toggleOpenCustomer] = useState(false);
  const [dialogValue, setDialogValue] = useState({ fullName: '', email: '', phone: '' });

  const handleCloseCustomerDialog = () => {
    setDialogValue({ fullName: '', email: '', phone: '' });
    toggleOpenCustomer(false);
  };

  const handleSubmitCustomer = async (event) => {
    event.preventDefault();
  
    const body = dialogValue;
    if (!body.email) body.email = "n/a";
  
    body.dealerId = storeData.ownerId;
    body.ipaddress = null;
    body.firstName = body.fullName.split(' ')[0];
    body.lastName = body.fullName.split(' ')[1] || '';
    body.mobileNumber = body.phone;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      if (jsonData.error) {
        alert(jsonData.error);
      } else {
        try {
          const customerResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/${jsonData.body._id}`);
          if (customerResponse.data.token) {
            ls.set('customerToken', customerResponse.data.token);
            setCustomerUser(customerResponse.data.customer);
            setIsLoggedIn(true);
            alert('Customer logged in successfully');
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
          alert('Failed to log in customer');
        }
        
        // Update local storage and state
        setCustomerUser(jsonData.body);
        ls.set('currentCustomer', jsonData.body);
        setDialogValue({
          dealerId: storeData.ownerId,
          firstName: dialogValue.fullName.split(' ')[0],
          lastName: dialogValue.fullName.split(' ')[1] || '',
          email: dialogValue.email,
          phone: dialogValue.phone,
          ipaddress: null,
        });
        handleCloseCustomerDialog();
      }
    } catch (error) {
      alert("Error on submit new customer");
    }
  };
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/all/${storeData.ownerId}`);
        const jsonData = await response.json();
        setCustomerList(jsonData);
      } catch (error) {
        console.error("Error fetching customer list:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        if (storeData && storeData.ownerId) {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/all/${storeData.ownerId}`);
          const jsonData = await response.json();
          if (jsonData.body && Array.isArray(jsonData.body)) {
            setCustomerList(jsonData.body);
          }
        }
      } catch (error) {
        console.error("Error fetching customer list:", error);
      }
    };
    fetchCustomers();
  }, [storeData]);
  
  
  

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/all/${storeData.ownerId}`);
        const jsonData = await response.json();
        setCustomerList(jsonData);
      } catch (error) {
        console.error("Error fetching customer list:", error);
      }
    };
    fetchCustomers();
  }, [dialogValue]);

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
              alt={`${storeData?.storeName || 'Your Store'}'s Logo`}
              style={logoStyle}
            />
          </Box>
          <Typography variant="h4" gutterBottom>
            {storeData.storeName}
          </Typography>
         
          {isLoggedIn ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}> 
                  <Typography variant="h6" gutterBottom>
                    Reseller: {reseller.fullName} {reseller.email}
                  </Typography>
                </div>
              
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button onClick={handleLogout} variant="contained" style={transactionButtonStyle}>
                    Logout
                  </Button>
                </div>
            
            </>
          ) : (
            <>
           <Container>
  <Grid item xs={12} sm={12} md={6}>
    <Typography variant="h6" gutterBottom style={signUpText}>
      Login to Store
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
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(!validateEmail(e.target.value));
              }}
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
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(!e.target.value);
              }}
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
        <Checkbox name="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
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
        handleLogin({
          email,
          password,
          rememberMe,
          setLoggingIn,
          setError,
          setDialogOpen,
          setVerificationMessage,
          navigate,
        });
        if (rememberMe) {
          ls.set('rememberMe', 'true');
        } else {
          ls.remove('rememberMe');
          ls.remove('rememberMeEmail');
          ls.remove('rememberMePassword');
        }
      }}
      disabled={!isFormValid}
    >
      Login
    </Button>
    {error && <div className="error-message">{ error}</div>}
  </Grid>
</Container>

            </>
            
          )}

          <Container>

          {(isLoggedIn && customerUser) && (
            <>
          <Stack direction={"column"} justifyContent={"center"} spacing={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setCustomerUser(null);
                ls.remove('currentCustomer');
                ls.remove('customerToken');
              }}
            >
              Customer: {customerUser.fullName} {customerUser.email} {customerUser.mobileNumber}
            </Button>
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
            <Button onClick={handleOpenTransactionsDialog} variant="contained" style={transactionButtonStyle}>
                {guestDetails ? 'View Guest Transactions' : 'View Transactions'}
            </Button>
          
          </Stack>
          </>
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

          {/* Customer management */}
          <Container>
            

            {(isLoggedIn && !customerUser) && (
              <Stack m={3} direction={"row"} justifyContent={"center"}>
              <Autocomplete
    id="customer-field"
    freeSolo
    options={Array.isArray(customerList) ? customerList : []}
    autoHighlight
    selectOnFocus
    clearOnBlur
    handleHomeEndKeys
    getOptionLabel={(option) => {
      if (typeof option === 'string') {
        return option;
      }
      if (option.inputValue) {
        return option.inputValue;
      }
      return `${option.fullName} ${option.email} ${option.mobileNumber}`;
    }}
    renderInput={(params) => <TextField {...params} label="Customer Name/Phone/Email" />}
    renderOption={(props, option) => (
      <li {...props}>
        {option.fullName} {option.email} {option.mobileNumber}
      </li>
    )}
    sx={{ width: 300 }}
    onChange={async (event, newValue) => {
      if (typeof newValue === 'string') {
        setTimeout(() => {
          toggleOpenCustomer(true);
          setDialogValue({
            fullName: newValue,
            mobileNumber: '',
            email: '',
          });
        });
      } else if (newValue && newValue.inputValue) {
        toggleOpenCustomer(true);
        setDialogValue({
          fullName: newValue.inputValue,
          mobileNumber: '',
          email: '',
        });
      } else if (newValue) {
        setCustomerUser(newValue);
        ls.set('currentCustomer', newValue);
    
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/${newValue._id}`);
          if (response.data.token) {
            ls.set('customerToken', response.data.token);
            setCustomerUser(response.data.customer);
            setIsLoggedIn(true);
            alert('Customer logged in successfully');
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
          alert('Failed to log in customer');
        }
      }
    }}
    filterOptions={(options, params) => {
      const filter = createFilterOptions();
      const filtered = filter(options, params);
      if (params.inputValue !== '') {
        filtered.push({
          inputValue: params.inputValue,
          fullName: `Add "${params.inputValue}"`,
        });
      }
      return filtered;
    }}
  />
  
                <Dialog open={openCustomer} onClose={handleCloseCustomerDialog}>
                  <form onSubmit={handleSubmitCustomer}>
                    <DialogTitle>Add a new Customer</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Can't see the customer in our list? Please, add it!
                      </DialogContentText>
                      <Stack spacing={2}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="fullName"
                          value={dialogValue.fullName}
                          onChange={(event) => setDialogValue({ ...dialogValue, fullName: event.target.value })}
                          label="Name"
                          type="text"
                          required
                          variant="standard"
                        />
                        <TextField
                          margin="dense"
                          id="email"
                          value={dialogValue.email}
                          onChange={(event) => setDialogValue({ ...dialogValue, email: event.target.value })}
                          label="Email"
                          type="email"
                          variant="standard"
                        />
                        <TextField
                          margin="dense"
                          id="phone"
                          value={dialogValue.phone}
                          onChange={(event) => setDialogValue({ ...dialogValue, mobileNumber: event.target.value })}
                          label="Phone"
                          type="text"
                          variant="standard"
                        />
                      </Stack>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseCustomerDialog}>Cancel</Button>
                      <Button type="submit">Add</Button>
                    </DialogActions>
                  </form>
                </Dialog>
              </Stack>
            )}
          </Container>

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
