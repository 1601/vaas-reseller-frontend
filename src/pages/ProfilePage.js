import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import UserDataFetch from '../components/user-account/UserDataFetch';
import StoreDataFetch from '../components/user-account/StoreDataFetch';

const ProfilePage = () => {
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  const userData = UserDataFetch(userId);
  const { storeData, error } = StoreDataFetch(userId);

  const kycStatuses = ['Unsubmitted documents', 'Pending Approval', 'Approved', 'Rejected'];

  if (!userData || !storeData) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Typography variant="h4">
          User Profile
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Personal Information</Typography>
              <Typography>First Name: {userData.firstName}</Typography>
              {userData.middleName && <Typography>Middle Name: {userData.middleName}</Typography>}
              <Typography>Last Name: {userData.lastName}</Typography>
              <Typography>Designation: {userData.designation}</Typography>
              <Typography>Country: {userData.country}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Credentials */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Credentials</Typography>
              <Typography>Username: {userData.username}</Typography>
              <Typography>Email: {userData.email}</Typography>
              <Typography>Mobile Number: {userData.mobileNumber}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Store Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Account Status and Balances</Typography>
              <Box mt={2}>
                <Typography>Balance: {userData.accountBalance}</Typography>
                <Typography>KYC Status: {kycStatuses[storeData.kycApprove]}</Typography>
                <Typography>Account Status: {userData.accountStatus}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
