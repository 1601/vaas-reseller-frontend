import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button } from '@mui/material';

const AdminKYCApproval = () => {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const [kycDetails, setKYCDetails] = useState(null);

    useEffect(() => {
        const fetchKYCDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/v1/api/kyc-business/details/${storeId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (response.data) {
                    setKYCDetails(response.data);
                } else {
                    console.error('KYC details not found');
                }
            } catch (error) {
                console.error('Could not fetch KYC details', error);
                navigate('/dashboard/admin/kyc');
            }
        };

        fetchKYCDetails();
    }, [storeId, navigate]);

    const handleGoBack = () => {
        navigate('/dashboard/admin/kyc');
    };

    return (
        <div className="flex flex-col mt-4">
            <div className="flex-grow flex flex-col justify-center items-center transition-all duration-500 ease-in-out ml-0">

                {kycDetails ? (
                    <div className="mb-4 w-full">
                        <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <Typography variant="h4" gutterBottom>
                                    KYC Details
                                </Typography>
                                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                    <Button
                                        onClick={handleGoBack}
                                        variant="outlined"
                                        color="primary"
                                    >
                                        Go Back
                                    </Button>
                                </div>
                            </div>
                            <div>
                                {/* Display KYC details from kycDetails object */}
                                <DisplayKYCDetails kycDetails={kycDetails} />
                            </div>
                        </Card>
                    </div>
                ) : (
                    <p>Loading KYC details...</p>
                )}

            </div>
        </div>
    );
};

// Extract a separate component to display KYC details
const DisplayKYCDetails = ({ kycDetails }) => {
    return (
        <div>
            <Card style={{ marginBottom: '20px', padding: '15px' }}>
                <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Customer Service Number
                </Typography>
                <Typography variant="body2" style={{ marginBottom: '8px' }}>
                    Customer service contact number.
                </Typography>
                <Typography variant="body1">
                    {kycDetails.customerServiceNumber}
                </Typography>
            </Card>

            {/* Add more KYC fields as needed */}
        </div>
    );
};

export default AdminKYCApproval;
