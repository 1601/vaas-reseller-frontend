import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/lab/Autocomplete';
import { Icon as Iconify } from '@iconify/react';
import Logo from '../components/logo';
import { countries } from '../components/country/CountriesList';

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

export default function SignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        designation: '',
        email: '',
        mobileNumber: '',
        country: '',
        ipAddress: '',
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, formData);
            setErrorMessage('');
            setShowSuccessMessage(true);
            setTimeout(() => {
                navigate('/verify');
            }, 3000);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred during signup.');
            }
        }
    };

    // Fetching IP Address
    useEffect(() => {
        const fetchIPAddress = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    ipAddress: response.data.ip
                }));
            } catch (error) {
                console.error("Error fetching IP address: ", error);
            }
        };

        fetchIPAddress();
    }, []);

    useEffect(() => {
        if (showSuccessMessage) {
            const redirectTimer = setTimeout(() => {
                navigate('/login');
            }, 5000);
            return () => clearTimeout(redirectTimer);
        }
        return undefined;
    }, [showSuccessMessage, navigate]);

    return (
        <>
            <Helmet>
                <title> Sign Up | Your App </title>
            </Helmet>
            <StyledRoot>
                <Container maxWidth="sm" sx={{ backgroundColor: "#fff" }}>
                    <Logo sx={{ alignSelf: 'center' }} />
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Sign Up
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 5 }}>
                            Register to Your App
                        </Typography>
                        <TextField
                            fullWidth
                            label="First Name"
                            variant="outlined"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            label="Middle Name"
                            variant="outlined"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleInputChange}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            variant="outlined"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            label="Designation"
                            variant="outlined"
                            name="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            label="Mobile Number"
                            variant="outlined"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            sx={{ mb: 3 }}
                        />
                        <Autocomplete
                            fullWidth
                            options={countries}
                            getOptionLabel={(option) => option}
                            value={formData.country}
                            onChange={(_, newValue) => setFormData({ ...formData, country: newValue })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Country of Location"
                                    variant="outlined"
                                    sx={{ mb: 3 }}
                                />
                            )}
                        />
                        <TextField
                            fullWidth
                            label="IP Address"
                            variant="outlined"
                            name="ipAddress"
                            value={formData.ipAddress}
                            // onChange={handleInputChange}
                            sx={{ mb: 3 }}
                            disabled 
                        />
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type={formData.showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            sx={{ mb: 3 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}
                                            edge="end"
                                        >
                                            <Iconify icon={formData.showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleSignup}>
                            Sign Up
                        </Button>
                        {errorMessage && (
                            <Typography variant="body2" color="error" sx={{ my: 2 }}>
                                {errorMessage}
                            </Typography>
                        )}
                        {showSuccessMessage && (
                            <Stack spacing={2} sx={{ mt: 3 }}>
                                <Typography variant="body2" color="primary">
                                    Successful Sign-Up!
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Redirecting to Login...
                                </Typography>
                            </Stack>
                        )}
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="body2" sx={{ mb: 5 }}>
                            Already have an account?
                            <Link variant="subtitle2" onClick={() => navigate('/login')} sx={{ cursor: 'pointer', ml: 1 }}>Login</Link>
                        </Typography>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
