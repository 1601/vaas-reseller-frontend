import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SecureLS from 'secure-ls';
import { Stack, Box, Button, Switch, FormControlLabel, Grid, Paper, Typography, TextField } from '@mui/material';
import CircularLoading from '../../../components/preLoader';
import TopUpImage from '../../../components/vortex/TopUpImage';

const ls = new SecureLS({ encodingType: 'aes' });

const TopUpProducts = () => {
  const [topUpToggles, setTopUpToggles] = useState({
    SMARTPH: { enabled: true, details: null, products: [] },
    TNTPH: { enabled: true, details: null, products: [] },
    PLDTPH: { enabled: true, details: null, products: [] },
    GLOBE: { enabled: true, details: null, products: [] },
    MERALCO: { enabled: true, details: null, products: [] },
    CIGNAL: { enabled: true, details: null, products: [] },
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const token = ls.get('token');
  const userId = ls.get('user') ? ls.get('user')._id : null;
  const user = ls.get('user') ? ls.get('user') : null;
  const role = user ? user.role : null;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/topup-toggles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedData = response.data;
        const filteredToggles = {
          SMARTPH: fetchedData.SMARTPH,
          TNTPH: fetchedData.TNTPH,
          PLDTPH: fetchedData.PLDTPH,
          GLOBE: fetchedData.GLOBE,
          MERALCO: fetchedData.MERALCO,
          CIGNAL: fetchedData.CIGNAL,
        };
        console.log('Filtered Toggles: ', filteredToggles);
        setTopUpToggles(filteredToggles);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching topup toggles:', error);
        setIsLoading(false);
      });
  }, [token, userId]);

  const handleToggleChange = (event) => {
    const { name, checked } = event.target;

    setTopUpToggles((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name], enabled: checked },
    }));

    // Delay the PUT request until state is updated
    setTimeout(() => {
      const updatedToggles = Object.keys(topUpToggles).reduce((acc, key) => {
        acc[key] = key === name ? { ...topUpToggles[key], enabled: checked } : { ...topUpToggles[key] };
        return acc;
      }, {});

      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/topup-toggles`,
          { topupToggles: updatedToggles },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          // setTopUpToggles(response.data.topupToggles);
        })
        .catch((error) => console.error('Error updating topup toggles:', error));
    }, 0);
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
    const basePath = role === 'reseller' ? '/dashboard/reseller/products/top-up/' : '/dashboard/products/top-up/';
    navigate(`${basePath}${productName}`);
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
          {Object.entries(topUpToggles).map(([key, { enabled, dealerConfig }]) => (
            <Grid hidden={role === 'reseller' && !dealerConfig?.enabled} item xs={12} sm={6} md={4} key={key}>
              <Paper
                elevation={3}
                sx={{
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  backgroundColor: role === 'reseller' && dealerConfig?.enabled === false ? 'lightgrey' : 'transparent',
                  opacity: role === 'reseller' && dealerConfig?.enabled === false ? '0.5' : '1',
                }}
              >
                <Typography variant="h6">{key}</Typography>
                <TopUpImage
                  title={key}
                  style={{ filter: topUpToggles[key] ? 'none' : 'grayscale(100%)', marginBottom: '10px' }}
                />
                <Stack direction="column" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                  {/* Configure Button */}
                  <Box width="100%" sx={{ maxWidth: '150px' }}>
                    <Button
                      variant="contained"
                      disabled={!enabled || (role === 'reseller' && dealerConfig?.enabled === false)}
                      sx={{
                        ...configureButtonStyle,
                        width: '100%',
                      }}
                      onClick={() => handleConfigure(key)}
                    >
                      Configure
                    </Button>
                  </Box>
                  {/* Toggle Switch */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={topUpToggles[key]?.enabled || false}
                        onChange={handleToggleChange}
                        name={key}
                        disabled={role === 'reseller' && dealerConfig?.enabled === false}
                      />
                    }
                    label={
                      <Typography color={role === 'reseller' && !dealerConfig?.enabled ? 'error' : 'inherit'}>
                        {role === 'reseller' && !dealerConfig?.enabled
                          ? 'Disabled by Dealer'
                          : enabled
                          ? 'Enabled'
                          : 'Disabled'}
                      </Typography>
                    }
                  />
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default TopUpProducts;
