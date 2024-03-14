import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
import {Card, Typography, CircularProgress, Chip, TextField, Autocomplete, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
  const [filteredApprovedStores, setFilteredApprovedStores] = useState(approvedStores);
  const [filteredLiveStores, setFilteredLiveStores] = useState(liveStores);
  const [filteredStoresNeedingApproval, setFilteredStoresNeedingApproval] = useState(storesNeedingApproval);
  const [sortBy, setSortBy] = useState("");

  const token = ls.get('token');

  const fetchData = useCallback(async () => {
    try {
      const storesNeedingApproval = await fetchStores('stores/pending/admin', token);
      const allApprovedStores = await fetchStores('stores/approved/admin', token);
      const liveStores = await fetchStores('stores/live/admin', token);

      setStoresNeedingApproval(storesNeedingApproval);
      setApprovedStores(allApprovedStores);
      setLiveStores(liveStores);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stores', error);
    }
  }, [token]);

  useEffect(() => {
    setFilteredApprovedStores(approvedStores);
    setFilteredLiveStores(liveStores);
    setFilteredStoresNeedingApproval(storesNeedingApproval);
  }, [approvedStores, liveStores, storesNeedingApproval]);

  const allStores = [
    ...storesNeedingApproval,
    ...approvedStores,
    ...liveStores,
  ];

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    console.log(sortBy);
  }

  const renderStoreCard = (title, stores) => (
    <div className="mb-4 w-full">
      <Card variant="outlined" className="p-4" style={{ backgroundColor: '#ffffff' }}>
        <Typography variant="h4" gutterBottom>
          <div>
            {title}
            <Select
                className="h-10 w-20 md:h-8 md:w-12 lg:h-12 lg:w-28 ml-4"
                id="demo-simple-select"
                label="Sort by"
                value={sortBy}
                onChange={handleSortChange}
            >
              <MenuItem value={"latest"}>Latest</MenuItem>
              <MenuItem value={"oldest"}>Oldest</MenuItem>
            </Select>
          </div>
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

    foundApprovedStores.push(...approvedStores.filter((store) => newValue.some((name) => store.storeName.includes(name))));
    foundLiveStores.push(...liveStores.filter((store) => newValue.some((name) => store.storeName.includes(name))));
    foundStoresNeedingApproval.push(...storesNeedingApproval.filter((store) => newValue.some((name) => store.storeName.includes(name))));

    setFilteredApprovedStores(newValue.length !== 0 ? foundApprovedStores : approvedStores);
    setFilteredLiveStores(newValue.length !== 0 ? foundLiveStores : liveStores);
    setFilteredStoresNeedingApproval(newValue.length !== 0 ? foundStoresNeedingApproval : storesNeedingApproval);
  };


  return (
    <Card className="mt-4 max-w-screen-lg mx-auto p-4" style={{ backgroundColor: '#ffffff' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Store Approval
      </Typography>
      <div>
        <Autocomplete
            multiple
            id="tags-filled"
            options={allStores.map((store) => store.storeName
            )}
            freeSolo
            onChange={handleFilterChange}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    label="Search store by name"
                    placeholder="stores"
                />
            )}
        />
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
