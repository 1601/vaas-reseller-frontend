import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, Typography, List, ListItem, DialogActions, Button, Card, CardContent, Box } from '@mui/material';

const ResellersModal = ({ open, onClose, userId }) => {
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/admin/${userId}/resellers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          setResellers(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching resellers:", error);
          setLoading(false);
        });
    }
  }, [open, userId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Resellers</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : resellers.length === 0 ? (
          <Typography>No Resellers Found</Typography>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="stretch">
            {resellers.map((reseller) => (
              <Card key={reseller._id} variant="outlined" style={{ width: '100%', marginBottom: '10px' }}>
                <CardContent>
                  <Typography variant="h6">
                    {reseller.firstName} {reseller.lastName}
                  </Typography>
                  <Typography variant="body2">
                    Email: {reseller.email}
                  </Typography>
                  <Typography variant="body2">
                    Country: {reseller.country}
                  </Typography>
                  <Typography variant="body2">
                    Mobile: {reseller.mobileNumber}
                  </Typography>
                  <Typography variant="body2">
                    Company: {reseller.companyName}
                  </Typography>
                  <Typography variant="body2">
                    Status: {reseller.status}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
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

export default ResellersModal;
