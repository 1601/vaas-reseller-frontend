import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import UserDataFetch from '../components/user-account/UserDataFetch';
import StoreDataFetch from '../components/user-account/StoreDataFetch';
import { countries } from '../components/country/CountriesList';
import { countryCodes } from '../components/country/countryNumCodes';
import { mobileNumberLengths } from '../components/country/countryNumLength';
import ValidatedTextField from '../components/validation/ValidatedTextField';
import { validateName, validateEmail, validateMobileNumber } from '../components/validation/validationUtils';

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  const userData = UserDataFetch(userId);
  const { storeData, error } = StoreDataFetch(userId);
  const [validationErrors, setValidationErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendOtpCooldown, setResendOtpCooldown] = useState(0);

  const kycStatuses = ['Unsubmitted Documents', 'Pending Approval', 'Approved', 'Rejected'];

  const accountStatusDisplay = {
    FreeTrial: 'Free Trial',
    Active: 'Active',
    Suspended: 'Suspended',
    Deactivated: 'Deactivated',
  };

  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formState.firstName) errors.firstName = 'First Name is required';
    if (!formState.lastName) errors.lastName = 'Last Name is required';
    if (!formState.designation) errors.designation = 'Designation is required';
    if (!formState.country) errors.country = 'Country is required';
    if (!formState.username) errors.username = 'Username is required';

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const openOtpDialog = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const endpoint = `${baseUrl}/api/send-otp`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpDialogOpen(true);
      } else {
        console.error('Error sending OTP:', data.message);
        alert('Failed to send OTP. Please try again later.');
      }
    } catch (error) {
      console.error('There was an error:', error);
      alert('Failed to send OTP. Please try again later.');
    }
  };

  const closeOtpDialog = () => {
    setOtpDialogOpen(false);
    setOtp('');
    setOtpError('');
  };

  const resendOtp = async () => {
    // Call API to resend OTP
    // Set a cooldown for the resend button
    setResendOtpCooldown(180); // 3 minutes in seconds
    const interval = setInterval(() => {
      setResendOtpCooldown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyOtp = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const endpoint = `${baseUrl}/api/verify-otp`;
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          otpCode: otp, 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Handle successful OTP verification, like updating the UI to show the mobile number as verified
        setOtpDialogOpen(false);
      } else {
        // Handle failed OTP verification by setting an error message
        setOtpError(data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Failed to verify OTP. Please try again later.');
    }
  };

  // State for Change Password Dialog
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const openChangePasswordDialog = () => {
    setChangePasswordDialogOpen(true);
  };

  const closeChangePasswordDialog = () => {
    setChangePasswordDialogOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const validatePassword = (password) => {
    if (!password || password.length < 8 || password.length > 12) {
      return 'Password must be between 8 to 12 characters.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number.';
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) {
      return 'Password must contain at least one special character.';
    }
    return '';
  };

  const handleChangePassword = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    let endpoint = `${baseUrl}/api/change-password`;

    if (!userData.hasPassword) {
      endpoint = `${baseUrl}/api/set-password`;
    }

    const newPasswordValidationError = validatePassword(newPassword);
    if (newPasswordValidationError) {
      setPasswordErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: newPasswordValidationError,
      }));
      return;
    }

    // Check if newPassword and confirmNewPassword match
    if (newPassword !== confirmNewPassword) {
      setPasswordErrors((prevErrors) => ({
        ...prevErrors,
        confirmNewPassword: 'New and Confirm Passwords does not Match',
      }));
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password changed successfully');
        closeChangePasswordDialog();
      } else {
        const newErrors = {};

        if (data.message.includes('New password')) {
          newErrors.newPassword = data.message;
        } else if (data.message.includes('Confirm new password')) {
          newErrors.confirmNewPassword = data.message;
        } else {
          newErrors.currentPassword = data.message;
        }

        setPasswordErrors(newErrors);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordErrors({
        ...passwordErrors,
        currentPassword: 'Failed to change password. Please try again later.',
      });
    }
  };

  const handleMobileNumberChange = (event) => {
    const { value } = event.target;
    const strippedNumber = value?.replace(countryCodes[formState.country] || '', '');

    const validationError = validateMobileNumber(formState.country, strippedNumber, countryCodes, mobileNumberLengths);
    setValidationErrors((prevErrors) => ({ ...prevErrors, mobileNumber: validationError }));

    handleInputChange(event);
  };

  const handleEditClick = () => {
    const countryCode = countryCodes[userData?.country];
    const strippedMobileNumber = userData?.mobileNumber?.replace(countryCode, '') || '';

    setFormState({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      middleName: userData?.middleName || '',
      designation: userData?.designation || '',
      country: userData?.country || '',
      mobileNumber: strippedMobileNumber,
      username: userData?.username || '',
    });
    setEditMode(true);
  };

  const handleSaveChanges = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const fullMobileNumber = countryCodes[formState.country] + formState.mobileNumber;

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formState.username,
          firstName: formState.firstName,
          lastName: formState.lastName,
          middleName: formState.middleName,
          designation: formState.designation,
          country: formState.country,
          mobileNumber: fullMobileNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEditMode(false);
        window.location.reload();
      } else {
        console.error('Error updating user:', data.message);
      }
    } catch (error) {
      console.error('There was an error updating the user:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'mobileNumber' || name === 'country') {
      const strippedNumber = value?.replace(countryCodes[formState.country] || '', '');
      const validationError = validateMobileNumber(
        formState.country,
        strippedNumber,
        countryCodes,
        mobileNumberLengths
      );
      setValidationErrors((prevErrors) => ({ ...prevErrors, mobileNumber: validationError }));
    }

    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const sendVerificationEmailAndNavigate = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(`${baseUrl}/api/send-verification-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/verify', { state: { email: userData.email } });
      } else {
        console.error('Error sending verification email:', data.message);
        alert('Failed to send verification email. Please try again later.');
      }
    } catch (error) {
      console.error('There was an error:', error);
      alert('Failed to send verification email. Please try again later.');
    }
  };

  if (!userData || !storeData) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <Typography variant="h4">User Profile</Typography>
            <div>
              {editMode ? (
                <div className="flex">
                  <Button onClick={handleSaveChanges} variant="outlined" className="mr-2">
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => setEditMode(false)} className="mr-2">
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outlined" onClick={handleEditClick} className="mr-2">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          <Grid container spacing={4}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Card style={{ borderColor: 'purple', borderWidth: '2px' }}>
                <CardContent>
                  <Typography variant="h6">Personal Information</Typography>
                  <Card style={{ marginBottom: '20px', padding: '15px' }}>
                    {editMode ? (
                      <>
                        <ValidatedTextField
                          validationFunction={validateName}
                          label="First Name"
                          name="firstName"
                          value={formState.firstName}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{ mb: 2, mt: 2 }}
                        />
                        <TextField
                          label="Middle Name (Optional)"
                          name="middleName"
                          value={formState.middleName}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <ValidatedTextField
                          validationFunction={validateName}
                          label="Last Name"
                          name="lastName"
                          value={formState.lastName}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                          <InputLabel id="designation-label">Designation</InputLabel>
                          <Select
                            labelId="designation-label"
                            label="Designation"
                            name="designation"
                            value={formState.designation}
                            onChange={handleInputChange}
                            error={!!validationErrors.designation}
                          >
                            <MenuItem value={'Mr.'}>Mr.</MenuItem>
                            <MenuItem value={'Ms.'}>Ms.</MenuItem>
                            <MenuItem value={'Mrs.'}>Mrs.</MenuItem>
                          </Select>
                          {validationErrors.designation && (
                            <Typography color="error" variant="caption">
                              {validationErrors.designation}
                            </Typography>
                          )}
                        </FormControl>
                        <Autocomplete
                          fullWidth
                          options={countries}
                          getOptionLabel={(option) => option}
                          value={formState.country}
                          onChange={(event, newValue) => {
                            handleInputChange({
                              target: { name: 'country', value: newValue },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Country"
                              variant="outlined"
                              sx={{ mb: 2 }}
                              error={!!validationErrors.country}
                              helperText={validationErrors.country}
                            />
                          )}
                        />
                      </>
                    ) : (
                      <>
                        <Typography>First Name: {userData.firstName}</Typography>
                        {userData.middleName && <Typography>Middle Name: {userData.middleName}</Typography>}
                        <Typography>Last Name: {userData.lastName}</Typography>
                        <Typography>Designation: {userData.designation}</Typography>
                        <Typography>Country: {userData.country}</Typography>
                      </>
                    )}
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
                    {editMode ? (
                      <>
                        <TextField
                          label="Username"
                          name="username"
                          value={formState.username}
                          onChange={handleInputChange}
                          fullWidth
                          error={!!validationErrors.username}
                          helperText={validationErrors.username}
                        />
                        <ValidatedTextField
                          validationFunction={validateEmail}
                          label="Email"
                          name="email"
                          value={formState.email || userData.email}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{ mb: 2, mt: 2 }}
                        />
                        <TextField
                          error={!!validationErrors.mobileNumber}
                          fullWidth
                          label="Mobile Number"
                          variant="outlined"
                          name="mobileNumber"
                          value={formState.mobileNumber?.replace(countryCodes[formState.country] || '', '')}
                          onChange={handleInputChange}
                          sx={{ mb: 2 }}
                          disabled={!formState.country}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {formState.country && countryCodes[formState.country]
                                  ? `${countryCodes[formState.country]} |`
                                  : ''}
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{
                            shrink: !!formState.mobileNumber || !!formState.country,
                          }}
                          helperText={validationErrors.mobileNumber}
                        />
                      </>
                    ) : (
                      <>
                        <Typography>Username: {userData.username}</Typography>
                        <Typography>
                          Email: {userData.email}{' '}
                          {userData.isActive ? (
                            <span style={{ color: 'green' }}>(Verified)</span>
                          ) : (
                            <span style={{ color: 'red' }}>(Unverified)</span>
                          )}
                        </Typography>
                        <Typography>
                          Mobile Number: {userData.mobileNumber}{' '}
                          {userData.mobileNumberVerified ? (
                            <span style={{ color: 'green' }}>(Verified)</span>
                          ) : (
                            <span style={{ color: 'red' }}>(Unverified)</span>
                          )}
                        </Typography>
                      </>
                    )}
                  </Card>
                  {!editMode && (
                    <Button variant="outlined" className="mt-2 mr-2" onClick={openChangePasswordDialog}>
                      Change Password
                    </Button>
                  )}
                  {!editMode && !userData.mobileNumberVerified && (
                    <Button variant="outlined" className="mt-2 mr-2" onClick={openOtpDialog}>
                      Verify Mobile Number
                    </Button>
                  )}
                  {!editMode && !userData.isActive && (
                    <Button variant="outlined" className="mt-2" onClick={sendVerificationEmailAndNavigate}>
                      Verify Email
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Store Details */}
            <Grid item xs={12}>
              <Card style={{ borderColor: 'purple', borderWidth: '2px' }}>
                <CardContent>
                  <Typography variant="h6">Account Status and Balances</Typography>
                  <Card style={{ marginBottom: '20px', padding: '15px' }}>
                    <Box mt={2}>
                      <Typography>Balance: {userData.accountBalance}</Typography>
                      <Typography>KYC Status: {kycStatuses[storeData.kycApprove]}</Typography>
                      <Typography>Account Status: {accountStatusDisplay[userData.accountStatus]}</Typography>
                    </Box>
                  </Card>
                </CardContent>
              </Card>
            </Grid>

            {/* Change Password Dialog */}
            <Dialog open={changePasswordDialogOpen} onClose={closeChangePasswordDialog}>
              <DialogTitle>Change Password</DialogTitle>
              <DialogContent>
                {userData.hasPassword && (
                  <TextField
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    fullWidth
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    sx={{ mt: 2 }}
                    error={!!passwordErrors.currentPassword}
                    helperText={passwordErrors.currentPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                <TextField
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ mb: 2, mt: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword}
                />
                <TextField
                  label="Confirm New Password"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  fullWidth
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} edge="end">
                          {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!passwordErrors.confirmNewPassword}
                  helperText={passwordErrors.confirmNewPassword}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeChangePasswordDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleChangePassword} color="primary">
                  Change Password
                </Button>
              </DialogActions>
            </Dialog>

            {/* Verify Mobile Number Dialog */}
            <Dialog open={otpDialogOpen} onClose={closeOtpDialog}>
              <DialogTitle>Verify Mobile Number</DialogTitle>
              <DialogContent>
                <TextField
                  label="Enter OTP"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  sx={{ mt: 2 }}
                  error={!!otpError}
                  helperText={otpError}
                />
                {resendOtpCooldown > 0 ? (
                  <Typography variant="body2" style={{ marginTop: '10px' }}>
                    Resend OTP in {Math.floor(resendOtpCooldown / 60)}:{resendOtpCooldown % 60 < 10 ? '0' : ''}
                    {resendOtpCooldown % 60}
                  </Typography>
                ) : (
                  <Button onClick={resendOtp} color="primary" variant="text" style={{ marginTop: '10px' }}>
                    Resend OTP
                  </Button>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={closeOtpDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={verifyOtp} color="primary">
                  Verify Number
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Card>
      </Box>
    </Container>
  );
};

export default ProfilePage;