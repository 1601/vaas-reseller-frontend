import React, { useState, useRef } from 'react';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Checkbox from '@mui/material/Checkbox';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddLinkIcon from '@mui/icons-material/AddLink';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CardContent from '@mui/material/CardContent';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import KycImage from '../images/Rectangle 52.png'
import { postDataKyc, putFileKyc } from '../api/public/kyc'

const steps = [
  'What is KYC?',
  'General Information',
  'Business Information',
  'Statement of acceptance'
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const fileInputRef = useRef(null);
  const [textFields, setTextFields] = useState([]);
  const [newTextField, setNewTextField] = useState('');

  const handleAddTextField = () => {
    setTextFields([...textFields, newTextField]);
    setNewTextField(''); // Clear the input field after adding
  };

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Send formData to the backend API
    const result = await postDataKyc(formData);
    if (result.status === 200) {
      // Submit File 
      const fileResult = await putFileKyc(selectedFile)
      console.log(fileResult.status)
    }

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
      <Card style={{ paddingTop: '50px', paddingBottom: '50px' }}>
        <Box sx={{ width: '100%', backgroundColor: 'white' }}>
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
                <Typography variant="h3" style={{ color: "#BA61E8" }}>Welcome to Vortex!</Typography>
                <img className="mx-auto" src={KycImage} width="150" height="auto" alt="Hero" />
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
              </Container>
            )}
            {activeStep === 1 && (
              <div>
                {/* Step 2: General Information */}
                <Container maxWidth="md" style={{ textAlign: "left", marginTop: "50px" }}>
                  <Typography variant="h6" style={{ marginBottom: '10px' }}>General Information</Typography>
                  <form>
                    {/* Customer Service Number */}
                    <Typography variant="body1"> Customer Service Number </Typography>
                    <Typography variant="caption" style={{ color: '#888e99' }}> This is a landline or mobile number your customer can contact</Typography>
                    <TextField
                      fullWidth
                      label="Enter service number"
                      variant="outlined"
                      margin="normal"
                      placeholder="+639178901234 or 0289871234"
                      name="customerServiceNumber"
                      value={formData.customerServiceNumber}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton>
                              <LocalPhoneIcon /> {/* Replace with your desired icon */}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Street Address */}
                    <Typography variant="body1"> Business Address</Typography>
                    <TextField
                      fullWidth
                      label="Street Address"
                      variant="outlined"
                      margin="normal"
                      placeholder="Enter street address"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton>
                              <HomeIcon /> {/* Replace with your desired icon */}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* City Address */}
                    <Box style={{ display: "flex", gap: '1em' }}>
                      <TextField
                        fullWidth
                        label="City Address"
                        variant="outlined"
                        margin="normal"
                        placeholder="Enter city address"
                        name="cityAddress"
                        value={formData.cityAddress}
                        onChange={handleInputChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton>
                                <LocationCityIcon /> {/* Replace with your desired icon */}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
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
                    </Box>

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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton>
                              <PeopleAltIcon /> {/* Replace with your desired icon */}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Typography variant="body1" style={{ marginTop: "30px" }}> Online Presence </Typography>
                    <Typography variant="caption" style={{ color: '#888e99' }}> Help us get to know your businese more by
                      providing atleast one link for either business website or social media
                      account
                    </Typography>
                    <Typography variant="body2" style={{ marginTop: "20px" }}>Business website or social media</Typography>
                    <Typography variant="caption" style={{ color: '#888e99' }}>Provide the link/s of your website
                      and/ or social media where you conduct business with your customers.
                      Business pages with your catalog of products and services are preferred
                    </Typography>
                    {/* Website links  */}
                    <TextField
                      fullWidth
                      label="Link"
                      variant="outlined"
                      margin="normal"
                      placeholder="e.g. https://vortex.com"
                      name="uniqueIdentifier"
                      value={formData.uniqueIdentifier}
                      onChange={handleInputChange}
                    />
                    {textFields.map((text, index) => (
                      <TextField
                        fullWidth
                        label="Link"
                        variant="outlined"
                        margin="normal"
                        placeholder="e.g. https://vortex.com"
                        name="uniqueIdentifier"
                        value={formData.uniqueIdentifier}
                        onChange={handleInputChange}
                        key={index}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <DeleteForeverIcon /> {/* Replace with your desired icon */}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    ))}
                    <Button style={{ color: "#BA61E8", fontSize: '.7rem' }} onClick={handleAddTextField}><AddLinkIcon /> Add another link</Button>

                    <Typography variant='body2' style={{ marginTop: '30px' }}> Preferred Business Handle</Typography>
                    <Typography variant='caption' style={{ color: "#BA61E8" }}> This unique identifier is like a Vortex username for your business. Note that you can't change this in the future.</Typography>
                    <Box>
                      <Typography variant='caption' style={{ color: "#BA61E8" }}> Use letter a - z, numbers 0-9 and dashes(-). No spaces and special character allowed</Typography>
                      {/* Unique Identifier */}
                      <TextField
                        fullWidth
                        label="Unique Identifier"
                        variant="outlined"
                        margin="normal"
                        placeholder="e.g. org-Dfcdk3TgsG5nuW4"
                        name="uniqueIdentifier"
                        value={formData.uniqueIdentifier}
                        onChange={handleInputChange}
                      />
                    </Box>
                  </form>
                </Container>
              </div>
            )}
            {activeStep === 2 && (
              <div style={{ marginTop: '50px', textAlign: 'start' }}>
                {/* Step 3: Business Information */}
                <Container maxWidth="md" style={{ marginTop: "50px" }}>
                  <Typography variant="h6">Business Information</Typography>
                  <Typography variant="caption"> Provide more details about your business. We ask questions specific to your business type.</Typography>
                  <Box style={{
                    marginTop: "40px",
                    border: "solid 2px #e0e0e0",
                    borderRadius: "20px",
                    padding: "30px"
                  }}>
                    <Typography> Choose your type of business</Typography>
                    <Typography variant="caption"> Select appropriately to avoid delays in your application. This will be reviewd by our Onboarding team.</Typography>
                    <Box style={{
                      display: 'flex',
                      gap: '10px',
                      textAlign: "center",
                      marginTop: "30px",
                    }}>
                      <Card style={{ width: '50%', height: '300px' }}>
                        <CardContent>
                          <PersonIcon style={{ fontSize: "4rem" }} />
                          <Typography variant="h5" component="div">
                            Individual
                          </Typography>
                          <Typography color="text.secondary">
                            You are the only owner of a business, and you are not registered with the DTI.
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card style={{ width: '50%', height: '300px' }}>
                        <CardContent>
                          <AccountBoxIcon style={{ fontSize: "4rem" }} />
                          <Typography variant="h5" component="div">

                            Sole Proprietorship
                          </Typography>
                          <Typography color="text.secondary">
                            You are the sole owner of the business, and you have it registered with the DTI.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                    <Box style={{ display: 'flex', gap: '10px', textAlign: "center", marginTop: "10px" }}>
                      <Card style={{ width: '50%', height: '300px' }}>
                        <CardContent>
                          <GroupIcon style={{ fontSize: "4rem" }} />
                          <Typography variant="h5" component="div">
                            Partnership
                          </Typography>
                          <Typography color="text.secondary">
                            Your businese owner by two or more individuals or partners, and it is registered with the SEC.
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card style={{ width: '50%', height: '300px' }}>
                        <CardContent>
                          <CorporateFareIcon style={{ fontSize: "4rem" }} />
                          <Typography variant="h5" component="div">
                            Corporation
                          </Typography>
                          <Typography color="text.secondary">
                            Your business is owned by a corporate entity and is registered with the SEC.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>

                    {/* <TextField
                    label="Business Type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                  />
                  Add other Business Information fields here */}
                  </Box>
                </Container>
              </div>
            )}
            {activeStep === 3 && (
              <div style={{ marginTop: '50px', textAlign: 'start' }}>
                <Container maxWidth="md" style={{ marginTop: "50px" }}>
                  <Typography variant="h6"> Sole Proprietorship - Business Information</Typography>
                  <Typography variant="caption"> Details about your business like bank details, business documents and others</Typography>
                  <div style={{ marginTop: '20px' }}>
                    <Typography> Upload IDs</Typography>
                    <Typography variant="caption"> Guidlines for uploading IDs</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                      <Typography variant="body1">
                        Do not submit expried IDs.
                      </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                      <Typography variant="body1">
                        Make sure all informations are legible. Do not censor, black out or redact any data.
                      </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                      <Typography variant="body1">
                        Do not crop the ID. all corners of the ID should be visible againts the backdrop.
                      </Typography>
                    </div>

                    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                      <Typography variant='subtitle1'> Valid Identification Documents</Typography>
                      <Typography variant='caption'> Upload one(1) Primary ID or two(2) Secondary IDs( only if you cannot provide a primary ID)</Typography>
                    </div>

                    <div style={{ border: 'solid 2px #e0e0e0', borderRadius: '10px', padding: '10px' }}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-input"
                      />
                      {/* <label htmlFor="file-input"> */}
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        Select File
                      </Button>
                      {/* </label> */}
                      {selectedFile && (
                        <p>Selected File: {selectedFile.name}</p>
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <Typography> Upload Documents </Typography>
                    <Typography variant="caption"> Guidlines for uploading documents</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                      <Typography variant="body1">
                        The documents must be in clear copies in color.
                      </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                      <Typography variant="body1">
                        Make sure the documents have complete pages
                      </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                      <Typography variant="body1">
                        The documents must not be redacted. All informations are visible
                      </Typography>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                      <Typography variant="body1">
                        All corners of the documents are visible againts the backdrop.
                      </Typography>
                    </div>

                    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
                      <Typography variant='subtitle1'> Valid Identification Documents</Typography>
                      <Typography variant='caption'> Upload one(1) Primary ID or two(2) Secondary IDs( only if you cannot provide a primary ID)</Typography>
                    </div>

                    <div style={{ border: 'solid 2px #e0e0e0', borderRadius: '10px', padding: '10px' }}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-input"
                      />
                      {/* <label htmlFor="file-input"> */}
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
                      >
                        Select File
                      </Button>
                      {/* </label> */}
                      {selectedFile && (
                        <p>Selected File: {selectedFile.name}</p>
                      )}
                    </div>
                  </div>
                </Container>
              </div>
            )}
            <div style={{ marginTop: '50px' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="outlined"
                color="primary"
                style={{ color: "white", backgroundColor: "#873EC0" }}
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
