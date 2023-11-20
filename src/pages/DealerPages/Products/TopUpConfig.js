import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';

const TopUpConfig = ({ productName, token, userId }) => {
  const defaultConfig = {
    defaultPrice: 'N/A',
    markup: '0',
    discount: '0'
  };

  const [productConfig, setProductConfig] = useState(defaultConfig);

  useEffect(() => {
    // Fetch the current configuration for the product
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/dealer/product-config/${userId}/${productName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProductConfig(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product configuration:', error);
        setProductConfig(defaultConfig); // Use default config on error
      });
  }, [productName, token, userId]);

  const handleSave = () => {
    // Save the updated configuration
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/dealer/product-config/${userId}/${productName}`,
        productConfig,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert('Configuration updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating product configuration:', error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value
    }));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Paper elevation={3} sx={{ padding: '20px', margin: 'auto', maxWidth: '500px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          Configure: {productName}
        </Typography>
        <TextField
          fullWidth
          label="Default Price"
          name="defaultPrice"
          value={productConfig.defaultPrice}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Mark-Up Price"
          name="markup"
          value={productConfig.markup}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Discount"
          name="discount"
          value={productConfig.discount}
          onChange={handleChange}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginTop: '20px' }}>
          Save Changes
        </Button>
      </Paper>
    </Box>
  );
};

export default TopUpConfig;
