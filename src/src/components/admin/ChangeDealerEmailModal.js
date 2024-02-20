import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';

export const ChangeDealerEmailModal = ({ open, onClose, user, onSubmit, errorMessage, onEmailEdit }) => {
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setNewEmail(email);
    setEmailError(!validateEmail(email));
    if (onEmailEdit) onEmailEdit();
  };

  const handleUpdateEmail = async () => {
    if (!validateEmail(newEmail)) {
      setEmailError(true);
      return;
    }
    setIsUpdating(true);
    try {
      await onSubmit(user.email, newEmail);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Change Dealer Email</DialogTitle>
      <DialogContent>
        {isUpdating ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress />
            <Typography style={{ marginTop: 16 }}>Updating email...</Typography>
          </div>
        ) : (
          <>
            <Typography variant="body1" gutterBottom>
              <strong>Current Email:</strong> {user?.email || 'N/A'}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="newEmail"
              label="New Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={newEmail}
              onChange={handleEmailChange}
              error={emailError || Boolean(errorMessage)}
              helperText={emailError ? 'Invalid email format.' : errorMessage || ''}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={isUpdating}>
          Close
        </Button>
        <Button onClick={handleUpdateEmail} color="primary" disabled={emailError || !newEmail || isUpdating}>
          Update Email
        </Button>
      </DialogActions>
    </Dialog>
  );
};
