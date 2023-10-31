import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Menu,
  MenuItem,
  Card,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { MoreVert as MoreVertIcon, Delete as DeleteIcon } from '@mui/icons-material';

const AdminDealerAccount = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userToView, setUserToView] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async (userId) => {
    handleMenuClose(); // Close the menu
    setUserToDelete(userId);
    setDeleteModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      // Delete the user
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Delete the store
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/stores/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Refresh the users list
      const updatedUsers = users.filter((user) => user._id !== userToDelete);
      setUsers(updatedUsers);

      // Close the modal
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete user and store:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (Array.isArray(response.data)) {
          const fetchStoreDetailsPromises = response.data.map(async (user) => {
            try {
              const storeResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stores/${user._id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              });
              user.storeDetails = storeResponse.data;
            } catch (err) {
              console.error('Could not fetch store details for user', err);
            }
            return user;
          });

          const usersWithDetails = await Promise.all(fetchStoreDetailsPromises);

          const sortedUsers = usersWithDetails
            .filter((user) => user.role !== 'admin')
            .sort((a, b) => {
              const nameA = a.firstName || '';
              const nameB = b.firstName || '';
              return nameA.localeCompare(nameB);
            });

          setUsers(sortedUsers);

          setUsers(sortedUsers);
        } else {
          console.error('Unexpected API response format for users');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Could not fetch users', error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Card className="mt-4 max-w-screen-lg mx-auto p-4" style={{ backgroundColor: '#ffffff' }}>
      <Typography variant="h3" align="center" gutterBottom>
        User Accounts
      </Typography>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '70%' }}>User</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Mobile Number</TableCell>
              <TableCell align="right">Actions</TableCell> {/* New TableCell for actions/three dots */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography variant="h6">
                    {user.firstName || user.lastName
                      ? `${user.firstName || ''} ${user.lastName || ''}`
                      : user.userName || user.email}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: user.isActive ? 'green' : 'red',
                      width: '20px',
                      height: '20px',
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: user.mobileNumberVerified ? 'green' : 'red',
                      width: '20px',
                      height: '20px',
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <MoreVertIcon
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                      setUserToDelete(user._id);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Dropdown Menu */}
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            setUserToView(users.find((u) => u._id === userToDelete));
            setViewModalOpen(true);
            handleMenuClose();
          }}
        >
          View
        </MenuItem>
        <MenuItem onClick={() => handleDelete(userToDelete)}>Delete</MenuItem>
      </Menu>
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>First Name:</strong> {userToView?.firstName || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Last Name:</strong> {userToView?.lastName || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Designation:</strong> {userToView?.designation || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {userToView?.email || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Mobile Number:</strong> {userToView?.mobileNumber || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Country:</strong> {userToView?.country || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>IP Address:</strong> {userToView?.ipAddress || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Username:</strong> {userToView?.username || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Role:</strong> {userToView?.role || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Is Active:</strong> {userToView?.isActive ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="body1">
            <strong>Failed Login Attempts:</strong> {userToView?.failedLoginAttempts || 0}
          </Typography>
          <Typography variant="body1">
            <strong>Last Failed Login:</strong> {userToView?.lastFailedLogin || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Account Status:</strong> {userToView?.accountStatus || 'N/A'}
          </Typography>
          <Typography variant="body1">
            <strong>Is Google User:</strong> {userToView?.isGoogleUser ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="body1">
            <strong>Mobile Number Verified:</strong> {userToView?.mobileNumberVerified ? 'Yes' : 'No'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this user and their store?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AdminDealerAccount;