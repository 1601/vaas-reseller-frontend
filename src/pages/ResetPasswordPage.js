import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Container, Typography, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import { Icon as Iconify } from '@iconify/react';
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

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/updateUserPassword`,
                { token, password: newPassword }
            );
    
            if (response.status === 200) {
                setErrorMessage(''); 
                setSuccessMessage('Password has been updated successfully. Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setSuccessMessage(''); 
                setErrorMessage('Failed to update password. Please try again.');
            }
        } catch (error) {
            setSuccessMessage(''); 
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            console.error('Error updating password:', error);
        }
    };
    

    return (
        <>
            <Helmet>
                <title>Reset Password | Your App</title>
            </Helmet>
            <StyledRoot>
                <Container maxWidth="sm" sx={{ backgroundColor: "#fff" }}>
                    <Logo sx={{ alignSelf: 'center' }} />
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Reset Password
                        </Typography>

                        <TextField
                            fullWidth
                            label="New Password"
                            variant="outlined"
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ mb: 3 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            variant="outlined"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 3 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                            <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            fullWidth
                            size="large"
                            color="inherit"
                            variant="outlined"
                            onClick={handleChangePassword}
                        >
                            Change Password
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
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}