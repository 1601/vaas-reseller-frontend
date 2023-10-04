import axios from 'axios';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Button, TextField } from '@mui/material';
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
    padding: theme.spacing(2, 0),
}));

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleRequestPasswordChange = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/send-password-change-email`,
                { email }
            );

            if (response.status === 200) {
                setSuccessMessage('Password change request sent! Redirecting to login...');
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // wait 3 seconds, then navigate
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message.includes("unregistered")) {
                setErrorMessage("Email is either unregistered or not activated");
            } else {
                setErrorMessage('Error sending password change request.');
            }
            console.error('Error sending password change request:', error);
        }
    };

    return (
        <>
            <Helmet>
                <title> Forgot Password | Your App </title>
            </Helmet>

            <StyledRoot>
                <Container maxWidth="sm" sx={{ backgroundColor: "#fff" }}>
                    <Logo sx={{ alignSelf: 'center' }} />
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Forgot Password
                        </Typography>

                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            fullWidth
                            size="large"
                            color="inherit"
                            variant="outlined"
                            onClick={handleRequestPasswordChange}
                        >
                            Request Password Change
                        </Button>

                        {successMessage && (
                            <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                                {successMessage}
                            </Typography>
                        )}

                        {errorMessage && (
                            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                {errorMessage}
                            </Typography>
                        )}

                        <Typography variant="body2" sx={{ mt: 3 }}>
                            Remembered your password?
                            <Link
                                variant="subtitle2"
                                onClick={() => navigate('/login')}
                                sx={{ cursor: 'pointer', ml: 1 }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
