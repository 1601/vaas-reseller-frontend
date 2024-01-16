import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  IconButton,
  Snackbar,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';

const AdminCreation = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: '',
    phoneNumber: '',
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^[0-9]+$/;
  const [errorMessage, setErrorMessage] = useState('');

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);

  const validateEmail = (email) => {
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    return phoneRegex.test(phoneNumber) && phoneNumber.length >= 10; // Assuming phone number should be at least 10 digits
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });

    if (name === 'email') {
      setIsEmailValid(validateEmail(value));
    } else if (name === 'phoneNumber') {
      setIsPhoneNumberValid(validatePhoneNumber(value));
    }
  };

  const isFormValid = () => {
    return isEmailValid && isPhoneNumberValid;
  };

  const handleSubmitClick = async () => {
    setErrorMessage('');

    // Check if the email is associated with a dealer account
    if (isEmailValid) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/email`, {
          params: { email: formState.email },
        });

        if (response.data && response.data.role === 'dealer') {
          setErrorMessage('Dealer account detected. Use another email that is not a registered dealer.');
        } else {
          setOpenConfirmDialog(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setOpenConfirmDialog(true);
        } else {
          console.error('Error checking email:', error);
          setErrorMessage('Error occurred while checking the email.');
        }
      }
    } else {
      setErrorMessage('Please enter a valid email.');
    }
  };

  const handleFinalSubmit = async () => {
    setOpenConfirmDialog(false);
    const uniqueKey = uuidv4();

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/admin/send-invite`, {
        email: formState.email,
        mobileNumber: formState.phoneNumber,
        uniqueKey,
      });
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/dashboard/admin/home');
      }, 2000);
    } catch (error) {
      console.error('Error sending admin invite:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleBack = () => {
    navigate('/dashboard/admin/home');
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ p: 4, mt: 4 }}>
        <IconButton onClick={handleBack} sx={{ position: 'absolute', top: 8, left: 8 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Add New Admin
        </Typography>
        <TextField
          label="Email"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          error={formState.email.length > 0 && !isEmailValid}
          helperText={formState.email.length > 0 && !isEmailValid ? 'Invalid email format' : ''}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formState.phoneNumber}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          error={formState.phoneNumber.length > 0 && !isPhoneNumberValid}
          helperText={formState.phoneNumber.length > 0 && !isPhoneNumberValid ? 'Invalid phone number format' : ''}
        />
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          variant="contained"
          style={{
            width: '100%',
            height: '40px',
            borderRadius: '22px',
            fontSize: '14px',
            backgroundColor: isFormValid() ? '#7A52F4' : '#CCCCCC',
            color: isFormValid() ? '#fff' : '#666666',
            marginTop: '16px',
          }}
          onClick={handleSubmitClick}
          disabled={!isFormValid()}
        >
          Submit
        </Button>
      </Card>

      <Dialog open={openConfirmDialog} onClose={handleCloseDialog}>
        <DialogTitle>{'Confirm Submission'}</DialogTitle>
        <DialogContent>
          <Typography>
            Ensure all details are correct as you are giving admin credentials to the specified email.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Review
          </Button>
          <Button onClick={handleFinalSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} message="Email has been sent." />
    </Container>
  );
};

export default AdminCreation;
