import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SecureLS from 'secure-ls';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Container, Divider, Typography, Card, CardContent, Button } from '@mui/material';
// components
import Iconify from '../components/iconify';
import AccountStatusModal from '../components/user-account/AccountStatusModal';
import UserDataFetch from '../components/user-account/UserDataFetch';
import StoreDataFetch from '../components/user-account/StoreDataFetch';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import CircularLoading from '../components/preLoader';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [kycApprove, setKycApprove] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [displayMessage, setDisplayMessage] = useState('');
  const [walletDetails, setWalletDetails] = useState({ accountBalance: 0, testBalance: 0, currency: '' });

  const ls = new SecureLS({ encodingType: 'aes' });

  let userId;
  try {
    const storedUser = ls.get('user');
    if (storedUser) {
      userId = storedUser._id;
    }
  } catch (error) {
    console.error('Error parsing user data from secureLS:', error);
  }

  const { storeData, editedData, platformVariables, error } = StoreDataFetch(userId);
  const userData = UserDataFetch(userId);
  // console.log('UserData: ', userData);

  useEffect(() => {
    const existingUserData = ls.get('user');

    if ((userId && userData && userData._id) || (existingUserData && (existingUserData.id || existingUserData._id))) {
      const mergedData = { ...existingUserData, ...userData };

      ls.set('user', mergedData);
    } else {
      const rememberMe = ls.get('rememberMe') === 'true';
      const rememberMeEmail = ls.get('rememberMeEmail');

      ls.removeAll();

      if (rememberMe) {
        ls.set('rememberMeEmail', rememberMeEmail);
        ls.set('rememberMe', 'true');
      }

      navigate('/login', { replace: true });
    }
    const storedUser = ls.get('user');
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
  }, [userData, navigate, userId]);

  useEffect(() => {
    if (storeData && storeData._id) {
      // console.log('Fetching store status for _id:', storeData._id);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/status/${storeData._id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          // console.log('Received store status data:', data);
          setKycApprove(data.kycApprove);
          setDaysLeft(data.daysLeft);
          setDisplayMessage(data.displayMessage);
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
        });
    }
    const userToken = Cookies.get('userToken');
    if (userToken) {
      // Save the token to local storage
      ls.set('token', userToken);

      // Remove the userToken cookie
      Cookies.remove('userToken');
    }
  }, [storeData]);

  const trialMessageCard =
    kycApprove !== 2 &&
    daysLeft !== null &&
    userData &&
    userData.accountStatus !== 'Suspended' &&
    userData.accountStatus !== 'Deactivated' ? (
      kycApprove === 1 ? (
        <Card sx={{ mb: 5, p: 3, textAlign: 'center', backgroundColor: 'error.light' }}>
          <CardContent>
            <Typography variant="h5" color="error.dark">
              Your Free Trial Account has {daysLeft} days left. Your documents are currently under review.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mb: 5, p: 3, textAlign: 'center', backgroundColor: 'error.light' }}>
          <CardContent>
            <Typography variant="h5" color="error.dark">
              Your Free Trial Account has {daysLeft} days left to submit documents for Approval.
            </Typography>
          </CardContent>
        </Card>
      )
    ) : null;

  const verificationCard =
    userData &&
    (!userData.isActive ||
      !userData.designation ||
      !userData.country ||
      !userData.mobileNumber ||
      !userData.username ||
      !userData.hasPassword) ? (
      <Card sx={{ mb: 5, p: 3, textAlign: 'center', backgroundColor: 'rgba(173, 216, 230, 0.5)' }}>
        <CardContent>
          <Typography variant="h5" color="primary.dark" sx={{ mb: 2 }}>
            {!userData.isActive
              ? 'Please complete the verification process for your email'
              : !userData.designation ||
                !userData.country ||
                !userData.mobileNumber ||
                !userData.username ||
                !userData.hasPassword
              ? 'Please complete your profile information'
              : 'Please complete your profile information and ensure verifications are complete.'}
          </Typography>
          <Button variant="contained" color="primary" href="/dashboard/settings/profile">
            Proceed to Settings
          </Button>
        </CardContent>
      </Card>
    ) : null;

  const user = ls.get('user');
  const userRole = user ? user.role : null;

  const storeUrl = user?.storeUrl;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const referralLink = `${baseUrl}/${storeUrl}?reseller=${userId}`;

  if (userRole === 'reseller') {
    return (
      <>
        <Helmet>
          <title>Reseller Dashboard | VAAS</title>
        </Helmet>
        <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Reseller Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/dashboard/reseller/products/bills-payment')}
            >
              Product Config
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/dashboard/reseller/sales/transactions')}
            >
              Transactions
            </Button>
          </Box>
          <Divider sx={{ width: '100%', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            Reseller Webstore Referral Link:
          </Typography>
          <Typography variant="body2" gutterBottom>
            {referralLink} {/* Ensure `referralLink` is defined and contains the full referral URL */}
          </Typography>
        </Container>
      </>
    );
  }

  // Fallback or loading screen if userRole is not yet determined
  if (!userRole) {
    return <CircularLoading />;
  }

  return (
    <>
      <Helmet>
        <title> Dealer Dashboard | VAAS </title>
      </Helmet>

      {!trialMessageCard && !verificationCard ? (
        userData && userData.isActive && userData.accountStatus === 'Active' ? (
          <Typography variant="h2" textAlign="center">
            All Verifications Complete!
          </Typography>
        ) : (
          <CircularLoading />
        )
      ) : (
        <Container maxWidth="xl">
          {trialMessageCard || verificationCard ? (
            <>
              <Typography variant="h4" sx={{ mb: 5 }}>
                {userData && userData.firstName ? `Hi ${userData.firstName}, welcome back` : 'Hi, Welcome back'}
              </Typography>
              <Card sx={{ mb: 5, textAlign: 'center', backgroundColor: 'skyblue', width: '40%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    Wallet Balance: ${walletDetails.accountBalance}
                  </Typography>
                </CardContent>
              </Card>
              {trialMessageCard}
              {verificationCard}
            </>
          ) : (
            <Typography variant="h4" sx={{ mb: 5, textAlign: 'center' }}>
              Welcome to VAAS Dealer Portal
            </Typography>
          )}
        </Container>
      )}
      <AccountStatusModal open userData={userData} storeData={storeData} />
    </>
  );
}
