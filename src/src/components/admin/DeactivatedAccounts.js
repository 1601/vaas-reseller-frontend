import React from 'react';
import {
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  DialogActions,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeactivatedAccounts = ({ open, onClose, deactivatedUsers, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center' }}>Deactivated Accounts</DialogTitle>
      <DialogContent dividers>
        {deactivatedUsers.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deactivatedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell component="th" scope="row">
                      {user.email}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton edge="end" aria-label="delete" onClick={() => onDelete(user._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ textAlign: 'center' }}>No Deactivated Accounts</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeactivatedAccounts;
