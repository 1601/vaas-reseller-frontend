import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
import {
  Card,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TextField,
  IconButton,
  Box,
  Divider,
  useTheme,
  TableContainer,
  Paper,
  Button,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WalletData from './WalletData.json';
import AdminWalletApproval from './AdminWalletApproval';

const ls = new SecureLS({ encodingType: 'aes' });
const token = ls.get('token');

const fetchWallets = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/wallet-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.body; 
  } catch (error) {
    console.error('Unexpected API response', error);
    return [];
  }
};

const AdminWallet = () => {
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedWallet, setSelectedWallet] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const walletsData = await fetchWallets();
      setWallets(walletsData);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedWallet]); // Empty dependency array means this effect runs once on mount


  // Sorting Function
  const sortData = (data) => {
    return data.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      // Date Sorting
      if (sortField === 'dateCreated' || sortField === 'dateUpdated') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      } else if (!Number.isNaN(parseFloat(valueA)) && !Number.isNaN(parseFloat(valueB))) {
        // Number Sorting
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      } else {
        // Text Sorting
        valueA = valueA ? valueA.toString().toLowerCase() : '';
        valueB = valueB ? valueB.toString().toLowerCase() : '';
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortField(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const sortedWallets = sortData([...wallets]);

  const renderSortIcon = (field) => {
    return sortField === field ? (
      sortDirection === 'asc' ? (
        <ArrowUpwardIcon fontSize="small" />
      ) : (
        <ArrowDownwardIcon fontSize="small" />
      )
    ) : null;
  };

  // Custom Pagination Actions
  const TablePaginationActions = (props) => {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, marginLeft: 2.5, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  };

  // Page Formats
  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return Number.isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleJumpToPage = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    setPage(page);
  };

  // View, Add, Back Buttons
  const handleAddClick = () => {};

  const handleViewClick = (wallet) => {
    setSelectedWallet(wallet);
  };

  const handleBack = () => {
    setSelectedWallet(null);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (selectedWallet) {
    return <AdminWalletApproval selectedWallet={selectedWallet} onBack={handleBack} />;
  }

  const startIndex = page * rowsPerPage;

  return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
        <Typography variant="h5" gutterBottom component="div">
          Wallet
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" sx={{ ml: 1 }}>
          Preview
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="h7" gutterBottom component="div">
        Manage Wallet CA
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          bgcolor: 'action.hover',
          p: 1,
          borderRadius: '4px',
        }}
      >
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Filters
        </Typography>
        <IconButton onClick={handleAddClick} color="primary" aria-label="add to wallet">
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Show"
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            type="number"
            size="small"
            sx={{ width: '80px' }}
          />
          <TextField
            label="Jump to page"
            type="number"
            size="small"
            onChange={handleJumpToPage}
            sx={{ width: '120px' }}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 1,
              min: 1,
              max: Math.ceil(wallets.length / rowsPerPage),
              type: 'number',
              'aria-labelledby': 'jump-to-page-label',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Total Records: {wallets.length}</Typography>
          <TablePaginationActions
            count={wallets.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small" sx={{ '& .MuiTableCell-sizeSmall': { padding: '6px 6px', fontSize: '0.75rem' } }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('referenceNo')}>
                Reference No {renderSortIcon('referenceNo')}
              </TableCell>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('account')}>
                Account {renderSortIcon('account')}
              </TableCell>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('walletType')}>
                Wallet Type {renderSortIcon('walletType')}
              </TableCell>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('amount')}>
                Amount {renderSortIcon('amount')}
              </TableCell>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('currency')}>
                Currency {renderSortIcon('currency')}
              </TableCell>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('computedAmount')}>
                Computed Amount {renderSortIcon('computedAmount')}
              </TableCell>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('bonusAmount')}>
                Bonus Amount {renderSortIcon('bonusAmount')}
              </TableCell>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                Status {renderSortIcon('status')}
              </TableCell>
              <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('paymentMethod')}>
                Payment Method {renderSortIcon('paymentMethod')}
              </TableCell>
              <TableCell onClick={() => handleSort('dateCreated')} style={{ cursor: 'pointer' }}>
                Date Created {renderSortIcon('dateCreated')}
              </TableCell>
              <TableCell onClick={() => handleSort('dateUpdated')} style={{ cursor: 'pointer' }}>
                Date Updated {renderSortIcon('dateUpdated')}
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedWallets.slice(startIndex, startIndex + rowsPerPage).map((wallet, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>{wallet.referenceNo}</TableCell>
                <TableCell>{wallet.accountEmail}</TableCell>
                <TableCell>{wallet.walletType}</TableCell>
                <TableCell>{wallet.amount}</TableCell>
                <TableCell>{wallet.currency}</TableCell>
                <TableCell>{formatAmount(wallet.computedAmount)}</TableCell>
                <TableCell>{formatAmount(wallet.bonusAmount)}</TableCell>
                <TableCell>{wallet.paymentStatus}</TableCell>
                <TableCell>{wallet.paymentMethod}</TableCell>
                <TableCell>{wallet.dateCreated}</TableCell>
                <TableCell>{wallet.dateUpdated}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewClick(wallet)}
                    sx={{ textTransform: 'none' }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default AdminWallet;
