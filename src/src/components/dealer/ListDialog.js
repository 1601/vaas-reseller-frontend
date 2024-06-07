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
  Link,
} from '@mui/material';

const ListDialog = ({ open, onClose, title, list }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {list && list.length > 0 ? (
          <List>
            {list.map((item, index) => (
              <div key={index}>
                <ListItem>
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
                {item.documents && item.documents.length > 0 && (
                  <>
                    <Typography variant="subtitle2" style={{ paddingLeft: '16px', paddingTop: '8px' }}>
                      Documents Rejected:
                    </Typography>
                    <List component="div" disablePadding>
                      {item.documents.map((doc, docIndex) => (
                        <ListItem key={docIndex} style={{ paddingLeft: '30px' }}>
                          <Link href={doc} target="_blank" rel="noopener">
                            Document {docIndex + 1}
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </div>
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
