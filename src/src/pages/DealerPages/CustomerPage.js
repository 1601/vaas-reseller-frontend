import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Box,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TableHead,
  TablePagination,
  Modal,
} from '@mui/material';
// components
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import DetailsModal from '../../components/customer/detailsModal';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import UserDataFetch from '../../components/user-account/UserDataFetch';
import AccountStatusModal from '../../components/user-account/AccountStatusModal';
import StoreDataFetch from '../../components/user-account/StoreDataFetch';
import CustomersTabs from '../../components/customer/customerTab';
// sections
import CustomerListToolbar from '../../components/customer/customerListToolbar';
import { allCustomers } from '../../api/public/customer';
// mock
import USERLIST from '../../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

const ls = new SecureLS({ encodingType: 'aes' });

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CustomerPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const userId = ls.get('user') ? ls.get('user')._id : null;
  const userData = UserDataFetch(userId);
  const { storeData, editedData, platformVariables, error } = StoreDataFetch(userId);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentTab, setCurrentTab] = useState('All');
  const [customers, setCustomers] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [inActiveCount, setInActiveCount] = useState(0);
  const [userList, setUserList] = useState();
  const [filterCustomer, setFilterCustomer] = useState([]);

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };
  const storeAllCustomers = (customers) => {
    setUserList(customers);
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleTabChange = async (event, newValue) => {
    if (newValue === 'Active') {
      const actives = userList.filter((data) => data.status === true);
      setFilterCustomer(actives);
    } else if (newValue === 'Deactivated') {
      const inActives = userList.filter((data) => data.status === false);
      setFilterCustomer(inActives);
    } else {
      setFilterCustomer(userList);
    }
    setCurrentTab(newValue);
  };

  // const handleRequestSort = (event, property) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     if (userList) {
  //       const newSelecteds = userList.map((n) => n.name);
  //       setSelected(newSelecteds);
  //       return;
  //     }

  //   }
  //   setSelected([]);
  // };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
  //   }
  //   setSelected(newSelected);
  // };

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setPage(0);
  //   setRowsPerPage(parseInt(event.target.value, 10));
  // };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleOpenModal = async (row) => {
    try {
      const token = ls.get('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/purchase/${row._id}`,
        config
      );
      const purchases = response.data.body;

      const totalAmount = purchases.reduce((accumulator, purchase) => accumulator + purchase.amount, 0);
      const averageAmount = totalAmount / purchases.length;
      const rateAverageAmount = (averageAmount / totalAmount) * 100;
      const totalNumberOfTrans = purchases.length / 30;

      const updatedRow = {
        ...row,
        purchases,
        totalAmount: totalAmount.toFixed(2),
        averageOfTransaction: totalNumberOfTrans.toFixed(2),
        averageAmount: averageAmount.toFixed(2),
        rateAverageAmount: rateAverageAmount.toFixed(2),
      };

      // console.log('Updated Row with Purchases: ', updatedRow);
      setSelectedRow(updatedRow);
      setOpenModal(true);
    } catch (error) {
      console.error('Error fetching purchase details:', error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = ls.get('token');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/all/${userId}`, config);
        if (response.data.body) {
          setCustomers(response.data.body.length);
          setFilterCustomer(response.data.body);
          storeAllCustomers(response.data.body);
          response.data.body.forEach((data) => {
            if (data.status === true) {
              setActiveCount((activeCount) => activeCount + 1);
            } else {
              setInActiveCount((inActiveCount) => inActiveCount + 1);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, [userId]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(filterCustomer, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> User | VAAS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Customer
          </Typography>
        </Stack>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
            <CustomersTabs
              currentTab={currentTab}
              handleTabChange={handleTabChange}
              customers={customers}
              activeCount={activeCount}
              inActiveCount={inActiveCount}
            />
          </div>
          <CustomerListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, padding: '20px' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isNotFound &&
                    filterCustomer &&
                    filterCustomer.map((row) => {
                      const { _id, fullName, address, role, status, profilePicture } = row;
                      let Status;
                      // convert into string to avoid input error
                      if (status === true) {
                        Status = 'Active';
                      } else {
                        Status = 'Inactive';
                      }
                      const selectedUser = selected.indexOf(row.fullName) !== -1;

                      return (
                        <TableRow hover key={_id} tabIndex={-1} selected={selectedUser}>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={fullName} src={profilePicture} />
                              <Typography variant="subtitle2" noWrap>
                                {fullName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{address}</TableCell>
                          <TableCell align="left">{role}</TableCell>
                          <TableCell align="left">
                            <Label color={(Status === 'Inactive' && 'error') || 'success'}>
                              {sentenceCase(Status)}
                            </Label>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              onClick={() => handleOpenModal(row)}
                              startIcon={<PersonSearchOutlinedIcon />}
                            >
                              {' '}
                              View More
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                  {isNotFound && (
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <DetailsModal open={openModal} handleClose={handleCloseModal} selectedRow={selectedRow} />
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <AccountStatusModal open userData={userData} storeData={storeData} />
    </>
  );
}
