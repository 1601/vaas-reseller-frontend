import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChromePicker } from 'react-color';
import { Box, Stack, Card, Grid, Container, Divider, Typography, Button } from '@mui/material';
import { ColorPreview, ColorMultiPicker, ColorSinglePicker } from '../components/color-utils';

const StorePageEdit = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [storeData, setStoreData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState("Uploading...");

    const [color, setColor] = useState({
        primary: { hex: '#FFFFFF' },
        secondary: { hex: '#FFFFFF' },
    });

    useEffect(() => {
        console.log("storeData:", storeData);
    }, [storeData]);

    useEffect(() => {
        
        const storedUserId = JSON.parse(localStorage.getItem('user'))._id;

        const fetchStoreData = async () => {
            try {
                console.log(storedUserId)
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stores/owner/${storedUserId}`);
                setStoreData(response.data);
                setEditedData(response.data);
            } catch (error) {
                console.error('Could not fetch store data', error);
            }
        };

        fetchStoreData();

        return () => {
            if (editedData.storeLogo) {
                URL.revokeObjectURL(editedData.storeLogo);
            }
            return null; // Consistent return value
        };
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const isValidSubdomain = (subdomain) => {
        const regex = /^[a-z\d][a-z\d-]*[a-z\d]$/i;
        return regex.test(subdomain);
    };

    const handleSaveClick = async () => {
        console.log("Save button clicked");
        try {
            const storedUserId = JSON.parse(localStorage.getItem('user'))._id;

            if (!isValidSubdomain(editedData.storeUrl)) {
                alert("Please ensure only lowercase alphanumerical with no special symbols");
                return;
            }

            const updatedData = {
                ...editedData,
                storeSubdomain: editedData.storeUrl,
                needsApproval: true,
                isLive: false,
                isApproved: false,
            };

            delete updatedData.storeLogo;

            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/stores/owner/update/${storedUserId}`, updatedData);

            if (response.status === 200) {
                setStoreData(prevStoreData => ({
                    ...prevStoreData,
                    isApproved: false,
                    needsApproval: true,
                    isLive: false,
                }));
                setIsEditing(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                console.error('Could not update store data, received status: ', response.status);
            }
        } catch (error) {
            console.error('Could not update store data', error);
        }
    };

    const handleInputChange = (e, field) => {
        setEditedData({
            ...editedData,
            [field]: e.target.value
        });
    };

    const handlePreviewClick = () => {
        // navigate(`/${editedData.storeUrl}`);
        window.open(`/${editedData.storeUrl}`, '_blank');
    };

    const handleFileUpload = (event) => {
        console.log('File selected:', event.target.files[0]);
        const file = event.target.files[0];

        // File type and size validation
        if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
            if (file.size <= 5000000) { // file size <= 5MB
                const storeName = editedData.storeName.replace(/\s+/g, '_');
                const fileName = `${storeName}_logo.${file.type.split('/')[1]}`;

                setEditedData({
                    ...editedData,
                    storeLogo: file,
                    logoFileName: fileName,
                });
            } else {
                alert('File size must not exceed 5MB');
            }
        } else {
            alert('Supported file types are JPEG and PNG');
        }
    };

    const handleUploadClick = async (proseso) => {
        console.log('Upload button clicked');
        console.log('Before upload:', editedData);
    
        // Update isLive status immediately after clicking upload
        console.log("Attempting to update isLive status...");
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/stores/owner/update/${storedUserId}`, {
                isLive: false
            });
            console.log("Successfully updated isLive status to false.");
        } catch (err) {
            console.error('Error updating isLive status:', err);
        }
    
        if (editedData.storeLogo) {
            setUploading(true);
            setProgress(0);
    
            const interval = setInterval(() => {
                setProgress(oldProgress => {
                    if (oldProgress >= 100) {
                        clearInterval(interval);
                        setProgressText("Successfully Uploaded!");
    
                        // Reload the page after progress reaches 100%.
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
    
                        return 100;
                    }
                    return Math.min(oldProgress + 10, 100);
                });
            }, 500);
    
            const formData = new FormData();
            const storedUserId = JSON.parse(localStorage.getItem('user'))._id;
    
            formData.append('file', editedData.storeLogo);
            formData.append('logoFileName', editedData.logoFileName);
            formData.append('storeName', editedData.storeName);
    
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };
    
            try {
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/upload-logo/${proseso}/${storedUserId}`, formData, config);
    
                if (response.data.url) {
                    const newLogoFileName = response.data.url.split('/').pop();
                    setEditedData({
                        ...editedData,
                        storeLogo: response.data.url,
                        logoFileName: newLogoFileName,
                    });
    
                    setProgressText("Successfully Uploaded!");
                    clearInterval(interval);
                    setUploading(false);
                    setProgress(100);
                }
    
            } catch (error) {
                console.error('Error uploading logo:', error);
                clearInterval(interval);
                setUploading(false);
                setProgress(0);
            }
        } else {
            console.error('No file to upload.');
        }
    };    

    const handleGoLiveClick = async () => {
        try {
            const storedUserId = JSON.parse(localStorage.getItem('user'))._id;  // Fetch the user ID from local storage

            // Fetch the latest store data to get the current isApproved status
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stores/owner/${storedUserId}`);
            const updatedStoreData = response.data;

            console.log("Before update - isApproved:", updatedStoreData.isApproved);
            console.log("Before update - isLive:", updatedStoreData.isLive);

            // Use the storedUserId when making the PUT request
            const updateResponse = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/stores/owner/update/${storedUserId}`, {
                isLive: true,
            }, {
                headers: {
                    'Owner-Id': storedUserId  // Add a custom header to pass the owner ID
                }
            });

            if (updateResponse.status === 200) {
                setStoreData(prevStoreData => ({
                    ...prevStoreData,
                    isLive: true,
                }));
            } else {
                console.error('Could not update isLive status, received status: ', updateResponse.status);
            }
        } catch (error) {
            console.error('Could not update isLive status', error);
        }
    };

    const handleSaveColorsClick = async () => {
        try {
            const isValidColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.primary.hex) && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.secondary.hex);

            if (!isValidColor) {
                throw new Error('Invalid color format');
            }

            const dataToSend = {
                primaryColor: color.primary.hex,
                secondaryColor: color.secondary.hex,
            };

            const token = localStorage.getItem('token');
            const ownerId = JSON.parse(localStorage.getItem('user'))._id;

            // Send the updated colors to the server
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/updateColors/${ownerId}`, dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message);
            }

            alert('Colors updated successfully');

            // Reload the webpage after a delay of 1 second (1000 milliseconds)
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error updating colors:', error.message);
            alert('Failed to update colors. Please try again.'); // Notify the user of the error
        }
    };

    const previewLogoUrl = `${process.env.REACT_APP_BACKEND_URL}/public/img/${editedData.storeLogo}`;

    const formData = new FormData();
    const storedUserId = JSON.parse(localStorage.getItem('user'))._id;
    formData.append('ownerId', storedUserId);
    formData.append('storeName', editedData.storeName);
    formData.append('storeLogo', editedData.storeLogo);

    return (
        <div className="flex flex-col mt-4">
            <div className="flex-grow flex flex-col justify-center items-center transition-all duration-500 ease-in-out ml-0">
                <div className="mb-4 w-full">
                    <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <Typography variant="h4" gutterBottom>
                                Store Details
                            </Typography>
                            <div>
                                {isEditing ? (
                                    <Button onClick={handleSaveClick} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Save</Button>
                                ) : (
                                    <>
                                        <Button onClick={handleEditClick} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Edit</Button>
                                        {storeData !== null && storeData.isApproved && !storeData.isLive && (
                                            <Button variant="contained" color="secondary" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleGoLiveClick}>
                                                Go Live
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {storeData && (
                            <div>
                                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Store Name
                                    </Typography>
                                    <Typography variant="body2" style={{ marginBottom: '8px' }}>
                                        This is the name of your store!
                                    </Typography>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData.storeName}
                                            onChange={(e) => handleInputChange(e, 'storeName')}
                                            className="border p-2 rounded"
                                            style={{ fontSize: '1rem' }}
                                        />
                                    ) : (
                                        <Typography variant="body1">
                                            {storeData.storeName}
                                        </Typography>
                                    )}
                                </Card>

                                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Store URL
                                    </Typography>
                                    <Typography variant="body2" style={{ marginBottom: '8px' }}>
                                        This is the URL of your store!
                                    </Typography>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData.storeUrl}
                                            onChange={(e) => handleInputChange(e, 'storeUrl')}
                                            className="border p-2 rounded"
                                            style={{ fontSize: '1rem' }}
                                            pattern="^[a-z0-9]+$"
                                            title="Please enter a lowercase alphanumeric value without special symbols."
                                        />
                                    ) : (
                                        <Typography variant="body1">
                                            {storeData.storeUrl}
                                        </Typography>
                                    )}
                                </Card>

                                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Store Approval
                                    </Typography>
                                    <Typography variant="body2" style={{ marginBottom: '8px' }}>
                                        This is the status of your store's approval!
                                    </Typography>
                                    <Typography variant="body1">
                                        {storeData.needsApproval ? 'Needs Approval' : 'Approved'}
                                    </Typography>
                                </Card>

                                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        Store Live Status
                                    </Typography>
                                    <Typography variant="body2" style={{ marginBottom: '8px' }}>
                                        Check here if your store is currently Live or Offline!
                                    </Typography>
                                    <Typography variant="body1">
                                        {storeData.isLive ? 'Live' : 'Offline'}
                                    </Typography>
                                </Card>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="mb-4 w-full">
                    <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
                        <Typography variant="h4" gutterBottom>
                            Store Logo
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom style={{ marginTop: '-10px' }}>
                            This is where your store logo is added.
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <img src={storeData ? storeData.storeLogo : '/vortex_logo_black.png'} alt="Your Store Logo" style={{ maxWidth: '230px', maxHeight: '230px' }} />
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '20px' }}>
                                    <div>
                                        <Typography variant="h6" gutterBottom>
                                            Default
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom style={{ marginTop: '-10px' }}>
                                            Used for most common logo applications
                                        </Typography>
                                        <Typography variant="body2" gutterBottom style={{ marginTop: '-10px' }}>
                                            Add a default logo
                                        </Typography>
                                    </div>
                                    <div>
                                        <input type="file" accept="image/png, image/jpeg" onChange={handleFileUpload} className="border p-2 rounded mt-2" />
                                        <Button onClick={() => handleUploadClick("logo")} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Upload</Button>
                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    </Card>
                </div>
                <div className="mb-4 w-full">
                    <div className="w-full">
                        <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
                            <Typography variant="h4" gutterBottom>
                                Store Colors
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom style={{ marginTop: '-10px' }}>
                                Choose the primary and secondary colors for your store.
                            </Typography>
                            <div>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Card
                                            variant="outlined"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                height: '100%',
                                                padding: '20px',
                                                marginBottom: '20px', // Add margin for spacing on small screens
                                            }}
                                        >
                                            {/* Primary Color */}
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <Typography variant="subtitle2">Primary Color</Typography>
                                                <ChromePicker
                                                    color={color.primary.hex}
                                                    onChangeComplete={(newColor) => setColor({ ...color, primary: { hex: newColor.hex } })}
                                                />
                                            </Box>

                                            {/* Right side content */}
                                            <Box ml={2}>
                                                {/* Current Primary Color */}
                                                <Typography variant="subtitle1" align="center">Current Primary Color</Typography>
                                                <Box
                                                    width="100px"
                                                    height="30px"
                                                    bgcolor={storeData ? storeData.primaryColor : '#FFF'}
                                                    mb={2} // Add margin at the bottom to separate from the next box
                                                    border="1px solid #000"
                                                />

                                                {/* New Primary Color */}
                                                <Typography variant="subtitle1" align="center">New Primary Color</Typography>
                                                <Box
                                                    width="100px"
                                                    height="30px"
                                                    bgcolor={color.primary.hex}
                                                    border="1px solid #000"
                                                />
                                            </Box>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Card
                                            variant="outlined"
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                height: '100%',
                                                padding: '20px',
                                                marginBottom: '20px', // Add margin for spacing on small screens
                                            }}
                                        >
                                            {/* Secondary Color */}
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <Typography variant="subtitle2">Secondary Color</Typography>
                                                <ChromePicker
                                                    color={color.secondary.hex}
                                                    onChangeComplete={(newColor) => setColor({ ...color, secondary: { hex: newColor.hex } })}
                                                />
                                            </Box>

                                            {/* Right side content */}
                                            <Box ml={2}>
                                                {/* Current Secondary Color */}
                                                <Typography variant="subtitle1" align="center">Current Secondary Color</Typography>
                                                <Box
                                                    width="100px"
                                                    height="30px"
                                                    bgcolor={storeData ? storeData.secondaryColor : '#FFF'}
                                                    mb={2} // Add margin at the bottom to separate from the next box
                                                    border="1px solid #000"
                                                />

                                                {/* New Secondary Color */}
                                                <Typography variant="subtitle1" align="center">New Secondary Color</Typography>
                                                <Box
                                                    width="100px"
                                                    height="30px"
                                                    bgcolor={color.secondary.hex}
                                                    border="1px solid #000"
                                                />
                                            </Box>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>

                            <Divider style={{ margin: '20px 0' }} />

                            <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center">
                                <Button variant="outlined" color="primary" className="mb-2 sm:mb-0" onClick={handleSaveColorsClick}>
                                    Update Colors
                                </Button>
                                <div>
                                    <Button variant="outlined" color="primary" className="mr-2 mb-2" onClick={handlePreviewClick}>
                                        Preview Store
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {uploading && (
                    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white text-center p-4">
                        <div>{progressText}</div>
                        <progress max="100" value={progress} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StorePageEdit;