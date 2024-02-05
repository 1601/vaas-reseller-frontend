import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const ChangePasswordDialog = ({ open, onClose, userId, currentReseller }) => {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

  const handlePasswordChange = async () => {
    if (!passwordValidation.test(newPassword)) {
      setPasswordError('Password must be 8-12 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/${currentReseller}/password`,
        {
          newPassword,
        }
      );
      // console.log('Password changed successfully for reseller:', currentReseller);
      setNewPassword('');
      setPasswordError('');
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="newPassword"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handlePasswordChange} color="primary">
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
