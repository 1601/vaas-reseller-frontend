import { Dialog, DialogTitle, DialogContent, DialogContentText, Box, CircularProgress } from '@mui/material';

function PasswordRequestDialog({ open }) {
  return (
    <Dialog open={open}>
      <DialogTitle>Password Request processing...</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
        <DialogContentText>Please wait, your password request is being processed.</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default PasswordRequestDialog;