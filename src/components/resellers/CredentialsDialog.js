import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from '@mui/material';

const CredentialsDialog = ({ open, onClose, email, password }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reseller Successfully Created</DialogTitle>
      <DialogContent>
        <Typography>Please save the following credentials for your reseller to use:</Typography>
        <Box mt={2}>
          <Typography>
            <strong>Email:</strong> {email}
          </Typography>
          <Typography>
            <strong>Password:</strong> {password}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            // Placeholder for change password functionality
            console.log('Change Password Clicked');
            onClose();
          }}
          color="primary"
        >
          Change Password
        </Button>
        <Button onClick={onClose} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CredentialsDialog;
