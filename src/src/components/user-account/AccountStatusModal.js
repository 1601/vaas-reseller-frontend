import React, { useEffect, useState } from 'react';
import SecureLS from 'secure-ls';
import { Modal, Typography, Button } from '@mui/material';

const ls = new SecureLS({ encodingType: 'aes' });

const AccountStatusModal = ({ open, onClose, userData, storeData }) => {
  const modalBodyStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 400,
    backgroundColor: 'white',
    p: 4,
    textAlign: 'center',
    borderRadius: '20px',
  };

  // Define the constants and logic here
  const [remainingDays, setRemainingDays] = useState(0);
  const [isSuspended, setIsSuspended] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  useEffect(() => {
    if (storeData && storeData.freeTrialStarted) {
      const freeTrialStartDate = new Date(storeData.freeTrialStarted);
      const suspendDate = new Date(freeTrialStartDate.getTime() + 120 * 24 * 60 * 60 * 1000);
      const currentDate = new Date();

      const remainingTime = suspendDate.getTime() - currentDate.getTime();
      setRemainingDays(Math.ceil(remainingTime / (1000 * 3600 * 24)));
    }

    setIsSuspended(userData && userData.accountStatus === 'Suspended');
    setIsDeactivated(userData && userData.accountStatus === 'Deactivated');
  }, [storeData, userData]);

  const handleDeactivationLogout = () => {
    const rememberMe = ls.get('rememberMe') === 'true';
    const rememberMeEmail = ls.get('rememberMeEmail');

    // Clear all items from secureLS
    ls.removeAll();

    // Conditionally retain the email and rememberMe status based on 'rememberMe' status
    if (rememberMe) {
      ls.set('rememberMeEmail', rememberMeEmail);
      ls.set('rememberMe', 'true');
    }

    // Navigate to login page
    window.location.href = '/';
  };

  return (
    <>
      {(isSuspended || isDeactivated) && (
        <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div style={modalBodyStyle}>
            {isSuspended ? (
              <>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  color="error.dark"
                  sx={{ fontWeight: 'bold' }}
                >
                  Account Suspended
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                  Account has been Suspended. You have {remainingDays} days to submit and get your documents approved.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ padding: '8px 16px', fontSize: '14px', mt: 5 }}
                  onClick={() => {
                    window.location.href = '/dashboard/kyc';
                  }}
                >
                  Submit Documents
                </Button>
              </>
            ) : isDeactivated ? (
              <>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  color="error.dark"
                  sx={{ fontWeight: 'bold' }}
                >
                  Account Deactivated
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                  Account has been Deactivated due to insufficient documents. Please create a new account if you wish to
                  continue using our services.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ padding: '8px 16px', fontSize: '14px', mt: 5 }}
                  onClick={handleDeactivationLogout}
                >
                  Logout
                </Button>
              </>
            ) : null}
          </div>
        </Modal>
      )}
    </>
  );
};

export default AccountStatusModal;
