import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import SecureLS from 'secure-ls';
import CsvDownloader from 'react-csv-downloader';

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

const ls = new SecureLS({ encodingType: 'aes' });

const columns = [
  {
    id: 'cell1',
    displayName: 'Created At',
  },
  {
    id: 'cell2',
    displayName: 'Type',
  },
  {
    id: 'cell3',
    displayName: 'ID',
  },
  {
    id: 'cell4',
    displayName: 'Ref no',
  },
  {
    id: 'cell5',
    displayName: 'User',
  },
  {
    id: 'cell6',
    displayName: 'Status',
  },
  {
    id: 'cell7',
    displayName: 'Payment ID',
  },
  {
    id: 'cell8',
    displayName: 'Method',
  },
];
export default function TransactionPage() {
  const [open, setOpen] = useState(null);
  const userId = ls.get('user') ? ls.get('user')._id : null;
  const userData = UserDataFetch(userId);
  const { storeData } = StoreDataFetch(userId);
  const [transactionList, setTransactionList] = useState();
  const [isNotFound, setIsNotFound] = useState(false);
  const [toDownload, setToDownload] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const handleSelect = (ranges) => {
    setSelectedRange([ranges.selection]);
    setDateRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // Adjusted function to fetch customer purchases and include user information
  const fetchCustomerPurchases = async () => {
    let userId;
    let role;

    try {
      const storedUser = ls.get('user');
      if (storedUser) {
        userId = storedUser._id;
        role = storedUser.role;
      }
    } catch (error) {
      console.error('Error parsing user data from secureLS:', error);
      return;
    }

    try {
      const endpoint = `${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/all/${userId}`;
      const customerResponse = await axios.get(endpoint);
      const customers = customerResponse.data.body;
      console.log('customers: ', customers);

      const transactions = await Promise.all(
        customers.map(async (customer) => {
          const purchaseResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/customer/purchase/${customer._id}`
          );
          return purchaseResponse.data.body
            .filter((purchase) => role !== 'reseller' || (role === 'reseller' && purchase.resellerId === userId))
            .map((purchase) => ({
              ...purchase,
              userName: customer.fullName,
              type: 'Topup',
              refNo: purchase.productName,
              ID: purchase.customerId,
              paymentId: `vaas_${purchase._id}`,
            }));
        })
      ).then((result) => result.flat());

      console.log('selectedRange: ', selectedRange);

      // Filter transactions by selected date range
      const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const startDate = new Date(selectedRange[0].startDate);
        const endDate = new Date(selectedRange[0].endDate);
        endDate.setHours(23, 59, 59, 999); 
      
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Error fetching customer purchases:', error);
    }
  };

  useEffect(() => {
    fetchCustomerPurchases();
  }, [selectedRange, userId]);

  const handleGetData = async () => {
    const { startDate, endDate } = selectedRange[0];
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    setIsNotFound(false); // Reset the not found flag before fetching new data

    try {
      // Fetch transactions within the specified date range
      const rangeResult = await getAllByDateRange(formattedStartDate, formattedEndDate);
      let dateRangeTransactions = [];
      if (rangeResult && rangeResult.body && rangeResult.body.length > 0) {
        dateRangeTransactions = rangeResult.body.map((transaction) => ({
          ...transaction,
          userName: transaction.userName || 'Unknown', // Placeholder if userName is missing
          type: 'Transaction', // Specific type for these transactions
        }));
      }

      // Fetch customer purchase transactions separately
      await fetchCustomerPurchases(); // This updates the `transactions` state with customer purchases

      // Combine transactions from both sources
      const combinedTransactions = [
        ...transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          return transactionDate >= startDate && transactionDate <= endDate;
        }),
        ...dateRangeTransactions,
      ];

      setTransactionList(combinedTransactions);
      handleToDownloadData(combinedTransactions); // Prepare data for download

      if (combinedTransactions.length === 0) {
        setIsNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching combined transactions data:', error);
      setIsNotFound(true);
    }
  };

  const handleToDownloadData = async (datas) => {
    setToDownload([]);
    datas.forEach((elements) => {
      const newElements = {
        cell1: elements.createdAt,
        cell2: elements.type,
        cell3: elements._id,
        cell4: elements.referenceNumber,
        cell5: elements.userName,
        cell6: elements.status,
        cell7: elements.paymentId,
        cell8: elements.paymentMethod,
      };
      setToDownload((prevtoDownload) => [...prevtoDownload, newElements]);
    });
  };

  useEffect(() => {
    const getTrans = async () => {
      const result = await getAllVortexTransactions();
      const jsonResult = await result.json();
      setTransactionList(jsonResult.body);
      handleToDownloadData(jsonResult.body);
    };
    getTrans();
  }, []);

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

        <Card style={{ marginBottom: '.5rem' }}>
          <Box style={{ padding: '1rem' }}>
            <Box>
              <DateRangePicker ranges={selectedRange} onChange={handleSelect} />
            </Box>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                style={{ backgroundColor: 'violet' }}
                onClick={handleGetData}
              >
                Get Data
              </Button>
            </Box>
          </Box>
        </Card>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, padding: '20px' }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
                  <TableRow>
                    {columns.map((data, index) => (
                      <TableCell>{data.displayName}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isNotFound &&
                    transactionList &&
                    transactionList.map((row) => {
                      const {
                        _id,
                        createdAt,
                        type,
                        referenceNumber,
                        userId,
                        status,
                        paymentId,
                        userName,
                        paymentMethod,
                      } = row;

                      return (
                        <TableRow hover key={_id} tabIndex={-1}>
                          <TableCell component="th" scope="row" padding="none">
                            <Typography variant="caption" noWrap>
                              {new Date(createdAt).toDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="caption">{type}</Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="caption">{_id}</Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="caption">{referenceNumber}</Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="caption">{userName}</Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="caption">{status}</Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="caption">{paymentId}</Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="caption">{paymentMethod}</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                            <strong>
                              &quot;
                              {dateRange.startDate instanceof Date
                                ? dateRange.startDate.toLocaleDateString()
                                : dateRange.startDate}
                              &quot;
                            </strong>
                            . to
                            <strong>
                              &quot;
                              {dateRange.endDate instanceof Date
                                ? dateRange.endDate.toLocaleDateString()
                                : dateRange.endDate}
                              &quot;
                            </strong>
                            .
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <Box style={{ padding: '1rem' }}>
            <CsvDownloader
              filename="vaas_transactions"
              extension=".csv"
              separator=";"
              columns={columns}
              datas={toDownload}
              text="DOWNLOAD"
            >
              <Button variant="contained" color="primary" style={{ backgroundColor: 'violet' }}>
                {' '}
                Download CSV{' '}
              </Button>
            </CsvDownloader>
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
