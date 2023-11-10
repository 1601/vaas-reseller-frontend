import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';

import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  Box,
  Popover,
  Paper,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TableHead,
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import UserDataFetch from '../../components/user-account/UserDataFetch';
import AccountStatusModal from '../../components/user-account/AccountStatusModal';
import StoreDataFetch from '../../components/user-account/StoreDataFetch';

import { getAllVortexTransactions, getAllByDateRange } from '../../api/public/vortex/transaction_db';

export default function CustomerPage() {
  const [open, setOpen] = useState(null);
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  const userData = UserDataFetch(userId);
  const { storeData} = StoreDataFetch(userId);
  const [transactionList, setTransactionList] = useState()
  const [isNotFound, setIsNotFound] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate:''
  })
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const handleSelect = (ranges) => {
    setSelectedRange([ranges.selection]);
  };
  const storeAllCustomers = (transactions) => {
    setTransactionList(transactions)
  }
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleGetData = async() =>{
    const {startDate, endDate} = selectedRange[0]
    const rangeResult = await getAllByDateRange(startDate, endDate);
    if(rangeResult.body.length > 0){
     setTransactionList(rangeResult.body)
    }else{
      setIsNotFound(true)
      setDateRange({
        ...dateRange,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      })
    }
  }

  useEffect(() => {
    const getTrans = async () => {
      const result = await getAllVortexTransactions()
      const jsonResult = await result.json();
      storeAllCustomers(jsonResult.body)
    }
    getTrans();
  }, [])


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

        <Card
          style={{ marginBottom: '.5rem' }}
        >
          <Box style={{ padding: '1rem' }}>
            <Box>
              <DateRangePicker
                ranges={selectedRange}
                onChange={handleSelect}
              />
            </Box>
            <Box>
              <Button 
              variant='contained' 
              color="secondary"
              style={{ backgroundColor: 'violet' }}
              onClick={handleGetData}
              >Get Data</Button>
            </Box>
          </Box>
        </Card>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, padding: '20px' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
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
                    const { _id, createdAt, type, referenceNumber, userId, status, paymentId, paymentMethod, } = row;

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
                           No results found from &nbsp;
                           <strong>&quot;{dateRange.startDate.toLocaleDateString()}&quot;</strong>.
                           to
                           <strong> &quot;{dateRange.endDate.toLocaleDateString()}&quot;</strong>.
                         </Typography>
                       </Paper>
                     </TableCell>
                   </TableRow>
                )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <Box style={{padding:'1rem'}}>
            <Button 
            variant='contained' 
            color="primary"
            style={{ backgroundColor: 'violet' }}
            > Download CSV </Button>
          </Box>
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
