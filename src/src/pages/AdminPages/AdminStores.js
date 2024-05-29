import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
import {
  Card,
  Typography,
  CircularProgress,
  Chip,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CircularLoading from '../../components/preLoader';

const ls = new SecureLS({ encodingType: 'aes' });

const fetchStores = async (endpoint, token) => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data && Array.isArray(response.data.stores)) {
    return response.data.stores;
  }

  console.error('Unexpected API response format', response);
  return [];
};

const AdminStores = () => {
  const navigate = useNavigate();
  const [storesNeedingApproval, setStoresNeedingApproval] = useState([]);
  const [approvedStores, setApprovedStores] = useState([]);
  const [liveStores, setLiveStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredApprovedStores, setFilteredApprovedStores] = useState([]);
  const [filteredLiveStores, setFilteredLiveStores] = useState([]);
  const [filteredStoresNeedingApproval, setFilteredStoresNeedingApproval] = useState([]);
  const [sortBy, setSortBy] = useState('latest');

  const token = ls.get('token');

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

  const fetchData = useCallback(async () => {
    try {
      const storesNeedingApproval = await fetchStores('stores/pending/admin', token);
      const allApprovedStores = await fetchStores('stores/approved/admin', token);
      const liveStores = await fetchStores('stores/live/admin', token);

      setStoresNeedingApproval(sortStores(storesNeedingApproval, sortBy));
      setApprovedStores(sortStores(allApprovedStores, sortBy));
      setLiveStores(sortStores(liveStores, sortBy));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stores', error);
    }
  }, [token, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setFilteredApprovedStores(sortStores(approvedStores, sortBy));
    setFilteredLiveStores(sortStores(liveStores, sortBy));
    setFilteredStoresNeedingApproval(sortStores(storesNeedingApproval, sortBy));
  }, [approvedStores, liveStores, storesNeedingApproval, sortBy]);

  const downloadCSV = useCallback(() => {
    const createCSVData = (data, title) => {
      if (!data.length) return '';

      const headers = Object.keys(data[0]);
      const csvRows = data.map((store) =>
        headers.map((header) => `"${String(store[header]).replace(/"/g, '""')}"`).join(',')
      );

      csvRows.unshift(headers.join(','));
      csvRows.unshift(title);
      return csvRows.join('\n');
    };

    const csvContentNeedsApproval = createCSVData(filteredStoresNeedingApproval, 'Needs Approval');
    const csvContentApproved = createCSVData(filteredApprovedStores, 'Approved Shops');
    const csvContentLive = createCSVData(filteredLiveStores, 'Live Shops');

    const finalCSVContent = [csvContentNeedsApproval, csvContentApproved, csvContentLive]
      .filter((section) => section)
      .join('\n\n');

    const blob = new Blob([finalCSVContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'store_approvals.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredStoresNeedingApproval, filteredApprovedStores, filteredLiveStores]);

  const allStores = [...storesNeedingApproval, ...approvedStores, ...liveStores];

  const handleStoreClick = (storeId) => {
    navigate(`/dashboard/admin/storeapproval/${storeId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularLoading />
      </div>
    );
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const renderStoreCard = (title, stores) => (
    <div className="mb-4 w-full">
      <Card variant="outlined" className="p-4" style={{ backgroundColor: '#ffffff' }}>
        <Typography variant="h4" gutterBottom>
          <div>{title}</div>
        </Typography>
        <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
          {stores.map((shop, index) => (
            <Card
              key={index}
              variant="outlined"
              className="m-2 p-2 cursor-pointer"
              onClick={() => handleStoreClick(shop._id)}
            >
              <Typography variant="h6">{shop.storeName}</Typography>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );

  const handleFilterChange = (event, newValue) => {
    const foundApprovedStores = [];
    const foundLiveStores = [];
    const foundStoresNeedingApproval = [];

    foundApprovedStores.push(
      ...approvedStores.filter((store) => newValue.some((name) => store.storeName.includes(name)))
    );
    foundLiveStores.push(...liveStores.filter((store) => newValue.some((name) => store.storeName.includes(name))));
    foundStoresNeedingApproval.push(
      ...storesNeedingApproval.filter((store) => newValue.some((name) => store.storeName.includes(name)))
    );

    setFilteredApprovedStores(newValue.length !== 0 ? foundApprovedStores : approvedStores);
    setFilteredLiveStores(newValue.length !== 0 ? foundLiveStores : liveStores);
    setFilteredStoresNeedingApproval(newValue.length !== 0 ? foundStoresNeedingApproval : storesNeedingApproval);
  };

  return (
    <Card className="mt-4 max-w-screen-lg mx-auto p-4" style={{ backgroundColor: '#ffffff' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3" gutterBottom>
          Store Approval
        </Typography>
        <Button variant="outlined" color="primary" startIcon={<FileDownloadIcon />} onClick={downloadCSV}>
          Export CSV
        </Button>
      </Box>
      <div className="flex">
        <Autocomplete
          className="w-4/5"
          multiple
          id="tags-filled"
          options={allStores.map((store) => store.storeName)}
          freeSolo
          onChange={handleFilterChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
          }
          renderInput={(params) => (
            <TextField {...params} variant="filled" label="Search store by name" placeholder="stores" />
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
        {renderStoreCard('Needs Approval', filteredStoresNeedingApproval)}
        {renderStoreCard('Approved Shops', filteredApprovedStores)}
        {renderStoreCard('Live Shops', filteredLiveStores)}
      </div>
    </Card>
  );
};

export default AdminStores;
