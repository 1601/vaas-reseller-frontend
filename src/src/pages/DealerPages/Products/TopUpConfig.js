import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SecureLS from 'secure-ls';
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
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserDataFetch from '../../../components/user-account/UserDataFetch';

const ls = new SecureLS({ encodingType: 'aes' });

const TopUpConfig = () => {
  const { productName } = useParams();
  const [productConfigs, setProductConfigs] = useState([]);
  const [filteredProductConfigs, setFilteredProductConfigs] = useState(productConfigs);
  const [dealerConfig, setDealerConfig] = useState({});
  const [markupInputValues, setMarkupInputValues] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingApplyButton, setIsLoadingApplyButton] = useState(null);
  const [failedApplyButton, setFailedApplyButton] = useState(null);
  const [successApplyButton, setSuccessApplyButton] = useState(null);

  const user = ls.get('user');
  const userId = user ? user._id : null;
  const userRole = user ? user.role : null;
  const navigate = useNavigate();
  const token = ls.get('token');
  UserDataFetch();

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/${userId}/${productName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          let products = [];
          let dealerConfig = [];
          if (userRole.toLowerCase() === 'dealer') {
            products = (response.data.products || []).map((p) => p._doc);
          } else if (userRole === 'reseller') {
            products = response.data.products || [];
            dealerConfig = response.data.dealer || [];
            setDealerConfig(dealerConfig);
            console.log('dealerConfig; ', dealerConfig);
            console.log('responsedata; ', response.data);
          }
          const sortedProducts = products.sort((a, b) => a.defaultPrice - b.defaultPrice);
          setProductConfigs(sortedProducts);
          setFilteredProductConfigs(sortedProducts); // Update the filtered configs here
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching product configurations:', error);
          setIsLoading(false);
        });
    } else {
      // pop up message
      window.alert('Token expired, please login again');
      setIsLoading(false);
      navigate('/login');
    }
  }, [userId, productName, token, userRole]);

  useEffect(() => {
    setFilteredProductConfigs(productConfigs);
    console.log('FilteredProductConfigs: ', productConfigs);
  }, [productConfigs]);

  // Function to calculate current price
  const calculateCurrentPrice = (defaultPrice, markUp) => {
    return Number(defaultPrice) + Number(markUp);
  };

  const handleToggle = (configId, enabled) => {
    const updateData = {
      enabled,
    };
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
          const updatedConfigs = productConfigs.map((config) => {
            if (config._id === configId) {
              return { ...config, enabled };
            }
            return config;
          });
          setProductConfigs(updatedConfigs);
        })
        .catch((error) => {
          console.error('Error updating product:', error);
          window.alert('Failed to update product');
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

  const handleApplyDiscount = (configId, rowIndex) => {
    setIsLoadingApplyButton(rowIndex);
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
                setIsLoadingApplyButton(null);
                setSuccessApplyButton(rowIndex);
                if (index === configIndex) {
                  return { ...config, markUp: newMarkUp, currentPrice: newCurrentPrice };
                }

                return config;
              })
            );
          })
          .catch((error) => {
            console.error('Error updating markup and current price:', error);
            setIsLoadingApplyButton(null);
            setFailedApplyButton(rowIndex);
            window.alert('Failed to update markup and current price');
          });
      }
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    if (event.target.value === 'name asc') {
      const sortedData = [...filteredProductConfigs].sort((a, b) => a.name.localeCompare(b.name));
      setFilteredProductConfigs(sortedData);
    }
    if (event.target.value === 'name desc') {
      const sortedData = [...filteredProductConfigs].sort((a, b) => b.name.localeCompare(a.name));
      setFilteredProductConfigs(sortedData);
    }
    if (event.target.value === 'current price desc') {
      const sortedData = [...filteredProductConfigs].sort((a, b) => b.currentPrice - a.currentPrice);
      setFilteredProductConfigs(sortedData);
    }
    if (event.target.value === 'current price asc') {
      const sortedData = [...filteredProductConfigs].sort((a, b) => a.currentPrice - b.currentPrice);
      setFilteredProductConfigs(sortedData);
    }
    if (event.target.value === 'default price desc') {
      const sortedData = [...filteredProductConfigs].sort((a, b) => b.defaultPrice - a.defaultPrice);
      setFilteredProductConfigs(sortedData);
    }
    if (event.target.value === 'default price asc') {
      const sortedData = [...filteredProductConfigs].sort((a, b) => a.defaultPrice - b.defaultPrice);
      setFilteredProductConfigs(sortedData);
    }
  };

  const handleFilterChange = (event, newValue) => {
    const foundProductConfigs = productConfigs.filter((store) => newValue.some((name) => store.name.includes(name)));
    setFilteredProductConfigs(newValue.length !== 0 ? foundProductConfigs : productConfigs);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Paper elevation={3} sx={{ padding: '20px', margin: 'auto', maxWidth: '100%', width: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <IconButton onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', flexGrow: 1, textAlign: 'center' }}>
            Configure: {productName}
          </Typography>
        </Box>
        <div className="flex">
          <Autocomplete
            className="w-4/5"
            multiple
            id="tags-filled"
            options={productConfigs.map((product) => product.name)}
            freeSolo
            onChange={handleFilterChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
            }
            renderInput={(params) => (
              <TextField {...params} variant="filled" label="Search product by name" placeholder="product" />
            )}
          />
          <FormControl className="w-1/5">
            <InputLabel id={'demo-simple-select-label'}>Sort By</InputLabel>
            <Select
              labelId={'demo-simple-select-label'}
              id="demo-simple-select"
              label="Sort By"
              value={sortBy}
              onChange={handleSortChange}
            >
              <MenuItem value={'name asc'}>Name (Asc)</MenuItem>
              <MenuItem value={'name desc'}>Name (Desc)</MenuItem>
              <MenuItem value={'current price desc'}>Current Price (Desc)</MenuItem>
              <MenuItem value={'current price asc'}>Current Price (Asc)</MenuItem>
              <MenuItem value={'default price desc'}>Default Price (Desc)</MenuItem>
              <MenuItem value={'default price asc'}>Default Price (Asc)</MenuItem>
            </Select>
          </FormControl>
        </div>
        <TableContainer>
          <Table sx={{ tableLayout: 'auto', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Default Price</TableCell>
                <TableCell align="right">Mark-Up | ₱</TableCell>
                <TableCell align="right">Apply to Mark-Up</TableCell>
                <TableCell align="right">Current Price</TableCell>
                <TableCell align="center">Toggle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredProductConfigs.map((config, index) => {
                  // Determine if the product is disabled by the dealer
                  let isDisabledByDealer = false;
                  if (userRole === 'reseller' && dealerConfig[productName]) {
                    if (dealerConfig[productName].products && dealerConfig[productName].products.length > 0) {
                      isDisabledByDealer = !dealerConfig[productName].products.some(
                        (product) => product.name === config.name && product.enabled
                      );
                    }
                  }
                  // Calculate current price
                  const calculatedCurrentPrice = calculateCurrentPrice(
                    config.defaultPrice,
                    markupInputValues[config._id] || config.markUp
                  );

                  return (
                    <TableRow
                      key={index}
                      sx={{
                        opacity: isDisabledByDealer ? 0.5 : 1,
                        position: 'relative',
                      }}
                    >
                      <TableCell sx={{ zIndex: isDisabledByDealer ? 0 : 1 }}>{config.name}</TableCell>
                      <TableCell align="right" sx={{ zIndex: isDisabledByDealer ? 0 : 1 }}>
                        ₱ {config.defaultPrice}
                      </TableCell>
                      <TableCell align="right" sx={{ zIndex: isDisabledByDealer ? 0 : 1 }}>
                        {isDisabledByDealer ? (
                          <Typography variant="subtitle1" sx={{ opacity: 0.5 }}>
                            Disabled by Dealer
                          </Typography>
                        ) : (
                          <TextField
                            variant="outlined"
                            size="small"
                            value={markupInputValues[config._id] || config.markUp.toString()}
                            onChange={(e) => {
                              let inputValue = e.target.value.replace(/[^0-9.]/g, '');

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
                            disabled={isDisabledByDealer}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right" sx={{ zIndex: isDisabledByDealer ? 0 : 1 }}>
                        <LoadingButton
                          loading={isLoadingApplyButton === index}
                          variant="outlined"
                          color={
                            successApplyButton === index ? 'success' : failedApplyButton === index ? 'error' : 'primary'
                          }
                          onClick={() => handleApplyDiscount(config._id, index)}
                          disabled={isDisabledByDealer} // Disable button if row is disabled
                        >
                          Apply
                        </LoadingButton>
                      </TableCell>
                      <TableCell align="right" sx={{ zIndex: isDisabledByDealer ? 0 : 1 }}>
                        ₱ {calculatedCurrentPrice}
                      </TableCell>
                      <TableCell align="center" sx={{ zIndex: isDisabledByDealer ? 0 : 1 }}>
                        <Switch
                          checked={config.enabled}
                          onChange={() => handleToggle(config._id, !config.enabled)}
                          disabled={isDisabledByDealer}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TopUpConfig;
