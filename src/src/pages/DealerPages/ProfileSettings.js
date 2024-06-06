import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SecureLS from 'secure-ls';
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
  Switch,
  FormControlLabel,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import UserDataFetch from '../../components/user-account/UserDataFetch';
import StoreDataFetch from '../../components/user-account/StoreDataFetch';
import { countries } from '../../components/country/CountriesList';
import { countryCodes } from '../../components/country/countryNumCodes';
import { mobileNumberLengths } from '../../components/country/countryNumLength';
import ValidatedTextField from '../../components/validation/ValidatedTextField';
import { validateName, validateEmail, validateMobileNumber } from '../../components/validation/validationUtils';
import CircularLoading from '../../components/preLoader';
import termsAndAgreement from '../../components/agreements/termsAndAgreement';
import privacyPolicy from '../../components/agreements/privacyPolicy';
import cookiePolicy from '../../components/agreements/cookiePolicy';

const ls = new SecureLS({ encodingType: 'aes' });

const ProfileSettings = () => {
  const navigate = useNavigate();
  const user = ls.get('user');
  const userId = user?._id || (user && user.id);
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
  const [originalMobileNumber, setOriginalMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [acceptedMarketSub, setAcceptedMarketSub] = useState(userData?.marketSub); // Default state is true
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCookie, setShowCookie] = useState(false);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [isPrivacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [isCookieDialogOpen, setCookieDialogOpen] = useState(false);
  const [resetFields, setResetFields] = useState(false);

  const kycStatuses = ['Unsubmitted Documents', 'Pending Approval', 'Approved', 'Rejected'];

  const accountStatusDisplay = {
    FreeTrial: 'Free Trial',
    Active: 'Active',
    Suspended: 'Suspended',
    Deactivated: 'Deactivated',
  };

  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  const validateForm = () => {
    const errors = {};

    if (!formState.firstName) errors.firstName = 'First Name is required';
    if (!formState.lastName) errors.lastName = 'Last Name is required';
    if (!formState.country) errors.country = 'Country is required';
    if (!formState.username) errors.username = 'Username is required';

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const openOtpDialog = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const endpoint = `${baseUrl}/v1/api/auth/mobile/otp`;

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
    const endpoint = `${baseUrl}/v1/api/auth/mobile/verify`;

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
    let endpoint = `${baseUrl}/v1/api/dealer/password`;

    if (!userData.hasPassword) {
      endpoint = `${baseUrl}/v1/api/dealer/password/new`;
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
      setIsLoading(true);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDialogTitle('Success');
        setDialogMessage('Password changed successfully');
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileNumberChange = (event) => {
    const { value } = event.target;

    if (!formState.country) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        mobileNumber: 'Country is required to validate mobile number.',
      }));
      handleInputChange(event);
      return;
    }

    const strippedNumber = value?.replace(countryCodes[formState.country] || '', '');

    const validationError = validateMobileNumber(formState.country, strippedNumber, countryCodes, mobileNumberLengths);
    setValidationErrors((prevErrors) => ({ ...prevErrors, mobileNumber: validationError }));

    handleInputChange(event);
  };

  const handleEditClick = () => {
    const countryCode = countryCodes[userData?.country];
    const strippedMobileNumber = userData?.mobileNumber?.replace(countryCode, '') || '';
    setOriginalMobileNumber(userData.mobileNumber || '');

    setAcceptedMarketSub(userData?.marketSub);

    setFormState({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      middleName: userData?.middleName || '',
      country: userData?.country || '',
      mobileNumber: strippedMobileNumber,
      username: userData?.username || '',
    });

    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setValidationErrors({});
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setOtpError('');
    setFormState({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      middleName: userData?.middleName || '',
      country: userData?.country || '',
      mobileNumber: userData?.mobileNumber?.replace(countryCodes[userData?.country] || '', '') || '',
      username: userData?.username || '',
    });
    console.log('Setting resetFields to true');
    setResetFields(true);
    setTimeout(() => {
      console.log('Setting resetFields to false');
      setResetFields(false);
    }, 0);
  };

  const handleSaveChanges = async () => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const fullMobileNumber = countryCodes[formState.country] + formState.mobileNumber;

    let mobileNumberChanged = false;
    if (originalMobileNumber !== fullMobileNumber) {
      mobileNumberChanged = true;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/v1/api/dealer/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          username: formState.username,
          email: formState.email,
          firstName: formState.firstName,
          lastName: formState.lastName,
          middleName: formState.middleName === '' ? undefined : formState.middleName,
          country: formState.country,
          mobileNumber: fullMobileNumber,
          marketSub: acceptedMarketSub,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDialogTitle('Success');
        setDialogMessage('Profile updated successfully');

        // Update userData with the new values
        userData.firstName = formState.firstName;
        userData.lastName = formState.lastName;
        userData.middleName = formState.middleName;
        userData.country = formState.country;
        userData.mobileNumber = fullMobileNumber;
        userData.username = formState.username;
        userData.marketSub = acceptedMarketSub;

        setEditMode(false);
      } else {
        setDialogTitle('Error');
        setDialogMessage(data.message || 'Failed to update profile. Please try again later.');
        console.error('Error updating user:', data.message);
      }
    } catch (error) {
      setDialogTitle('Error');
      setDialogMessage('There was an error updating the user. Please try again later.');
      console.error('There was an error updating the user:', error);
    } finally {
      setIsLoading(false);
      setDialogOpen(true);
    }
  };

  const hasValidationErrors = () => {
    return Object.values(validationErrors).some((error) => error);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'country') {
      setFormState((prevState) => ({ ...prevState, mobileNumber: '' }));
      setValidationErrors((prevErrors) => ({ ...prevErrors, mobileNumber: 'Mobile number is required' }));
    } else if (name === 'mobileNumber') {
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
      const response = await fetch(`${baseUrl}/v1/api/auth/email`, {
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

  const openTermsDialog = () => {
    setIsTermsDialogOpen(true);
  };

  const closeTermsDialog = () => {
    setIsTermsDialogOpen(false);
  };

  const openPrivacyDialog = () => {
    setPrivacyDialogOpen(true);
  };

  const closePrivacyDialog = () => {
    setPrivacyDialogOpen(false);
  };

  const openCookieDialog = () => {
    setCookieDialogOpen(true);
  };

  const closeCookieDialog = () => {
    setCookieDialogOpen(false);
  };

  const handleMarketingEmailSubChange = (event) => {
    console.log(user);
    setAcceptedMarketSub(event.target.checked);
  };

  if (!userData || !storeData) {
    return <CircularLoading />;
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
            <Typography variant="h4">Profile Settings</Typography>
            <div>
              {editMode ? (
                <div className="flex">
                  <Button
                    onClick={handleSaveChanges}
                    variant="outlined"
                    className="mr-2"
                    disabled={hasValidationErrors()}
                  >
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleCancelClick} className="mr-2">
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
                          inputProps={{ maxLength: 20 }}
                          reset={resetFields}
                        />
                        <ValidatedTextField
                          validationFunction={validateName}
                          label="Middle Name (Optional)"
                          name="middleName"
                          value={formState.middleName}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{ mb: 2 }}
                          inputProps={{ maxLength: 20 }}
                          reset={resetFields}
                        />
                        <ValidatedTextField
                          validationFunction={validateName}
                          label="Last Name"
                          name="lastName"
                          value={formState.lastName}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{ mb: 2 }}
                          inputProps={{ maxLength: 20 }}
                          reset={resetFields}
                        />
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
                        <ValidatedTextField
                          validationFunction={validateName}
                          label="First Name"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{ mb: 2, mt: 2 }}
                          inputProps={{ maxLength: 20 }}
                          disabled={!editMode}
                        />
                        <TextField
                          label="Middle Name (Optional)"
                          name="middleName"
                          value={userData.middleName}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{ mb: 2 }}
                          disabled={!editMode}
                        />
                        <ValidatedTextField
                          validationFunction={validateName}
                          label="Last Name"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{ mb: 2 }}
                          disabled={!editMode}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          label="Country"
                          sx={{ mb: 2 }}
                          value={userData.country}
                          disabled={!editMode}
                        />
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
                          inputProps={{ maxLength: 20 }}
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
                        <TextField
                          label="Username"
                          name="username"
                          value={editMode ? formState.username : userData.username}
                          onChange={handleInputChange}
                          fullWidth
                          disabled={!editMode}
                          error={!!validationErrors.username}
                          helperText={validationErrors.username}
                        />
                        <TextField
                          label="Email"
                          name="email"
                          value={editMode ? formState.email : userData.email}
                          onChange={handleInputChange}
                          fullWidth
                          sx={{ mb: 2, mt: 2 }}
                          disabled
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {userData.isActive ? (
                                  <span style={{ color: 'green' }}>(Verified)</span>
                                ) : (
                                  <span style={{ color: 'red' }}>(Unverified)</span>
                                )}
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          error={!!validationErrors.mobileNumber}
                          fullWidth
                          label="Mobile Number"
                          variant="outlined"
                          name="mobileNumber"
                          value={editMode ? formState.mobileNumber : userData.mobileNumber}
                          onChange={handleInputChange}
                          sx={{ mb: 2 }}
                          disabled={!editMode || !formState.country}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {/* {userData.mobileNumberVerified ? (
                                  <span style={{ color: 'green' }}>(Verified)</span>
                                ) : (
                                  <span style={{ color: 'red' }}>(Unverified)</span>
                                )} */}
                              </InputAdornment>
                            ),
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          helperText={validationErrors.mobileNumber}
                        />
                      </>
                    )}
                  </Card>
                  {!editMode && (
                    <Button variant="outlined" className="mt-2 mr-2" onClick={openChangePasswordDialog}>
                      {userData.hasPassword ? 'Change Password' : 'Add Password'}
                    </Button>
                  )}
                  {/* {!editMode && !userData.mobileNumberVerified && (
                    <Button variant="outlined" className="mt-2 mr-2" onClick={openOtpDialog}>
                      Verify Mobile Number
                    </Button>
                  )} */}
                  {!editMode && !userData.isActive && (
                    <Button variant="outlined" className="mt-2" onClick={sendVerificationEmailAndNavigate}>
                      Verify Email
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Preference */}
            <Grid item xs={12}>
              <Card style={{ borderColor: 'purple', borderWidth: '2px' }}>
                <CardContent>
                  <Typography variant="h6">Preferences</Typography>
                  <Card style={{ marginBottom: '20px', padding: '15px' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editMode ? acceptedMarketSub : userData.marketSub}
                          onChange={handleMarketingEmailSubChange}
                          color="primary"
                          disabled={!editMode}
                        />
                      }
                      label="Subscribe to Marketing Emails"
                    />
                  </Card>
                  <Card style={{ marginBottom: '20px', padding: '15px' }}>
                    <Typography variant="body1">
                      You have agreed to our{' '}
                      <Tooltip
                        title={showTerms ? 'Terms and Agreements' : ''}
                        onOpen={() => setShowTerms(true)}
                        onClose={() => setShowTerms(false)}
                        onClick={openTermsDialog}
                      >
                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms and Conditions</span>
                      </Tooltip>
                      {', '}
                      <Tooltip
                        title={showCookie ? 'Cookie Policy' : ''}
                        onOpen={() => setShowCookie(true)}
                        onClose={() => setShowTerms(false)}
                        onClick={openCookieDialog}
                      >
                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Cookie Policy</span>
                      </Tooltip>
                      {', and '}
                      <Tooltip
                        title={showPrivacy ? 'Privacy Policy' : ''}
                        onOpen={() => setShowPrivacy(true)}
                        onClose={() => setShowTerms(false)}
                        onClick={openPrivacyDialog}
                      >
                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
                      </Tooltip>{' '}
                      upon signing up.
                    </Typography>
                  </Card>
                </CardContent>
              </Card>
            </Grid>

            <Dialog open={isTermsDialogOpen} onClose={closeTermsDialog} scroll="paper">
              <DialogTitle>Terms and Conditions</DialogTitle>
              <DialogContent dividers>
                <div
                  style={{
                    overflowY: 'auto',
                    maxHeight: 400,
                    whiteSpace: 'pre-line',
                  }}
                >
                  <p>{termsAndAgreement}</p>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeTermsDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={isCookieDialogOpen} onClose={closeCookieDialog} scroll="paper">
              <DialogTitle>Cookie Policy</DialogTitle>
              <DialogContent dividers>
                <div
                  style={{
                    overflowY: 'auto',
                    maxHeight: 400,
                    whiteSpace: 'pre-line',
                  }}
                >
                  <p>{cookiePolicy}</p>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={closeCookieDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={isPrivacyDialogOpen} onClose={closePrivacyDialog} scroll="paper">
              <DialogTitle>Privacy Policy</DialogTitle>
              <DialogContent dividers>
                <div
                  style={{
                    overflowY: 'auto',
                    maxHeight: 400,
                    whiteSpace: 'pre-line',
                  }}
                >
                  <p>{privacyPolicy}</p>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={closePrivacyDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>

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
                  Submit
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

            {/* Success/Error Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogContent>
                <Typography>{dialogMessage}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Card>
      </Box>

      {isLoading && (
        <Dialog open={isLoading}>
          <DialogContent>
            <Box display="flex" alignItems="center">
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Processing...
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default ProfileSettings;
