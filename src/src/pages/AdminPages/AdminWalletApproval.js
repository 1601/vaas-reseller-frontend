import React, {useState, useCallback } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { Card, Typography, Button, Box, Divider, 
  IconButton, Dialog, DialogActions, DialogContent, DialogContentText,
   DialogTitle, TextField, Link } from '@mui/material';
import ReactImageMagnify from 'react-image-magnify';

const ConfirmationDialog = ({ open, onClose, onSubmit, action, remarks, setRemarks, adjustedAmount, setAdjustedAmount }) => {
  const isAdjust = action === 'verified';
  const isApprove = action === 'approved';
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm {action}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to {action} this wallet request?
        </DialogContentText>
        {isAdjust && (
          <TextField
            autoFocus
            margin="dense"
            label="Adjusted Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={adjustedAmount}
            onChange={(e) => setAdjustedAmount(e.target.value)}
          />
        )}
        
        {!isApprove && (
          <TextField
          margin="dense"
          label="Remarks"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={isAdjust ? 1 : 3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const AdminWalletApproval = ({ selectedWallet, onBack }) => {

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [adjustedAmount, setAdjustedAmount] = useState('');
  const [isImageMagnified, setIsImageMagnified] = useState(false);

  const setRemarksStable = useCallback(setRemarks, []);
  const setAdjustedAmountStable = useCallback(setAdjustedAmount, []);

  const toggleImageMagnification = () => {
    setIsImageMagnified(!isImageMagnified);
  };

  const isFinalized = ['APPROVED', 'REJECTED'].includes(selectedWallet.paymentStatus);

  const handleOpenConfirmation = (action) => {
    setConfirmationAction(action);
    setShowConfirmation(true);
  };
  
  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setRemarks('');
    setAdjustedAmount('');
  };
  
  const handleSubmitConfirmation = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/v1/api/wallet-requests/${selectedWallet._id}`;
    const status = confirmationAction.toUpperCase();
    const data = {
      paymentStatus: status,
      ...(status === 'VERIFIED' && { computedAmount: adjustedAmount }),
      remarks, 
      action: confirmationAction,
    };
    
    try {
      console.log('Updating wallet request...', data)
      const response = await axios.put(url, data);
      console.log(response.data);
      handleConfirmationClose();
      onBack();
    } catch (error) {
      console.error('Error updating wallet request: ', error);
    }
  };
  

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
    <>
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
          <strong>Account:</strong> {selectedWallet.accountEmail}
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
          <strong>Status:</strong> {selectedWallet.paymentStatus}
        </Typography>
        <Typography variant="body1">
          <strong>Remarks:</strong> {selectedWallet.remarks}
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
        {/* Image preview with magnification feature */}
      <Box sx={{ mt: 2 }}>
        {isImageMagnified ? (
          
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: 'Wallet Request',
                isFluidWidth: true,
                src: selectedWallet.image,
              },
              largeImage: {
                src: selectedWallet.image,
                width: 1200,
                height: 1800
              },
              enlargedImagePosition: 'over', // or 'beside' based on preference
              isHintEnabled: true,
              shouldHideHintAfterFirstActivation: false,
              enlargedImageContainerDimensions: {
                width: '150%',
                height: '150%',
              },
            }}
          />
        ) : (
          <button
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            maxWidth: '100%'
          }}
          onClick={toggleImageMagnification}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              toggleImageMagnification();
            }
          }}
        >
          <img 
            src={selectedWallet.image} 
            alt="Wallet Request"
          />
        </button>
        

        )}
        <a 
          href={selectedWallet.image} 
          target="_blank" 
          rel="noopener noreferrer" // Use noreferrer for security reasons along with noopener
          style={{ textDecoration: 'none' }} // optional style to remove underline
        >
          View Full Image
        </a>

      </Box>

        {!isFinalized && (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Button variant="outlined" color="primary" onClick={() => handleOpenConfirmation('approved')}>
            Approve
          </Button>
          {/* <Button variant="outlined" onClick={() => handleOpenConfirmation('verified')}>
            Adjust
          </Button> */}
          <Button variant="outlined" color="secondary" onClick={() => handleOpenConfirmation('rejected')}>
            Reject
          </Button>
        </Box>
      )}
      </Card>
       <ConfirmationDialog
        open={showConfirmation}
        onClose={handleConfirmationClose}
        onSubmit={handleSubmitConfirmation}
        action={confirmationAction}
        remarks={remarks}
        setRemarks={setRemarksStable}
        adjustedAmount={adjustedAmount}
        setAdjustedAmount={setAdjustedAmountStable}
      />
    </>
  );
};

export default AdminWalletApproval;
