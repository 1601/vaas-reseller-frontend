import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Card, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CircularLoading from '../../components/preLoader';

const fetchStores = async (endpoint, token) => {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/${endpoint}`, {
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

  const token = localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    try {
      const storesNeedingApproval = await fetchStores('stores/admin/pending', token);
      const allApprovedStores = await fetchStores('stores/admin/approved', token);
      const liveStores = await fetchStores('store/live', token);
      const filteredApprovedStores = allApprovedStores.filter((store) => !store.isLive);

      setStoresNeedingApproval(storesNeedingApproval);
      setApprovedStores(filteredApprovedStores);
      setLiveStores(liveStores);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stores', error); 
    }
  }, [token]);

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

  const renderStoreCard = (title, stores) => (
    <div className="mb-4 w-full">
      <Card variant="outlined" className="p-4" style={{ backgroundColor: '#ffffff' }}>
        <Typography variant="h4" gutterBottom>
          {title}
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

  return (
    <Card className="mt-4 max-w-screen-lg mx-auto p-4" style={{ backgroundColor: '#ffffff' }}>
      <Typography variant="h3" align="center" gutterBottom>
        Store Approval
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-screen-lg mx-auto">
        {renderStoreCard('Needs Approval', storesNeedingApproval)}
        {renderStoreCard('Approved Shops', approvedStores)}
        {renderStoreCard('Live Shops', liveStores)}
      </div>
    </Card>
  );
};

export default AdminStores;