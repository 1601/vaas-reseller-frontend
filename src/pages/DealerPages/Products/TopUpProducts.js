import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Switch, FormControlLabel, Grid, Paper, Typography, TextField } from '@mui/material';
import CircularLoading from '../../../components/preLoader';
import TopUpImage from '../../../components/vortex/TopUpImage';

const TopUpProducts = () => {
  const [topUpToggles, setTopUpToggles] = useState({
    SMARTPH: true,
    TNTPH: true,
    PLDTPH: true,
    GLOBE: true,
    MERALCO: true,
    CIGNAL: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userId = JSON.parse(localStorage.getItem('user'))._id;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/dealer/topup-toggles/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedToggles = response.data;
        setTopUpToggles((prevState) => ({
          ...prevState,
          ...fetchedToggles,
        }));
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
      [name]: checked,
    }));

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
    navigate(`/dashboard/products/top-up/${productName}`);
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
              <Paper
                elevation={3}
                sx={{
                  padding: '10px',
                  textAlign: 'center',
                  backgroundColor: topUpToggles[key] ? 'transparent' : 'lightgrey',
                  opacity: topUpToggles[key] ? '1' : '0.5',
                }}
              >
                <Typography variant="h6">{key}</Typography>
                <TopUpImage title={key} style={{ filter: topUpToggles[key] ? 'none' : 'grayscale(100%)' }} />
                <Button
                  variant="contained"
                  disabled={!topUpToggles[key]} 
                  sx={{
                    ...configureButtonStyle,
                    backgroundColor: topUpToggles[key] ? 'skyblue' : 'grey',
                    '&:hover': {
                      backgroundColor: topUpToggles[key] ? 'lightblue' : 'grey',
                    },
                    marginBottom: '10px',
                  }}
                  onClick={() => handleConfigure(key)}
                >
                  Configure
                </Button>
                <FormControlLabel
                  control={<Switch checked={topUpToggles[key]} onChange={handleToggleChange} name={key} />}
                  label={topUpToggles[key] ? 'Enabled' : 'Disabled'}
                  sx={{ marginTop: '10px' }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default TopUpProducts;
