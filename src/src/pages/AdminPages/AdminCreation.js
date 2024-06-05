import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
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
  Tooltip, 
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';

const ls = new SecureLS({ encodingType: 'aes' });

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
  const [disableCreateButton, setDisableCreateButton] = useState(false);
  const [createButtonTooltip, setCreateButtonTooltip] = useState('');

  const validateEmail = (email) => emailRegex.test(email);

  const validatePhoneNumber = (phoneNumber) => phoneRegex.test(phoneNumber) && phoneNumber.length >= 10;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });

    if (name === 'email') {
      setIsEmailValid(validateEmail(value));
    } else if (name === 'phoneNumber') {
      setIsPhoneNumberValid(validatePhoneNumber(value));
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      const token = ls.get('token');
      const currentUser = ls.get('user');
      const currentUserSubrole = currentUser?.subrole;

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          const admins = response.data.filter((user) => user.role === 'admin');
          const hasAdmin1 = admins.some((admin) => admin.subrole === 'admin1');

          if (hasAdmin1 && currentUserSubrole === 'admin0') {
            setDisableCreateButton(true);
            setCreateButtonTooltip('Admin1 already created');
          }
        } else {
          console.error('Unexpected API response format for admins');
        }
      } catch (error) {
        console.error('Could not fetch admins:', error);
      }
    };

    fetchAdmins();
  }, []);

  const isFormValid = () => isEmailValid && isPhoneNumberValid;

  const handleSubmitClick = async () => {
    setErrorMessage('');

    if (isEmailValid) {
      try {
        const token = ls.get('token');
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/email`, {
          params: { email: formState.email },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.role === 'dealer') {
          setErrorMessage('Dealer account detected. Use another email that is not a registered dealer.');
        } else {
          setOpenConfirmDialog(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setOpenConfirmDialog(true);
        } else if (error.response && error.response.status === 400) {
          setErrorMessage(error.response.data.message.join(' '));
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
    const token = ls.get('token');
    const currentUser = ls.get('user');
    let subrole = 'crm';

    if (currentUser.subrole === 'admin0') {
      subrole = 'admin1';
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/admin/send-invite`,
        {
          email: formState.email,
          mobileNumber: formState.phoneNumber,
          uniqueKey,
          subrole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/dashboard/admin/home');
      }, 2000);
    } catch (error) {
      console.error('Error sending admin invite:', error);
    }
  };

  const handleCloseDialog = () => setOpenConfirmDialog(false);

  const handleBack = () => navigate('/dashboard/admin/accounts');

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
        <Tooltip title={createButtonTooltip} arrow disableHoverListener={!disableCreateButton}>
          <span>
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
              disabled={!isFormValid() || disableCreateButton}
            >
              Submit
            </Button>
          </span>
        </Tooltip>
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
