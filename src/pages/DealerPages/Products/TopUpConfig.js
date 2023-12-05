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
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TopUpConfig = ({ token }) => {
  const { productName } = useParams();
  const [productConfigs, setProductConfigs] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/${userId}/${productName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProductConfigs(response.data.products);
      })
      .catch((error) => {
        console.error('Error fetching product configurations:', error);
      });
  }, [userId, productName, token]);

  const handleToggle = (configId, enabled) => {
    // Logic to handle toggle change
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
                <TableCell align="right">Mark-Up Price</TableCell>
                <TableCell align="right">Discount</TableCell>
                <TableCell align="center">Toggle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productConfigs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>{config.name}</TableCell>
                  <TableCell align="right">{config.defaultPrice}</TableCell>
                  <TableCell align="right">{config.markup}</TableCell>
                  <TableCell align="right">{config.discount}</TableCell>
                  <TableCell align="center">
                    <Switch checked={config.enabled} onChange={() => handleToggle(config.id, !config.enabled)} />
                  </TableCell> 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TopUpConfig;
