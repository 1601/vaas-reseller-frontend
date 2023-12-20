import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
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

export default function WalletAndPayout() {
  const [walletDetails, setWalletDetails] = useState({ accountBalance: 0, testBalance: 0, currency: '' });
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState();
  const [edit, setEdit] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user'))._id;

  const userData = UserDataFetch(userId);
  const { storeData, editedData, platformVariables, error } = StoreDataFetch(userId);

  const handleInputChange = (e) => {
    setWalletDetails({
      ...walletDetails,
      currency: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setEdit(false);
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

  return (
    <>
      <Helmet>
        <title>Wallet and Payout | Your App</title>
      </Helmet>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Wallet and Payout
          </Typography>

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
        </Container>
      <AccountStatusModal open userData={userData} storeData={storeData} />
    </>
  );
}
