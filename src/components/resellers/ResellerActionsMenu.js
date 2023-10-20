import React from 'react';
import { Menu, MenuItem } from '@mui/material';

const ResellerActionsMenu = ({ menuAnchor, handleClose, selectedRows, currentReseller, handleMenuAction }) => {
  return (
    <Menu anchorEl={menuAnchor} keepMounted open={Boolean(menuAnchor)} onClose={handleClose}>
      {currentReseller !== 'header' && selectedRows.length <= 1 && (
        <>
          <MenuItem onClick={() => handleMenuAction('edit', currentReseller._id)}>Edit Reseller</MenuItem>
          <MenuItem onClick={() => handleMenuAction('changePassword', currentReseller._id)}>Change Password</MenuItem>
        </>
      )}
      {selectedRows.length <= 1 && (
        <MenuItem onClick={() => handleMenuAction('delete', currentReseller._id)}>Delete Reseller</MenuItem>
      )}
      {selectedRows.length > 1 && (
        <MenuItem
          onClick={() => {
            handleMenuAction('delete', currentReseller._id);
            handleClose();
          }}
        >
          Delete Reseller
        </MenuItem>
      )}
    </Menu>
  );
};

export default ResellerActionsMenu;
