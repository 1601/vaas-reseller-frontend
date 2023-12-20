import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';

export const ViewUserModal = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>First Name:</strong> {user?.firstName || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Last Name:</strong> {user?.lastName || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Designation:</strong> {user?.designation || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user?.email || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Mobile Number:</strong> {user?.mobileNumber || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Country:</strong> {user?.country || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>IP Address:</strong> {user?.ipAddress || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Username:</strong> {user?.username || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Role:</strong> {user?.role || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Is Active:</strong> {user?.isActive ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body1">
          <strong>Failed Login Attempts:</strong> {user?.failedLoginAttempts || 0}
        </Typography>
        <Typography variant="body1">
          <strong>Last Failed Login:</strong> {user?.lastFailedLogin || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Account Status:</strong> {user?.accountStatus || 'N/A'}
        </Typography>
        <Typography variant="body1">
          <strong>Is Google User:</strong> {user?.isGoogleUser ? 'Yes' : 'No'}
        </Typography>
        <Typography variant="body1">
          <strong>Mobile Number Verified:</strong> {user?.mobileNumberVerified ? 'Yes' : 'No'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
