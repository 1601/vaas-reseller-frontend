import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  TextField,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TopUpConfig = () => {
  const { productName } = useParams();
  const [productConfigs, setProductConfigs] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/${userId}/${productName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const sortedProducts = response.data.products.sort((a, b) => a.defaultPrice - b.defaultPrice);
          setProductConfigs(sortedProducts);
        })
        .catch((error) => {
          console.error('Error fetching product configurations:', error);
        });
    }
  }, [userId, productName, token]);

  const handleToggle = (configId, enabled) => {
    // Update local state
    const updatedConfigs = productConfigs.map((config) => {
      if (config._id === configId) {
        return { ...config, enabled };
      }
      return config;
    });
    setProductConfigs(updatedConfigs);

    // Prepare data for the API request
    const updateData = {
      enabled,
    };

    // Send update to backend for a specific product
    if (token) {
      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/topup-toggles/${productName}/${configId}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log('Product updated successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error updating product:', error);
        });
    }
  };

  const handleMarkUpChange = (configId, event) => {
    // Logic to handle markup price change
  };

  const handleApplyDiscount = (configId) => {
    // Logic to apply discount
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Paper elevation={3} sx={{ padding: '20px', margin: 'auto', maxWidth: '800px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <IconButton onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', flexGrow: 1, textAlign: 'center' }}>
            Configure: {productName}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Default Price</TableCell>
                <TableCell align="right">Mark-Up</TableCell>
                <TableCell align="right">Apply</TableCell>
                <TableCell align="center">Toggle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productConfigs.map((config) => {
                console.log('Config: ', config);
                return (
                  <TableRow key={config._id}>
                    <TableCell>{config.name}</TableCell>
                    <TableCell align="right">{config.defaultPrice}</TableCell>
                    <TableCell align="right">
                      <TextField
                        variant="outlined"
                        size="small"
                        value={config.markup}
                        onChange={(e) => handleMarkUpChange(config._id, e)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" onClick={() => handleApplyDiscount(config._id)}>
                        Apply
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Switch checked={config.enabled} onChange={() => handleToggle(config._id, !config.enabled)} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TopUpConfig;