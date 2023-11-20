import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Paper, Typography, TextField, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TopUpConfig = ({ token, userId }) => {
  const { productName } = useParams();

  const defaultConfig = {
    defaultPrice: 'N/A',
    markup: '0',
    discount: '0',
  };

  const [productConfig, setProductConfig] = useState(defaultConfig);
  const navigate = useNavigate();

  useEffect(() => {
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
        setProductConfig(defaultConfig); 
      });
  }, [productName, token, userId]);

  const handleSave = () => {
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/api/dealer/product-config/${userId}/${productName}`, productConfig, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
      [name]: value,
    }));
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Paper elevation={3} sx={{ padding: '20px', margin: 'auto', maxWidth: '500px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <IconButton onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', flexGrow: 1, textAlign: 'center' }}>
            Configure: {productName}
          </Typography>
        </Box>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button variant="outlined" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TopUpConfig;
