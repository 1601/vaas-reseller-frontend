import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';
import ValidatedManageReseller from '../validation/ValidatedManageReseller';
import { validateName } from '../validation/validationUtils';

const EditResellerDialog = ({ open, onClose, reseller, onSubmit, userId, refreshResellers, editingResellerId }) => {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
  });

  useEffect(() => {
    if (reseller) {
      setFormState({
        firstName: reseller.firstName || '',
        lastName: reseller.lastName || '',
        companyName: reseller.companyName || '',
      });
    }
  }, [reseller]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/resellers/${editingResellerId}`,
        formState
      );

      if (response.status === 200) {
        onSubmit(formState);
        refreshResellers();
        onClose();
      } else {
        console.error('Error updating reseller:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating reseller:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="edit-reseller-dialog-title">
      <DialogTitle
        id="edit-reseller-dialog-title"
        sx={{
          backgroundColor: '#7A52F4',
          color: 'white',
          padding: '16px',
          textAlign: 'center',
          fontSize: '35px !important',
        }}
      >
        Edit Reseller
      </DialogTitle>
      <DialogContent>
        <ValidatedManageReseller
          validationFunction={validateName}
          label="First Name"
          name="firstName"
          value={formState.firstName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
          error={!validateName(formState.firstName)}
          helperText={!validateName(formState.firstName) ? 'Invalid first name' : ''}
        />
        <ValidatedManageReseller
          validationFunction={validateName}
          label="Last Name"
          name="lastName"
          value={formState.lastName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
          error={!validateName(formState.lastName)}
          helperText={!validateName(formState.lastName) ? 'Invalid last name' : ''}
        />
        <ValidatedManageReseller
          label="Company Name"
          name="companyName"
          value={formState.companyName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
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
            onClick={() => {
              handleFormSubmit();
              onClose();
            }}
          >
            Submit
          </Button>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default EditResellerDialog;
