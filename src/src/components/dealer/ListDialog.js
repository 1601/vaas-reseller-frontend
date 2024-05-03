import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, DialogActions, Button } from '@mui/material';

const ListDialog = ({ open, onClose, title, list, itemKey }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <List>
          {list.map((item, index) => (
            <ListItem key={item[itemKey]}>
              <ListItemText primary={item.reason} secondary={`Date: ${new Date(item.date).toLocaleDateString()}`} />
            </ListItem>
          ))}
        </List>
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
