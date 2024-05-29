import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
import {
  Autocomplete,
  Card,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Button,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useNavigate } from 'react-router-dom';
import CircularLoading from '../../components/preLoader';

const ls = new SecureLS({ encodingType: 'aes' });

const KYCCard = ({ title, items, onStoreClick }) => (
  <div className="mb-4 w-full">
    <Card variant="outlined" className="p-4">
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <div className="overflow-auto max-h-screen">
        {items.map((shop) => (
          <Card
            key={shop._id}
            variant="outlined"
            className="m-2 p-2 cursor-pointer"
            onClick={() => onStoreClick(shop._id)}
          >
            <Typography variant="h6">{shop.storeName}</Typography>
          </Card>
        ))}
      </div>
    </Card>
  </div>
);

const sortStores = (stores, sortBy) => {
  return [...stores].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    if (sortBy === 'oldest') {
      return new Date(a.updatedAt) - new Date(b.updatedAt);
    }
    return 0;
  });
};

const AdminKYC = () => {
  const navigate = useNavigate();
  const [kycNotSubmitted, setKycNotSubmitted] = useState([]);
  const [kycPending, setKycPending] = useState([]);
  const [kycApproved, setKycApproved] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredKycNotSubmitted, setFilteredKycNotSubmitted] = useState([]);
  const [filteredKycPending, setFilteredKycPending] = useState([]);
  const [filteredKycApproved, setFilteredKycApproved] = useState([]);
  const [sortBy, setSortBy] = useState('latest');

  const fetchKYCStatus = async (status) => {
    const token = ls.get('token');
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/kyc-business/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }
    throw new Error('Unexpected API response format');
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [notSubmitted, pending, approved] = await Promise.all([
          fetchKYCStatus('not-submitted'),
          fetchKYCStatus('pending'),
          fetchKYCStatus('approved'),
        ]);
        if (isMounted) {
          setKycNotSubmitted(sortStores(notSubmitted, sortBy));
          setKycPending(sortStores(pending, sortBy));
          setKycApproved(sortStores(approved, sortBy));
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [sortBy]);

  useEffect(() => {
    setFilteredKycNotSubmitted(sortStores(kycNotSubmitted, sortBy));
    setFilteredKycPending(sortStores(kycPending, sortBy));
    setFilteredKycApproved(sortStores(kycApproved, sortBy));
  }, [kycNotSubmitted, kycPending, kycApproved, sortBy]);

  const downloadCSV = () => {
    const createCSVData = (data, title) => {
      const headers = data.length > 0 ? Object.keys(data[0]) : [];
      const csvRows = data.map((item) =>
        headers.map((header) => `"${String(item[header]).replace(/"/g, '""')}"`).join(',')
      );
      csvRows.unshift(headers.join(','));
      csvRows.unshift(title);
      return csvRows.join('\n');
    };

    const csvContent = [
      createCSVData(kycNotSubmitted, 'No KYC Submitted'),
      createCSVData(kycPending, 'For KYC Approval'),
      createCSVData(kycApproved, 'Approved KYC'),
    ]
      .filter((section) => section)
      .join('\n\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'KYC_statuses.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleStoreClick = (storeId) => {
    navigate(`/dashboard/admin/kycapprove/${storeId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  const allKyc = [...kycNotSubmitted, ...kycPending, ...kycApproved];

  const handleFilterChange = (event, newValue) => {
    const foundKycNotSubmitted = [];
    const foundKycPending = [];
    const foundKycApproved = [];

    foundKycNotSubmitted.push(
      ...kycNotSubmitted.filter((store) => newValue.some((name) => store.storeName.includes(name)))
    );
    foundKycPending.push(...kycPending.filter((store) => newValue.some((name) => store.storeName.includes(name))));
    foundKycApproved.push(...kycApproved.filter((store) => newValue.some((name) => store.storeName.includes(name))));

    setFilteredKycNotSubmitted(newValue.length !== 0 ? foundKycNotSubmitted : kycNotSubmitted);
    setFilteredKycPending(newValue.length !== 0 ? foundKycPending : kycPending);
    setFilteredKycApproved(newValue.length !== 0 ? foundKycApproved : kycApproved);
  };

  return (
    <Card className="mt-4 max-w-screen-lg mx-auto p-4 bg-white">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3" gutterBottom>
          KYC Approval
        </Typography>
        <Button variant="outlined" color="primary" startIcon={<FileDownloadIcon />} onClick={downloadCSV}>
          Export CSV
        </Button>
      </Box>
      <div className="flex">
        <Autocomplete
          multiple
          className="w-4/5"
          id="tags-filled"
          options={allKyc.map((store) => store.storeName)}
          freeSolo
          onChange={handleFilterChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
          }
          renderInput={(params) => (
            <TextField {...params} variant="filled" label="Search KYC by name" placeholder="KYC" />
          )}
        />
        <FormControl className="w-1/5">
          <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Sort By"
            value={sortBy}
            onChange={handleSortChange}
          >
            <MenuItem value="latest">Latest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-screen-lg mx-auto">
        <KYCCard title="No KYC Submitted" items={filteredKycNotSubmitted} onStoreClick={handleStoreClick} />
        <KYCCard title="For KYC Approval" items={filteredKycPending} onStoreClick={handleStoreClick} />
        <KYCCard title="Approved KYC" items={filteredKycApproved} onStoreClick={handleStoreClick} />
      </div>
    </Card>
  );
};

export default AdminKYC;
