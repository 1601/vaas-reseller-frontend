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

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmitClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleFinalSubmit = async () => {
    setOpenConfirmDialog(false);
    const uniqueKey = uuidv4();

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/admin/send-invite`, {
        email: formState.email,
        phoneNumber: formState.phoneNumber, 
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
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formState.phoneNumber}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          style={{
            width: '100%',
            height: '40px',
            borderRadius: '22px',
            fontSize: '14px',
            backgroundColor: '#7A52F4',
            color: '#fff',
            marginTop: '16px',
          }}
          onClick={handleSubmitClick}
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
