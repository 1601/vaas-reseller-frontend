import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const DeleteResellerDialog = ({ open, handleCloseDeleteDialog, userId, resellerId, fetchData, token }) => {
    const [deletingResellerId, setDeletingResellerId] = useState(null);
    const handleConfirmDelete = async () => {
        let headers = {}
        if (!userId || !resellerId) {
            console.error("UserId or ResellerId is missing!");
            return;
        }
        try {
            headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/${resellerId}`, {headers});
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
            <DialogContent>Are you sure you want to delete this Retailer?</DialogContent>
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
