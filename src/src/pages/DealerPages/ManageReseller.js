import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  Typography,
  Box,
  Menu,
  MenuItem,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import UserDataFetch from '../../components/user-account/UserDataFetch';

// Validations
import { validateName, validateEmail, validateMobileNumber } from '../../components/validation/validationUtils';
import { countryCodes } from '../../components/country/countryNumCodes';
import { countries } from '../../components/country/CountriesList';
import { mobileNumberLengths } from '../../components/country/countryNumLength';

// JSX Component
import ResellerTabs from '../../components/resellers/ResellerTabs';

// Hooks Component
import useFilteredResellers from '../../components/resellers/useFilteredResellers';
import useSort from '../../components/resellers/useSort';

// Dialogs Component
import EditResellerDialog from '../../components/resellers/EditResellerDialog';
import CredentialsDialog from '../../components/resellers/CredentialsDialog';
import AddResellerDialog from '../../components/resellers/AddResellerDialog';
import ChangePasswordDialog from '../../components/resellers/ChangePasswordDialog';
import DeleteResellerDialog from '../../components/resellers/DeleteResellerDIalog';

// Other Component
import SearchBar from '../../components/resellers/SearchBar';
import ResellerActionsMenu from '../../components/resellers/ResellerActionsMenu';
import CircularLoading from '../../components/preLoader';

const ls = new SecureLS({ encodingType: 'aes' });

const StatusLabel = ({ status }) => {
  const colorMap = {
    Active: {
      text: 'green',
      background: '#e8f5e9',
    },
    Disabled: {
      text: 'darkorange',
      background: '#fff8e1',
    },
    Deactivated: {
      text: 'red',
      background: '#ffebee',
    },
  };

  const colors = colorMap[status];

  return (
    <Box
      sx={{
        display: 'inline-block',
        backgroundColor: colors.background,
        borderRadius: '8px',
        padding: '2px 8px',
        color: colors.text,
      }}
    >
      {status}
    </Box>
  );
};

const ManageReseller = () => {
  const userId = ls.get('user') ? ls.get('user')._id : null;
  const userData = UserDataFetch(userId);
  const user = ls.get('user');
  const [open, setOpen] = useState(false);
  const initialFormState = {
    email: '',
    firstName: '',
    lastName: '',
    country: userData ? userData.country : '',
    mobileNumber: '',
    companyName: '',
  };
  const [formState, setFormState] = useState(initialFormState);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeCount, setActiveCount] = useState(0);
  const [disabledCount, setDisabledCount] = useState(0);
  const [deactivatedCount, setDeactivatedCount] = useState(0);
  const [currentTab, setCurrentTab] = useState('All');
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingResellerId, setEditingResellerId] = useState(null);
  const [showCredentialsPopup, setShowCredentialsPopup] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [value, setValue] = useState('');
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [menuReseller, setMenuReseller] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentReseller, setCurrentReseller] = useState(null);
  const [resellers, setResellers] = useState([]);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingResellerId, setDeletingResellerId] = useState(null);
  const [resellerToDelete, setResellerToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccessMessage, setCreateSuccessMessage] = useState('');
  const [createErrorMessage, setCreateErrorMessage] = useState('');

  const handleCloseDeleteDialog = () => {
    setDeletingResellerId(null);
    setDeleteDialogOpen(false);
  };

  const handleStatusClick = (event, resellerId) => {
    setAnchorEl(event.currentTarget);
    setEditingResellerId(resellerId);
  };

  const handleCloseStatusMenu = () => {
    setAnchorEl(null);
    setEditingResellerId(null);
  };

  const handleHeaderCheckboxChange = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(resellers.map((reseller) => reseller._id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleRowCheckboxChange = (resellerId) => {
    const currentIndex = selectedRows.indexOf(resellerId);
    const newSelectedRows = [...selectedRows];

    if (currentIndex === -1) {
      newSelectedRows.push(resellerId);
    } else {
      newSelectedRows.splice(currentIndex, 1);
    }

    setSelectedRows(newSelectedRows);
    setIsAllSelected(newSelectedRows.length === resellers.length);
  };

  const handleStatusChange = async (newStatus) => {
    let headers = {}
    try {
      headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      };
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/${editingResellerId}`, {
        status: newStatus,
      }, {headers});
      const updatedResellers = await fetchResellersForUser(userId);
      setResellers(updatedResellers);
    } catch (error) {
      console.error('Error updating reseller status:', error);
    }
    handleCloseStatusMenu();
  };

  const handleMenuOpen = (e, reseller) => {
    setCurrentReseller(reseller);
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuReseller(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setTouchedFields((prevState) => ({
      ...prevState,
      [name]: true,
    }));

    validateField(name, value);
  };

  const [touchedFields, setTouchedFields] = useState({
    email: false,
    firstName: false,
    lastName: false,
    country: false,
    mobileNumber: false,
    companyName: false,
  });

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouchedFields((prevState) => ({
      ...prevState,
      [name]: true,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email': {
        if (value === '' || !validateEmail(value)) {
          error = value === '' ? 'Email is required' : 'Invalid Email';
        }
        break;
      }
      case 'firstName': {
        if (value === '' || !validateName(value)) {
          error = value === '' ? 'First Name is required' : 'Invalid First Name';
        }
        break;
      }
      case 'lastName': {
        if (value === '' || !validateName(value)) {
          error = value === '' ? 'Last Name is required' : 'Invalid Last Name';
        }
        break;
      }
      case 'country': {
        if (value === '') {
          error = 'Country is required';
        }
        break;
      }
      case 'mobileNumber': {
        const mobileValidationError = validateMobileNumber(formState.country, value, countryCodes, mobileNumberLengths);
        if (value === '' || mobileValidationError) {
          error = value === '' ? 'Mobile Number is required' : mobileValidationError;
        }
        break;
      }
      default:
        break;
    }
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleAddReseller = async () => {
    setTouchedFields({
      email: true,
      firstName: true,
      lastName: true,
      country: true,
      mobileNumber: true,
      companyName: true,
    });

    if (!formState.companyName) {
      formState.companyName = 'N/A';
    }

    const tempValidationErrors = {};
    Object.keys(formState).forEach((field) => {
      const error = getValidationError(field, formState[field]);
      if (error) {
        tempValidationErrors[field] = error;
      }
    });

    setValidationErrors(tempValidationErrors);

    if (Object.keys(tempValidationErrors).length === 0) {
      setIsCreating(true);
      setCreateSuccessMessage('');
      setCreateErrorMessage('');

      try {
        const token = ls.get('token');

        const dataToSend = {
          ...formState,
          mobileNumber:
            formState.country && countryCodes[formState.country]
              ? countryCodes[formState.country] + formState.mobileNumber
              : formState.mobileNumber,
        };

        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/resellers`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200 && res.data) {
          // Send the account creation details to the reseller's email
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/auth/resellers`,
            { email: formState.email, password: res.data.password },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setFormState(initialFormState);
          setCreateSuccessMessage('Email with account details successfully sent');
          setIsCreating(false);
          setCreateSuccessMessage('Reseller Successfully Created');
          // setOpen(false);
        }
        await fetchUpdatedResellers();
      } catch (error) {
        setIsCreating(false);
        if (error.response && error.response.status === 409) {
          setValidationErrors((prevErrors) => ({
            ...prevErrors,
            email: 'Email is already in use',
          }));
          setCreateErrorMessage('Email is already in use');
        } else {
          console.error('Error adding reseller:', error);
          setCreateErrorMessage('An error occurred while creating the reseller.');
        }
      }
    }
  };

  const fetchUpdatedResellers = async () => {
    try {
      const updatedResellersList = await fetchResellersForUser(userId);
      setResellers(updatedResellersList);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredResellers = useFilteredResellers(resellers, value, currentTab);

  const { sortedData, requestSort, sortConfig } = useSort(filteredResellers);

  const getValidationError = (name, value) => {
    switch (name) {
      case 'email': {
        return value === '' ? 'Email is required' : validateEmail(value) ? '' : 'Invalid Email';
      }
      case 'firstName': {
        return value === '' ? 'First Name is required' : validateName(value) ? '' : 'Invalid First Name';
      }
      case 'lastName': {
        return value === '' ? 'Last Name is required' : validateName(value) ? '' : 'Invalid Last Name';
      }
      case 'country': {
        return value === '' ? 'Country is required' : '';
      }
      case 'mobileNumber': {
        const mobileValidationError = validateMobileNumber(formState.country, value, countryCodes, mobileNumberLengths);
        return value === '' ? 'Mobile Number is required' : mobileValidationError;
      }
      case 'companyName': {
        return value === '' ? 'Company Name is required' : '';
      }
      default:
        return '';
    }
  };

  const fetchResellersForUser = async (userId) => {
    let headers = {}
    try {
      headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      };
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/resellers`, {headers});
      return response.data;
    } catch (error) {
      console.error('Error fetching resellers:', error);
      throw error;
    }
  };

  const handleMenuAction = (action, resellerId) => {
    // console.log('handleMenuAction triggered with action:', action, 'and resellerId:', resellerId);

    switch (action) {
      case 'edit': {
        const resellerToEdit = resellers.find((r) => r._id === resellerId);
        // console.log('Found resellerToEdit:', resellerToEdit);

        setCurrentReseller(resellerToEdit);
        setEditingResellerId(resellerId);
        setEditDialogOpen(true);

        break;
      }
      case 'delete': {
        const reseller = resellers.find((r) => r._id === resellerId);
        setResellerToDelete(reseller);
        if (reseller && reseller._id) {
          setDeleteDialogOpen(true);
        } else {
          console.error('Could not find reseller to delete with ID:', resellerId);
        }
        break;
      }
      // case 'changePassword': {
      //   const resellerToChangePassword = resellers.find((r) => r._id === resellerId);
      //   if (resellerToChangePassword && resellerToChangePassword._id) {
      //     setCurrentReseller(resellerToChangePassword._id);
      //     setChangePasswordDialogOpen(true);
      //   } else {
      //     console.error('Could not find reseller to change password with ID:', resellerId);
      //   }
      //   break;
      // }
      default:
        console.log('Default case triggered for action:', action);
        break;
    }
    handleMenuClose();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowCredentialsPopup(false);

    setFormState(initialFormState);

    setValidationErrors({});

    setIsCreating(false);
    setCreateSuccessMessage('');
    setCreateErrorMessage('');

    setSelectedRows([]);
    setIsAllSelected(false);
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const fetchedResellers = await fetchResellersForUser(userId);
      setResellers(fetchedResellers);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const activeResellers = resellers.filter((r) => r.status === 'Active');
    const disabledResellers = resellers.filter((r) => r.status === 'Disabled');
    const deactivatedResellers = resellers.filter((r) => r.status === 'Deactivated');

    setActiveCount(activeResellers.length);
    setDisabledCount(disabledResellers.length);
    setDeactivatedCount(deactivatedResellers.length);
  }, [resellers]);

  useEffect(() => {
    if (userData && userData.country) {
      setFormState((prevState) => ({ ...prevState, country: userData.country }));
    }
  }, [userData]);

  return (
    <div style={{ padding: '20px' }}>
      {isLoading ? (
        <>
          <Box display="flex" height="100vh" alignItems="center" justifyContent="center">
            <CircularLoading />
          </Box>
        </>
      ) : (
        <>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
                <Typography variant="h5">My Retailers</Typography>
                <Button variant="contained" style={{ backgroundColor: '#000', color: '#fff' }} onClick={handleOpen}>
                  + Add Retailer
                </Button>
              </Box>

              <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
                <ResellerTabs
                  currentTab={currentTab}
                  handleTabChange={handleTabChange}
                  resellers={resellers}
                  activeCount={activeCount}
                  disabledCount={disabledCount}
                  deactivatedCount={deactivatedCount}
                />
              </div>

              <SearchBar value={value} onChange={(e) => setValue(e.target.value)} />

              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isAllSelected} onChange={handleHeaderCheckboxChange} />
                      </TableCell>
                      <TableCell style={{ cursor: 'pointer' }} onClick={() => requestSort('firstName')}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          Name
                          {sortConfig.key === 'firstName' &&
                            (sortConfig.direction === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </div>
                      </TableCell>
                      <TableCell style={{ cursor: 'pointer' }} onClick={() => requestSort('mobileNumber')}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          Phone Number
                          {sortConfig.key === 'mobileNumber' &&
                            (sortConfig.direction === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </div>
                      </TableCell>
                      <TableCell style={{ cursor: 'pointer' }} onClick={() => requestSort('companyName')}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          Company
                          {sortConfig.key === 'companyName' &&
                            (sortConfig.direction === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </div>
                      </TableCell>
                      <TableCell style={{ cursor: 'pointer' }} onClick={() => requestSort('status')}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          Status
                          {sortConfig.key === 'status' &&
                            (sortConfig.direction === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                        </div>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <IconButton size="small">
                          <MoreVertIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedData
                      .slice(
                        page * rowsPerPage,
                        rowsPerPage === -1 ? sortedData.length : page * rowsPerPage + rowsPerPage
                      )
                      .map((reseller) => (
                        <TableRow key={reseller._id}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRows.includes(reseller._id)}
                              onChange={() => handleRowCheckboxChange(reseller._id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              {reseller.firstName} {reseller.lastName}
                            </div>
                            <Typography variant="body2" color="textSecondary">
                              {reseller.email}
                            </Typography>
                          </TableCell>
                          <TableCell>{reseller.mobileNumber}</TableCell>
                          <TableCell>{reseller.companyName}</TableCell>
                          <TableCell>
                            <StatusLabel status={reseller.status} />
                          </TableCell>
                          <TableCell style={{ width: '50px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <IconButton
                                size="small"
                                style={{ marginRight: '8px' }}
                                onClick={(e) => handleStatusClick(e, reseller._id)}
                              >
                                <EditIcon fontSize="inherit" />
                              </IconButton>
                              <IconButton size="small" onClick={(e) => handleMenuOpen(e, reseller)}>
                                <MoreVertIcon fontSize="inherit" />
                              </IconButton>

                              <ResellerActionsMenu
                                menuAnchor={menuAnchor}
                                handleClose={handleMenuClose}
                                selectedRows={selectedRows}
                                currentReseller={currentReseller}
                                handleMenuAction={handleMenuAction}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                component="div"
                count={sortedData.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
              />
            </CardContent>
          </Card>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseStatusMenu}
          >
            <MenuItem onClick={() => handleStatusChange('Active')}>Active</MenuItem>
            <MenuItem onClick={() => handleStatusChange('Disabled')}>Disabled</MenuItem>
            <MenuItem onClick={() => handleStatusChange('Deactivated')}>Deactivated</MenuItem>
          </Menu>

          <AddResellerDialog
            open={open}
            onClose={handleClose}
            formState={formState}
            handleInputChange={handleInputChange}
            handleBlur={handleBlur}
            validationErrors={validationErrors}
            handleAddReseller={handleAddReseller}
            countries={countries}
            countryCodes={countryCodes}
            isCreating={isCreating}
            createSuccessMessage={createSuccessMessage}
            createErrorMessage={createErrorMessage}
          />
          <CredentialsDialog
            open={showCredentialsPopup}
            onClose={() => setShowCredentialsPopup(false)}
            email={formState.email}
            password={generatedPassword}
            fetchData={fetchData}
          />
          <EditResellerDialog
            open={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
              setCurrentReseller(null);
            }}
            reseller={currentReseller}
            onSubmit={fetchData}
            userId={userId}
            editingResellerId={editingResellerId}
          />
          {/* <ChangePasswordDialog
            open={changePasswordDialogOpen}
            onClose={() => setChangePasswordDialogOpen(false)}
            userId={userId}
            currentReseller={currentReseller}
          /> */}
          <DeleteResellerDialog
            open={deleteDialogOpen}
            handleCloseDeleteDialog={handleCloseDeleteDialog}
            userId={userId}
            resellerId={resellerToDelete?._id}
            fetchData={fetchData}
            token={user.token}
          />
        </>
      )}
    </div>
  );
};

export default ManageReseller;
