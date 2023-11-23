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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TopUpConfig = ({ token }) => {
  const { productName } = useParams();
  const [productConfigs, setProductConfigs] = useState([]);
  const [productConfig, setProductConfig] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))._id;

  const defaultConfig = {
    defaultPrice: 'N/A',
    markup: '0',
    discount: '0',
  };

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/${userId}/${productName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProductConfigs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product configurations:', error);
      });
  }, [userId, token]);

  const handleToggle = (configId, enabled) => {
    // Logic to handle toggle change
  };

  const handleSave = () => {
    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/${userId}/${productName}`, productConfig, {
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
                  <TableCell>{config.productName}</TableCell>
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
