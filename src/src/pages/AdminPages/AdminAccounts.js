import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SecureLS from 'secure-ls';
import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  TextField,
  Chip,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ViewUserModal } from '../../components/admin/ViewUserModal';
import { DeleteUserModal } from '../../components/admin/DeleteUserModal';
import CircularLoading from '../../components/preLoader';

const ls = new SecureLS({ encodingType: 'aes' });

const AdminAccounts = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [emailToReset, setEmailToReset] = useState('');
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userToView, setUserToView] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      const token = ls.get('token');

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data)) {
          const admins = response.data.filter((user) => user.role === 'admin');
          admins.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setAdmins(admins);
          setFilteredAdmins(admins);
        } else {
          console.error('Unexpected API response format for admins');
        }
      } catch (error) {
        console.error('Could not fetch admins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  useEffect(() => {
    setFilteredAdmins(admins);
  }, [admins]);

  const downloadCSV = (arrayOfObjects) => {
    if (!arrayOfObjects.length) return;

    const headers = Object.keys(arrayOfObjects[0]).filter((header) => header !== 'password');

    const csvRows = [headers.join(',')];

    arrayOfObjects.forEach((obj) => {
      const values = headers.map((header) => {
        const cell = obj[header] === null || obj[header] === undefined ? '' : obj[header];
        const escaped = `${cell}`.replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'admin_accounts.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  };

  const handleFilterChange = (event, newValue) => {
    const foundAdmins = [];
    foundAdmins.push(...admins.filter((admin) => newValue.some((email) => admin.email.includes(email))));
    setFilteredAdmins(newValue.length !== 0 ? foundAdmins : admins);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    const sortedAdmins = [...filteredAdmins];
    if (event.target.value === 'latest') {
      sortedAdmins.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (event.target.value === 'oldest') {
      sortedAdmins.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    setFilteredAdmins(sortedAdmins);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = (userId) => {
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

      const updatedAdmins = admins.filter((admin) => admin._id !== userToDelete);
      setAdmins(updatedAdmins);

      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete admin:', error);
    }
  };

  const handleRequestPasswordChange = (email) => {
    setEmailToReset(email);
    setConfirmDialogOpen(true);
    handleMenuClose();
  };

  const confirmRequestPasswordChange = async () => {
    setLoadingRequest(true);
    try {
      const payload = {
        email: emailToReset,
        fromAdminCRM: true,
      };

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/password/email`, payload);

      if (response.status === 200) {
        setDialogContent('Request to change password sent.');
      } else {
        setDialogContent('Failed to send password change request.');
      }
    } catch (error) {
      console.error('Error sending password change request:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setDialogContent(error.response.data.message);
      } else {
        setDialogContent('Error sending password change request.');
      }
    }
    setLoadingRequest(false);
    setConfirmDialogOpen(false);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoading />
      </div>
    );
  }

  return (
    <Card className="mt-4 max-w-screen-lg mx-auto p-4" style={{ backgroundColor: '#ffffff' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3" gutterBottom>
          Admin Accounts
        </Typography>
        <Box>
          <Button variant="outlined" color="primary" onClick={() => navigate('/dashboard/admin/create')}>
            Create Admin
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<FileDownloadIcon />}
            onClick={() => downloadCSV(filteredAdmins)}
            style={{ marginLeft: '10px' }}
          >
            Export CSV
          </Button>
        </Box>
      </Box>
      <div className="flex">
        <Autocomplete
          multiple
          className="w-4/5"
          id="tags-filled"
          options={admins.map((admin) => admin.email)}
          freeSolo
          onChange={handleFilterChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
          }
          renderInput={(params) => (
            <TextField {...params} variant="filled" label="Search admins by email" placeholder="admins" />
          )}
        />
        <FormControl className="w-1/5">
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select labelId="sort-label" id="sort-select" value={sortBy} onChange={handleSortChange} label="Sort By">
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins.map((admin, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography variant="h6">
                    {admin.firstName || admin.lastName
                      ? `${admin.firstName} ${admin.lastName}`
                      : admin.userName || admin.email}
                  </Typography>
                </TableCell>
                <TableCell align="right">{admin.email}</TableCell>
                <TableCell align="right">
                  <MoreVertIcon
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleMenuClick}
                    style={{ cursor: 'pointer' }}
                  />
                  <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem
                      onClick={() => {
                        setUserToView(admin);
                        setViewModalOpen(true);
                        handleMenuClose();
                      }}
                    >
                      View Info
                    </MenuItem>
                    <MenuItem onClick={() => handleRequestPasswordChange(admin.email)}>Change Password</MenuItem>
                    <MenuItem onClick={() => handleDelete(admin._id)}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ViewUserModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} user={userToView} />
      <DeleteUserModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} />

      {/* Confirmation dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Change Password Request</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to request a password change?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button onClick={confirmRequestPasswordChange} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          {loadingRequest ? <CircularProgress /> : <DialogContentText>{dialogContent}</DialogContentText>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AdminAccounts;
