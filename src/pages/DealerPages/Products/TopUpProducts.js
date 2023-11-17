import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Switch, FormControlLabel, Grid, Paper, Typography, TextField } from '@mui/material';
import CircularLoading from '../../../components/preLoader';
import TopUpImage from '../../../components/vortex/TopUpImage';

const TopUpProducts = () => {
  const [topUpToggles, setTopUpToggles] = useState({
    SMARTPH: { enabled: true, defaultPrice: 'N/A', markup: '', discount: '' },
    TNTPH: { enabled: true, defaultPrice: 'N/A', markup: '', discount: '' },
    PLDTPH: { enabled: true, defaultPrice: 'N/A', markup: '', discount: '' },
    GLOBE: { enabled: true, defaultPrice: 'N/A', markup: '', discount: '' },
    MERALCO: { enabled: true, defaultPrice: 'N/A', markup: '', discount: '' },
    CIGNAL: { enabled: true, defaultPrice: 'N/A', markup: '', discount: '' },
  });
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token');
  const userId = JSON.parse(localStorage.getItem('user'))._id;

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/dealer/topup-toggles/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Map response to your state structure
        // setTopUpToggles(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching topup toggles:', error);
        setIsLoading(false);
      });
  }, [token, userId]);

  const handleToggleChange = (event) => {
    const { name, checked } = event.target;
    setTopUpToggles((prevState) => ({ ...prevState, [name]: checked }));

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/dealer/topup-toggles/${userId}`,
        { topupToggles: { ...topUpToggles, [name]: checked } },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch((error) => console.error('Error updating topup toggles:', error));
  };

  if (isLoading) {
    return <CircularLoading />;
  }

  const configureButtonStyle = {
    color: 'black',
    backgroundColor: 'white',
    '&:hover': {
      color: 'white',
      backgroundColor: 'skyblue',
    },
  };

  const handleConfigure = (productName) => {
    setSelectedProduct(productName);
    // Navigate to configuration page or open a modal for configuration
    // For example: navigate(`/configure/${productName}`);
  };

  const handleMarkupChange = (name, value) => {
    // Update markup price for a product
    setTopUpToggles((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name], markup: value },
    }));
  };

  const handleDiscountChange = (name, value) => {
    // Update discount for a product
    setTopUpToggles((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name], discount: value },
    }));
  };

  if (isLoading) {
    return <CircularLoading />;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Paper elevation={3} sx={{ margin: 'auto', maxWidth: '90%', padding: '20px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          Top-Up Products
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(topUpToggles).map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Paper elevation={3} sx={{ padding: '10px', textAlign: 'center' }}>
                <Typography variant="h6">{key}</Typography>
                <TopUpImage title={key} />
                <FormControlLabel
                  control={
                    <Switch checked={topUpToggles[key].enabled} onChange={(e) => handleToggleChange(e)} name={key} />
                  }
                  label={topUpToggles[key].enabled ? 'Enabled' : 'Disabled'}
                />
                {topUpToggles[key].enabled && (
                  <Button variant="contained" sx={configureButtonStyle} onClick={() => handleConfigure(key)}>
                    Configure
                  </Button>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default TopUpProducts;
