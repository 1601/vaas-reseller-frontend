import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Grid, Box, CircularProgress } from '@mui/material';

const AdminApproval = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [storeDetails, setStoreDetails] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/v1/api/stores/${storeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data) {
          setStoreDetails(response.data);
          setOwnerId(response.data.ownerId);
        } else {
          setError('Store details not found');
        }
      } catch (error) {
        setError('Could not fetch store details');
        navigate('/dashboard/admin');
      }
    };

    fetchStoreDetails().finally(() => setIsLoading(false));
  }, [storeId, navigate, BACKEND_URL]);

  const handleApprovalChange = async (isApproved) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/v1/api/admin/stores/${isApproved ? 'approve' : 'unapprove'}/${storeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.status === 200) {
        setStoreDetails((prevStoreDetails) => ({
          ...prevStoreDetails,
          needsApproval: !isApproved,
          isApproved,
        }));
      }
    } catch (error) {
      setError('Could not update approval status');
    }
  };

  const handleLiveStatusChange = async (isLive) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/v1/api/stores/owner/${ownerId}`,
        { isLive },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.status === 200) {
        setStoreDetails((prevStoreDetails) => ({
          ...prevStoreDetails,
          isLive,
        }));
      }
    } catch (error) {
      setError('Could not update live status');
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard/admin/storeapproval');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-4">
      <div className="flex-grow flex flex-col justify-center items-center transition-all duration-500 ease-in-out ml-0">
        {storeDetails ? (
          <div className="mb-4 w-full">
            <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}
              >
                <Typography variant="h4" gutterBottom>
                  Store Details
                </Typography>
                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                  {storeDetails && storeDetails.needsApproval && !storeDetails.isLive && (
                    <Button
                      onClick={handleApprovalChange}
                      variant="outlined"
                      color="primary"
                      style={{ marginRight: '8px' }}
                    >
                      Approve
                    </Button>
                  )}
                  {storeDetails &&
                    storeDetails.isApproved &&
                    (storeDetails.isLive ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        className="bg-red-600 text-white px-4 py-2 rounded"
                        onClick={() => handleLiveStatusChange(false)}
                        style={{ marginRight: '8px' }}
                      >
                        Un-Live
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        className="bg-green-600 text-white px-4 py-2 rounded"
                        onClick={() => handleLiveStatusChange(true)}
                        style={{ marginRight: '8px' }}
                      >
                        Go Live
                      </Button>
                    ))}
                  <Button onClick={handleGoBack} variant="outlined" color="primary">
                    Go Back
                  </Button>
                </div>
              </div>
              <div>
                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                  <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Store Name
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: '8px' }}>
                    Chosen Store Name of the User.
                  </Typography>
                  <Typography variant="body1">{storeDetails.storeName}</Typography>
                </Card>

                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                  <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Store URL
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: '8px' }}>
                    The Chosen Store URL of the User.
                  </Typography>
                  <Typography variant="body1">{storeDetails.storeUrl}</Typography>
                </Card>

                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                  <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Store Approval
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: '8px' }}>
                    Status of Store's Approval.
                  </Typography>
                  <Typography variant="body1">
                    {storeDetails.needsApproval ? 'Pending Approval' : 'Approved'}
                  </Typography>
                </Card>

                <Card style={{ marginBottom: '20px', padding: '15px' }}>
                  <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Store Live Status
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: '8px' }}>
                    Store's Live Status
                  </Typography>
                  <Typography variant="body1">{storeDetails.isLive ? 'Live' : 'Offline'}</Typography>
                </Card>
              </div>
            </Card>
          </div>
        ) : (
          <p>Loading store details...</p>
        )}
        {/* Store Logo and Colors section */}
        <div className="mb-4 w-full">
          <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
            <div className="flex flex-col md:flex-row">
              <Card variant="outlined" className="md:flex-1 p-4 mb-4 md:mb-0 md:mr-4">
                {/* Store Logo section */}
                <Typography variant="h4" gutterBottom align="center">
                  Store Logo
                </Typography>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={12}>
                    <div
                      className="flex justify-center items-center"
                      style={{
                        maxHeight: '230px',
                        maxWidth: '230px',
                        margin: 'auto',
                      }}
                    >
                      <img
                        src={storeDetails ? storeDetails.storeLogo : '/vortex_logo_black.png'}
                        alt="Store Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </Grid>
                </Grid>
              </Card>

              {/* Store Colors section */}
              <Card variant="outlined" className="md:flex-1 p-4">
                <Typography variant="h4" gutterBottom align="center">
                  Store Colors
                </Typography>
                <div className="flex flex-col items-center justify-between flex-1">
                  <div>
                    {/* Primary Color */}
                    <Box ml={2}>
                      <Typography variant="subtitle1" align="center">
                        Primary
                      </Typography>
                      <Box
                        width="100px"
                        height="30px"
                        bgcolor={storeDetails ? storeDetails.primaryColor : '#FFF'}
                        mb={2}
                        border="1px solid #000"
                      />
                    </Box>

                    {/* Secondary Color */}
                    <Box ml={2} mt={2}>
                      <Typography variant="subtitle1" align="center">
                        Secondary
                      </Typography>
                      <Box
                        width="100px"
                        height="30px"
                        bgcolor={storeDetails ? storeDetails.secondaryColor : '#FFF'}
                        mb={2}
                        border="1px solid #000"
                      />
                    </Box>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminApproval;