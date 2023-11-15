import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch, FormControlLabel, Grid, Paper, Typography } from '@mui/material';

const TopUpProducts = () => {
  const [topUpToggles, setTopUpToggles] = useState({
    SMARTPH: true,
    TNTPH: true,
    PLDTPH: true,
    GLOBE: true,
    MERALCO: true,
    CIGNAL: true,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/topup-toggles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTopUpToggles(response.data);
      })
      .catch((error) => console.error('Error fetching topup toggles:', error));
  }, [token]);

  const handleToggleChange = (event) => {
    const { name, checked } = event.target;
    setTopUpToggles((prevState) => ({ ...prevState, [name]: checked }));

    console.log('Headers for PUT request:', { Authorization: `Bearer ${token}` }); // Log headers for PUT request

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/topup-toggles`,
        { topupToggles: { ...topUpToggles, [name]: checked } },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch((error) => console.error('Error updating topup toggles:', error));
  };

  return (
    <Grid container spacing={2}>
      {Object.entries(topUpToggles).map(([key, value]) => (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h6">{key}</Typography>
            <FormControlLabel
              control={<Switch checked={value} onChange={handleToggleChange} name={key} />}
              label={value ? 'Enabled' : 'Disabled'}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopUpProducts;
