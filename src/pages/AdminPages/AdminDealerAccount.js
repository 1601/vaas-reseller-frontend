import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
import {
  Menu,
  MenuItem,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { ViewUserModal } from '../../components/admin/ViewUserModal';
import { DeleteUserModal } from '../../components/admin/DeleteUserModal';
import ResellersModal from '../../components/admin/ResellersModal';
import CircularLoading from '../../components/preLoader';

const AdminDealerAccount = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userToView, setUserToView] = useState(null);
  const [resellersModalOpen, setResellersModalOpen] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async (userId) => {
    handleMenuClose();
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/users/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/stores/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const updatedUsers = users.filter((user) => user._id !== userToDelete);
      setUsers(updatedUsers);

      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete user and store:', error);
    }
  };

  const handleResellers = (userId) => {
    handleMenuClose();
    setUserToDelete(userId);
    setResellersModalOpen(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);

      try {
        const rawToken = localStorage.getItem('token');
        const isValidToken = rawToken && rawToken.split('.').length === 3;

        if (!isValidToken) {
          throw new Error('Invalid token format');
        }

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${rawToken}`,
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
        <CircularLoading />
      </div>
    );
  }

  return (
    <Card className="mt-4 max-w-screen-lg mx-auto p-4" style={{ backgroundColor: '#ffffff' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Dealer Accounts
      </Typography>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '70%' }}>User</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Mobile Number</TableCell>
              <TableCell align="right">Actions</TableCell>
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
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            setUserToView(users.find((u) => u._id === userToDelete));
            setViewModalOpen(true);
            handleMenuClose();
          }}
        >
          View Info
        </MenuItem>
        <MenuItem onClick={() => handleResellers(userToDelete)}>Resellers</MenuItem>
        <MenuItem onClick={() => handleDelete(userToDelete)}>Delete</MenuItem>
      </Menu>
      <ViewUserModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} user={userToView} />
      <ResellersModal open={resellersModalOpen} onClose={() => setResellersModalOpen(false)} userId={userToDelete} />
      <DeleteUserModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} />
    </Card>
  );
};

export default AdminDealerAccount;
