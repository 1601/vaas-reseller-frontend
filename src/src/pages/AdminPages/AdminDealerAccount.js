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
  Select,
  FormControl,
  InputLabel,
  Box,
  Autocomplete,
  TextField,
  Chip
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { ViewUserModal } from '../../components/admin/ViewUserModal';
import { DeleteUserModal } from '../../components/admin/DeleteUserModal';
import ResellersModal from '../../components/admin/ResellersModal';
import { ChangeDealerEmailModal } from '../../components/admin/ChangeDealerEmailModal';
import CircularLoading from '../../components/preLoader';

const ls = new SecureLS({ encodingType: 'aes' });

const AdminDealerAccount = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userToView, setUserToView] = useState(null);
  const [resellersModalOpen, setResellersModalOpen] = useState(false);
  const [emailChangeError, setEmailChangeError] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [sortBy, setSortBy] = useState('');

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
      const token = ls.get('token');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/api/admin/users/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      const token = ls.get('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/admin/users/stores`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUsers([...response.data.withStoreDetails, ...response.data.withoutStoreDetails]);
          console.log(users);
        }
      } catch (error) {
        console.error('Could not fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users)
  }, [users]);

  // Handler for submitting the email change
  const handleSubmitEmailChange = async (currentEmail, newEmail) => {
    try {
      const token = ls.get('token');
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/admin/users/update-email`,
        { currentEmail, newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert('Email updated successfully. A confirmation email has been sent to the new address.');
        setChangeEmailModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      let errorMessage = 'Failed to update email.';
      if (error.response && error.response.status === 400) {
        errorMessage = 'Email is currently used.';
      }
      setEmailChangeError(errorMessage);
      console.error('Error updating email:', error);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    if (event.target.value === 'latest') {
       filteredUsers.sort((a, b) => {
         if (!Object.prototype.hasOwnProperty.call(a, 'createdAt')) {
           return 1;
         }
         if (!Object.prototype.hasOwnProperty.call(b, 'createdAt')) {
           return -1;
         }
         return new Date(b.createdAt) - new Date(a.createdAt);
       });
    }
    if (event.target.value === 'oldest') {
      // if createdAt does not exist at json sort to last
      filteredUsers.sort((a, b) => {
        if (!Object.prototype.hasOwnProperty.call(a, 'createdAt')) {
            return 1;
        }
        if (!Object.prototype.hasOwnProperty.call(b, 'createdAt')) {
            return -1;
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    }
  }

  const handleEmailEdit = () => {
    setEmailChangeError('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoading />
      </div>
    );
  }

  const handleFilterChange = (event, newValue) => {
    const foundUsers = [];

    foundUsers.push(...users.filter((user) => newValue.some((email) => user.email.includes(email))));

    setFilteredUsers(newValue.length !== 0 ? foundUsers : users);
  };


  return (
      <Card className="mt-4 max-w-screen-lg mx-auto p-4" style={{backgroundColor: '#ffffff'}}>
        <Typography variant="h3" align="center" gutterBottom>
          Dealer Accounts
        </Typography>
        <div className="flex">
          <Autocomplete
              multiple
              className="w-4/5"
              id="tags-filled"
              options={users.map((user) => user.email
              )}
              freeSolo
              onChange={handleFilterChange}
              renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({index})} />
                  ))
              }
              renderInput={(params) => (
                  <TextField
                      {...params}
                      variant="filled"
                      label="Search dealers by email"
                      placeholder="dealers"
                  />
              )}
          />
          <FormControl className="w-1/5">
            <InputLabel id={"demo-simple-select-label"}>Sort By</InputLabel>
            <Select
                labelId={"demo-simple-select-label"}
                id="demo-simple-select"
                label="Sort By"
                value={sortBy}
                onChange={handleSortChange}
            >
              <MenuItem value={"latest"}>Latest</MenuItem>
              <MenuItem value={"oldest"}>Oldest</MenuItem>
            </Select>
          </FormControl>
        </div>
          <TableContainer style={{borderTopLeftRadius: "0", borderTopRightRadius: "0"}} component={Card}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{width: '70%'}}>User</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Mobile Number</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
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
                            style={{cursor: 'pointer'}}
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
            <MenuItem
                onClick={() => {
                  const user = users.find((u) => u._id === userToDelete);
                  if (user) {
                    setUserToEdit(user);
                    setChangeEmailModalOpen(true);
                  }
                  setAnchorEl(null);
                }}
            >
              Change Email
            </MenuItem>
            <MenuItem onClick={() => handleDelete(userToDelete)}>Delete</MenuItem>
          </Menu>
          <ViewUserModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} user={userToView}/>
          <ChangeDealerEmailModal
              open={changeEmailModalOpen}
              onClose={() => {
                setChangeEmailModalOpen(false);
              }}
              user={userToEdit}
              onSubmit={handleSubmitEmailChange}
              errorMessage={emailChangeError}
              onEmailEdit={handleEmailEdit}
          />
          <ResellersModal open={resellersModalOpen} onClose={() => setResellersModalOpen(false)} userId={userToDelete}/>
          <DeleteUserModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete}/>
      </Card>
);
};

export default AdminDealerAccount;
