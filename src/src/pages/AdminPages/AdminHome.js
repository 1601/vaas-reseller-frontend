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
    document.title = 'Admin CRM | VAAS';
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        let token;

        // Check for token in different locations
        if (user && user.token) {
          token = user.token; // Token inside the user object
        } else {
          token = localStorage.getItem('token'); // Token directly in local storage
        }

        if (!token) {
          console.error('No token found');
          setIsLoading(false);
          return;
        }

        setUsername(user?.username || 'Not Available');
        setEmail(user?.email || 'Not Available');

        // Headers with token
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch KYC data
        const pendingResponse = await axios.get(`${BACKEND_URL}/v1/api/kyc-business/pending`, { headers });
        const totalResponse = await axios.get(`${BACKEND_URL}/v1/api/admin/users`, { headers });

        // Fetch store data
        const storeResponse = await axios.get(`${BACKEND_URL}/v1/api/stores/all/admin`, { headers });

        // Process KYC responses
        if (Array.isArray(pendingResponse.data)) {
          setAccountsNeedingKYC(pendingResponse.data.length);
        }
        if (Array.isArray(totalResponse.data)) {
          setTotalAccounts(totalResponse.data.length);
        }

        // Process store response
        if (Array.isArray(storeResponse.data.stores)) {
          const stores = storeResponse.data.stores;
          const storesNeedingApprovalCount = stores.filter((store) => store.needsApproval).length;

          setStoresNeedingApproval(storesNeedingApprovalCount);
          setTotalStores(stores.length);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);

        // Check if the response status is 403, which might indicate an expired JWT
        if (error.response && error.response.status === 403) {
          logoutUser(); // Call the logout function
        } else {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [BACKEND_URL]);

  const logoutUser = () => {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const rememberMeEmail = localStorage.getItem('rememberMeEmail');

    localStorage.clear();

    if (rememberMe) {
      localStorage.setItem('rememberMeEmail', rememberMeEmail);
      localStorage.setItem('rememberMe', 'true');
    }

    navigate('/login', { replace: true });
  };

  const handleStoreApproval = () => {
    navigate('/dashboard/admin/storeapproval');
  };

  const handleKYCApproval = () => {
    navigate('/dashboard/admin/kycapproval');
  };

  const handleAdminCreation = () => {
    navigate('/dashboard/admin/create');
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
                  <Button
                    onClick={handleStoreApproval}
                    variant="outlined"
                    color="primary"
                    style={{ marginRight: '8px' }}
                  >
                    Store Approval
                  </Button>
                  <Button onClick={handleKYCApproval} variant="outlined" color="primary" style={{ marginRight: '8px' }}>
                    KYC Approval
                  </Button>
                  <Button onClick={handleAdminCreation} variant="outlined" color="primary">
                    Admin Creation
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
