import React, { useEffect, useState } from 'react';
import { 
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Container, Tab, Tabs, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button ,
  Stepper,
  Step,
  StepLabel,
  Chip, Grid
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import { Helmet } from 'react-helmet-async';
import UserDataFetch from '../../components/user-account/UserDataFetch';
import AccountStatusModal from '../../components/user-account/AccountStatusModal';
import StoreDataFetch from '../../components/user-account/StoreDataFetch';
import CircularLoading from '../../components/preLoader';

const currencies = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'CHF',
  'CAD',
  'AUD',
  'CNY',
  'INR',
  'KRW',
  'BRL',
  'ZAR',
  'RUB',
  'MXN',
  'SGD',
  'NZD',
  'HKD',
  'SEK',
  'NOK',
  'DKK',
];

const WalletPayouts = () => {
  const [tabValue, setTabValue] = useState(0);
  const [walletDetails, setWalletDetails] = useState({ accountBalance: 0, testBalance: 0, currency: '' });
  const [replenishDetails, setReplenishDetails] = useState({ amount: '' });
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState();
  const [edit, setEdit] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user'))._id;

  const userData = UserDataFetch(userId);
  const { storeData, editedData, platformVariables, error } = StoreDataFetch(userId);
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [isBankDeposit, setIsBankDeposit] = useState(false)
  // State hooks for various functionalities
  // const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('USA');
  const [file, setFile] = useState(null);
  const [bankDetails] = useState({
    'USA': {
      bankName: 'Philippine National Bank',
      swiftCode: 'PNBMHKHH',
      bankAddress: 'Unit 902, 9/F, Tung Wai Commercial Building, 109-111 Gloucester Road, Wanchai',
      accountName: 'PLDT 1528 Limited',
      accountNumber: '573060002016',
    },
    'HongKong': {
      bankName: 'Philippine National Bank',
      swiftCode: 'PNBMHKHH',
      bankAddress: 'Unit 902, 9/F, Tung Wai Commercial Building, 109-111 Gloucester Road, Wanchai',
      accountName: 'PLDT 1528 Limited',
      accountNumber: '08573060002001',
    },
    'Singapore': {
      bankName: 'HSBC',
      accountName: 'PLDT (SG) Retail Service Pte Ltd',
      accountNumber: '142-069079-001',
    },
    'Malaysia': {
      bankName: 'OCBC Bank (M) Berhad',
      accountName: 'PLDT Global Malaysia Sdn Berhad',
      accountNumber: '790-108789-8',
    },
    'Japan': {
      bankName: 'Japan Post Bank',
      accountName: 'PLDT Japan (ピーエルディーティージャパン（ド)',
      accountNumber: '10180-97832641',
    },
    'Rest of World': {
      bankName: 'Philippine National Bank',
      swiftCode: 'PNBMHKHH',
      bankAddress: 'Unit 902, 9/F, Tung Wai Commercial Building, 109-111 Gloucester Road, Wanchai',
      accountName: 'PLDT 1528 Limited',
      accountNumber: '573060002016',
    },
  });
  

  // Handlers for various events
  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleBankDepositClick = () => {
    setIsBankDeposit(true)
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const selectMethod = (method) => {
    setSelectedMethod(method);
  };


  const handleInputChange = (e) => {
    setWalletDetails({
      ...walletDetails,
      currency: e.target.value,
    });
  };
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = () => {
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/wallet/update/${user._id}`, {
        currency: walletDetails.currency,
      })
      .then((response) => {
        setEdit(false);
      })
      .catch((error) => {
        console.error('Error updating user data: ', error);
      });
  };

  const handleReplenishChange = (event) => {
    const { name, value } = event.target;
    setReplenishDetails({
      ...replenishDetails,
      [name]: value,
    });
  };

  const handleReplenishSubmit = () => {
    // Submit replenishment logic here
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    if (storedUser && storedUser._id) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/wallet/details/${storedUser._id}`)
        .then((response) => {
          setWalletDetails({
            accountBalance: response.data.body[0].accountBalance,
            testBalance: response.data.body[0].testBalance,
            currency: response.data.body[0].currency,
          });
        })
        .catch((error) => {
          console.error('Error fetching user data: ', error);
        });
    }
  }, []);

  if (!userData || !storeData) { 
    return <CircularLoading />; 
  }

  const renderPaymentOptions = () => (
    <>
      <Typography sx={{ mb: 2 }}>
        Please select your preferred payment method:
      </Typography>
      <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Paper
              elevation={selectedMethod === 'PLDT' ? 12 : 1}
              onClick={() => selectMethod('PLDT')}
              sx={{ padding: 2, cursor: 'pointer', bgcolor: selectedMethod === 'PLDT' ? '#d32f2f' : '#f44336' }}
            >
              <Typography variant="button" display="block" gutterBottom>
                PLDT GLOBAL PAYMENTS
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              elevation={selectedMethod === 'Bank' ? 12 : 1}
              onClick={() => selectMethod('Bank')}
              sx={{ padding: 2, cursor: 'pointer', bgcolor: selectedMethod === 'Bank' ? '#303f9f' : '#3f51b5' }}
            >
              <Typography variant="button" display="block" gutterBottom>
                Bank Deposit
              </Typography>
            </Paper>
          </Grid>
        </Grid>
    </>
  );

  const renderPLDTPayment = () => (
    <>
      <Typography sx={{ mb: 3 }} variant="h6">
        PLDT Global Payment
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Please enter your PLDT Global Payment Reference Number:
      </Typography>
      <TextField label="PLDT Global Payment Reference Number" variant="outlined" sx={{ mb: 2, width: '100%' }} />
      <Typography variant="body2" sx={{ mb: 2 }}>
        Please enter the amount you wish to credit in your wallet:
      </Typography>
      <TextField label="Amount to be credited in your Wallet" variant="outlined" value={amount} onChange={(e) => setAmount(e.target.value)} sx={{ mb: 2, width: '100%' }} />
      
      <Button variant="outlined" onClick={() => selectMethod(null)} sx={{ mb: 2, width: '100%' }}>
        Back
      </Button>
    </>
  );

   // Render bank details for the selected country
   const renderBankDetails = (country) => {
    const details = bankDetails[country];
    return (
      <>
        {Object.entries(details).map(([key, value]) => (
          <Typography key={key} sx={{ mb: 2 }}>{`${key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}: ${value}`}</Typography>
        ))}
      </>
    );
  };

  const renderBankPayment = () => (
    <>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Please upload your bank slip upon deposit of PHP 1000.00 to:
      </Typography>
      <Tabs value={selectedCountry} onChange={handleCountryChange} variant="scrollable" scrollButtons="auto">
        {Object.keys(bankDetails).map((country) => (
          <Tab key={country} label={country} value={country} />
        ))}
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {renderBankDetails(selectedCountry)}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" component="label">
          Choose file
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
      </Box>
      <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
        - Only JPG, JPEG and PNG image formats will be accepted.
        - File size must not exceed 6MB.
        - Image height and width must not exceed 2048 pixels.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
        <Button variant="outlined" onClick={() => setSelectedMethod(null)}>
          Back
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Wallet and Payout | VAAS </title>
      </Helmet>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Wallet and Payout
      </Typography>

      <Container maxWidth="md">
        <Tabs value={tabValue} onChange={handleChange} aria-label="wallet tabs">
          {/* <Tab label="Balance" /> */}
          <Tab label="Replenishment" />
          <Tab label="History" />
        </Tabs>
        {/* {tabValue === 0 && (
           <Card sx={{ mb: 5, p: 3 }}>
             <CardContent>
               <Typography variant="h5">
                 Balance: {walletDetails.currency} {walletDetails.accountBalance}
               </Typography>
               <Typography variant="body2" color="textSecondary">
                 Test Balance: {walletDetails.currency} {walletDetails.testBalance}
               </Typography>
               <Box
                 onClick={() => {
                   setEdit(true);
                 }}
               >
                 <Typography variant="body2" color="textSecondary">
                   {' '}
                   Current Currency: {walletDetails.currency} {<EditIcon />}
                 </Typography>
               </Box>
               {edit && (
                 <Box width="30%">
                   <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                     <InputLabel id="currency-label">Currency</InputLabel>
                     <Select
                       labelId="currency-label"
                       label="Currency"
                       name="currency"
                       value={currency}
                       onChange={handleInputChange}
                     >
                       <MenuItem value={walletDetails.currency}>{walletDetails.currency}</MenuItem>
                       {currencies.map((currency) => (
                         <MenuItem value={currency}>{currency}</MenuItem>
                       ))}
                     </Select>
                     <Button variant="outlined" onClick={() => handleSubmit()}>
                       {' '}
                       Save{' '}
                     </Button>
                   </FormControl>
                 </Box>
               )}
             </CardContent>
           </Card>
        )} */}
        {tabValue === 0 && (
          <Box sx={{ position: 'relative' }}>
          <Chip label={`Wallet Balance: ${walletDetails.accountBalance}`} color="primary" sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }} />
          <Card sx={{ minWidth: 275, my: 4 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Replenish My Wallet
              </Typography>
              <Typography sx={{ mt: 1.5, mb: 3 }}>
                Follow these easy steps to recharge your account balance in seconds!
              </Typography>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                <Step key="Enter Amount">
                  <StepLabel>Enter Amount</StepLabel>
                </Step>
                <Step key="Payment Method">
                  <StepLabel>Payment Method</StepLabel>
                </Step>
                <Step key="Confirmation">
                  <StepLabel>Confirmation</StepLabel>
                </Step>
              </Stepper>
              {activeStep === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                  <TextField
                    label="Amount to be credited in your Wallet"
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={{ mb: 2, width: '100%' }}
                  />
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Your wallet currency is PHP
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      bgcolor: 'pink',
                      '&:hover': {
                        bgcolor: 'darkpink',
                      },
                      width: 'fit-content',
                    }}
                  >
                    Next
                  </Button>
                </Box>
              )}
              {activeStep === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                {selectedMethod === null && renderPaymentOptions()}
                {selectedMethod === 'PLDT' && renderPLDTPayment()}
                {selectedMethod === 'Bank' && renderBankPayment()}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                  <Button variant="outlined" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="contained" disabled={!selectedMethod} onClick={handleNext}>
                    Next
                  </Button>
                </Box>
              </Box>
              )}
              {activeStep === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                <Typography sx={{ mb: 3 }}>
                  Confirmation
                </Typography>
               
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                  <Button variant="outlined" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="contained" disabled={!selectedMethod} onClick={handleNext}>
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
        )}
        {tabValue === 1 && (
           <TableContainer component={Paper}>
           <Table aria-label="transaction history">
             <TableHead>
               <TableRow>
                 <TableCell>Date</TableCell>
                 <TableCell>Transaction</TableCell>
                 <TableCell align="right">Amount</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {/* Map through history data here */}
             </TableBody>
           </Table>
         </TableContainer>
        )}
      </Container>
      <AccountStatusModal open userData={userData} storeData={storeData} />
    </>
  );
};

export default WalletPayouts;

