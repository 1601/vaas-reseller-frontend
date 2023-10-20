import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const DeleteResellerDialog = ({ open, handleCloseDeleteDialog, userId, resellerId, fetchData }) => {
    const [deletingResellerId, setDeletingResellerId] = useState(null);

    const handleConfirmDelete = async () => {
        if (!userId || !resellerId) {
            console.error("UserId or ResellerId is missing!");
            return;
        }

        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/resellers/${resellerId}`);
            handleCloseDeleteDialog();
            if (fetchData) {
                fetchData();  
            }
        } catch (error) {
            console.error('Error deleting reseller:', error);
        }
    };

    return (
        <Dialog open={open} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>Are you sure you want to delete this Reseller?</DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDeleteDialog} color="primary">
                    No
                </Button>
                <Button onClick={handleConfirmDelete} color="primary">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteResellerDialog;
