import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminKYC = () => {
    const navigate = useNavigate();
    const [kycPending, setKycPending] = useState([]);

    useEffect(() => {
        const fetchKYCPending = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/kycpending`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (Array.isArray(response.data)) {
                    setKycPending(response.data);
                } else if (response.data && Array.isArray(response.data.stores)) {
                    setKycPending(response.data.stores);
                } else {
                    console.error('Unexpected API response format');
                }
            } catch (error) {
                console.error('Could not fetch KYC pending approval', error);
            }
        };

        fetchKYCPending();
    }, []);

    const handleStoreClick = (storeId) => {
        navigate(`/dashboard/admin/kycapprove/${storeId}`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-screen-lg mx-auto">
            {/* Needs Approval Card */}
            <div className="mb-4 w-full">
                <Card variant="outlined" className="p-4">
                    <Typography variant="h4" gutterBottom>
                        KYC Needs Approval
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
                                {/* Display other KYC related information here */}
                                <Typography variant="body2">
                                    Customer Service Number: {shop.customerServiceNumber}
                                </Typography>
                                <Typography variant="body2">
                                    Street Address: {shop.streetAddress}
                                </Typography>
                                {/* Add other KYC fields as needed */}
                            </Card>
                        ))}
                    </div>
                </Card>
            </div>
            {/* You can add more sections similar to the above for other categories if needed */}
        </div>
    );
};

export default AdminKYC;
