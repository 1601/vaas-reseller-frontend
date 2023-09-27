import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminKYC = () => {
    const navigate = useNavigate();
    const [kycPending, setKycPending] = useState([]);
    const [kycApproved, setKycApproved] = useState([]);

    useEffect(() => {
        const fetchKYCPending = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/v1/api/kyc-business/pending`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (Array.isArray(response.data)) {
                    setKycPending(response.data);
                } else {
                    console.error('Unexpected API response format');
                }
            } catch (error) {
                console.error('Could not fetch KYC pending approval', error);
            }
        };

        fetchKYCPending();
    }, []);

    useEffect(() => {
        const fetchKYCApproved = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/v1/api/kyc-business/approved`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (Array.isArray(response.data)) {
                    setKycApproved(response.data);
                } else {
                    console.error('Unexpected API response format');
                }
            } catch (error) {
                console.error('Could not fetch KYC approved', error);
            }
        };

        fetchKYCApproved();
    }, []);

    const handleStoreClick = (storeId) => {
        navigate(`/dashboard/admin/kycapprove/${storeId}`);
    };

    return (
        <Card
            className="mt-4 max-w-screen-lg mx-auto p-4"
            style={{ backgroundColor: '#ffffff' }}
        >
            <Typography variant="h3" align="center" gutterBottom>
                KYC Approval
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-w-screen-lg mx-auto">
                {/* Needs Approval Card */}
                <div className="mb-4 w-full">
                    <Card variant="outlined" className="p-4">
                        <Typography variant="h4" gutterBottom>
                            For KYC Approval
                        </Typography>
                        <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                            {kycPending.map((shop, index) => (
                                <Card
                                    key={index}
                                    variant="outlined"
                                    className="m-2 p-2 cursor-pointer"
                                    onClick={() => handleStoreClick(shop._id)}
                                >
                                    <Typography variant="h6">
                                        {shop.storeName}
                                    </Typography>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </div>
                {/* Approved KYC Card */}
                <div className="mb-4 w-full">
                    <Card variant="outlined" className="p-4">
                        <Typography variant="h4" gutterBottom>
                            Approved KYC
                        </Typography>
                        <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                            {kycApproved.map((shop, index) => (
                                <Card
                                    key={index}
                                    variant="outlined"
                                    className="m-2 p-2 cursor-pointer"
                                    onClick={() => handleStoreClick(shop._id)}
                                >
                                    <Typography variant="h6">
                                        {shop.storeName}
                                    </Typography>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </Card>
    );
};

export default AdminKYC;
