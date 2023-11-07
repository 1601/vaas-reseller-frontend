import React from 'react';
import { Card, Typography, LinearProgress, Box } from '@mui/material';

const NotificationsCard = ({ storesNeedingApproval, totalStores, accountsNeedingKYC, totalAccounts }) => {
  const storeApprovalPercentage = totalStores ? (storesNeedingApproval / totalStores) * 100 : 0;
  const kycApprovalPercentage = totalAccounts ? (accountsNeedingKYC / totalAccounts) * 100 : 0;

  return (
    <Card variant="outlined" className="p-4">
      <Typography variant="h4" gutterBottom align="center">
        Notifications
      </Typography>
      <Card variant="outlined" className="p-4">
        <Box display="flex" alignItems="center">
          <Box width="100%" mr={1}>
            <Typography variant="h6">Stores needing approval:</Typography>
            <LinearProgress
              variant="determinate"
              value={storeApprovalPercentage}
              sx={{ height: '10px', borderRadius: '5px' }}
            />
          </Box>
          <Box minWidth={35}>
            <Typography variant="h6" align="right">{`${storesNeedingApproval}/${totalStores}`}</Typography>
          </Box>
        </Box>
      </Card>
      <Card variant="outlined" className="p-4">
        <Box display="flex" alignItems="center">
          <Box width="100%" mr={1}>
            <Typography variant="h6">Accounts needing KYC approval:</Typography>
            <LinearProgress
              variant="determinate"
              value={kycApprovalPercentage}
              sx={{ height: '10px', borderRadius: '5px' }}
            />
          </Box>
          <Box minWidth={35}>
            <Typography variant="h6" align="right">{`${accountsNeedingKYC}/${totalAccounts}`}</Typography>
          </Box>
        </Box>
      </Card>
    </Card>
  );
};

export default NotificationsCard;
