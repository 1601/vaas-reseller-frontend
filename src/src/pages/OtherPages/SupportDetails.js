import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';

const SupportDetails = () => {
  return (
    <Container>
      <Box mt={4} mb={4}>
        <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h4" style={{ marginBottom: '20px' }}>Support Contact Details</Typography>
          <Typography variant="h5">VAAS Program Support</Typography>
          <Card style={{ marginTop: '10px', padding: '15px' }}>
            <CardContent>
              <Typography variant="h6">Email Support:</Typography>
              <Typography paragraph>support@vaas.com</Typography>
              <Typography variant="h6">Phone Support:</Typography>
              <Typography paragraph>+1 800 555 1234</Typography>
              <Typography variant="h6">Live Chat:</Typography>
              <Typography paragraph>Available 24/7 on our website</Typography>
            </CardContent>
          </Card>
        </Card>
      </Box>
    </Container>
  );
};

export default SupportDetails;
