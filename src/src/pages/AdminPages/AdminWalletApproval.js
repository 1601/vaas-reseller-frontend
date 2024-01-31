import React from 'react';
import { Card, Typography, Button, Box, Divider, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AdminWalletApproval = ({ selectedWallet, onBack }) => {
  const handleApprove = () => {
    console.log('Approve', selectedWallet);
  };

  const handleReject = () => {
    console.log('Reject', selectedWallet);
  };

  const handleAdjust = () => {
    console.log('Adjust', selectedWallet);
  };

  const formatDate = (isoString) => new Date(isoString).toLocaleString();

  return (
    <Card sx={{ p: 2, maxWidth: 600, margin: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <IconButton onClick={onBack} color="primary" aria-label="back to wallet list">
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="h5" gutterBottom component="div">
            Wallet Request
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" sx={{ ml: 1 }}>
            Preview
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h7" gutterBottom component="div">
        Wallet Request
      </Typography>

      <Typography variant="body1">
        <strong>Reference No:</strong> {selectedWallet.referenceNo}
      </Typography>
      <Typography variant="body1">
        <strong>Account:</strong> {selectedWallet.account}
      </Typography>
      <Typography variant="body1">
        <strong>Wallet Type:</strong> {selectedWallet.walletType}
      </Typography>
      <Typography variant="body1">
        <strong>Amount:</strong> {selectedWallet.amount}
      </Typography>
      <Typography variant="body1">
        <strong>Currency:</strong> {selectedWallet.currency}
      </Typography>
      <Typography variant="body1">
        <strong>Computed Amount:</strong> {selectedWallet.computedAmount}
      </Typography>
      <Typography variant="body1">
        <strong>Bonus Amount:</strong> {selectedWallet.bonusAmount}
      </Typography>
      <Typography variant="body1">
        <strong>Status:</strong> {selectedWallet.status}
      </Typography>
      <Typography variant="body1">
        <strong>Payment Method:</strong> {selectedWallet.paymentMethod}
      </Typography>
      <Typography variant="body1">
        <strong>Date Created:</strong> {selectedWallet.dateCreated}
      </Typography>
      <Typography variant="body1">
        <strong>Date Updated:</strong> {selectedWallet.dateUpdated}
      </Typography>
      <Typography variant="body1">
        <strong>Image:</strong> {selectedWallet.image}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
        <Button variant="outlined" color="primary" onClick={handleApprove}>
          Approve
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="outlined" onClick={handleAdjust}>
          Adjust
        </Button>
      </Box>
    </Card>
  );
};

export default AdminWalletApproval;
