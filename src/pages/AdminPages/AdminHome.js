import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsCard from '../../components/admin/NotificationsCard';

const AdminHome = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Loading...');
  const [email, setEmail] = useState('Loading...');
  const [storesNeedingApproval, setStoresNeedingApproval] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [accountsNeedingKYC, setAccountsNeedingKYC] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username || 'Not Available');
      setEmail(user.email || 'Not Available');
    }

    const fetchKYCPending = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/v1/api/kyc-business/pending`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (Array.isArray(response.data)) {
          setAccountsNeedingKYC(response.data.length);
        } else {
          console.error('Unexpected API response format');
        }
      } catch (error) {
        console.error('Could not fetch KYC pending approval', error);
      }
    };

    fetchKYCPending();
  }, [BACKEND_URL]);

  useEffect(() => {
    const fetchStoresNeedingApproval = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/stores`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const stores = response.data.filter((store) => !store.needsApproval);
        setStoresNeedingApproval(stores.length);
      } catch (error) {
        console.error('Could not fetch stores needing approval:', error);
      }
    };

    fetchStoresNeedingApproval();
  }, [BACKEND_URL]);

  const handleStoreApproval = () => {
    navigate('/dashboard/admin/storeapproval');
  };

  const handleKYCApproval = () => {
    navigate('/dashboard/admin/kycapproval');
  };

  return (
    <div className="flex flex-col mt-4 max-w-screen-lg mx-auto">
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
      <div className="w-full">
        <Card variant="outlined" className="p-4">
          <Typography variant="h4" gutterBottom align="center">
            Notifications
          </Typography>
          <Typography variant="h6">Stores needing approval: {storesNeedingApproval}</Typography>
          <Typography variant="h6">Accounts needing KYC approval: {accountsNeedingKYC}</Typography>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;