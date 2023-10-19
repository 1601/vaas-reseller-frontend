import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
} from '@mui/material';
import UserDataFetch from '../../components/user-account/UserDataFetch';
import StoreDataFetch from '../../components/user-account/StoreDataFetch';
import { countries } from '../../components/country/CountriesList';
import { countryCodes } from '../../components/country/countryNumCodes';
import ValidatedTextField from '../../components/validation/ValidatedTextField';

const ProfilePage = () => {
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  const userData = UserDataFetch(userId);
  const { storeData, error } = StoreDataFetch(userId);

  const [formState, setFormState] = useState({});

  const kycStatuses = ['Unsubmitted Documents', 'Pending Approval', 'Approved', 'Rejected'];

  const accountStatusDisplay = {
    FreeTrial: 'Free Trial',
    Active: 'Active',
    Suspended: 'Suspended',
    Deactivated: 'Deactivated',
  };

  if (!userData || !storeData) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  const CustomTextField = ({ label, value }) => (
    <div
      style={{
        position: 'relative',
        marginBottom: '16px',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: '4px',
        padding: '18px 12px',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '6px',
          left: '12px',
          backgroundColor: 'white',
          padding: '0 5px',
          transform: 'translateY(-50%)',
          fontSize: '0.75rem',
          color: 'rgba(0, 0, 0, 0.54)',
        }}
      >
        {label}
      </span>
      <div>{value}</div>
    </div>
  );

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h4" style={{ marginBottom: '20px' }}>
            User Profile
          </Typography>
          <Grid container spacing={4}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Card style={{ borderColor: 'purple', borderWidth: '2px' }}>
                <CardContent>
                  <Typography variant="h6">Personal Information</Typography>
                  <Card style={{ marginBottom: '20px', padding: '15px' }}>
                    <CustomTextField label="First Name" value={userData.firstName} />
                    <CustomTextField label="Middle Name (Optional)" value={userData.middleName} />
                    <CustomTextField label="Last Name" value={userData.lastName} />
                    <CustomTextField label="Designation" value={userData.designation} />
                    <CustomTextField label="Country" value={userData.country} />
                  </Card>
                </CardContent>
              </Card>
            </Grid>

            {/* Credentials */}
            <Grid item xs={12}>
              <Card style={{ borderColor: 'purple', borderWidth: '2px' }}>
                <CardContent>
                  <Typography variant="h6">Credentials</Typography>
                  <Card style={{ marginBottom: '20px', padding: '15px' }}>
                    <CustomTextField label="Username" value={userData.username} />
                    <div
                      style={{
                        position: 'relative',
                        marginBottom: '16px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        padding: '18px 12px',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '12px',
                          backgroundColor: 'white',
                          padding: '0 5px',
                          transform: 'translateY(-50%)',
                          fontSize: '0.75rem',
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                      >
                        Email
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {userData.email}
                        {userData.isActive ? (
                          <span style={{ color: 'green', marginLeft: '8px' }}>(Verified)</span>
                        ) : (
                          <span style={{ color: 'red', marginLeft: '8px' }}>(Unverified)</span>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        position: 'relative',
                        marginBottom: '16px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        padding: '18px 12px',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '12px',
                          backgroundColor: 'white',
                          padding: '0 5px',
                          transform: 'translateY(-50%)',
                          fontSize: '0.75rem',
                          color: 'rgba(0, 0, 0, 0.54)',
                        }}
                      >
                        Mobile Number
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {userData.mobileNumber}
                        {userData.mobileNumberVerified ? (
                          <span style={{ color: 'green', marginLeft: '8px' }}>(Verified)</span>
                        ) : (
                          <span style={{ color: 'red', marginLeft: '8px' }}>(Unverified)</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </CardContent>
              </Card>
            </Grid>

            {/* Store Details */}
            <Grid item xs={12}>
              <Card style={{ borderColor: 'purple', borderWidth: '2px' }}>
                <CardContent>
                  <Typography variant="h6">Account Status and Balances</Typography>
                  <Card style={{ marginBottom: '20px', padding: '15px' }}>
                    <Typography>Balance: {userData.accountBalance}</Typography>
                    <Typography>KYC Status: {kycStatuses[storeData.kycApprove]}</Typography>
                    <Typography>Account Status: {accountStatusDisplay[userData.accountStatus]}</Typography>
                  </Card>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfilePage;
