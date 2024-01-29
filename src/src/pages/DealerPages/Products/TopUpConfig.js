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
  const [markupInputValues, setMarkupInputValues] = useState({});

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
          // console.log('Response data:', response.data);
          const sortedProducts = (response.data.products || [])
            .map((p) => p._doc)
            .sort((a, b) => a.defaultPrice - b.defaultPrice);
          setProductConfigs(sortedProducts);

          sortedProducts.forEach((product) => {
            // console.log(`Markup for product ${product.name}:`, product.markUp);
          });
        })
        .catch((error) => {
          console.error('Error fetching product configurations:', error);
        });
    }
  }, [userId, productName, token]);

  // Function to calculate current price
  const calculateCurrentPrice = (defaultPrice, markUp) => {
    return Number(defaultPrice) + Number(markUp);
  };

  const handleToggle = (configId, enabled) => {
    const updatedConfigs = productConfigs.map((config) => {
      if (config._id === configId) {
        return { ...config, enabled };
      }
      return config;
    });
    setProductConfigs(updatedConfigs);

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
          // console.log('Product updated successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error updating product:', error);
        });
    }
  };

  const handleMarkUpChange = (configId, newValue) => {
    const valueToSet = newValue === '' ? '0' : newValue;

    setMarkupInputValues((prevValues) => ({
      ...prevValues,
      [configId]: valueToSet,
    }));
  };

  const handleApplyDiscount = (configId) => {
    const newMarkUp = markupInputValues[configId] !== undefined ? markupInputValues[configId] : '0';
    const configIndex = productConfigs.findIndex((config) => config._id === configId);

    if (configIndex !== -1) {
      const config = productConfigs[configIndex];
      const newCurrentPrice = calculateCurrentPrice(config.defaultPrice, newMarkUp);

      const updateData = {
        markUp: newMarkUp,
        currentPrice: newCurrentPrice,
      };

      if (token) {
        axios
          .put(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/${userId}/${productName}/${configId}`,
            updateData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            // console.log('Markup and current price updated successfully:', response.data);
            setProductConfigs((prevConfigs) =>
              prevConfigs.map((config, index) => {
                if (index === configIndex) {
                  return { ...config, markUp: newMarkUp, currentPrice: newCurrentPrice };
                }
                return config;
              })
            );
          })
          .catch((error) => {
            console.error('Error updating markup and current price:', error);
          });
      }
    }
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
                <TableCell align="right">Mark-Up | ₱</TableCell>
                <TableCell align="right">Apply</TableCell>
                <TableCell align="right">Current Price</TableCell>
                <TableCell align="center">Toggle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productConfigs.map((config) => {
                const calculatedCurrentPrice = calculateCurrentPrice(
                  config.defaultPrice,
                  markupInputValues[config._id] || config.markUp
                );

                return (
                  <TableRow key={config._id}>
                    <TableCell>{config.name}</TableCell>
                    <TableCell align="right">₱ {config.defaultPrice}</TableCell>
                    <TableCell align="right">
                      <TextField
                        variant="outlined"
                        size="small"
                        value={markupInputValues[config._id] || config.markUp.toString()}
                        onChange={(e) => {
                          let inputValue = e.target.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters

                          if (inputValue.startsWith('0') && inputValue.length > 1) {
                            inputValue = inputValue.substring(1);
                          }

                          handleMarkUpChange(config._id, inputValue);
                        }}
                        placeholder="Enter markup"
                        InputProps={{
                          startAdornment: <span style={{ marginRight: '8px' }}>₱</span>,
                        }}
                        style={{ opacity: config.markUp !== undefined ? 1 : 0.5 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" onClick={() => handleApplyDiscount(config._id)}>
                        Apply
                      </Button>
                    </TableCell>
                    <TableCell align="right">₱ {calculatedCurrentPrice}</TableCell>
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
