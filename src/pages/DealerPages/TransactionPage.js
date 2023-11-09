import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
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
import DetailsModal from '../../components/customer/detailsModal'
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import UserDataFetch from '../../components/user-account/UserDataFetch';
import AccountStatusModal from '../../components/user-account/AccountStatusModal';
import StoreDataFetch from '../../components/user-account/StoreDataFetch';

import { getAllVortexTransactions } from '../../api/public/vortex/transaction_db';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'address', label: 'Address', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

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
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  const userData = UserDataFetch(userId);
  const { storeData, editedData, platformVariables, error } = StoreDataFetch(userId);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentTab, setCurrentTab] = useState('All');
  const [customers, setCustomers] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [inActiveCount, setInActiveCount] = useState(0);
  const [transactionList, setTransactionList] = useState()
  const [filterCustomer, setFilterCustomer] = useState([])

  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };
  const storeAllCustomers = (transactions) =>{
    setTransactionList(transactions)
  }
  const handleCloseMenu = () => {
    setOpen(null);
  };



  const handleOpenModal = (row) => {
    const purchases = row.purchase
    const totalAmount = purchases.reduce((accumulator, data) => accumulator + data.amount, 0);
    const averageAmount = totalAmount / purchases.length
    const rateAverageAmount = (averageAmount / totalAmount) * 100;
    const totalNumberOfTrans = purchases.length / 30;

    row.averageOfTransaction = totalNumberOfTrans
    row.averageAmount = averageAmount.toFixed(2)
    row.rateAverageAmount = rateAverageAmount.toFixed(2)
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  useEffect(() =>{
    const getTrans = async () =>{
       const result = await getAllVortexTransactions()
       const jsonResult = await result.json();
       storeAllCustomers(jsonResult.body)
       console.log(jsonResult)
    }
    getTrans();
  },[])


  const filteredUsers = applySortFilter(filterCustomer, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Transactions | VAAS </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Transactions
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 , padding:'20px'}}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f2f2f2'}}>
                  <TableRow>
                    <TableCell>Created At</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Ref no</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(!isNotFound && transactionList) && (transactionList.map((row) => {
                    const { _id, createdAt, type, referenceNumber, userId, status, paymentId, paymentMethod,} = row;

                    return (
                      <TableRow hover key={_id} tabIndex={-1}>
                        <TableCell component="th" scope="row" padding="none">
                            <Typography variant="caption" noWrap>
                                {new Date(createdAt).toDateString()}
                            </Typography>
                        </TableCell>
                        <TableCell align='left'>
                            <Typography variant="caption">
                            {type}
                            </Typography>
                        </TableCell>
                        <TableCell align='left'>
                            <Typography variant='caption'>
                                {_id}
                            </Typography>
                        </TableCell>
                        <TableCell align='left'>
                            <Typography variant='caption'>
                                {referenceNumber}
                            </Typography>
                        </TableCell>
                        <TableCell align='left'>
                        <Typography variant='caption'>
                                Gemar
                            </Typography>
                        </TableCell>
                        <TableCell align='left'>
                        <Typography variant='caption'>
                                {status}
                            </Typography>
                        </TableCell>
                        <TableCell align='left'>
                        <Typography variant='caption'>
                                {paymentId}
                            </Typography>
                        </TableCell>
                        <TableCell align='left'>
                            <Typography variant='caption'>
                            {paymentMethod}
                            </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  }))}
                </TableBody>
              </Table>
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
