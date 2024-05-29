import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const ListDialog = ({ open, onClose, title, list, itemKey }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {list && list.length > 0 ? (
          <List>
            {list.map((item, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={item.reason}
                  secondary={`Date: ${new Date(item.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">Dealer currently has no Rejection Reasons from Admin Approval</Typography>
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

export default ListDialog;
