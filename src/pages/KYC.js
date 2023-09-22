import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Card } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const steps = [
  'What is KYC?',
  'General Information',
  'Business Information',
  'Statement of acceptance',
];

const initialFormData = {
  customerServiceNumber: '',
  streetAddress: '',
  cityAddress: '',
  regionAddress: '',
  zipCodeAddress: '',
  physicalStore: false,
  numberOfEmployees: 0,
  uniqueIdentifier: '',
  businessType: '',
  idLink: '',
  documentLink: '',
};

export default function KYC() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Handle different input types (text, checkbox, number)
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = () => {
    // Send formData to the backend API
    console.log('Submitting formData:', formData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };


  const isLastStep = activeStep === steps.length - 1;

  return (
    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Card>
        <Box sx={{ width: '100%', backgroundColor: 'white'}}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <form onSubmit={(e) => e.preventDefault()}>
            {activeStep === 0 && (
              <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
              <Typography variant="h4">Welcome to Vortex</Typography>
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                  <Typography variant="body1">
                    Please provide the necessary information and documents to avoid delays in your activation
                  </Typography>
                </div>
        
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                  <Typography variant="body1">
                    Upon submission, please give our team up to 7 working days to review your application
                  </Typography>
                </div>
        
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                  <Typography variant="body1">
                    Please make sure that your business is not part of our list of Restricted Business
                  </Typography>
                </div>
              </div>
        
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            </Container>
            )}
            {activeStep === 1 && (
              <div>
                {/* Step 2: General Information */}
                <Container maxWidth="md">
                  <Typography variant="h4">General Information</Typography>
                  <form>
                    {/* Customer Service Number */}
                    <TextField
                      fullWidth
                      label="Customer Service Number"
                      variant="outlined"
                      margin="normal"
                      placeholder="Enter customer service number"
                      name="customerServiceNumber"
                      value={formData.customerServiceNumber}
                      onChange={handleInputChange}
                    />

                    {/* Street Address */}
                    <TextField
                      fullWidth
                      label="Street Address"
                      variant="outlined"
                      margin="normal"
                      placeholder="Enter street address"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                    />

                    {/* City Address */}
                    <TextField
                      fullWidth
                      label="City Address"
                      variant="outlined"
                      margin="normal"
                      placeholder="Enter city address"
                      name="cityAddress"
                      value={formData.cityAddress}
                      onChange={handleInputChange}
                    />

                    {/* Region Address */}
                    <TextField
                      fullWidth
                      label="Region Address"
                      variant="outlined"
                      margin="normal"
                      placeholder="Enter region address"
                      name="regionAddress"
                      value={formData.regionAddress}
                      onChange={handleInputChange}
                    />

                    {/* Zip Code Address */}
                    <TextField
                      fullWidth
                      label="Zip Code Address"
                      variant="outlined"
                      margin="normal"
                      placeholder="Enter zip code"
                      name="zipCodeAddress"
                      value={formData.zipCodeAddress}
                      onChange={handleInputChange}
                    />

                    {/* Physical Store Checkbox */}
                    <FormControlLabel
                      control={<Checkbox name="physicalStore" checked={formData.physicalStore} onChange={handleInputChange} />}
                      label="Do you have a physical store?"
                    />

                    {/* Number of Employees */}
                    <TextField
                      fullWidth
                      label="Number of Employees"
                      variant="outlined"
                      margin="normal"
                      placeholder="Enter number of employees"
                      name="numberOfEmployees"
                      type="number"
                      value={formData.numberOfEmployees}
                      onChange={handleInputChange}
                    />

                    {/* Unique Identifier */}
                    <TextField
                      fullWidth
                      label="Unique Identifier"
                      variant="outlined"
                      margin="normal"
                      placeholder="Enter unique identifier"
                      name="uniqueIdentifier"
                      value={formData.uniqueIdentifier}
                      onChange={handleInputChange}
                    />
                  </form>
                </Container>
              </div>
            )}
            {activeStep === 2 && (
              <div>
                {/* Step 3: Business Information */}
                <TextField
                  label="Business Type"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                />
                {/* Add other Business Information fields here */}
              </div>
            )}
            {activeStep === 3 && (
              <div>
                {/* Step 4: Statement of Acceptance */}
                <TextField
                  label="Unique Identifier"
                  name="uniqueIdentifier"
                  value={formData.uniqueIdentifier}
                  onChange={handleChange}
                />
                {/* Add other Statement of Acceptance fields here */}
              </div>
            )}
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={isLastStep ? handleSubmit : handleNext}
              >
                {isLastStep ? 'Submit' : 'Next'}
              </Button>
            </div>
          </form>
        </Box>
      </Card>
    </Container>
  );
}
