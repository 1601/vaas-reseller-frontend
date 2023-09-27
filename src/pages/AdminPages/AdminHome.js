import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [storesNeedingApproval, setStoresNeedingApproval] = useState([]);
    const [approvedStores, setApprovedStores] = useState([]);
    const [liveStores, setLiveStores] = useState([]);

    useEffect(() => {
        const fetchStoresNeedingApproval = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/storepending`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (Array.isArray(response.data)) {
                    setStoresNeedingApproval(response.data);
                } else if (response.data && Array.isArray(response.data.stores)) {
                    setStoresNeedingApproval(response.data.stores);
                } else {
                    console.error('Unexpected API response format');
                }
            } catch (error) {
                console.error('Could not fetch stores needing approval', error);
            }
        };

        // Fetch approved stores
        const fetchApprovedStores = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/storeapproved`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setApprovedStores(response.data.stores || []);
            } catch (error) {
                console.error('Could not fetch approved stores', error);
            }
        };

        // Fetch live stores
        const fetchLiveStores = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/store/live`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setLiveStores(response.data || []);
            } catch (error) {
                console.error('Could not fetch live stores', error);
            }
        };

        fetchStoresNeedingApproval();
        fetchApprovedStores();
        fetchLiveStores();
    }, []);

    const handleStoreClick = (storeId) => {
        navigate(`/dashboard/admin/approve/${storeId}`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-screen-lg mx-auto">
            {/* Needs Approval Card */}
            <div className="mb-4 w-full">
                <Card variant="outlined" className="p-4">
                    <Typography variant="h4" gutterBottom>
                        Needs Approval
                    </Typography>
                    <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                        {storesNeedingApproval.map((shop, index) => (
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

            {/* Approved Shops Card */}
            <div className="mb-4 w-full">
                <Card variant="outlined" className="p-4">
                    <Typography variant="h4" gutterBottom>
                        Approved Shops
                    </Typography>
                    <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                        {approvedStores.map((shop, index) => (
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

            {/* Live Shops Card */}
            <div className="mb-4 w-full">
                <Card variant="outlined" className="p-4">
                    <Typography variant="h4" gutterBottom>
                        Live Shops
                    </Typography>
                    <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                        {liveStores.map((shop, index) => (
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
    );
};

export default AdminDashboard;
