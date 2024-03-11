import React, { useState, useEffect, useReducer, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SecureLS from 'secure-ls';
import { Box, Button, Divider, Stack, Grid, TextField, Toolbar, Typography, InputBase } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { navigate } from "gatsby"
import VortexTopupCard from '../../Vortex/components/VortexTopupCard';

// import moment from "moment"
import VortexFormToolbar from '../../Vortex/components/VortexFormToolbar';
import {
  IsloadingProducts,
  ReloadProductsTrigger,
  VortexContextError,
  VortexProducts,
} from '../../Vortex/context/VortexContext';
import { createVortexTopupTransaction } from '../../api/public/vortex/topup_service';
import { getVortexTokenBase, signIn } from '../../api/public/vortex/token_service';
import { getPlatformVariables } from '../../api/public/vortex/platform_vars';
import {
  saveVortexTopUpTransaction,
  updateVortexByRefId,
  getVortexTransactionByRefId,
} from '../../api/public/vortex/transaction_db';
import VortexError from '../../Vortex/components/VortexError';
import VortexProductBrandCard from '../../Vortex/components/VortexProductBrandCard';
// import CenteredProgress from '../../Vortex/components/centeredProgress';
// import { sparkleTopupFee } from "../config/config"
// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
// import "../../assets/css/HorizontalCardList.css"
// import { LoginState, PlatformVariables, StoreStatus, UserStatus } from '../../Vortex/globalstates';
import { primaryVortexTheme } from '../../Vortex/config/theme';
import VortexBottomGradient from '../../Vortex/components/VortexBottomGradient';
import { countryCodes } from '../../components/country/countryNumCodes';
import { countries } from '../../components/country/CountriesList';

import { validateMobileNumber } from '../../components/validation/validationUtils';
import { mobileNumberLengths } from '../../components/country/countryNumLength';
// import BottomNavigator from '../../Homemade/BottomNavigator';
// import useLoggedUser from "../../../custom-hooks/useLoggedUser"
// import VortexVoucherSearchBar from '../../Vortex/components/VortexVoucherSearchBar';

import {
  getContinents,
  addToInternationalLoad,
  getCountriesOnTopUp,
  getBrandsByCountry,
  getProductsOfBrand,
} from '../../Vortex/functions/getCountriesOnTopUp';
import VortexTopUpBrandProducts from '../../Vortex/components/VortexTopUpBrandProducts';
import VortexContinentList from '../../Vortex/components/VortexContinentList';
import VortexCountriesList from '../../Vortex/components/VortexTopUpCountriesList';
import VortexTopUpInternationalBrands from '../../Vortex/components/VortexTopUpInternationalBrands';

import localTelecomRankProvider from '../../Vortex/functions/localTelecomRankProvider';
import BlockPrompt from '../../Vortex/Prompts/BlockPrompt';
import StoreBlockPrompt from '../../Vortex/Prompts/StoreBlockPrompt';
// import { getStoreEnvById } from '../../api/public/store-env';
import ServiceDisabledPrompt from '../../Vortex/Prompts/ServiceDisabledPrompt';

function convertParamToCat(paramCategory) {
  switch (paramCategory) {
    case 'electronic_load':
      return 'Electronic Load';
    case 'food':
      return 'Food';
    case 'shop':
      return 'Shop';
    case 'data_bundles':
      return 'Data Bundles';
    default:
      return 'Electronic Load';
  }
}

const createLink = async (amount, description) => {
  console.log(`Creating link with amount: ${amount} and description: ${description}`);
  const url = 'https://api.paymongo.com/v1/links';

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Basic c2tfdGVzdF9McEhlRFVzTlJmR3B0WXh3VjZWMmtSTEg6S29yb2tvcm8xNyEhIQ==');

  const raw = JSON.stringify({
    data: {
      attributes: {
        amount,
        description,
        remarks: 'remarks test',
      },
    },
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  try {
    const response = await fetch(url, requestOptions);

    if (response.ok) {
      const responseData = await response.json();
      return responseData.data.attributes.checkout_url;
    }

    // Log the error response from the API
    const errorResponse = await response.json();
    console.error('API response error:', errorResponse);
    return null;
  } catch (error) {
    console.error('Error while making the request:', error);
    return null;
  }
};

const initialTransactionDataState = {};

const LoginPage = () => (
  <Box>
    <div> Login Page</div>
  </Box>
);

const BottomNavigator = () => (
  <Box>
    <div> </div>
  </Box>
);

const topUpProducts = [];

const ProductContext = React.createContext();

const VortexTopUp = () => {
  // const params = useParams()

  const forApi = signIn('ilagandarlomiguel@gmail.com', 'GrindGr@titud3');

  const defaultPlatformVariables = {
    billsCurrencyToPeso: 1,
    topupCurrencyToPeso: 1,
    giftCurrencyToPeso: 1,
    billsConvenienceFee: 5.25,
    topupConvenienceFee: 0,
    createdAt: '2022-07-20T13:37:28.743Z',
    currencySymbol: 'PHP',
    enableBills: true,
    enableGift: true,
    enableLoad: true,
    environmentName: 'Dubai Default Environment',
    giftConvenienceFee: 5.25,
    isArchived: false,
    updatedAt: '2022-10-05T13:11:51.615Z',
    _id: '62d805186eab3a1cd07725ca',
  };

  const [platformVariables, setPlatformVariables] = useState(defaultPlatformVariables);

  useEffect(() => {
    const fetchPlatformVariables = async () => {
      // console.log('Attempting to fetch platform variables...');
      try {
        const [data] = await getPlatformVariables();
        // console.log('Successfully fetched platform variables:', data);
        setPlatformVariables((prevState) => {
          const mergedData = { ...prevState, ...data };
          // console.log('Merged platform variables:', mergedData);
          return mergedData;
        });
      } catch (error) {
        console.error('Failed to fetch platform variables:', error);

        // Reload the page if encountering "Could not parse JSON" error
        if (error.message.includes('Could not parse JSON')) {
          console.log('Encountered JSON parse error, reloading page.');
          window.location.reload();
        }
      }
    };

    fetchPlatformVariables();
  }, []);

  const navigate = useNavigate();

  const ls = new SecureLS({ encodingType: 'aes' });

  const { userId } = useParams();

  const [error, setErrorData] = useState({ isError: false, message: '' });

  const [retry, setRetry] = useState(null);

  const [userStatus, setUserStatus] = useState(null);

  const [storeStatus, setStoreStatus] = useState(null);

  const [transactionDocId, setTransactionDocId] = useState(null);

  const [transactionReferenceId, setTransactionReferenceId] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  // console.log('activeStep:', activeStep);

  const [transactionData, setTransactionData] = useState(initialTransactionDataState);

  const resetTransactionData = () => {
    setTransactionData(initialTransactionDataState);
  };

  const [accountOrMobileNumber, setAccountOrMobileNumber] = useState('');

  const [selectedBrand, setSelectedBrand] = useState('');

  const [selectedProduct, setSelectedProduct] = useState({});

  const [brands, setbrands] = useState([]);

  const [data, setData] = useContext(VortexProducts);

  const [renderData, setRenderData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // const [isLoggin, setisLoggin] = useState(null);

  // const [platformVariables, setPlatformVariables] = useContext(PlatformVariables)

  // const [isLoadingPrivate, setIsLoadingPrivate] = useState(false);

  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  // const { getUser } = useLoggedUser()

  // const [productCategories, setProductCategories] = useState([])

  const [decryptedUserId, setDecryptedUserId] = useState(null);

  const [productInfo, setProductInfo] = useState({});

  const [transactionDetails, setTransactionDetails] = useState({
    status: 200,
    message: 'Fulfillment Failed.',
    clientRequestId: 'SPARKLEPWAh5f7n7sasGd9gD',
    referenceNumber: '220223170501bkka',
    accountName: 'Jay ar Sta Ana',
    mobileNumber: '639273342196',
    wallet: 'MAIN',
    walletType: 'TU',
    currency: 'PHP',
    walletDeduction: 0,
    beginningBalance: 500,
    endingBalance: 500,
    transactionDate: '2022-02-23T17:05:01.487Z',
    productName: 'Smart Load 100',
    productPrice: 100,
    dispensingDiscount: 4.44,
    dealerDispensingDiscount: 0,
    dealerCommission: 0,
    fulfillmentResponse: {
      id: '220223170501bkka',
      status: 'FAILED',
      remarks:
        '23-Feb 17:05: Error is encountered in Target Number validation. Contact SMART Hotline. This message is free. Ref:119135804015|1|',
      returnCode: '5217',
      isSuccess: false,
    },
    smartReferenceNumber: '119135804015',
  });

  // const [selectedCategory, setSelectedCategory] = useReducer(filterProductsBySelectedCategory, 'Electronic Load');

  // useEffect(async () => {
  //   setSelectedCategory(convertParamToCat(params.category))
  // }, [data])

  // useEffect(async () => {
  //   let x = await getPlatformVariables()
  //   setPlatformVariables(x[0])
  // }, [])

  // useEffect(async () => {

  //   let store = ls.get("store")

  //   let storeEnvId = store?.storeEnv?._id || store?.storeEnv

  //   let x = await getStoreEnvById({ storeEnvId: storeEnvId })

  //   setPlatformVariables(x)

  // }, [])

  const [topupToggles, setTopupToggles] = useState({});
  const [isDialogOpen, setDialogOpen] = useState(false);

  let dialogResolve; // This will hold the resolve function of the promise

  const handleOpenDialog = () => {
    return new Promise((resolve) => {
      dialogResolve = resolve; // Store the resolve function
      setDialogOpen(true);
      // No need to reassign handleDialogClose
    });
  };

  const handleDialogClose = (result, detailsSubmitted) => {
    setDialogOpen(false);
    if (dialogResolve) {
      dialogResolve(result);
    }
    // setUserDetailShown(detailsSubmitted); // Update this line
  };

  const UserDetailsDialog = ({ open, onUserDetailsSubmit, handleDialogClose }) => {
    const [selectedCountry, setSelectedCountry] = useState('');
    const [userDetails, setUserDetails] = useState({
      phoneNumber: '',
      email: '',
      firstName: '',
      lastName: '',
      ipAddress: '',
      country: '',
    });
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
      const { phoneNumber, email } = userDetails;
      const isPhoneNumberValid = phoneNumber.trim() !== '' && /^\d+$/.test(phoneNumber);
      const isEmailValid = email.trim() !== '' && validateEmail(email);
      setIsValid(isPhoneNumberValid || isEmailValid);
    }, [userDetails]);

    // Function to fetch IP address
    const externalIpAddCur = async () => {
      try {
        const ipResult = await axios.get('https://api64.ipify.org?format=text');
        setUserDetails((prevState) => ({
          ...prevState,
          ipAddress: ipResult.data,
        }));
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    const handleChange = (prop) => (event, newValue) => {
      // newValue is only for the Autocomplete component, use event.target.value for TextField
      const value = prop === 'country' ? newValue : event.target.value;

      if (prop === 'country') {
        // If the country is changed, update only the country state and reset the phone number
        setUserDetails((prevState) => ({
          ...prevState,
          country: value,
          phoneNumber: '', // Reset phone number when country changes
        }));
        setSelectedCountry(value);
      } else if (prop === 'phoneNumber') {
        const cleanNumber = event.target.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        // Set the clean number to state
        setUserDetails((prevState) => ({
          ...prevState,
          [prop]: cleanNumber,
        }));

        // Validate phone number length based on the selected country
        const validationMessage = validateMobileNumber(selectedCountry, cleanNumber, countryCodes, mobileNumberLengths);
        setPhoneNumberError(validationMessage); // This will be an empty string if the number is valid
      } else {
        // Handle changes for other fields like email, firstName, lastName
        setUserDetails((prevState) => ({
          ...prevState,
          [prop]: value,
        }));
        if (prop === 'email') {
          // Additional validation for email if needed
          setEmailError(validateEmail(value) ? '' : 'Invalid email address');
        }
      }
    };

    useEffect(() => {
      if (selectedCountry && userDetails.phoneNumber) {
        const validationMessage = validateMobileNumber(
          selectedCountry,
          userDetails.phoneNumber,
          countryCodes,
          mobileNumberLengths
        );
        setPhoneNumberError(validationMessage);
      }
    }, [selectedCountry, userDetails.phoneNumber, countryCodes, mobileNumberLengths]);

    const validateEmail = (email) => {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return regex.test(email);
    };

    useEffect(() => {
      const { phoneNumber, email } = userDetails;
      const isPhoneNumberValid = phoneNumber.trim() !== '' && !Number.isNaN(phoneNumber);
      const isEmailValid = email.trim() !== '' && validateEmail(email);
      setIsValid(isPhoneNumberValid || isEmailValid);
    }, [userDetails]);

    const getStoreUrl = () => {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      const pathParts = pathname.split('/');
      let storeUrl = pathParts[1];

      if (storeUrl === 'topup' || storeUrl === 'bills') {
        const hostnameParts = hostname.split('.');
        if (hostnameParts.length > 2) {
          storeUrl = hostnameParts[0];
        }
      }
      // console.log('storeUrl: ', storeUrl);
      return storeUrl;
    };

    const handleSubmit = async () => {
      if (isValid || userDetails.ipAddress) {
        try {
          const storeUrl = getStoreUrl();
          // console.log('storeUrl: ', storeUrl);

          const fullPhoneNumber = userDetails.country
            ? countryCodes[userDetails.country] + userDetails.phoneNumber
            : userDetails.phoneNumber;

          // Fetch dealerId from the store URL
          const storeResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}/user`
          );
          const dealerId = storeResponse.data.userId;
          // console.log('dealerId: ', dealerId);

          // Append customer details first
          const appendResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/append`, {
            ...userDetails,
            phoneNumber: fullPhoneNumber, // Use fullPhoneNumber which includes the country code
            dealerId,
          });
          // console.log('appendResponse: ', appendResponse);

          let customerId;

          if (appendResponse.data && appendResponse.data.body && appendResponse.data.body._id) {
            // Use the ID from the append response directly
            customerId = appendResponse.data.body._id;

            // Update transactionData with dealerId and customerId
            const updatedTransactionData = { ...transactionData, dealerId, customerId };
            onUserDetailsSubmit(updatedTransactionData);
            handleDialogClose({ userDetails, skipped: false }, true);
          } else {
            throw new Error('Failed to create or append customer');
          }
        } catch (error) {
          console.error('Error fetching IDs or submitting user details:', error);
          // Handle error cases here
        }
      }
    };

    const handleSkip = async () => {
      try {
        const storeUrl = getStoreUrl();
        const storeResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}/user`
        );
        const dealerId = storeResponse.data.userId;

        // Check if userDetails.ipAddress is available, otherwise fetch from the server
        let ipAddress = userDetails.ipAddress;
        if (!ipAddress) {
          const ipResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/get-ip`);
          ipAddress = ipResponse.data.ipAddress;
        }

        // Payload with IP address and dealerId
        const payload = {
          ipAddress,
          dealerId,
        };

        // Submitting payload
        const appendResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/append`, payload);

        if (appendResponse.status === 200 || appendResponse.status === 201) {
          // Attempt to fetch customerId using the IP address
          const customerResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/find`, {
            params: { ipAddress },
          });

          // If customer is found, use its ID
          const customerId = customerResponse.data ? customerResponse.data._id : null;

          // Update transactionData with dealerId and customerId
          const updatedTransactionData = { ...transactionData, dealerId, customerId };
          onUserDetailsSubmit(updatedTransactionData);

          handleDialogClose({ userDetails: {}, skipped: true }, false);
        }
      } catch (error) {
        console.error('Error in handleSkip:', error);
        // Handle error cases here
      }
    };

    return (
      <Dialog open={open} onClose={handleSkip} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter Your Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            To follow up on the transaction, please provide at least one contact detail.
          </Typography>
          <Autocomplete
            id="country-select"
            options={countries}
            getOptionLabel={(option) => option}
            value={selectedCountry}
            onChange={handleChange('country')}
            fullWidth
            renderInput={(params) => <TextField {...params} label="Country" />}
          />
          <TextField
            autoFocus
            margin="dense"
            id="phone"
            label="Phone Number"
            type="tel"
            fullWidth
            value={userDetails.phoneNumber}
            onChange={handleChange('phoneNumber')}
            error={!!phoneNumberError}
            helperText={phoneNumberError}
            disabled={!selectedCountry}
            InputProps={{
              startAdornment: userDetails.country ? (
                <InputAdornment position="start">{countryCodes[userDetails.country]}</InputAdornment>
              ) : null,
            }}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={userDetails.email}
            onChange={handleChange('email')}
            error={!!emailError}
            helperText={emailError}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="firstName"
                label="First Name"
                type="text"
                fullWidth
                value={userDetails.firstName}
                onChange={handleChange('firstName')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="lastName"
                label="Last Name"
                type="text"
                fullWidth
                value={userDetails.lastName}
                onChange={handleChange('lastName')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSkip} color="primary">
            Skip
          </Button>
          <div style={{ flex: '1 0 0' }} /> {/* This will push the Submit button to the right */}
          <Button onClick={handleSubmit} color="primary" disabled={!isValid}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  useEffect(() => {
    const fetchTopupToggles = async (userId, isFallbackAttempt = false) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/topup-toggles/public`
        );
        setDecryptedUserId(userId); 
        setTopupToggles(response.data);
      } catch (error) {
        console.error('Error fetching top-up toggles:', error);
        if ((error.response && (error.response.status === 500 || error.response.status === 404)) && !isFallbackAttempt) {
          const encryptedUserId = ls.get('encryptedUserId');
          if (encryptedUserId && userId !== encryptedUserId) {
            console.log('Attempting fallback with encryptedUserId...');
            fetchTopupToggles(encryptedUserId, true); 
          }
        }
      }
    };
  
    const initialUserId = ls.get('resellerCode') ? JSON.parse(ls.get('resellerCode')).code : ls.get('encryptedUserId');
    fetchTopupToggles(initialUserId);
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const collectedBrands = [];

      for (let index = 0; index < data.length; index += 1) {
        const product = data[index];

        // Update the condition to check the 'enabled' property
        if (
          topupToggles[product.brand]?.enabled &&
          (product.category === 'Electronic Load' || product.category === 'Data Bundles')
        ) {
          topUpProducts.push(product);
        }

        if (topupToggles[product.brand]?.enabled && product.category === 'Electronic Load') {
          if (product.brand === 'ROW') {
            addToInternationalLoad(product);
          }

          if (!collectedBrands.some((brand) => brand.name === product.brand)) {
            collectedBrands.push({
              name: product.brand,
              image: product.catalogImageURL,
              rank: localTelecomRankProvider(product.brand),
            });
          }
        }
      }

      // console.log('Filtered and collected brands:', collectedBrands);
      setbrands(collectedBrands.sort((brand, previous) => previous.rank - brand.rank));
    }
  }, [data, topupToggles]);

  const getServiceFee = ({ amount, currency }) => {
    // let paypalPercentage = amount * 0.0355
    // let foreignFee = amount * 0.01
    // let paypalFee = Math.round(paypalPercentage) + Math.round(foreignFee)
    const amountInDirham = parseFloat(amount / platformVariables?.topupCurrencyToPeso).toFixed(2);
    const convenienceFee = parseFloat(platformVariables?.topupConvenienceFee).toFixed(2);
    const grandTotalFee = parseFloat(amountInDirham) + parseFloat(convenienceFee);

    return { convenienceFee, grandTotalFee };
  };

  const stepForward = useCallback(() => {
    setActiveStep((prevStep) => prevStep + 1);
  }, []);

  const stepBack = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
  }, []);

  function filterProductsBySelectedCategory(state, category) {
    const productsByCategory = [];

    for (let index = 0; index < data.length; index += 1) {
      if (data[index].category === 'Data Bundles' || data[index].category === 'Electronic Load') {
        productsByCategory.push(data[index]);
      }
    }

    setRenderData(productsByCategory);

    return category;
  }

  async function handleVortexRequestGCash({ paymentData }) {
    try {
      setIsLoading(true);

      // save transaction only as for manual Gcash
      setTransactionDetails(paymentData);

      const s = await updateVortexByRefId({
        refId: transactionReferenceId,
        data: {
          paymentId: 'Awaiting for GCash Payment',
          paymentMethod: 'GCash',
          totalAmount: paymentData.grandTotalFee,
        },
      });

      // navigate(`/vortextransactions/topup/${s.referenceNumber}`, { state: s });

      setIsLoading(false);
    } catch (error) {
      setErrorData({
        isError: true,
        message: error,
      });
      throw error;
    }
  }

  async function handleVortexRequest({ docId, paymentData }) {
    try {
      // setisLoading(true)
      const vortexTokenResponse = await getVortexTokenBase();

      if (vortexTokenResponse.status === 200) {
        const vortexTokenResult = await vortexTokenResponse.json();

        const vortexTopupTransactionResponse = await createVortexTopupTransaction(
          vortexTokenResult.access_token,
          docId,
          process.env.GATSBY_APP_VORTEX_CLIENTREQID,
          accountOrMobileNumber,
          selectedProduct.code,
          paymentData?.data?.orderID,
          paymentData?.details?.purchase_units[0]?.amount?.value
        );

        const vortexTopupTransactionResult = await vortexTopupTransactionResponse.json();

        if (vortexTopupTransactionResponse.status === 200) {
          // setTransactionDetails(vortexTopupTransactionResult)

          navigate(`/vortextransactions/topup/${vortexTopupTransactionResult.referenceNumber}`);
        } else {
          setErrorData({
            isError: true,
            message: `Something went wrong `,
          });

          throw Error(vortexTopupTransactionResponse);
        }
      } else {
        setErrorData({
          isError: true,
          message: `Something went wrong `,
        });

        throw Error(vortexTokenResponse);
      }
      // setisLoading(false)
    } catch (error) {
      setErrorData({
        isError: true,
        message: `${error}`,
      });
      throw error;
    }
  }

  async function handleVortexCashRequest({ docId, total }) {
    try {
      // setisLoading(true)
      const vortexTokenResponse = await getVortexTokenBase();

      if (vortexTokenResponse.status === 200) {
        const vortexTokenResult = await vortexTokenResponse.json();

        const vortexTopupTransactionResponse = await createVortexTopupTransaction({
          access_token: vortexTokenResult.access_token,
          docId,
          clientRequestId: process.env.REACT_APP_VORTEX_CLIENTREQID,
          mobileNumber: accountOrMobileNumber,
          productCode: selectedProduct.code,
          paymentId: 'Payment via Store',
          totalAmount: total,
          oneAedToPhp: platformVariables?.topupCurrencyToPeso,
          convenienceFee: platformVariables?.topupConvenienceFee,
          currencySymbol: platformVariables?.currencySymbol,
          currencyToPhp: platformVariables?.topupCurrencyToPeso,
          callbackUrl: '',
        });

        const vortexTopupTransactionResult = await vortexTopupTransactionResponse.json();
        // console.log(vortexTopupTransactionResult);

        if (vortexTopupTransactionResult.status === 400 || vortexTopupTransactionResult.error) {
          setIsLoadingTransaction(false);

          alert(` ${vortexTopupTransactionResult.cause} - Try again. Check your number.`);
        } else if (vortexTopupTransactionResult?.fulfillmentResponse?.isSuccess) {
          // setTransactionDetails(vortexTopupTransactionResult)
          // get transaction vortex by reference pass it on this navigate state
          const latest = await getVortexTransactionByRefId(vortexTopupTransactionResult.referenceNumber);
          // console.log(latest);
          navigate(`/vortextransactions/topup/${vortexTopupTransactionResult.referenceNumber}`); // add a state
        } else {
          setIsLoadingTransaction(false);

          alert(vortexTopupTransactionResult.fulfillmentResponse.remarks);
          // setErrorData({
          //   isError: true,
          //   message: `Something went wrong : ${vortexTopupTransactionResult.fulfillmentResponse.remarks}`,
          // })

          // throw Error(vortexTopupTransactionResponse)
        }
      } else {
        setErrorData({
          isError: true,
          message: `Something went wrong - vortex token failed`,
        });

        // throw Error(vortexTokenResponse)
      }
      // setisLoading(false)
    } catch (error) {
      setErrorData({
        isError: true,
        message: `${error}`,
      });
      throw error;
    }
  }

  // FORMS

  const BrandSelectForm = ({ setSelectedBrand }) => {
    const [loading, setLoading] = useState(true);
    const [navigation, setNavigation] = useState({
      name: 'brandProducts',
      data: [],
      previous: '',
    });

    const [searchResult, setSearchResult] = useState([]);

    const [_selectedBrand, _setSelectedBrand] = useReducer(filterProductBySelectedBrand);

    const getCountriesOfContinent = useCallback(
      (continent) => {
        navigateInternationalLoad('countries', getCountriesOnTopUp(continent), {
          continent,
        });
      },
      [navigateInternationalLoad, getCountriesOnTopUp]
    );

    const getBrandsOfTheCountry = useCallback(
      (country) => {
        // console.log('getting brands');
        // console.log(country, navigation.previous?.continent);
        navigateInternationalLoad('countryBrands', getBrandsByCountry(navigation.previous?.continent, country), {
          country,
        });
      },
      [navigation.previous]
    );

    const getProductsByBrand = useCallback(
      (country, brand) => {
        // console.log('getting products of brand');
        navigateInternationalLoad(
          'brandProducts',
          getProductsOfBrand(navigation.previous.continent, navigation.previous.country, brand),
          { brand }
        );
      },
      [navigateInternationalLoad, getProductsOfBrand, navigation.previous]
    );

    async function updateProductDetailsForAllDealers(brandName, products) {
      try {
        // console.log(`Attempting to update product details for brand: ${brandName}`);
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/topup/products`, {
          brandName,
          products,
        });
        // console.log(`Successfully updated product details for brand: ${brandName}`, response.data);
      } catch (error) {
        console.error(`Error updating product details for ${brandName}:`, error);
      }
    }

    // Fetch Dealer Product Config Function
    async function fetchDealerProductConfig(dealerId, brandName) {
      let userIdToUse = ls.get('resellerCode') ? JSON.parse(ls.get('resellerCode')).code : null;
    
      userIdToUse = userIdToUse || dealerId;
    
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/${userIdToUse}/${brandName}/public`
        );
    
        if (response.data && response.data.products) {
          return response.data.products;
        }
    
        return [];
      } catch (error) {
        console.error(`Error fetching product configuration for dealer/reseller ${userIdToUse}, brand ${brandName}:`, error);
    
        if (userIdToUse !== dealerId) {
          console.log(`Attempting fallback with dealerId ${dealerId}...`);
          return fetchDealerProductConfig(dealerId, brandName, true); // Notice the third parameter is not used anymore, kept for consistency
        }
    
        return [];
      }
    }

    function navigateInternationalLoad(name, data, previous = {}) {
      // console.log(`navigateInternationalLoad called with name: ${name}, data:`, data);

      if (name === 'brandProducts') {
        const brandName = data[0]?.brand;
        // console.log(`Brand name in navigateInternationalLoad: ${brandName}`);

        // Mapping existing product data to prepare for update
        const products = data.map((product) => ({
          ...product,
          name: product.name, // Keep the original name
          price: product.pricing.price,
          isAvailable: product.enabled, // Use the original 'enabled' status
        }));

        // console.log(`Preparing to update product details for brand: ${brandName}`, products);

        updateProductDetailsForAllDealers(brandName, products);

        if (decryptedUserId) {
          // console.log(`DecryptedUserId available: ${decryptedUserId}`);

          fetchDealerProductConfig(decryptedUserId, brandName).then((dealerProductConfig) => {
            // console.log(`Dealer Product Config:`, dealerProductConfig);

            const updatedProducts = products.map((product) => {
              const fetchedProduct = dealerProductConfig.find((p) => p.name === product.name);

              // If no product-config found, default isAvailable to true
              if (!fetchedProduct) {
                return {
                  ...product,
                  isAvailable: true, // Default to true if no specific config is found
                };
              }

              // If the fetchedProduct is found, use its enabled status
              return {
                ...product,
                name: fetchedProduct.enabled ? product.name : `${product.name} (Not Available)`,
                price: fetchedProduct.currentPrice,
                isAvailable: fetchedProduct.enabled,
              };
            });

            // Sort the updated products so that unavailable products are at the bottom
            const sortedProducts = updatedProducts.sort((a, b) => {
              if (!a.isAvailable && b.isAvailable) {
                return 1;
              }
              if (a.isAvailable && !b.isAvailable) {
                return -1;
              }
              return 0;
            });

            setNavigation({
              name,
              data: sortedProducts,
              previous: {
                ...navigation.previous,
                ...previous,
              },
            });
          });
        } else {
          // If decryptedUserId is not available, default all products to available
          const defaultAvailableProducts = products.map((product) => ({
            ...product,
            isAvailable: true,
          }));

          setNavigation({
            name,
            data: defaultAvailableProducts,
            previous: {
              ...navigation.previous,
              ...previous,
            },
          });
        }
      }
    }

    function filterProductBySelectedBrand(state, brand) {
      const products = [];
      // console.log('filtering product by selected brand');

      if (brand !== 'ROW') {
        for (let index = 0; index < data.length; index += 1) {
          if (data[index].brand === brand) {
            products.push(data[index]);
          }
        }

        navigateInternationalLoad('brandProducts', products);

        return brand;
      }

      navigateInternationalLoad('continents', getContinents(data));
      return null;
    }

    const searchLoad = useCallback(
      (keyword) => {
        let result = [];
        if (keyword.trim().length > 0) {
          for (let a = 0; a < topUpProducts.length; a += 1) {
            if (topUpProducts[a].name.trim().toLowerCase().includes(keyword.toLowerCase())) {
              result.push(topUpProducts[a]);
            }
          }
        } else {
          result = [];
        }
        setSearchResult(result);
      },
      [topUpProducts]
    );

    // Add state for search query
    const [searchQuery, setSearchQuery] = useState('');

    // Handler for search input changes
    const handleSearchInputChange = (event) => {
      setSearchQuery(event.target.value.toLowerCase());
    };

    // Filter brands based on the search query
    const filteredBrands = searchQuery
      ? brands.filter((brand) => brand.name.toLowerCase().includes(searchQuery))
      : brands;

    return (
      <>
        <VortexFormToolbar
          title={'Load'}
          onClickBack={() => {
            // console.log(' navigate back');
            window.history.back();
          }}
        />
        <Toolbar />
        <div
          style={{
            margin: '1em',
          }}
        >
          <div className="heading-search-container">
            <div className="heading-search-shape" style={{ display: 'flex' }}>
              <InputBase
                disabled={false}
                style={{
                  width: '100%',
                  fontFamily: 'montserrat',
                  fontSize: '1em',
                  fontWeight: '500',
                  color: '#6b6b6b',
                  paddingLeft: '0.3em',
                  zIndex: 999,
                }}
                placeholder="Search Top-up brands..."
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              {searchQuery.length > 0 && (
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'grey',
                    fontWeight: 'bold',
                  }}
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchQuery('');
                    }
                  }}
                >
                  X
                </button>
              )}
            </div>
          </div>
        </div>

        {!isLoading && (
          <>
            {searchQuery && filteredBrands.length === 0 ? (
              <>
                <Typography margin={2} fontFamily={'Visby'} fontSize={17} color={'gray'} textAlign={'left'}>
                  No brands found
                </Typography>
              </>
            ) : (
              <>
                <Typography margin={2} fontFamily={'Visby'} fontSize={17} color={'gray'} textAlign={'left'}>
                  Select brand
                </Typography>

                <div
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '1px',
                  }}
                >
                  {(searchQuery ? filteredBrands : brands).map((brand, index) => (
                    <div
                      key={index}
                      style={{
                        flexShrink: 0,
                        minWidth: '100px',
                        maxWidth: '100px',
                        height: '100px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '8px',
                        marginLeft: '8px',
                      }}
                    >
                      <VortexProductBrandCard
                        title={brand.name}
                        image={brand.image}
                        onClick={() => {
                          _setSelectedBrand(brand.name);
                        }}
                        imageStyle={{
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </div>
                  ))}
                </div>

                {navigation.name === 'countries' && (
                  <VortexCountriesList countries={navigation.data} onClick={getBrandsOfTheCountry} />
                )}
                {navigation.name === 'brandProducts' && (
                  <VortexTopUpBrandProducts
                    brandProducts={navigation.data}
                    selectedBrand={_selectedBrand || 'ROW'}
                    setSelectedProduct={setSelectedProduct}
                    setSelectedBrand={setSelectedBrand}
                    stepForward={stepForward}
                    platformVariables={platformVariables}
                  />
                )}

                {navigation.name === 'continents' && (
                  <VortexContinentList continents={navigation.data} onClick={getCountriesOfContinent} />
                )}

                {navigation.name === 'countryBrands' && (
                  <VortexTopUpInternationalBrands
                    onClick={getProductsByBrand}
                    brands={navigation.data}
                    country={navigation.previous}
                  />
                )}
              </>
            )}
          </>
        )}
      </>
    );
  };

  /* 
  const ProductSelectForm = () => {
    return (
      <Box>
        <Typography margin={2} fontWeight={'bold'} fontFamily={'Visby'} fontSize={20} color="#0060bf">
          Select Load
        </Typography>
        {console.log('RenderData:', renderData)}
        {renderData.map((v) => {
          return (
            <VortexTopupCard
              name={v.name}
              imageUrl={v.catalogImageURL}
              desc={v.description}
              price={v.pricing.price}
              unit={v.pricing.unit}
              onClick={() => {
                setSelectedProduct(v);
                stepForward();
              }}
            />
          );
        })}
      </Box>
    );
  }; 
  */

  const AccountNoInputForm = ({ selectedBrand }) => {
    const { convenienceFee, grandTotalFee } = getServiceFee({
      amount: selectedProduct.pricing.price,
      currency: selectedProduct.pricing.unit,
    });

    // const [countryCode, setcountryCode] = useState('63');
    const [accountNumber, setAccountNumber] = useState(accountOrMobileNumber);

    const [isFormLoading, setIsFormLoading] = useState(false);

    const [inputValue, setInputValue] = useState('');

    const [error, setError] = useState('');

    const [dealerId, setDealerId] = useState('');

    useEffect(() => {
      const fetchDealerId = async () => {
        try {
          // Extract the storeUrl from the window location
          const pathnameArray = window.location.pathname.split('/');
          const storeUrl = pathnameArray[1];
          // console.log('storeUrl in AccountNoInputForm: ', storeUrl);

          // Fetch dealerId from the store URL
          const storeResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}/user`
          );
          if (storeResponse && storeResponse.data && storeResponse.data._id) {
            setDealerId(storeResponse.data._id);
          }
        } catch (error) {
          console.error('Error fetching dealer ID:', error);
        }
      };

      fetchDealerId();
    }, []);

    const validateInput = (value, brand) => {
      let maxLength;
      let errorMessageTooLong;
      let errorMessageTooShort;

      switch (brand) {
        case 'MERALCO':
          maxLength = 16;
          errorMessageTooLong = 'Account Number is too long';
          errorMessageTooShort = 'Account Number is too short';
          break;
        case 'CIGNAL':
          maxLength = 10;
          errorMessageTooLong = 'Account Number is too long';
          errorMessageTooShort = 'Account Number is too short';
          break;
        default:
          maxLength = 12;
          errorMessageTooLong = 'Mobile Number is too long';
          errorMessageTooShort = 'Mobile Number is too short';
      }

      if (value.length > maxLength) {
        setError(errorMessageTooLong);
      } else if (value.length < maxLength) {
        setError(errorMessageTooShort);
      } else {
        setError('');
      }
    };

    const handleChange = (event) => {
      const value = event.target.value;
      const validValue = value.replace(/[^0-9]/g, '');
      setAccountNumber(validValue);
      validateInput(validValue, selectedBrand?.toUpperCase() || '');
    };

    const inputProps = (brand) => {
      let maxLength;
      switch (brand) {
        case 'MERALCO':
          maxLength = 16;
          break;
        case 'CIGNAL':
          maxLength = 10;
          break;
        default:
          maxLength = 12;
      }

      const showTypeYourMessage = accountNumber.length !== maxLength && !error;

      return {
        title: brand === 'MERALCO' ? 'Meralco Account Number' : brand === 'CIGNAL' ? 'CCA Number' : 'Mobile Number',
        maxLength,
        helperText:
          error ||
          (showTypeYourMessage
            ? `Type your ${
                brand === 'MERALCO'
                  ? 'meralco load account number'
                  : brand === 'CIGNAL'
                  ? 'account number'
                  : 'mobile number with country code'
              }`
            : ''),
        placeholder: brand === 'MERALCO' ? '1234567890123456' : brand === 'CIGNAL' ? '1234567890' : '639273342196',
        error: !!error,
        onChange: handleChange,
      };
    };

    useEffect(() => {
      validateInput(accountNumber, selectedBrand?.toUpperCase() || '');
    }, [selectedBrand, accountNumber]);

    const handleContinueClick = async () => {
      try {
        if (accountNumber.length <= 0) {
          return;
        }

        setIsFormLoading(true);

        const reqInputPayload = {
          clientRequestId: 'Empty',
          mobileNumber: accountNumber.trim(),
          productCode: selectedProduct.code,
        };

        const result = await saveVortexTopUpTransaction({
          requestInputPayload: reqInputPayload,
          totalAmount: grandTotalFee,
        });

        // Update transactionData with dealerId
        setTransactionData((prevData) => {
          const updatedTransactionData = {
            ...prevData,
            dealerId,
          };
          // console.log('Updated Transaction Data:', updatedTransactionData);
          return updatedTransactionData;
        });

        setTransactionDocId(result._id);
        setTransactionReferenceId(result.referenceNumber);
        setAccountOrMobileNumber(`${accountNumber.trim()}`);

        setIsFormLoading(false);
        stepForward();
      } catch (error) {
        setErrorData({
          isError: true,
          message: `${error}`,
        });
        throw error;
      }
    };

    return (
      <Box>
        {/* } {!isLoggin ? (
          <LoginPage />
       ) : ( */}
        <Box>
          <VortexFormToolbar
            title={'Load'}
            onClickBack={() => {
              stepBack();
            }}
          />
          <Toolbar />
          <Box
            style={{
              margin: '1em',
            }}
          >
            <Stack spacing={1} marginTop={5}>
              <Stack direction={'row'} justifyContent="center" alignItems="center">
                <PhoneIphoneIcon />
                <Typography fontSize={20} textAlign={'center'}>
                  {inputProps(selectedBrand?.toUpperCase() || '').title}
                </Typography>
              </Stack>

              {/* Add console.log statements here */}
              {/* {console.log('selectedBrand:', selectedBrand)}
              {console.log('inputProps(selectedBrand.toUpperCase()):', inputProps(selectedBrand.toUpperCase()))} */}

              <Stack direction={'row'} justifyContent={'center'} spacing={0.5}>
                <TextField
                  id="account-input-field"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '1em',
                  }}
                  size="medium"
                  variant="standard"
                  type="number"
                  value={accountNumber}
                  placeholder={inputProps(selectedBrand?.toUpperCase() || '').placeholder}
                  helperText={inputProps(selectedBrand?.toUpperCase() || '').helperText}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: inputProps(selectedBrand?.toUpperCase() || '').maxLength,
                  }}
                  error={inputProps(selectedBrand?.toUpperCase() || '').error}
                />
              </Stack>
              <Stack direction={'row'} justifyContent={'center'}>
                <Button
                  disabled={isFormLoading || error !== ''}
                  variant="outlined"
                  sx={{
                    width: '100%',
                    marginTop: '1em',
                    borderRadius: '10em',
                    background: primaryVortexTheme.button,
                  }}
                  onClick={handleContinueClick}
                >
                  {isFormLoading ? 'Please wait...' : 'CONTINUE'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
        {/* }  )} */}
      </Box>
    );
  };

  const ReviewConfirmationForm = ({ setActiveStep, setTransactionData }) => {
    const paymentMethodType = ls.get('paymentMethodType');
    const customerDetails = ls.get('customerDetails');

    // const { email, name, phone, address } = getUser();

    const { convenienceFee, grandTotalFee } = getServiceFee({
      amount: selectedProduct.price,
      currency: selectedProduct.pricing.unit,
    });

    // const [isPaymentMethodGCash, setisPaymentMethodGCash] = useState(false);
    const [expanded, setExpanded] = useState('panel1');

    const handleAccordionChange = (panel) => (event, isExpanded) => {
      // console.log(panel, isExpanded);

      if (panel === 'panel1') {
        setExpanded(isExpanded ? 'panel1' : 'panel2');
      } else if (panel === 'panel2') {
        setExpanded(isExpanded ? 'panel2' : 'panel1');
      }
    };
    const handleUserDetailsSubmit = async (userDetails) => {
      // console.log('User Details Submitted: ', userDetails);
      // Logic to open the URL
      const url = await createLink(grandTotalFee * 100, selectedProduct.name);
      if (url) {
        const paymentWindow = window.open(url, '_blank');
        // Polling to check if the payment window has been closed
        const paymentWindowClosed = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(paymentWindowClosed);

            const newTransactionData = {
              productName: selectedProduct.name,
              price: selectedProduct.price,
              convenienceFee,
              totalPrice: grandTotalFee,
              currency: platformVariables?.currencySymbol,
              customerId: userDetails.customerId,
              dealerId: userDetails.dealerId,
            };
            // console.log('Setting Transaction Data: ', newTransactionData);
            setTransactionData(newTransactionData);
            setActiveStep(3);
          }
        }, 500);
      }
    };

    const handlePayment = async () => {
      if (customerDetails) {
        handleUserDetailsSubmit(customerDetails);
      } else {
        const userDetailsDialog = await handleOpenDialog();
        // console.log('User Details Dialog: ', userDetailsDialog);
      }
    };

    return (
      <Box>
        <Box>
          <VortexFormToolbar
            title={'Load Payment'}
            onClickBack={() => {
              stepBack();
            }}
          />
          <Toolbar />
          <div>
            {/* Product Hero */}
            <Stack direction={'row'} alignItems="center" marginTop={'2em'} marginLeft={'2em'} marginBottom={'2em'}>
              <Stack sx={{ marginRight: '2em' }} textAlign="center">
                <Typography fontSize={'3em'} fontWeight={'bold'} color={primaryVortexTheme.secondarytextcolor}>
                  {selectedProduct.price}
                </Typography>
                <Typography fontSize={'1em'} fontWeight={'bold'} color={primaryVortexTheme.secondarytextcolor}>
                  {selectedProduct.pricing.unit}
                </Typography>
              </Stack>
              <Stack>
                <Typography fontWeight={'bold'} color={primaryVortexTheme.primarytextcolor}>
                  {selectedProduct.name}
                </Typography>
                <Typography color={primaryVortexTheme.primarytextcolor}>{selectedProduct.description}</Typography>
              </Stack>
            </Stack>
            <Divider />

            {/* Buy load for */}
            <Stack style={{ marginBottom: '1em' }}>
              <Stack style={{ margin: '0.5em' }}>
                <Typography
                  style={{
                    color: `${primaryVortexTheme.primarytextcolor}`,
                    marginTop: '1em',
                    marginBottom: '1em',
                  }}
                  fontSize={15}
                  fontWeight="bold"
                >
                  Buy load for
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent={'center'}>
                <Box
                  style={{
                    border: 'solid 2px #707070',
                    borderRadius: '1em',
                  }}
                >
                  <Typography
                    style={{
                      color: `${primaryVortexTheme.secondarytextcolor}`,
                      marginTop: '0.1em',
                      marginBottom: '0.1em',
                      marginLeft: '1em',
                      marginRight: '1em',
                    }}
                    fontWeight="bold"
                    fontSize={50}
                  >
                    {accountOrMobileNumber}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            {/* You are about to pay */}
            <Divider />
            <Stack>
              <Stack style={{ margin: '0.5em' }}>
                <Typography
                  style={{
                    color: `${primaryVortexTheme.primarytextcolor}`,
                    marginTop: '1em',
                  }}
                  fontSize={20}
                  fontWeight="bold"
                >
                  You are about to pay
                </Typography>
              </Stack>
              <Stack style={{ margin: '1em' }}>
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  style={{
                    color: 'black',
                    marginBottom: '0.5em',
                  }}
                >
                  <Typography fontWeight={'bold'}>{`Amount Due `}</Typography>

                  <Typography fontWeight={'bold'} style={{ marginRight: '2em' }}>{`${parseFloat(
                    selectedProduct.price / platformVariables?.topupCurrencyToPeso
                  ).toFixed(2)} ${platformVariables?.currencySymbol}`}</Typography>
                </Stack>

                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  style={{
                    color: 'black',
                    marginBottom: '0.5em',
                  }}
                >
                  <Typography fontWeight={'bold'}>{`Convenience Fee `}</Typography>

                  {expanded === 'panel2' ? (
                    <Typography fontWeight={'bold'}>{`0 ${platformVariables?.currencySymbol}`}</Typography>
                  ) : (
                    <Typography fontWeight={'bold'} style={{ marginRight: '2em' }}>
                      {`${convenienceFee} ${platformVariables?.currencySymbol}`}
                      {'        '}
                    </Typography>
                  )}
                </Stack>

                <Divider />

                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  style={{
                    color: 'black',
                    marginTop: '0.5em',
                  }}
                >
                  <Typography fontWeight={'bold'} fontSize={'25px'}>
                    TOTAL AMOUNT
                  </Typography>
                  <Typography fontWeight={'bold'} fontSize={'25px'}>
                    {`${grandTotalFee} ${platformVariables?.currencySymbol}`}
                  </Typography>
                </Stack>
                <Box height={20} />
                {/* <UserDetailsDialog open={isDialogOpen} handleDialogClose={handleDialogClose} /> */}
                <UserDetailsDialog
                  open={isDialogOpen}
                  onUserDetailsSubmit={handleUserDetailsSubmit}
                  handleDialogClose={handleDialogClose}
                />
                <Button
                  disabled={isLoadingTransaction}
                  variant="outlined"
                  onClick={handlePayment}
                  // onClick={async () => {
                  // const userDetailsDialog = await handleOpenDialog();
                  // console.log('User Details Dialog: ', userDetailsDialog);
                  // if(isUserDetailShown) {
                  //   console.log('User Details Dialog: ', userDetailsDialog);
                  //   const url = await createLink(grandTotalFee * 100, selectedProduct.name);
                  //   const paymentWindow = window.open(url, '_blank');
                  //   console.log('Link Created: ', createLink);
                  //   console.log('Amount: ', grandTotalFee);
                  //   console.log('Description: ', selectedProduct.name);

                  //   // Polling to check if the payment window has been closed
                  //   const paymentWindowClosed = setInterval(() => {
                  //     if (paymentWindow.closed) {
                  //       clearInterval(paymentWindowClosed);
                  //       // Once the payment window is closed, set the transaction data
                  //       setTransactionData({
                  //         productName: selectedProduct.name,
                  //         price: selectedProduct.price,
                  //         convenienceFee,
                  //         totalPrice: grandTotalFee,
                  //         currency: platformVariables?.currencySymbol,
                  //       });
                  //       // Update the activeStep to 3 to show the transaction completed message
                  //       setActiveStep(3);
                  //     }
                  //   }, 500);
                  // }
                  // }}
                >
                  {isLoadingTransaction ? 'PLEASE WAIT . . . TRANSACTION IN PROGRESS . . ' : 'PAY'}
                </Button>
              </Stack>
            </Stack>
          </div>
        </Box>
      </Box>
    );
  };

  const TransactionCompletedForm = ({ setActiveStep, transactionData, resetTransactionData }) => {
    const handleConfirmClick = async () => {
      // console.log('Transaction Data in handleConfirmClick: ', transactionData);
      try {
        const customerId = transactionData.customerId;
        const dealerId = transactionData.dealerId;
        const resellerCodeObject = ls.get('resellerCode');
        const resellerId = resellerCodeObject ? JSON.parse(resellerCodeObject).code : null;
        // console.log('customerId: ', customerId);
        // console.log('dealerId: ', dealerId);

        const purchaseData = {
          productName: transactionData.productName,
          amount: transactionData.totalPrice,
          dealerId,
          resellerId,
        };

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/purchase/${customerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(purchaseData),
        });

        if (response.ok) {
          // Handle successful transaction confirmation
          // console.log('Transaction confirmed and saved');
          resetTransactionData();
        } else {
          // Handle errors
          const errorResponse = await response.json();
          console.error('Failed to save transaction:', errorResponse.message);
        }
      } catch (error) {
        console.error('Error while confirming the transaction:', error);
      }

      setActiveStep(0);
    };

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100vh',
          p: 3,
          border: '2px dashed grey',
          borderRadius: '10px',
          m: 2,
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        <Typography variant="h4" textAlign="center" mt={2} mb={4} fontWeight="bold">
          TRANSACTION RECEIPT
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Product Name:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography>{transactionData.productName}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>Price:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography>
              {transactionData.price} {transactionData.currency}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>Convenience Fee:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography>
              {transactionData.convenienceFee} {transactionData.currency}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 3, borderWidth: 2 }} />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              TOTAL AMOUNT:
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              {transactionData.totalPrice} {transactionData.currency}
            </Typography>
          </Grid>
        </Grid>
        <Box textAlign="center" mt={10}>
          {' '}
          <Button variant="outlined" color="primary" onClick={handleConfirmClick}>
            Confirm Transaction
          </Button>
        </Box>
      </Box>
    );
  };

  const FormRender = ({
    activeStep,
    setActiveStep,
    selectedBrand,
    setSelectedBrand,
    setTransactionData,
    transactionData,
  }) => {
    // console.log('Active Step:', activeStep);
    // console.log('Selected Brand in FormRender:', selectedBrand);

    switch (activeStep) {
      case 0:
        return <BrandSelectForm setSelectedBrand={setSelectedBrand} />;
      case 1:
        return <AccountNoInputForm selectedBrand={selectedBrand} />;
      case 2:
        return <ReviewConfirmationForm setActiveStep={setActiveStep} setTransactionData={setTransactionData} />;
      case 3:
        return (
          <TransactionCompletedForm
            setActiveStep={setActiveStep}
            transactionData={transactionData}
            resetTransactionData={resetTransactionData}
          />
        );
      default:
        return <AccountNoInputForm selectedBrand={selectedBrand} />;
    }
  };

  useEffect(() => {
    if (activeStep === 0) {
      setStoreStatus(1);
      setUserStatus(1);
    }
  }, [activeStep]);

  return (
    <div
      style={{
        display: 'block',
        flexDirection: 'column',
        position: 'absolute',
        textAlign: 'center',
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '100vh',
        background: '#fff',
        color: 'black',
        fontSize: '1.5rem',
        padding: '0 0 2em 0',
      }}
    >
      {platformVariables?.enableLoad === false && <ServiceDisabledPrompt />}
      {storeStatus === 0 && <StoreBlockPrompt />}
      {userStatus === 0 && <BlockPrompt />}

      {userStatus === 1 && storeStatus === 1 && platformVariables?.enableLoad ? (
        <>
          {error.isError ? (
            <VortexError
              message={error.message}
              onClick={() => {
                setErrorData({
                  isError: false,
                  message: '',
                });
                setRetry(!retry);
                setActiveStep(0);
              }}
            />
          ) : (
            <FormRender
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              setTransactionData={setTransactionData}
              transactionData={transactionData}
            />
          )}
          <Box sx={{ height: '10em' }} />
          <VortexBottomGradient />
          <BottomNavigator />
        </>
      ) : null}
    </div>
  );
};

export default VortexTopUp;
