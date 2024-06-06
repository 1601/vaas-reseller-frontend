import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  InputAdornment,
  CircularProgress,
  Typography,
} from '@mui/material';

const AddResellerDialog = ({
  open,
  onClose,
  formState,
  handleInputChange,
  handleBlur,
  validationErrors,
  handleAddReseller,
  countries,
  countryCodes,
  isCreating,
  createSuccessMessage,
  createErrorMessage,
}) => {
  const isSubmitDisabled = () => {
    const requiredFields = ['email', 'firstName', 'lastName', 'country', 'mobileNumber'];
    const hasErrors = Object.values(validationErrors).some((error) => error);
    const hasEmptyFields = requiredFields.some((field) => !formState[field]);
    return hasErrors || hasEmptyFields;
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle
        id="form-dialog-title"
        sx={{
          backgroundColor: '#7A52F4',
          color: 'white',
          padding: '16px',
          textAlign: 'center',
          fontSize: '35px !important',
        }}
      >
        Add Retailer
      </DialogTitle>

      <DialogContent>
        {isCreating ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <CircularProgress />
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              Creating Retailer...
            </Typography>
          </div>
        ) : createSuccessMessage ? (
          <Typography variant="h5" style={{ textAlign: 'center', padding: '20px' }}>
            {createSuccessMessage}
          </Typography>
        ) : (
          <>
            {/* Email Field */}
            <TextField
              label="Email"
              name="email"
              value={formState.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
              error={!!validationErrors.email}
              helperText={validationErrors.email || ''}
              variant="outlined"
              sx={{ mt: 2 }}
            />

            {/* First Name Field */}
            <TextField
              label="First Name"
              name="firstName"
              value={formState.firstName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
              error={!!validationErrors.firstName}
              helperText={validationErrors.firstName}
              variant="outlined"
              sx={{ mt: 2 }}
            />

            {/* Last Name Field */}
            <TextField
              label="Last Name"
              name="lastName"
              value={formState.lastName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              fullWidth
              error={!!validationErrors.lastName}
              helperText={validationErrors.lastName}
              variant="outlined"
              sx={{ mt: 2 }}
            />

            {/* Country Field */}
            <Autocomplete
              fullWidth
              options={countries}
              getOptionLabel={(option) => option}
              value={formState.country}
              onChange={(event, newValue) => {
                handleInputChange({ target: { name: 'country', value: newValue } });
              }}
              onBlur={handleBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  variant="outlined"
                  error={!!validationErrors.country}
                  helperText={validationErrors.country}
                  sx={{ mt: 2 }}
                />
              )}
            />

            {/* Mobile Number Field */}
            <TextField
              fullWidth
              label="Mobile Number"
              variant="outlined"
              name="mobileNumber"
              value={formState.mobileNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              InputProps={{
                startAdornment: formState.country && (
                  <InputAdornment position="start">
                    {countryCodes[formState.country] ? `${countryCodes[formState.country]} |` : ''}
                  </InputAdornment>
                ),
              }}
              disabled={!formState.country}
              error={!!validationErrors.mobileNumber}
              helperText={validationErrors.mobileNumber}
              sx={{ mt: 2 }}
            />

            {/* Company Name Field */}
            <TextField
              fullWidth
              variant="outlined"
              label="Company Name (Optional)"
              name="companyName"
              value={formState.companyName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </DialogContent>
      {createSuccessMessage ? (
        <DialogActions
          sx={{
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <Button
            variant="contained"
            onClick={onClose}
            style={{
              backgroundColor: '#7A52F4',
              color: '#fff',
            }}
          >
            Done
          </Button>
        </DialogActions>
      ) : (
        !isCreating && (
          <DialogActions
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Display error or success messages if any */}
            {createSuccessMessage && (
              <div style={{ width: '100%', textAlign: 'center', color: 'green', padding: '10px' }}>
                {createSuccessMessage}
              </div>
            )}
            {createErrorMessage && (
              <div style={{ width: '100%', textAlign: 'center', color: 'red', padding: '10px' }}>
                {createErrorMessage}
              </div>
            )}
            <Button
              variant="contained"
              style={{
                width: '140px',
                height: '40px',
                borderRadius: '22px',
                fontSize: '14px',
                backgroundColor: isSubmitDisabled() ? '#d3bdfa' : '#7A52F4',
                color: '#fff',
                marginTop: createSuccessMessage || createErrorMessage ? '10px' : '0',
              }}
              onClick={handleAddReseller}
              disabled={isSubmitDisabled()}
            >
              Submit
            </Button>

            <Button onClick={onClose} color="primary" sx={{ mt: 2 }}>
              Cancel
            </Button>
          </DialogActions>
        )
      )}
    </Dialog>
  );
};

export default AddResellerDialog;
