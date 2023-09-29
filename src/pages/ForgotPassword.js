import axios from 'axios';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, TextField } from '@mui/material';
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
    const [step, setStep] = useState(0); 
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isSendingVerificationCode, setIsSendingVerificationCode] = useState(false);
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
                setSuccessMessage('Password change request sent! Check your email.');
                console.log(response.data.message);
                setStep(1);
                setErrorMessage(''); 
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


    const handleVerifyOwnership = async () => {
        try {
            const verifyResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/verify-password-change`, {
                email,
                code: verificationCode
            });

            if (verifyResponse.data.message === 'Code verified successfully. Proceed to change password.') {
                setSuccessMessage('Ownership verified successfully! Enter your new password.');
                console.log("Ownership verified successfully!");
                setStep(2);
                setErrorMessage(''); 
            } else {
                setErrorMessage('Verification failed. Please check the code and try again.');
                console.error("Error during verification:", verifyResponse.data.message);

            }
        } catch (error) {
            setErrorMessage('Error during verification.');
            console.error("Error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                console.error("Server Response:", error.response.data.message);
            }
        }
    };

    const handleChangePassword = async () => {
        setIsSendingVerificationCode(true);
        try {
            const updateResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/updateUserPassword`, {
                email,
                password: newPassword
            });

            if (updateResponse.data.message === 'Password updated successfully') {
                setSuccessMessage('Password successfully updated! Redirecting to login...');
                console.log("Password successfully updated!");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setErrorMessage(`Error during password update: ${updateResponse.data.message}`);
                console.error("Error during password update:", updateResponse.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
                console.error("Server Response:", error.response.data.message);
            } else {
                setErrorMessage('Error during password update.');
                console.error("Error:", error);
            }
        }
        setIsSendingVerificationCode(false);
    };

    return (
        <>
            <Helmet>
                <title> Forgot Password | VAAS </title>
            </Helmet>

            <StyledRoot>
                <Container maxWidth="sm" sx={{ backgroundColor: "#fff" }}>
                    <Logo sx={{ alignSelf: 'center' }} />
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            {step === 0 ? 'Forgot Password' : step === 1 ? 'Verify Ownership' : 'Change Password'}
                        </Typography>

                        {step === 0 && (
                            <>
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
                            </>
                        )}

                        {step === 1 && (
                            <>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    value={email}
                                    disabled
                                    sx={{ mb: 3 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Verification Code"
                                    variant="outlined"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    sx={{ mb: 3 }}
                                />
                                <Button
                                    fullWidth
                                    size="large"
                                    color="inherit"
                                    variant="outlined"
                                    onClick={handleVerifyOwnership}
                                >
                                    Verify Ownership
                                </Button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    value={email}
                                    disabled
                                    sx={{ mb: 3 }}
                                />
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    variant="outlined"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    sx={{ mb: 3 }}
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
                            </>
                        )}

                        {isSendingVerificationCode && (
                            <Typography variant="body2" color="secondary" sx={{ mt: 2 }}>
                                Sending Verification Code...
                            </Typography>
                        )}

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