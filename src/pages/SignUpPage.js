import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, TextField, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/logo';

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
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('dealer');
    const [emailExists, setEmailExists] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async () => {
        try {
            setEmailExists(false);
            setErrorMessage('');
            console.log('Signing up user...');

            const signupData = { username, email, password, role };
            console.log('Signup data:', signupData);

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, signupData);
            console.log('Signup response:', response.data);

            // Create default store page linked to the user
            if (response.data._id && role !== 'admin') {
                console.log('Creating default store...');
                const storeData = {
                    ownerId: response.data._id,
                    storeName: email.split('@')[0],
                    storeLogo: 'vortex_logo_black.png',
                    needsApproval: false,
                    isApproved: false,
                    isLive: false
                };
                console.log('Store data:', storeData);

                try {
                    const storeResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/createstore`, storeData);
                    console.log('Store creation response:', storeResponse.data);
                } catch (storeError) {
                    console.error('Store creation error:', storeError);
                    setErrorMessage('Error creating default store.');
                }
            }

            setShowSuccessMessage(true);
            navigate('/verify'); // Redirect to the verify page

        } catch (error) {
            console.error("Signup error:", error);

            if (error.response && error.response.data) {
                console.log("Server response:", error.response.data);
                setErrorMessage(error.response.data.message);
            } else {
                console.error("Other error:", error);
                setErrorMessage('An error occurred during signup.');
            }
        }
    };

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
                <title> Sign Up | VAAS </title>
            </Helmet>

            <StyledRoot>
                <Container maxWidth="sm" sx={{ backgroundColor: "#fff" }}>
                    <Logo
                        sx={{
                            alignSelf: 'center',
                        }}
                    />
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Sign Up
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 5 }}>
                            Register to Vortex
                        </Typography>

                        {errorMessage && <Typography variant="body2" color="error" sx={{ mb: 5 }}>{errorMessage}</Typography>}

                        <TextField
                            fullWidth
                            label="Name"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleSignup}>
                            Sign Up
                        </Button>

                        {showSuccessMessage && (
                            <Stack spacing={2} sx={{ mt: 3 }}>
                                <Typography variant="body2" color="success">
                                    Successful Sign-Up!
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Redirecting to Login...
                                </Typography>
                            </Stack>
                        )}

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="body2" sx={{ mb: 5 }}>
                            Already have a Vortex ID?
                            <Link variant="subtitle2" onClick={() => navigate('/login')} sx={{ cursor: 'pointer' }}>Login</Link>
                        </Typography>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}