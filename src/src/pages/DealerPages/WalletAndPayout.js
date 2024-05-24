import React, { useEffect, useState, useMemo } from 'react';
import SecureLS from 'secure-ls';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container, FormControl,
  Grid, InputLabel, MenuItem,
  Paper, Select,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Helmet } from 'react-helmet-async';
import { DateRangePicker } from 'react-date-range';
import UserDataFetch from '../../components/user-account/UserDataFetch';
import AccountStatusModal from '../../components/user-account/AccountStatusModal';
import StoreDataFetch from '../../components/user-account/StoreDataFetch';
import CircularLoading from '../../components/preLoader';

const ls = new SecureLS({ encodingType: 'aes' });

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
  const userId = ls.get('user') ? ls.get('user')._id : null;

  const userData = UserDataFetch(userId);
  const { storeData, editedData, platformVariables, error } = StoreDataFetch(userId);
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isBankDeposit, setIsBankDeposit] = useState(false);
  // State hooks for various functionalities
  // const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('USA');
  const [file, setFile] = useState(null);
  const [walletRequests, setWalletRequests] = useState([]);
  const [flattenedWalletRequests, setFlattenedWalletRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredWalletRequests, setFilteredWalletRequests] = useState(walletRequests);
  const [dateFilteredWalletRequests, setDateFilteredWalletRequests] = useState(filteredWalletRequests);
  const [sortBy, setSortBy] = useState('createdBy desc');
  const [walletReplenishResponse, setWalletReplenishResponse] = useState(null);
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [bankDetails] = useState({
    USA: {
      bankName: 'Philippine National Bank',
      swiftCode: 'PNBMHKHH',
      bankAddress: 'Unit 902, 9/F, Tung Wai Commercial Building, 109-111 Gloucester Road, Wanchai',
      accountName: 'PLDT 1528 Limited',
      accountNumber: '573060002016',
    },
    HongKong: {
      bankName: 'Philippine National Bank',
      swiftCode: 'PNBMHKHH',
      bankAddress: 'Unit 902, 9/F, Tung Wai Commercial Building, 109-111 Gloucester Road, Wanchai',
      accountName: 'PLDT 1528 Limited',
      accountNumber: '08573060002001',
    },
    Singapore: {
      bankName: 'HSBC',
      accountName: 'PLDT (SG) Retail Service Pte Ltd',
      accountNumber: '142-069079-001',
    },
    Malaysia: {
      bankName: 'OCBC Bank (M) Berhad',
      accountName: 'PLDT Global Malaysia Sdn Berhad',
      accountNumber: '790-108789-8',
    },
    Japan: {
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
    setIsBankDeposit(true);
  };

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

  const handleSelectDate = (ranges) => {
    setSelectedRange([ranges.selection]);
    setDateRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  const handleClearSelectDate = () => {
    setSelectedRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);
    setDateRange({
      startDate: new Date(),
      endDate: new Date(),
    });
  };

  const handleReplenishChange = (event) => {
    const { name, value } = event.target;
    setReplenishDetails({
      ...replenishDetails,
      [name]: value,
    });
  };

  // Function to create a new wallet request
  const createWalletRequest = async () => {
    // change here
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const dateTimeCode = `${year}${month}${day}${hours}${minutes}${seconds}`;
    const code = `VAAS${dateTimeCode}`;

    const walletRequestData = {
      userId, // This should be dynamic based on logged-in user
      referenceNo: code, // Generate this or get it from user input
      accountEmail: user.email, // Assuming 'user' contains the email; adjust as necessary
      walletType: 'SW', // Get this from user input if needed
      amount: parseFloat(amount),
      tradeDiscount: 0, // Get this from user input if needed
      amountToPay: 0, // Calculate this based on amount and discount
      bonusAmount: 0, // Get this from user input if needed
      currency: 'PHP', // Get this from user input if needed
      paymentStatus: 'PENDING',
      paymentMethod: 'bank',
      image: '',
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/wallet-requests`,
        walletRequestData, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
      );
      console.log('Wallet request created successfully: ', response.data);
      const walletRequestId = response.data.body._id;
      await uploadBankSlipImage(walletRequestId); // Wait for the image upload to complete
      const responseLatestRequest = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/wallet-requests/${walletRequestId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
      );
      setWalletReplenishResponse(responseLatestRequest.data);
      setIsSubmitting(false); // Re-enable the submit button after the operation
      handleNext(); // Move to the next step only after the upload is successful
    } catch (error) {
      alert('Error creating wallet request. Please try again.');
      console.error('Error in wallet request creation or image upload: ', error);
      setIsSubmitting(false); // Ensure button is re-enabled even if there's an error
    }
  };

  const handleExportToExcel = () => {
    const maxRows = 5000;
    const requestKey = ['dateCreated', 'referenceNo', 'currency', 'amount', 'paymentStatus', 'paymentMethod'];
    const headers = ['Date Created', 'Transaction', 'Currency', 'Amount', 'Payment Status', 'Payment Method']
    const tableData = [headers, ...filteredWalletRequests.slice(0, maxRows).map(row => requestKey.map(key => row[key]))];

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(tableData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Wallet Replenishment Report');

    // Generate the Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the Excel file data
    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(fileData);
    const now = Math.floor(new Date().getTime() / (60 * 1000)) * (60 * 1000);
    const unixTimestamp = Math.floor(now / 1000);
    downloadLink.download = `wallet_rep_report_${unixTimestamp}.xlsx`;
    downloadLink.click();
  };

  // Ensure uploadBankSlipImage does not directly call handleNext
  const uploadBankSlipImage = async (walletRequestId) => {
    const formData = new FormData();
    formData.append('file', file);

    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/v1/api/wallet-requests/walletRequest/${walletRequestId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    console.log('Bank slip image uploaded successfully');
  };

  const handleFilterChange = (event, newValue) => {
    const foundWalletRequests = [];
    const searchCriteria = {
      paymentStatus: [],
      referenceNo: [],
      currency: [],
      amount: [],
      accountEmail: [],
      paymentMethod: [],
    };

    if(newValue.length !== 0){
      // let searchCategory = [];
      newValue.forEach(value => {
          const results = dateFilteredWalletRequests.filter(obj => {
            const jsonValues = Object.values(obj);
            return jsonValues.some((jsonValue) => jsonValue === value);
          })
          .map((obj) => {
            const key = Object.entries(obj).find(([key, val]) => val === value)?.[0];
            return key;
          });

        if (results[0]) searchCriteria[results[0]].push(value);
      });

      foundWalletRequests.push(...dateFilteredWalletRequests.filter(obj => {
        const flattenedObj = flattenObject(obj);
        return Object.entries(searchCriteria).every(([key, value]) => {
          if (value.length !== 0) {
            return value.some(selects => flattenedObj.some(val => selects.includes(val)));
          }
          return true;
        });
      }));
    }

    setFilteredWalletRequests(newValue.length !== 0 ? foundWalletRequests : dateFilteredWalletRequests);
  };

  const handleReplenishSubmit = () => {
    // Submit replenishment logic here
    setIsSubmitting(true);
    createWalletRequest();
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  }

  useEffect(() => {
    if (sortBy === 'createdBy desc') {
      const sortedData = [...filteredWalletRequests].sort((a, b) => b.dateCreated.localeCompare(a.dateCreated));
      setFilteredWalletRequests(sortedData);
    }
    if (sortBy === 'createdBy asc') {
      const sortedData = [...filteredWalletRequests].sort((a, b) => a.dateCreated.localeCompare(b.dateCreated));
      setFilteredWalletRequests(sortedData);
    }
  }, [sortBy, filteredWalletRequests]);

  const tableKeys = ['paymentStatus', 'referenceNo', 'currency', 'amount', 'accountEmail', 'paymentMethod'];

  const flattenObject = (obj) => {
    return Object.entries(obj)
      .filter(([key]) => tableKeys.includes(key))
      .map(([key, value]) => {
        return value;
      });
  };

  useEffect(() => {
    setFilteredWalletRequests(dateFilteredWalletRequests);

    const flattenedValues = [...new Set(dateFilteredWalletRequests.flatMap(flattenObject))];
    setFlattenedWalletRequests(flattenedValues);

  }, [dateFilteredWalletRequests]);

  useEffect(() => {
      if(dateFilteredWalletRequests.length === 0){
        setDateFilteredWalletRequests(walletRequests.filter((item) => {
          const date = new Date(item.dateCreated);
          const startDate = new Date(dateRange.startDate);
          const endDate = new Date(dateRange.endDate);
          // Set the time of endDate to 23:59:59
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          return (
              (!startDate || date >= startDate) &&
              (!endDate || date <= endDate)
          )}));
      }else{
        setDateFilteredWalletRequests(dateFilteredWalletRequests.filter((item) => {
          const date = new Date(item.dateCreated);
          const startDate = new Date(dateRange.startDate);
          const endDate = new Date(dateRange.endDate);
          // Set the time of endDate to 23:59:59
          endDate.setHours(23, 59, 59, 999);
          return (
              (!startDate || date >= startDate) &&
              (!endDate || date <= endDate)
          )}));
      }

  }, [dateRange, walletRequests]);

  useEffect(() => {
    const storedUser = ls.get('user');
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

  useEffect(() => {
    // Only fetch data when the tabValue is 1
    if (tabValue === 1) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/wallet-requests/user`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          setWalletRequests(response.data.data);
        })
        .catch((error) => console.error('Error fetching wallet requests: ', error));
    }
  }, [tabValue, userId]); // React will run the effect when tabValue changes to 1 or userId changes

  if (!userData || !storeData) {
    return <CircularLoading />;
  }

  const renderPaymentOptions = () => (
    <>
      <Typography sx={{ mb: 2 }}>Please select your preferred payment method:</Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Paper
            elevation={selectedMethod === 'Bank' ? 12 : 1}
            onClick={() => selectMethod('Bank')}
            sx={{ padding: 2, cursor: 'pointer', bgcolor: selectedMethod === 'Bank' ? '#303f9f' : '#3f51b5' }}
          >
            <Typography variant="button" display="block" gutterBottom sx={{ color: 'white' }}>
              Bank Deposit
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Typography
        sx={{
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          p: 2,
          mt: 2,
          borderRadius: 1,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        Wallet replenishment approval for payments via Bank Deposit may take 24-72 business hours (Philippine Standard
        Time) since payments need to be checked and verified before approval.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
        <Button variant="outlined" onClick={handleBack}>
          Back
        </Button>
      </Box>
    </>
  );

  const renderPLDTPayment = () => (
    <>
      <Typography sx={{ mb: 3 }} variant="h6">
        PLDT Global Payment
      </Typography>
      <Typography sx={{ mb: 2 }}>Please enter your PLDT Global Payment Reference Number:</Typography>
      <TextField label="PLDT Global Payment Reference Number" variant="outlined" sx={{ mb: 2, width: '100%' }} />
      <Typography variant="body2" sx={{ mb: 2 }}>
        Please enter the amount you wish to credit in your wallet:
      </Typography>
      <TextField
        label="Amount to be credited in your Wallet"
        variant="outlined"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />

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
          <Typography key={key} sx={{ mb: 2 }}>{`${key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())}: ${value}`}</Typography>
        ))}
      </>
    );
  };
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);

  const renderBankPayment = () => (
    <>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Please upload your bank slip upon deposit of {formattedAmount} to:
      </Typography>
      <Tabs value={selectedCountry} onChange={handleCountryChange} variant="scrollable" scrollButtons="auto">
        {Object.keys(bankDetails).map((country) => (
          <Tab key={country} label={country} value={country} />
        ))}
      </Tabs>
      <Box sx={{ mt: 2 }}>{renderBankDetails(selectedCountry)}</Box>
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={file ? file.name : ''}
          placeholder="No file chosen"
          InputProps={{
            readOnly: true,
          }}
          sx={{ flexGrow: 1, mr: 2 }} // Adjust marginRight to give space for the button
        />
        <Button variant="contained" component="label" sx={{ whiteSpace: 'nowrap' }}>
          Browse
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
      </Box>
      <Typography variant="caption" sx={{ mt: 2 }}>
        <span style={{ display: 'block' }}>- Only JPG, JPEG and PNG image formats will be accepted.</span>
        <span style={{ display: 'block' }}>- File size must not exceed 6MB.</span>
        <span style={{ display: 'block' }}>- Image height and width must not exceed 2048 pixels.</span>
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
        <Button variant="outlined" onClick={() => setSelectedMethod(null)}>
          Back
        </Button>
        <Button variant="outlined" onClick={handleReplenishSubmit} disabled={!file || isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
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
            <Chip
              label={`Wallet Balance: ${walletDetails.accountBalance}`}
              color="primary"
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}
            />
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
                      onChange={(e) => {
                        // Allow only numbers and decimal points
                        const { value } = e.target;
                        if (!value || value.match(/^\d*\.?\d*$/)) {
                          setAmount(value);
                        }
                      }}
                      type="number"
                      // Disabling browser autofill
                      autoComplete="off"
                      // Customizing the input to accept numbers including decimal points
                      inputProps={{
                        step: '0.01', // Allow decimal values to be input by user
                        min: '0', // Optional: if you want to allow only positive values
                      }}
                      sx={{ mb: 2, width: '100%' }}
                    />

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Your wallet currency is PHP
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleNext}
                      disabled={!amount || parseFloat(amount) <= 0} // Disable if no amount or amount is 0 or less
                      sx={{
                        marginLeft: 'auto',
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
                  </Box>
                )}
                {activeStep === 2 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                        sx={{
                          bgcolor: 'background.paper',
                          border: 1,
                          borderColor: 'divider',
                          p: 2,
                          mt: 2,
                          borderRadius: 1,
                          textAlign: 'justify', // Set text alignment to justify
                          color: 'text.secondary',
                          margin: 'auto',
                        }}
                    >
                      {walletReplenishResponse && (
                          <div>
                            <span>Date Created: {new Date(walletReplenishResponse.dateCreated).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}</span><br/>
                            <span>Reference Number: {walletReplenishResponse.referenceNo}</span><br/>
                            <span>Amount: {walletReplenishResponse.currency} {walletReplenishResponse.amount}</span><br/>
                            <span>Status: {walletReplenishResponse.paymentStatus}</span><br/>
                            <span>File Uploaded: </span><br/>
                            <div style={{marginBottom: 10}}>
                              <img src={`${walletReplenishResponse.image}`} alt={"Displayed"} style={{maxWidth: '100%'}}/>
                            </div>
                          </div>
                      )}
                      <br/>
                      <span style={{display: 'block'}}>
                        Please wait for your replenishment request to be processed.
                      </span>
                      <span style={{display: 'block'}}>
                        You will receive an email notification once request has been approved.
                      </span>
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                      <Button
                        variant="outlined"
                        disabled={!selectedMethod}
                        onClick={() => {
                          setTabValue(1);
                          setActiveStep(0);
                          setAmount('');
                          setFile(null);
                        }}
                        sx={{
                          marginLeft: 'auto',
                          width: 'fit-content',
                        }}
                      >
                        Done
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
        {tabValue === 1 && (
          <>
            <div>
              <Card style={{ marginBottom: '.5rem' }}>
                <Box style={{ padding: '1rem' }}>
                  <Box>
                    <DateRangePicker ranges={selectedRange} onChange={handleSelectDate} />
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ backgroundColor: 'violet' }}
                      onClick={handleClearSelectDate}
                    >
                      Clear
                    </Button>
                  </Box>
                </Box>
              </Card>
            </div>
            <div className={"flex"}>
              <Autocomplete
                  className="w-4/5"
                  multiple
                  id="tags-filled"
                  freeSolo
                  options={flattenedWalletRequests || ""}
                  getOptionLabel={(option) => (option || "")}
                  onChange={handleFilterChange}
                  renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                          <Chip variant="outlined" label={option} {...getTagProps({index})} />
                      ))
                  }
                  renderInput={(params) => (
                      <TextField
                          {...params}
                          variant="filled"
                          label="Search transaction"
                          placeholder="transaction"
                      />
                  )}
              />
                <FormControl className="w-1/5">
                  <InputLabel id={"demo-simple-select-label"}>Sort By</InputLabel>
                  <Select
                      labelId={"demo-simple-select-label"}
                      id="demo-simple-select"
                      label="Sort By"
                      value={sortBy}
                      onChange={handleSortChange}
                  >
                    <MenuItem value={"createdBy desc"}>Created By (Desc)</MenuItem>
                    <MenuItem value={"createdBy asc"}>Created By (Asc)</MenuItem>
                  </Select>
                </FormControl>
            </div>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table stickyHeader aria-label="transaction history">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Transaction</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Payment Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredWalletRequests.map((request) => (
                    <TableRow
                      key={request._id}
                      sx={{ '&:hover': { cursor: 'pointer', backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                      onClick={() => window.open(request.image, '_blank')}
                      hover
                    >
                      <Tooltip
                        title={`Created: ${new Date(request.dateCreated).toLocaleString()}, Updated: ${new Date(
                          request.dateUpdated
                        ).toLocaleString()}`}
                      >
                        <TableCell component="th" scope="row">
                          {new Date(request.dateCreated).toLocaleDateString()}
                        </TableCell>
                      </Tooltip>
                      <Tooltip title={`Wallet Type: ${request.walletType}`}>
                        <TableCell>{request.referenceNo}</TableCell>
                      </Tooltip>
                      <Tooltip title={`Trade Discount: ${request.tradeDiscount}, Bonus Amount: ${request.bonusAmount}`}>
                        <TableCell align="right">{`${request.currency} ${request.amount}`}</TableCell>
                      </Tooltip>
                      <Tooltip title={request.remarks || 'No additional information'}>
                        <TableCell>{request.paymentStatus}</TableCell>
                      </Tooltip>
                      <Tooltip title={`Image: Click row to view`}>
                        <TableCell>{request.paymentMethod}</TableCell>
                      </Tooltip>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div>
              <Button onClick={handleExportToExcel}>Export</Button>
            </div>
          </>
        )}
      </Container>
      <AccountStatusModal open userData={userData} storeData={storeData} />
    </>
  );
};

export default WalletPayouts;
