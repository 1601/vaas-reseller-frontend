import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Grid, Box, Divider } from '@mui/material';

const AdminApproval = () => {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [storeDetails, setStoreDetails] = useState(null);

    useEffect(() => {
        console.log('storeId:', storeId);

        const fetchStoreDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/api/stores/${storeId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (response.data) {
                    setStoreDetails(response.data);
                } else {
                    console.error('Store details not found');
                }
            } catch (error) {
                console.error('Could not fetch store details', error);
                navigate('/dashboard/admin');
            }
        };

        fetchStoreDetails();
    }, [storeId, navigate]);

    const handleApprove = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/stores/approve/${storeId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (response.status === 200) {
                navigate('/dashboard/admin');
            }
        } catch (error) {
            console.error('Could not approve store', error);
        }
    };

    const handleGoBack = () => {
        navigate('/dashboard/admin');
    };

    return (
        <div className="flex flex-col mt-4">
            <div className="flex-grow flex flex-col justify-center items-center transition-all duration-500 ease-in-out ml-0">

                {storeDetails ? (
                    <div className="mb-4 w-full">
                        <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <Typography variant="h4" gutterBottom>
                                    Store Details
                                </Typography>
                            </div>
                            <div>
                                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Store Name
                                    </Typography>
                                    <Typography variant="body2" style={{ marginBottom: '8px' }}>
                                        Chosen Store Name of the User.
                                    </Typography>
                                    <Typography variant="body1">
                                        {storeDetails.storeName}
                                    </Typography>
                                </Card>

                                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Store URL
                                    </Typography>
                                    <Typography variant="body2" style={{ marginBottom: '8px' }}>
                                        The Chosen Store URL of the User.
                                    </Typography>
                                    <Typography variant="body1">
                                        {storeDetails.storeUrl}
                                    </Typography>
                                </Card>

                                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Store Approval
                                    </Typography>
                                    <Typography variant="body2" style={{ marginBottom: '8px' }}>
                                        Status of Store's Approval.
                                    </Typography>
                                    <Typography variant="body1">
                                        {storeDetails.needsApproval ? 'Needs Approval' : 'Approved'}
                                    </Typography>
                                </Card>

                                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Store Live Status
                                    </Typography>
                                    <Typography variant="body2" style={{ marginBottom: '8px' }}>
                                        Store's Live Status
                                    </Typography>
                                    <Typography variant="body1">
                                        {storeDetails.isLive ? 'Live' : 'Offline'}
                                    </Typography>
                                </Card>

                                <div style={{ marginTop: '10px' }}>
                                    {(storeDetails.needsApproval && !storeDetails.isLive) && (
                                        <Button
                                            onClick={handleApprove}
                                            variant="outlined"
                                            color="primary"
                                            style={{ marginRight: '10px' }}
                                        >
                                            Approve
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleGoBack}
                                        variant="outlined"
                                        color="primary"
                                    >
                                        Go Back
                                    </Button>
                                </div>

                            </div>
                        </Card>
                    </div>
                ) : (
                    <p>Loading store details...</p>
                )}

                {/* Store Logo and Colors section */}
                <div className="mb-4 w-full">
                    <Card variant="outlined" style={{ display: 'flex', flexDirection: 'row', padding: '20px', marginBottom: '20px' }}>
                        {/* Store Logo section */}
                        <div style={{ flex: 1, paddingRight: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="h4" gutterBottom>
                                    Store Logo
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom style={{ marginTop: '-10px' }}>
                                    Current Store Logo.
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                                <img
                                                    src={storeDetails ? storeDetails.storeLogo : '/vortex_logo_black.png'}
                                                    alt="Store Logo"
                                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                />
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Card>
                        </div>


                        {/* Store Colors section */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px', flex: 1 }}>
                                <Typography variant="h4" gutterBottom>
                                    Store Colors
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom style={{ marginTop: '-10px' }}>
                                    Current Store's Primary and Secondary Colors
                                </Typography>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                    <div>
                                        {/* Primary Color */}
                                        <Box ml={2} >
                                            <Typography variant="subtitle1" align="center">Primary Color</Typography>
                                            <Box
                                                width="100px"
                                                height="30px"
                                                bgcolor={storeDetails ? storeDetails.primaryColor : '#FFF'}
                                                mb={2}
                                                border="1px solid #000"
                                            />
                                        </Box>

                                        {/* Secondary Color */}
                                        <Box ml={2} mt={2}>
                                            <Typography variant="subtitle1" align="center">Secondary Color</Typography>
                                            <Box
                                                width="100px"
                                                height="30px"
                                                bgcolor={storeDetails ? storeDetails.secondaryColor : '#FFF'}
                                                mb={2}
                                                border="1px solid #000"
                                            />
                                        </Box>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminApproval;