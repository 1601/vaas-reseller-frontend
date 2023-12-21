import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Autocomplete, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const AddResellerDialog = ({
  open,
  onClose,
  formState,
  handleInputChange,
  handleBlur,
  validationErrors,
  handleAddReseller,
  countries,
  countryCodes
}) => {
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
        Add Reseller
      </DialogTitle>
      <DialogContent>
        {/* Email Field */}
        <TextField
          label="Email"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          fullWidth
          error={!!validationErrors.email}
          helperText={validationErrors.email}
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
            startAdornment: (
              <InputAdornment position="start">
                {formState.country && countryCodes[formState.country] ? `${countryCodes[formState.country]} |` : ''}
              </InputAdornment>
            ),
          }}
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
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Button
          variant="contained"
          style={{
            width: '140px',
            height: '40px',
            borderRadius: '22px',
            fontSize: '14px',
            backgroundColor: '#7A52F4',
            color: '#fff',
          }}
          onClick={handleAddReseller}
        >
          Submit
        </Button>
        <Button onClick={onClose} color="primary" sx={{ mt: 2 }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddResellerDialog;
