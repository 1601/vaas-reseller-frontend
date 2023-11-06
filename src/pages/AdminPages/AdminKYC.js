import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

const AdminKYC = () => {
  const navigate = useNavigate();
  const [kycNotSubmitted, setKycNotSubmitted] = useState([]);
  const [kycPending, setKycPending] = useState([]);
  const [kycApproved, setKycApproved] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchKYCStatus = async (status) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/kyc-business/${status}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
          setKycNotSubmitted(notSubmitted);
          setKycPending(pending);
          setKycApproved(approved);
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
  }, []);

  const handleStoreClick = (storeId) => {
    navigate(`/dashboard/admin/kycapprove/${storeId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
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

  return (
    <Card className="mt-4 max-w-screen-lg mx-auto p-4 bg-white">
      <Typography variant="h3" align="center" gutterBottom>
        KYC Approval
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-screen-lg mx-auto">
        <KYCCard title="No KYC Submitted" items={kycNotSubmitted} onStoreClick={handleStoreClick} />
        <KYCCard title="For KYC Approval" items={kycPending} onStoreClick={handleStoreClick} />
        <KYCCard title="Approved KYC" items={kycApproved} onStoreClick={handleStoreClick} />
      </div>
    </Card>
  );
};

export default AdminKYC;