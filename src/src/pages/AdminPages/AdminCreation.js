import React, { useState } from 'react';
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
} from '@mui/material';

const AdminCreation = () => {
  const [formState, setFormState] = useState({
    email: '',
    phoneNumber: '',
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmitClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleFinalSubmit = () => {
    // Implement the logic to add a new admin
    console.log(formState);
    // You might want to send this data to your backend server
    setOpenConfirmDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ p: 4, mt: 4 }}>
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
    </Container>
  );
};

export default AdminCreation;
