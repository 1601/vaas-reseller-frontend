import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Container, Typography, Divider, TextField, Button, Stack } from '@mui/material';
import Logo from '../../components/logo';

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

export default function VerifyPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [countdown, setCountdown] = useState(180);
    const [allowResend, setAllowResend] = useState(false);

    useEffect(() => {
        const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);

        if (countdown === 0) {
            setAllowResend(true);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    const resendCode = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/resend-verification-email`, {
                email
            });
            setCountdown(180);
            setAllowResend(false);
        } catch (error) {
            console.error('Error while resending verification email:', error);
            // Handle the error, e.g., show an error message to the user
        }
    };

    const verifyEmail = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/verify`, {
                email,
                code,
            });

            if (response.status === 200) {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/updateUserStatus`, {
                    email,
                });

                setSuccessMessage('Successful Verification. Proceeding to login page...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);

            } else {
                setErrorMessage('Invalid email or verification code.');
            }
        } catch (error) {
            console.error('Verification error:', error);
            if (error.response && error.response.status === 400) {
                setErrorMessage('Invalid email or verification code.');
            } else {
                setErrorMessage('An error occurred during verification.');
            }
        }
    };

    return (
        <>
            <Helmet>
                <title> Email Verification | VAAS </title>
            </Helmet>

            <StyledRoot>
                <Container maxWidth="sm" sx={{ backgroundColor: "#fff" }}>
                    <Logo sx={{ alignSelf: 'center' }} />

                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Email Verification
                        </Typography>

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
                            label="Verification Code"
                            variant="outlined"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        {errorMessage && <Typography variant="body2" color="error" sx={{ mb: 5 }}>{errorMessage}</Typography>}
                        {successMessage && <Typography variant="body2" color="success" sx={{ mb: 5 }}>{successMessage}</Typography>}

                        <Button
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={verifyEmail}
                            style={{ opacity: 1, backgroundColor: "#3f51b5", color: "white" }}
                        >
                            Verify
                        </Button>

                        <Divider sx={{ my: 3 }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}> 
                            <div>
                                <Typography variant="body2">
                                    Already verified?
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Typography variant="subtitle2" onClick={() => navigate('/login')} sx={{ cursor: 'pointer' }}>Login</Typography>
                                </Stack>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                {allowResend ? (
                                    <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                        <a
                                            href="#"
                                            onClick={resendCode}
                                            style={{ textDecoration: 'none', cursor: 'pointer' }}
                                        >
                                            Resend Verification Code
                                        </a>
                                    </Typography>
                                ) : (
                                    <Typography variant="body2">
                                        Resend code in {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}{countdown % 60}
                                    </Typography>
                                )}
                            </div>
                        </div>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
};