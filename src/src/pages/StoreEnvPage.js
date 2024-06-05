import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
import {
  Container, Card, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Checkbox, Stack, CircularProgress, Alert, AlertTitle, Box
} from '@mui/material';
import { Formik, Form } from 'formik';
import { currencies } from '../utils/currencies';

const ls = new SecureLS({ encodingType: 'aes' });
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const StoreEnvPage = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: '', message: '' });

  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        const token = ls.get('token');
        const response = await axios.get(`${API_BASE_URL}/v1/api/stores/owner`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStoreData(response.data);
      } catch (error) {
        console.error('Failed to fetch store data', error);
        setAlert({ open: true, severity: 'error', message: 'Failed to fetch store data' });
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  const handleSave = async (values, { setSubmitting }) => {
    setLoading(true);
    const token = ls.get('token');
    try {
      const ownerId = storeData.ownerId;
      const requestBody = { platformVariables: values };
      const response = await axios.put(`${API_BASE_URL}/v1/api/dealer/${ownerId}/platvar`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      setStoreData((prevData) => ({
        ...prevData,
        platformVariables: values,
      }));
      setAlert({ open: true, severity: 'success', message: 'Platform variables updated successfully' });
    } catch (error) {
      console.error('Failed to update platform variables:', error.message);
      setAlert({ open: true, severity: 'error', message: 'Failed to update platform variables' });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container>
     
      <Typography variant="h4" gutterBottom>
        Store Forex
      </Typography>
      {alert.open && (
        <Alert severity={alert.severity} onClose={() => setAlert({ open: false, severity: '', message: '' })} style={{ position: 'relative', top: 0, left: 0, width: '100%', zIndex: 1300 }}>
          <AlertTitle>{alert.severity === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {alert.message}
        </Alert>
      )}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : storeData ? (
        <Formik
          initialValues={{
            currencySymbol: storeData.platformVariables.currencySymbol || '',
            billsCurrencyToPeso: storeData.platformVariables.billsCurrencyToPeso || 0,
            topupCurrencyToPeso: storeData.platformVariables.topupCurrencyToPeso || 0,
            giftCurrencyToPeso: storeData.platformVariables.giftCurrencyToPeso || 0,
            billsConvenienceFee: storeData.platformVariables.billsConvenienceFee || 0,
            topupConvenienceFee: storeData.platformVariables.topupConvenienceFee || 0,
            giftConvenienceFee: storeData.platformVariables.giftConvenienceFee || 0,
            enableLoad: storeData.platformVariables.enableLoad || false,
            enableBills: storeData.platformVariables.enableBills || false,
            enableGift: storeData.platformVariables.enableGift || false,
          }}
          onSubmit={handleSave}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form>
              <Card style={{ padding: '20px', marginBottom: '20px' }}>
                <Stack spacing={2}>
                  <Typography variant={"h5"}>Manage Store Forex</Typography>
                  <FormControl required>
                    <InputLabel>Currency symbol</InputLabel>
                    <Select
                      value={values.currencySymbol}
                      name={"currencySymbol"}
                      onChange={handleChange}
                    >
                      {currencies.map((v) => (
                        <MenuItem key={v.cc} value={v.cc}>{`(${v.cc}) ${v.name}`}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    required
                    type={"number"}
                    name={"billsCurrencyToPeso"}
                    label={"Bills Currency To Peso"}
                    value={values.billsCurrencyToPeso}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    type={"number"}
                    name={"topupCurrencyToPeso"}
                    label={"Topup Currency To Peso"}
                    value={values.topupCurrencyToPeso}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    type={"number"}
                    name={"giftCurrencyToPeso"}
                    label={"Gift Currency To Peso"}
                    value={values.giftCurrencyToPeso}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    type={"number"}
                    name={"billsConvenienceFee"}
                    label={"Bills Convenience Fee"}
                    value={values.billsConvenienceFee}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    type={"number"}
                    name={"topupConvenienceFee"}
                    label={"Topup Convenience Fee"}
                    value={values.topupConvenienceFee}
                    onChange={handleChange}
                  />
                  <TextField
                    required
                    type={"number"}
                    name={"giftConvenienceFee"}
                    label={"Gift Convenience Fee"}
                    value={values.giftConvenienceFee}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    label="Topup service"
                    control={
                      <Checkbox
                        name={'enableLoad'}
                        checked={values.enableLoad}
                        onChange={handleChange}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Bills payment service"
                    control={
                      <Checkbox
                        name={'enableBills'}
                        checked={values.enableBills}
                        onChange={handleChange}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Voucher / Gift service"
                    control={
                      <Checkbox
                        name={'enableGift'}
                        checked={values.enableGift}
                        onChange={handleChange}
                      />
                    }
                  />
                </Stack>
                <Box display="flex" alignItems="center" marginTop="20px">
                  <Button type={'submit'} disabled={isSubmitting} variant="outlined" color="primary">
                    {isSubmitting ? "Please wait..." : "Save"}
                  </Button>
                  {isSubmitting && <CircularProgress size={24} style={{ marginLeft: '20px' }} />}
                </Box>
              </Card>
            </Form>
          )}
        </Formik>
      ) : (
        <Typography>No store data available</Typography>
      )}
    </Container>
  );
};

export default StoreEnvPage;
