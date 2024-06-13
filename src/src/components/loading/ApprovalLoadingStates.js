import React from 'react';
import { Button, CircularProgress, Box, Dialog, DialogContent, Typography } from '@mui/material';

const ApprovalLoadingStates = ({ isLoading, loadingText, children, ...props }) => {
  return (
    <>
      <Button {...props} disabled={isLoading}>
        {children}
      </Button>
      {isLoading && loadingText && (
        <Dialog open={isLoading} PaperProps={{ style: { padding: '20px', textAlign: 'center' } }}>
          <DialogContent>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
              <CircularProgress size={24} color="inherit" />
              <Typography variant="body2" mt={2}>
                {loadingText}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ApprovalLoadingStates;
