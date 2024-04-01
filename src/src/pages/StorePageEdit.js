import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SecureLS from 'secure-ls';
import { ChromePicker } from 'react-color';
import {
  Card,
  Grid,
  Container,
  Divider,
  Switch,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import CircularLoading from '../components/preLoader';
import AccountStatusModal from '../components/user-account/AccountStatusModal';
import UserDataFetch from '../components/user-account/UserDataFetch';

const ls = new SecureLS({ encodingType: 'aes' });

const StorePageEdit = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('Uploading...');
  const userId = ls.get('user') ? ls.get('user')._id : null;
  const userData = UserDataFetch(userId);
  const [isStoreUrlValid, setIsStoreUrlValid] = useState(true);
  const [isStoreNameValid, setIsStoreNameValid] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [platformVariables, setPlatformVariables] = useState({
    enableBills: true,
    enableLoad: true,
    enableGift: true,
  });

  useEffect(() => {}, [storeData]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const token = ls.get('token');
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/owner`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStoreData(response.data);
        setEditedData(response.data);
        setPlatformVariables(response.data.platformVariables);
      } catch (error) {
        console.error('Could not fetch store data', error);
      }
    };

    fetchStoreData();

    return () => {
      if (editedData.storeLogo) {
        URL.revokeObjectURL(editedData.storeLogo);
      }
      return null;
    };
  }, []);

  const [color, setColor] = useState({
    primary: { hex: storeData ? storeData.primaryColor : '#FFFFFF' },
    secondary: { hex: storeData ? storeData.secondaryColor : '#FFFFFF' },
  });

  useEffect(() => {
    if (storeData) {
      setColor({
        primary: { hex: storeData.primaryColor || '#FFFFFF' },
        secondary: { hex: storeData.secondaryColor || '#FFFFFF' },
      });
    }
  }, [storeData]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const isValidSubdomain = (subdomain) => {
    const regex = /^[a-z\d][a-z\d-]*[a-z\d]$/i;
    return regex.test(subdomain);
  };

  const handleSaveClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      if (!isValidSubdomain(editedData.storeUrl)) {
        setErrorMessage('Please ensure only lowercase alphanumerical with no special symbols');
        setErrorDialogOpen(true);
        return;
      }

      const token = ls.get('token');

      const updatedData = {
        ...editedData,
        storeSubdomain: editedData.storeUrl,
        needsApproval: true,
        isLive: false,
        isApproved: false,
      };

      delete updatedData.storeLogo;

      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/owner`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setStoreData((prevStoreData) => ({
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
      let errorMessage = 'Could not update store data';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setErrorMessage(errorMessage);
      setErrorDialogOpen(true);
    }
  };

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e, field) => {
    let value = e.target.value;

    if (field === 'storeName') {
      const isValid = /^[a-z0-9\s]{1,30}$/i.test(value);
      setIsStoreNameValid(isValid);
      value = value.replace(/[^a-z0-9\s]/gi, '').substring(0, 30);
    }

    if (field === 'storeUrl') {
      const isValid = /^[a-z0-9]+$/i.test(e.target.value);
      setIsStoreUrlValid(isValid);
    }
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  const handlePreviewClick = () => {
    // navigate(`/${editedData.storeUrl}`);
    window.open(`/${editedData.storeUrl}`, '_blank');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    // File type and size validation
    if (file && ['image/jpeg', 'image/png'].includes(file.type)) {
      if (file.size <= 5000000) {
        // file size <= 5MB
        const storeName = editedData.storeName.replace(/\s+/g, '_');
        const fileName = `${storeName}_logo.${file.type.split('/')[1]}`;

        setEditedData({
          ...editedData,
          storeLogo: file,
          logoFileName: fileName,
          needsApproval: true,
          isApproved: false,
        });
      } else {
        alert('File size must not exceed 5MB');
      }
    } else {
      alert('Supported file types are JPEG and PNG');
    }
  };

  const handleToggle = async (field) => {
    const newValue = !platformVariables[field];
    const newPlatformVariables = {
      ...platformVariables,
      [field]: newValue,
    };
    setPlatformVariables(newPlatformVariables);

    const requestBody = {
      [field]: newValue,
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${storedUserId}/platvar`,
        requestBody
      );
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating platform variables:', error.message);
      setPlatformVariables({
        ...platformVariables,
        [field]: !newValue,
      });
    }
  };

  const handleUploadClick = async (proseso) => {
    try {
      const token = ls.get('token');

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/owner`,
        { isLive: false, isApproved: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error updating isLive status:', err);
    }

    if (editedData.storeLogo) {
      setUploading(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(interval);
            setProgressText('Successfully Uploaded!');

            setTimeout(() => {
              window.location.reload();
            }, 1000);

            return 100;
          }
          return Math.min(oldProgress + 10, 100);
        });
      }, 500);

      const formData = new FormData();
      const storedUserId = ls.get('user') ? ls.get('user')._id : null;

      formData.append('file', editedData.storeLogo);
      formData.append('logoFileName', editedData.logoFileName);
      formData.append('storeName', editedData.storeName);

      const token = ls.get('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/logo/${proseso}/${storedUserId}`,
          formData,
          config
        );

        if (response.data.url) {
          const newLogoFileName = response.data.url.split('/').pop();
          setEditedData({
            ...editedData,
            storeLogo: response.data.url,
            logoFileName: newLogoFileName,
          });

          setProgressText('Successfully Uploaded!');
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
      const token = ls.get('token');

      const updateResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/owner`,
        { isLive: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (updateResponse.status === 200) {
        setStoreData((prevStoreData) => ({
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

  const handleUnliveClick = async () => {
    try {
      const token = ls.get('token');

      const updateResponse = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/owner`,
        { isLive: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (updateResponse.status === 200) {
        setStoreData((prevStoreData) => ({
          ...prevStoreData,
          isLive: false,
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
      const isValidColor =
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.primary.hex) &&
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.secondary.hex);

      if (!isValidColor) {
        throw new Error('Invalid color format');
      }

      const dataToSend = {
        primaryColor: color.primary.hex,
        secondaryColor: color.secondary.hex,
      };

      const token = ls.get('token');

      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/colors`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert('Colors updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating colors:', error.message);
      alert('Failed to update colors. Please try again.');
    }
  };

  const previewLogoUrl = `${process.env.REACT_APP_BACKEND_URL}/public/img/${editedData.storeLogo}`;

  const formData = new FormData();
  const storedUserId = ls.get('user') ? ls.get('user')._id : null;
  formData.append('ownerId', storedUserId);
  formData.append('storeName', editedData.storeName);
  formData.append('storeLogo', editedData.storeLogo);

  const handleNavigateToKyc = () => {
    navigate('/dashboard/kyc');
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const messageBoxStyle = {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: '8px',
  };

  return (
    <Container>
      <div className="mb-4 w-full">
        <div className="flex-grow flex flex-col justify-center items-center transition-all duration-500 ease-in-out ml-0">
          {/* KYC Card */}
          {storeData && !storeData.kycApprove && (
            <Card
              variant="outlined"
              style={{
                padding: '20px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h4" style={{ marginBottom: '20px', textAlign: 'center' }}>
                {storeData.kycSubmitted ? 'Documents are not yet Approved.' : 'Documents are not yet Submitted.'}
              </Typography>

              {storeData.kycSubmitted ? (
                <Typography variant="h6" mb={2} style={{ marginBottom: '20px', textAlign: 'center' }}>
                  Please wait for Admins to assess your submitted documents.
                </Typography>
              ) : (
                <Typography variant="h6" mb={2} style={{ marginBottom: '20px', textAlign: 'center' }}>
                  Please finish this step first before the store can go Live.
                </Typography>
              )}

              {!storeData.kycSubmitted && (
                <Button variant="outlined" color="primary" className="mr-2 mb-2" onClick={handleNavigateToKyc}>
                  Go to Upload Documents
                </Button>
              )}
            </Card>
          )}

          {/* Store Details Card */}
          {storeData ? (
            <>
              <div className="mb-4 w-full">
                <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
                  <div className="md:flex md:justify-between md:items-center mb-4">
                    <Typography variant="h4" gutterBottom className="w-full md:w-auto">
                      Store Details
                    </Typography>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <Button onClick={handleSaveClick} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
                          Save
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outlined"
                            color="primary"
                            className="px-4 py-2 text-base"
                            onClick={handlePreviewClick}
                          >
                            Preview Store
                          </Button>
                          {storeData !== null && storeData.isApproved && !storeData.isLive && (
                            <Button
                              variant="contained"
                              color="secondary"
                              className="bg-green-600 text-white px-4 py-2 rounded"
                              onClick={!storeData.kycApprove ? undefined : handleGoLiveClick}
                              disabled={!storeData.kycApprove}
                            >
                              Go Live
                            </Button>
                          )}
                          {storeData !== null && storeData.isLive && (
                            <Button
                              variant="contained"
                              color="secondary"
                              className="bg-red-600 text-white px-4 py-2 rounded"
                              onClick={!storeData.kycApprove ? undefined : handleUnliveClick}
                              disabled={!storeData.kycApprove}
                            >
                              Disable
                            </Button>
                          )}
                          <Button onClick={handleEditClick} className="bg-blue-600 text-white px-4 py-2 rounded">
                            Edit
                          </Button>
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
                          <>
                            <input
                              type="text"
                              value={editedData.storeName}
                              onChange={(e) => handleInputChange(e, 'storeName')}
                              className={`border p-2 rounded ${!isStoreNameValid ? 'border-red-500' : ''}`}
                              style={{
                                fontSize: '1rem',
                                borderColor: !isStoreNameValid ? 'red' : '#d1d5db',
                                backgroundColor: !isStoreNameValid ? '#ffe5e5' : 'white',
                              }}
                              maxLength={30}
                            />
                            {!isStoreNameValid && (
                              <Typography variant="body2" style={{ color: 'red' }}>
                                Invalid Format
                              </Typography>
                            )}
                          </>
                        ) : (
                          <Typography variant="body1">{storeData.storeName}</Typography>
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
                          <>
                            <input
                              type="text"
                              value={editedData.storeUrl.replace(/\./g, '')}
                              onChange={(e) => handleInputChange(e, 'storeUrl')}
                              className="border p-2 rounded"
                              style={{
                                fontSize: '1rem',
                                borderColor: !isStoreUrlValid ? 'red' : '#d1d5db',
                                backgroundColor: !isStoreUrlValid ? '#ffe5e5' : 'white',
                              }}
                            />
                            {!isStoreUrlValid && (
                              <Typography variant="body2" style={{ color: 'red' }}>
                                Invalid Format
                              </Typography>
                            )}
                          </>
                        ) : (
                          <Typography variant="body1">{storeData.storeUrl}</Typography>
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
                          {storeData.needsApproval ? 'Pending Approval' : 'Approved'}
                        </Typography>
                      </Card>

                      <Card style={{ marginBottom: '20px', padding: '15px' }}>
                        <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                          Store Live Status
                        </Typography>
                        <Typography variant="body2" style={{ marginBottom: '8px' }}>
                          Check here if your store is currently Live or Offline!
                        </Typography>
                        <Typography variant="body1">{storeData.isLive ? 'Live' : 'Offline'}</Typography>
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
                      <Card
                        variant="outlined"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
                      >
                        <img
                          src={storeData && storeData.storeLogo ? storeData.storeLogo : '/assets/logo.svg'}
                          alt="Your Store Logo"
                          style={{
                            maxWidth: '230px',
                            maxHeight: '230px',
                            width: 'auto',
                            height: 'auto',
                          }}
                        />
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card
                        variant="outlined"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%',
                          padding: '20px',
                        }}
                      >
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
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-x-2">
                          <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileUpload}
                            className="w-full md:w-auto text-sm md:text-base border p-2 rounded mt-2"
                          />
                          <Button
                            onClick={() => handleUploadClick('logo')}
                            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                          >
                            Upload
                          </Button>
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
                              justifyContent: 'center',
                              padding: '20px',
                              marginBottom: '20px',
                            }}
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                              <div className="mb-4 md:mb-0 w-full md:w-auto">
                                <Typography variant="subtitle2" align="center">
                                  Primary Color
                                </Typography>
                                <ChromePicker
                                  color={color.primary.hex}
                                  onChangeComplete={(newColor) =>
                                    setColor({ ...color, primary: { hex: newColor.hex } })
                                  }
                                />
                              </div>
                              <div className="md:flex flex-col md:items-center">
                                {/* Current Primary Color */}
                                <div className="mb-4 md:mb-2">
                                  <Typography
                                    variant="subtitle1"
                                    align="center"
                                    className="text-base md:text-sm lg:text-md"
                                  >
                                    Current Primary Color
                                  </Typography>
                                  <div
                                    className="w-full md:w-25 h-6 bg-black border border-black"
                                    style={{ backgroundColor: storeData ? storeData.primaryColor : '#FFFFFF' }}
                                  />
                                </div>

                                {/* New Primary Color */}
                                <div>
                                  <Typography
                                    variant="subtitle1"
                                    align="center"
                                    className="text-base md:text-sm lg:text-md"
                                  >
                                    New Primary Color
                                  </Typography>
                                  <div
                                    className="w-full md:w-30 h-6 bg-black border border-black"
                                    style={{ backgroundColor: color.primary.hex }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Card
                            variant="outlined"
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '20px',
                              marginBottom: '20px',
                            }}
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                              <div className="mb-4 md:mb-0 w-full md:w-auto">
                                <Typography variant="subtitle2" align="center">
                                  Secondary Color
                                </Typography>
                                <ChromePicker
                                  color={color.secondary.hex}
                                  onChangeComplete={(newColor) =>
                                    setColor({ ...color, secondary: { hex: newColor.hex } })
                                  }
                                />
                              </div>

                              {/* Right side content */}
                              <div className="md:flex flex-col md:items-center">
                                {/* Current Secondary Color */}
                                <div className="mb-4 md:mb-2">
                                  <Typography
                                    variant="subtitle1"
                                    align="center"
                                    className="text-base md:text-sm lg:text-md"
                                  >
                                    Current Secondary Color
                                  </Typography>
                                  <div
                                    className="w-full md:w-25 h-6 bg-black border border-black"
                                    style={{ backgroundColor: storeData ? storeData.secondaryColor : '#FFFFFF' }}
                                  />
                                </div>

                                {/* New Secondary Color */}
                                <div>
                                  <Typography
                                    variant="subtitle1"
                                    align="center"
                                    className="text-base md:text-sm lg:text-md"
                                  >
                                    New Secondary Color
                                  </Typography>
                                  <div
                                    className="w-full md:w-30 h-6 bg-black border border-black"
                                    style={{ backgroundColor: color.secondary.hex }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Grid>
                      </Grid>
                    </div>

                    <Divider style={{ margin: '20px 0' }} />

                    <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center">
                      <Button onClick={handleSaveColorsClick} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
                        Update Colors
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="mb-4 w-full">
                <div className="w-full">
                  <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
                    <Typography variant="h4" gutterBottom>
                      Product Toggles
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom style={{ marginTop: '-10px' }}>
                      Toggle what products you want your customers to interact with.
                    </Typography>
                    <Card
                      variant="outlined"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        padding: '20px',
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="subtitle1">Enable Bills:</Typography>
                            <Switch
                              checked={platformVariables.enableBills}
                              onChange={() => handleToggle('enableBills')}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="subtitle1">Enable Load:</Typography>
                            <Switch
                              checked={platformVariables.enableLoad}
                              onChange={() => handleToggle('enableLoad')}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="subtitle1">Enable Gift:</Typography>
                            <Switch
                              checked={platformVariables.enableGift}
                              onChange={() => handleToggle('enableGift')}
                            />
                          </div>
                        </Grid>
                      </Grid>
                    </Card>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <CircularLoading />
          )}

          {uploading && (
            <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white text-center p-4">
              <div>{progressText}</div>
              <progress max="100" value={progress} />
            </div>
          )}

          <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
            <DialogTitle>Error</DialogTitle>
            <DialogContent>
              <DialogContentText>{errorMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setErrorDialogOpen(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Confirm Changes'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do you wish to save new changes? If you proceed, your store details will be sent to admins for approval
                and your store's live status will automatically go offline until the new details are approved.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleConfirmSave();
                  setConfirmDialogOpen(false);
                }}
                color="primary"
                autoFocus
              >
                Proceed
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <AccountStatusModal open userData={userData} storeData={storeData} />
    </Container>
  );
};

export default StorePageEdit;
