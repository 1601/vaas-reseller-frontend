import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from '@mui/material';

const ConfirmationDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  contentText,
  remarks,
  setRemarks,
  isLoading,
  rejectedDocuments = [],
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contentText}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Reason"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Rejected Documents
        </Typography>
        <ul>
          {rejectedDocuments.map((doc, index) => (
            <li key={index}>
              <a href={doc} target="_blank" rel="noopener noreferrer">
                {doc}
              </a>
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button disabled={isLoading} onClick={onSubmit} color="primary">
          {isLoading ? 'Loading...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
