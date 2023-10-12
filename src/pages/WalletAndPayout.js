import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent } from '@mui/material';
import { Helmet } from 'react-helmet-async';

export default function WalletAndPayout() {
  const [userBalance, setUserBalance] = useState({ accountBalance: 0, testBalance: 0 });
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Assuming you store user data in local storage after logging in
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    if(storedUser && storedUser._id) {
      // Fetch the user's data from the server using their ID
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/${storedUser._id}`)
        .then((response) => {
          // Update the state with the user's balances
          setUserBalance({
            accountBalance: response.data.accountBalance,
            testBalance: response.data.testBalance
          });
        })
        .catch((error) => {
          console.error('Error fetching user data: ', error);
        });
    }
  }, []);

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
              Balance: ${userBalance.accountBalance}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Test Balance: ${userBalance.testBalance}
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
