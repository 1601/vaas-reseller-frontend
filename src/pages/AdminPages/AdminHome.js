import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('Loading...');
    const [email, setEmail] = useState('Loading...');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUsername(user.username || 'Not Available');
            setEmail(user.email || 'Not Available');
        }
    }, []);

    const handleStoreApproval = () => {
        navigate('/dashboard/admin/approval');
    };

    const handleKYCApproval = () => {
        navigate('/dashboard/admin/kycapproval');
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mt-4 max-w-screen-lg mx-auto">
            {/* Admin Information Card */}
            <div className="flex-1 mb-4 w-full">
                <Card variant="outlined" className="p-4 h-full">
                    <Card className="p-2 h-full">
                        <Typography variant="h4" gutterBottom>
                            Admin Information
                        </Typography>
                        <Typography variant="h6">
                            Name: {username}
                        </Typography>
                        <Typography variant="h6">
                            Email: {email}
                        </Typography>
                    </Card>
                </Card>
            </div>

            {/* Navigation Buttons Card */}
            <div className="flex-1 mb-4 w-full">
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
                        <Button
                            onClick={handleKYCApproval}
                            variant="outlined"
                            color="primary"
                        >
                            KYC Approval
                        </Button>
                    </Card>
                </Card>
            </div>
        </div>
    );
};

export default AdminHome;
