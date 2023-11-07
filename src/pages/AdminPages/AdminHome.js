import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsCard from '../../components/admin/NotificationsCard';
import CircularLoading from '../../components/preLoader';

const AdminHome = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('Loading...');
  const [email, setEmail] = useState('Loading...');
  const [storesNeedingApproval, setStoresNeedingApproval] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [accountsNeedingKYC, setAccountsNeedingKYC] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUsername(user.username || 'Not Available');
          setEmail(user.email || 'Not Available');
        }

        // Fetch KYC data
        const pendingResponse = await axios.get(`${BACKEND_URL}/v1/api/kyc-business/pending`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const totalResponse = await axios.get(`${BACKEND_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Fetch store data
        const storeResponse = await axios.get(`${BACKEND_URL}/api/stores`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (Array.isArray(pendingResponse.data)) {
          setAccountsNeedingKYC(pendingResponse.data.length);
        }
        if (Array.isArray(totalResponse.data)) {
          setTotalAccounts(totalResponse.data.length);
        }
        if (Array.isArray(storeResponse.data)) {
          const storesNeedingApproval = storeResponse.data.filter((store) => !store.needsApproval);
          setStoresNeedingApproval(storesNeedingApproval.length);
          setTotalStores(storeResponse.data.length);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [BACKEND_URL]);

  const handleStoreApproval = () => {
    navigate('/dashboard/admin/storeapproval');
  };

  const handleKYCApproval = () => {
    navigate('/dashboard/admin/kycapproval');
  };

  return (
    <div className="flex flex-col mt-4 max-w-screen-lg mx-auto">
      {isLoading ? (
        <CircularLoading />
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Admin Information Card */}
            <div className="flex-1 w-full">
              <Card variant="outlined" className="p-4 h-full">
                <Card className="p-2 h-full">
                  <Typography variant="h4" gutterBottom>
                    Admin Information
                  </Typography>
                  <Typography variant="h6">Name: {username}</Typography>
                  <Typography variant="h6">Email: {email}</Typography>
                </Card>
              </Card>
            </div>

            {/* Navigation Buttons Card */}
            <div className="flex-1 w-full">
              <Card variant="outlined" className="p-4 h-full" align="center">
                <Card className="p-2 h-full" align="center">
                  <Typography variant="h4" gutterBottom align="center">
                    Navigation
                  </Typography>
                  <Button onClick={handleStoreApproval} variant="outlined" color="primary" style={{ marginRight: '8px' }}>
                    Store Approval
                  </Button>
                  <Button onClick={handleKYCApproval} variant="outlined" color="primary">
                    KYC Approval
                  </Button>
                </Card>
              </Card>
            </div>
          </div>

          {/* Notifications Card */}
          <NotificationsCard
            storesNeedingApproval={storesNeedingApproval}
            totalStores={totalStores}
            accountsNeedingKYC={accountsNeedingKYC}
            totalAccounts={totalAccounts}
          />
        </>
      )}
    </div>
  );
};

export default AdminHome;