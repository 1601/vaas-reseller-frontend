import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {Alert, Card} from '@mui/material';
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
import CircularProgress from '@mui/material/CircularProgress';
import PlaceIcon from '@mui/icons-material/Place';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { useDropzone } from 'react-dropzone';
import KycImage from '../images/Rectangle 52.png';
import UnderReview from '../images/underReview.jpeg';
import Approved from '../images/approved.png';
import { postDataKyc, putFileKyc, autoCompleteAddress, kycSubmittedstatus } from '../api/public/kyc';
import ListDialog from '../components/dealer/ListDialog';

const ls = new SecureLS({ encodingType: 'aes' });

const Responsive = styled('Typography')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '.6rem',
  },
}));

const HoverableCard = styled(Card)`
  width: 100%;
  height: 300px;
  transition: 0.3s; /* Add a smooth transition effect on hover */

  color: ${(props) => (props.active ? '#BA61E8' : 'initial')}; /* Initial background color */
  box-shadow: ${(props) =>
    props.active ? '0px 0px 5px 0px rgba(0, 0, 0, 0.75)' : 'none'}; /* Box shadow when active */

  &:hover {
    background-color: #f0f0f0; /* New background color on hover */
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75); /* Box shadow on hover */
    cursor: pointer; /* Change cursor to pointer on hover (optional) */
    color: #ba61e8;
  }
`;

const HoverableButton = styled(Box)`
  transition: 0.3s; /* Add a smooth transition effect on hover */
  &:hover {
    border: 2px solid #e0e0e0; /* Remove quotes and use camelCase */
    border-radius: 10px; /* Remove quotes and use camelCase */
    padding: 10px; /* Remove quotes and use camelCase */
  }
`;

const steps = ['What is KYC?', 'General Information', 'Business Information', 'Statement of acceptance'];

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

const initialErrorMessage = {
  customerServiceNumber: '',
  streetAddress: '',
  cityAddress: '',
  regionAddress: '',
  zipCodeAddress: '',
  numberOfEmployees: '',
  uniqueIdentifier: '',
  externalLinkAccount: '',
};
const CircularLoading = () => (
  <>
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        opacity: 0.5,
        zIndex: 1,
      }}
    />
    <Box
      sx={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        textAlign: 'center',
        color: '#fff',
      }}
    >
      <CircularProgress size={70} />
      <Typography variant="h4">Uploading Files</Typography>
    </Box>
  </>
);

const CircularLoadingSuccess = () => (
    <>
      <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            opacity: 0.5,
            zIndex: 1,
          }}
      />
      <Box
          sx={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            textAlign: 'center',
            color: '#fff',
          }}
      >
        <Typography variant="h6">Upload Success</Typography>
        <Button variant="contained" color="primary" onClick={() => {
          // Redirect to the desired URL inline
          window.location.href = '/dashboard/app';
        }}>Proceed</Button>
      </Box>
    </>
);

export default function KYC() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [errorImage, setErrorImage] = useState('');
  const [errorDoc, setErrorDoc] = useState('');
  const [url, setUrl] = useState('');
  const [errorUrl, setErrorUrl] = useState('');
  const [formData, setFormData] = useState(initialFormData);
  const fileInputRef = useRef(null);
  const [businessType, setBusinessType] = useState('');
  const [linkFieldsData, setLinkFieldsData] = useState([{ externalLinkAccount: '' }]);
  const [approvalStatus, setApprovalStatus] = useState(0);
  const [preload, setPreload] = useState(0);
  const [autoComplete, setAutoComplete] = useState();
  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [isActive4, setIsActive4] = useState(false);
  const [isError, setIsError] = useState(initialErrorMessage);
  const [openListDialog, setOpenListDialog] = useState(false);
  const [rejectionList, setRejectionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  useEffect(() => {
    const fetchStoreData = async () => {
      const token = ls.get('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/owner`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.kycRejectionReasons) {
          setRejectionList(response.data.kycRejectionReasons);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, []);

  const handleOpenRejections = () => {
    setOpenListDialog(true);
  };

  const handleCloseRejections = () => {
    setOpenListDialog(false);
  };

  const handleAddTextField = () => {
    setLinkFieldsData([...linkFieldsData, { externalLinkAccount: '' }]);
  };

  const handleDeleteField = (indexField) => {
    const newArray = [...linkFieldsData];
    newArray.splice(indexField, 1);
    setLinkFieldsData(newArray);
  };

  const handleNext = () => {
    const values = Object.values(formData);
    console.log(values);
    if (activeStep === 1) {
      if(errorUrl){
        return setIsError({
          ...isError,
          externalLinkAccount: 'Invalid Link',
        });
      }
      if (values[0] !== '') {
        const regex = /[a-zA-Z]+/g; // Regular expression to match one or more letters
        const letters = values[0].match(regex);
        if (letters) {
          return setIsError({
            ...isError,
            customerServiceNumber: 'Only valid numbers',
          });
        }
      } else {
        return setIsError({
          ...isError,
          customerServiceNumber: 'This is a required field',
        });
      }

      if (values[1] === '') {
        return setIsError({
          ...isError,
          streetAddress: 'Street address is required',
        });
      }
      if (values[2] === '') {
        return setIsError({
          ...isError,
          cityAddress: 'City address is required',
        });
      }
      if (values[3] === '') {
        return setIsError({
          ...isError,
          regionAddress: 'Region address is required',
        });
      }
      if (values[4] === '') {
        return setIsError({
          ...isError,
          zipCodeAddress: 'Zip code is required',
        });
      }
      if (values[6] <= 0) {
        return setIsError({
          ...isError,
          numberOfEmployees: 'Invalid input, need to have greater than 0',
        });
      }
      if (values[7] === '') {
        return setIsError({
          ...isError,
          uniqueIdentifier: 'Unique identifier is required',
        });
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
    return setIsError(initialErrorMessage);
  };

  function ErrorMessage(label) {
    return (
      <Box
        style={{
          marginTop: '0px',
          marginBottom: '20px',
          textAlign: 'left',
          borderRadius: '10px',
          width: '100%',
          color: '#ff6b6b',
        }}
      >
        <ErrorOutlineIcon />
        <Typography variant="caption" color="#ff6b6b">
          {' '}
          {label.label}
        </Typography>
      </Box>
    );
  }
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Merge textFieldsData into formData
    const mergedFormData = {
      ...formData,
      dateSubmitted: new Date(),
      externalLinkAccount: linkFieldsData.map((item) => item.externalLinkAccount),
    };

    // Send formData to the backend API
    try {
      setPreload(1);
      const result = await postDataKyc(mergedFormData);
      if (result.status === 200) {
        // Submit File
        const fileIdResult = await putFileKyc(selectedImage);
        const fileDocResult = await putFileKyc(selectedDocs,'docOthers');
        if (fileIdResult.status === 200 || fileDocResult.status === 200) {
          const userData = ls.get('user');
          const userToken = userData.token;
          const submitted = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/kyc/submit`,
            {},
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          // console.log(result)
          setFormData(initialFormData);
          setLinkFieldsData([{ externalLinkAccount: '' }]);
          setSelectedDocs([]);
          setSelectedImage([]);
          if (submitted) {
            setPreload(2);
          }
        }else{
          setPreload(0);
        }
      }
    } catch (error) {
      if(error.status === 400){
        window.alert(`Submission failed: ${error.data.message}`);
      }else{
        window.alert(`Submission failed`);
      }

    }
  };

  const validateUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (isError) {
      setIsError({
        ...isError,
        [name]: '',
      });
    }

    if (name === 'streetAddress' && value !== '') {
      autoCompleteAddress(value).then((result) => {
        setAutoComplete(result.data.features);
      });
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleClick = (type, number) => {
    if (number === 1) {
      setIsActive1(!isActive1);
      setIsActive2(false);
      setIsActive3(false);
      setIsActive4(false);
    }
    if (number === 2) {
      setIsActive1(false);
      setIsActive2(!isActive2);
      setIsActive3(false);
      setIsActive4(false);
    }
    if (number === 3) {
      setIsActive1(false);
      setIsActive2(false);
      setIsActive3(!isActive3);
      setIsActive4(false);
    }
    if (number === 4) {
      setIsActive1(false);
      setIsActive2(false);
      setIsActive3(false);
      setIsActive4(!isActive4);
    }
    setBusinessType(type);
    setFormData({ ...formData, businessType: type });
  };

  const handleAddressClick = (datas) => {
    // Update the selected address and the TextField value when an option is clicked

    setFormData({
      ...formData,
      streetAddress: datas.properties.address_line1,
      cityAddress: datas.properties.city,
      regionAddress: datas.properties.state,
      zipCodeAddress: datas.properties.postcode,
    });
  };

  const handleInputChangeLink = (index, event) => {
    setUrl(event.target.value);
    if(event.target.value === ''){
      setErrorUrl('');
    }else{
      setErrorUrl(!validateUrl(event.target.value));
    }
    const updatedData = [...linkFieldsData];
    updatedData[index].externalLinkAccount = event.target.value;
    setLinkFieldsData(updatedData);
  };

  const handleProceed = () => {
    window.location.href = '/dashboard/app';
  };

  const onDropID = useCallback((acceptedFiles, fileRejections) => {
    console.log(selectedImage);
    // Do something with the files
    if(fileRejections[0]){
      const file = fileRejections[0];
      if(file.errors[0].code === "file-too-large") setErrorImage(`File "${file.file.name}" is too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)} MB`);
    }else if(selectedImage.length >= 2){
      setErrorImage(`Exceeded allowed number of files to be uploaded`);
    }else{
      setErrorImage('');
      const file = acceptedFiles[0];
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setSelectedImage((selectedImage) => [...selectedImage, acceptedFiles[0]]);
      }
    }
  }, [selectedImage]);

  const onDropDoc = useCallback((acceptedFiles, fileRejections) => {
    if(fileRejections[0]){
      const file = fileRejections[0];
      if(file.errors[0].code === "file-too-large") setErrorDoc(`File "${file.name}" is too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)} MB`);
    }else if(selectedDocs.length >= 1){
      setErrorDoc(`Exceeded allowed number of files to upload`);
    }else{
      setErrorDoc('');
      // Do something with the files
      setSelectedDocs((selectedDocs) => [...selectedDocs, acceptedFiles[0]]);
    }
  }, [selectedDocs]);

  const { getRootProps: getRootPropsID, getInputProps: getInputPropsID, isDragActive: isDragActiveID } = useDropzone({ onDrop: onDropID, maxSize: MAX_FILE_SIZE });
  const { getRootProps: getRootPropsDoc, getInputProps: getInputPropsDoc, isDragActive: isDragActiveDoc } = useDropzone({ onDrop: onDropDoc, maxSize: MAX_FILE_SIZE });
  const isLastStep = activeStep === steps.length - 1;

  useEffect(() => {
    const getStatus = async () => {
      const datas = await kycSubmittedstatus();
      if (datas) {
        switch (
          datas.kycApprove 
        ) {
          case 1:
            setApprovalStatus(1);
            break;
          case 2:
            setApprovalStatus(2);
            break;
          case 3:
            setApprovalStatus(3);
            break;
          default:
            setApprovalStatus(0);
        }
      } else {
        console.log('No KYC data available');
      }
    };
    getStatus();
  }, []);

  return (
    <>
      {preload === 1 && <CircularLoading />}
      {preload === 2 && <CircularLoadingSuccess />}
      {approvalStatus !== null && (
        <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
          <Card style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            {(approvalStatus === 0 || approvalStatus === 3) && (
              <Box sx={{ width: '100%', backgroundColor: 'white' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>
                        <Responsive>{label}</Responsive>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <form onSubmit={(e) => e.preventDefault()}>
                  {activeStep === 0 && (
                    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>
                      <Typography variant="h3" style={{ color: '#BA61E8' }}>
                        Welcome to Vortex!
                      </Typography>
                      <img className="mx-auto" src={KycImage} width="150" height="auto" alt="Hero" />
                      {approvalStatus === 3 && (
                        <Box
                          style={{
                            marginTop: '50px',
                            textAlign: 'center',
                            backgroundColor: '#fde4f2',
                            border: 'solid #eea1cd 1px',
                            borderRadius: '10px',
                            width: '50%',
                          }}
                        >
                          <Typography variant="subtitle2" color="#ff6b6b">
                            {' '}
                            Please resubmit, rejected application{' '}
                          </Typography>
                        </Box>
                      )}
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
                      <Container maxWidth="md" style={{ textAlign: 'left', marginTop: '50px' }}>
                        <Typography variant="h6" style={{ marginBottom: '10px' }}>
                          General Information
                        </Typography>

                        {/* Customer Service Number */}
                        <Typography variant="body1"> Customer Service Number </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {' '}
                          This is a landline or mobile number your customer can contact
                        </Typography>
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
                        {isError.customerServiceNumber && <ErrorMessage label={isError.customerServiceNumber} />}
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
                        {isError.streetAddress && <ErrorMessage label={isError.streetAddress} />}
                        {autoComplete &&
                          autoComplete.map((datas, index) => (
                            <Box
                              key={index}
                              style={{
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #ddd',
                                padding: '10px',
                                margin: '5px 0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease',
                                fontSize: '.8rem',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                              onClick={() => {
                                handleAddressClick(datas);
                                setAutoComplete('');
                              }}
                            >
                              <PlaceIcon sx={{ fontSize: '14px' }} />
                              <p>{datas.properties.formatted}</p>
                            </Box>
                          ))}

                        {/* City Address */}
                        <Grid container spacing={1}>
                          {/* City Address */}
                          <Grid item xs={12} md={4}>
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
                            {isError.cityAddress && <ErrorMessage label={isError.cityAddress} />}
                          </Grid>

                          {/* Region Address */}
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Region/State"
                              variant="outlined"
                              margin="normal"
                              placeholder="Region/State"
                              name="regionAddress"
                              value={formData.regionAddress}
                              onChange={handleInputChange}
                            />
                            {isError.regionAddress && <ErrorMessage label={isError.regionAddress} />}
                          </Grid>

                          {/* Zip Code Address */}
                          <Grid item xs={12} md={4}>
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
                            {isError.zipCodeAddress && <ErrorMessage label={isError.zipCodeAddress} />}
                          </Grid>
                        </Grid>

                        {/* Physical Store Checkbox */}
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="physicalStore"
                              checked={formData.physicalStore}
                              onChange={handleInputChange}
                            />
                          }
                          label="with physical store"
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
                        {isError.numberOfEmployees && <ErrorMessage label={isError.numberOfEmployees} />}
                        <Typography variant="body1" style={{ marginTop: '30px' }}>
                          {' '}
                          Online Presence{' '}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {' '}
                          Help us get to know your businese more by providing atleast one link for either business
                          website or social media account
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: '20px' }}>
                          Business website or social media
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Provide the link/s of your website and/ or social media where you conduct business with your
                          customers. Business pages with your catalog of products and services are preferred
                        </Typography>
                        {/* Website links  */}
                        {linkFieldsData.map((text, index) => (
                          <TextField
                            fullWidth
                            label="Link"
                            variant="outlined"
                            margin="normal"
                            placeholder="e.g. https://vortex.com"
                            name={`externalLinkAccount-${index}`}
                            value={text.externalLinkAccount}
                            onChange={(event) => handleInputChangeLink(index, event)}
                            key={index}
                            error={errorUrl}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {index > 0 ? (
                                    <IconButton>
                                      <DeleteForeverIcon onClick={() => handleDeleteField(index)} />
                                    </IconButton>
                                  ) : null}
                                </InputAdornment>
                              ),
                            }}
                          />
                        ))}
                        {isError.externalLinkAccount && <ErrorMessage label={isError.externalLinkAccount} />}

                        <Button style={{ color: '#BA61E8', fontSize: '.7rem' }} onClick={handleAddTextField}>
                          <AddLinkIcon /> Add another link
                        </Button>

                        <Typography variant="body2" style={{ marginTop: '30px' }}>
                          {' '}
                          Preferred Business Handle
                        </Typography>
                        <Typography variant="caption" style={{ color: '#BA61E8' }}>
                          {' '}
                          This unique identifier is like a Vortex username for your business. Note that you can't change
                          this in the future.
                        </Typography>
                        <Box>
                          <Typography variant="caption" style={{ color: '#BA61E8' }}>
                            {' '}
                            Use letter a - z, numbers 0-9 and dashes(-). No spaces and special character allowed
                          </Typography>
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
                          {isError.uniqueIdentifier && <ErrorMessage label={isError.uniqueIdentifier} />}
                        </Box>
                      </Container>
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div style={{ marginTop: '50px', textAlign: 'start' }}>
                      {/* Step 3: Business Information */}
                      <Container maxWidth="md" style={{ marginTop: '50px' }}>
                        <Typography variant="h6">Business Information</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {' '}
                          Provide more details about your business. We ask questions specific to your business type.
                        </Typography>
                        <Box
                          style={{
                            marginTop: '40px',
                            border: 'solid 2px #e0e0e0',
                            borderRadius: '20px',
                            padding: '30px',
                          }}
                        >
                          <Typography> Choose your type of business</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {' '}
                            Select appropriately to avoid delays in your application. This will be reviewd by our
                            Onboarding team.
                          </Typography>
                          <Box
                            style={{
                              display: 'flex',
                              gap: '10px',
                              textAlign: 'center',
                              marginTop: '30px',
                            }}
                          >
                            <Grid container spacing={1}>
                              <Grid item xs={12} md={6}>
                                <HoverableCard active={isActive1} onClick={() => handleClick('Individual', 1)}>
                                  <CardContent>
                                    <PersonIcon style={{ fontSize: '4rem' }} />
                                    <Typography variant="h5" component="div">
                                      Individual
                                    </Typography>
                                    <Typography color="text.secondary">
                                      You are the only owner of a business, and you are not registered with the DTI.
                                    </Typography>
                                  </CardContent>
                                </HoverableCard>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <HoverableCard active={isActive2} onClick={() => handleClick('Sole Proprietorship', 2)}>
                                  <CardContent>
                                    <AccountBoxIcon style={{ fontSize: '4rem' }} />
                                    <Typography variant="h5" component="div">
                                      Sole Proprietorship
                                    </Typography>
                                    <Typography color="text.secondary">
                                      You are the sole owner of the business, and you have it registered with the DTI.
                                    </Typography>
                                  </CardContent>
                                </HoverableCard>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <HoverableCard active={isActive3} onClick={() => handleClick('Partnership', 3)}>
                                  <CardContent>
                                    <GroupIcon style={{ fontSize: '4rem' }} />
                                    <Typography variant="h5" component="div">
                                      Partnership
                                    </Typography>
                                    <Typography color="text.secondary">
                                      Your businese owner by two or more individuals or partners, and it is registered
                                      with the SEC.
                                    </Typography>
                                  </CardContent>
                                </HoverableCard>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <HoverableCard active={isActive4} onClick={() => handleClick('Corporation', 4)}>
                                  <CardContent>
                                    <CorporateFareIcon style={{ fontSize: '4rem' }} />
                                    <Typography variant="h5" component="div">
                                      Corporation
                                    </Typography>
                                    <Typography color="text.secondary">
                                      Your business is owned by a corporate entity and is registered with the SEC.
                                    </Typography>
                                  </CardContent>
                                </HoverableCard>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                      </Container>
                    </div>
                  )}
                  {activeStep === 3 && (
                    <div style={{ marginTop: '50px', textAlign: 'start' }}>
                      <Container maxWidth="md" style={{ marginTop: '50px' }}>
                        <Typography variant="h6"> {businessType}- Business Information</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {' '}
                          Details about your business like bank details, business documents and others
                        </Typography>
                        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                          <Typography> Upload IDs</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {' '}
                            Guidlines for uploading IDs
                          </Typography>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                            <Typography variant="body1">Do not submit expired IDs.</Typography>
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
                            <Typography variant="body2"> Valid Identification Documents</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {' '}
                              Upload one(1) Primary ID or two(2) Secondary IDs( only if you cannot provide a primary ID)
                            </Typography>
                          </div>

                          <HoverableButton {...getRootPropsID()}>
                            <div>
                              <input name={"uploadIdInput"} {...getInputPropsID()} />
                              <Button
                                name={"uploadId"}
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
                                Select Image
                              </Button>
                              <Box style={{ color: 'gray', fontSize: '.7rem' }}>
                                <div>
                                {isDragActiveID ? (
                                  <p>Drop the files here ...</p>
                                ) : (
                                  <p>Drag 'n' drop some files here, or click to select files</p>
                                )}
                                </div>
                                <div>
                                  {errorImage && (<Alert severity="error" sx={{mt: 2}}>{errorImage}</Alert>)}
                                </div>
                              </Box>
                            </div>
                            {/* </label> */}
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '10px' }}>
                              {selectedImage.map((item, index) => (
                                <div
                                  key={index}
                                  style={{
                                    backgroundColor: '#873EC0',
                                    borderRadius: '5px',
                                    color: 'white', // Changed text color to white for better contrast
                                    width: '100px', // Increased the width for more space
                                    padding: '8px', // Added padding for better spacing
                                    fontSize: '14px', // Adjusted font size
                                    textAlign: 'center', // Center-align text
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    marginRight: '10px',
                                    marginBottom: '10px',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Added a subtle shadow
                                  }}
                                >
                                  {item.name}
                                </div>
                              ))}
                            </div>
                          </HoverableButton>
                        </div>
                        <hr />
                        <div style={{ marginTop: '20px' }}>
                          <Typography> Upload Documents </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {' '}
                            Guidelines for uploading documents
                          </Typography>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                            <Typography variant="body1">The documents must be in clear copies in color.</Typography>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <CheckCircleOutlineIcon style={{ color: 'green', marginRight: '10px' }} />
                            <Typography variant="body1">Make sure the documents have complete pages</Typography>
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
                            <Typography variant="body2"> DTI Business Name Registration certificate </Typography>
                          </div>
                          <HoverableButton {...getRootPropsDoc()}>
                            <div>
                              <input name={"uploadDocInput"} {...getInputPropsDoc()} />
                              <Button
                                name={"uploadDoc"}
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
                                Select Image
                              </Button>
                              <Box style={{ color: 'gray', fontSize: '.7rem' }}>
                                {isDragActiveDoc ? (
                                  <p>Drop the files here ...</p>
                                ) : (
                                  <p>Drag 'n' drop some files here, or click to select files</p>
                                )}
                              </Box>
                            </div>
                            {/* </label> */}

                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '10px' }}>
                              {selectedDocs.map((item, index) => (
                                <div
                                  key={index}
                                  style={{
                                    backgroundColor: '#873EC0',
                                    borderRadius: '5px',
                                    color: 'white', // Changed text color to white for better contrast
                                    width: '100px', // Increased the width for more space
                                    padding: '8px', // Added padding for better spacing
                                    fontSize: '14px', // Adjusted font size
                                    textAlign: 'center', // Center-align text
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    marginRight: '10px',
                                    marginBottom: '10px',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Added a subtle shadow
                                  }}
                                >
                                  {item.name}
                                </div>
                              ))}
                            </div>
                          </HoverableButton>
                        </div>
                        {errorDoc && <Alert severity="error" sx={{ mt: 2 }}>{errorDoc}</Alert>}
                      </Container>
                    </div>
                  )}

                  <div style={{ marginTop: '40px' }}>
                    <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      style={{ color: 'white', backgroundColor: '#873EC0' }}
                      onClick={isLastStep ? handleSubmit : handleNext}
                    >
                      {isLastStep ? 'Submit' : 'Next'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleOpenRejections}
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    >
                      View Rejections
                    </Button>
                  </div>
                </form>
              </Box>
            )}
            {approvalStatus === 1 && (
              <div style={{ marginTop: '50px', textAlign: 'center', height: '350px' }}>
                <Container maxWidth="md" style={{ marginTop: '50px' }}>
                  <img
                    className="mx-auto"
                    src={UnderReview}
                    alt="Under review"
                    style={{ width: '250px', height: 'auto', borderRadius: '10px', marginBottom: '10px' }}
                  />
                  <Typography variant="h5"> Your Files are Successfuly Uploaded And it is Under Review </Typography>
                  <Button
                    onClick={handleProceed}
                    style={{
                      color: 'white',
                      backgroundColor: '#873EC0',
                      marginTop: '30px',
                      paddingLeft: '30px',
                      paddingRight: '30px',
                    }}
                  >
                    {' '}
                    PROCEED{' '}
                  </Button>
                </Container>
              </div>
            )}
            {approvalStatus === 2 && (
              <div style={{ marginTop: '50px', textAlign: 'center', height: '350px' }}>
                <Container maxWidth="md" style={{ marginTop: '50px' }}>
                  <img
                    className="mx-auto"
                    src={Approved}
                    alt="Under review"
                    style={{ width: '250px', height: 'auto', borderRadius: '10px', marginBottom: '10px' }}
                  />
                  <Typography variant="h5"> Submitted files are approved </Typography>
                  <Button
                    onClick={handleProceed}
                    style={{
                      color: 'white',
                      backgroundColor: '#873EC0',
                      marginTop: '30px',
                      paddingLeft: '30px',
                      paddingRight: '30px',
                    }}
                  >
                    {' '}
                    PROCEED{' '}
                  </Button>
                </Container>
              </div>
            )}
          </Card>
        </Container>
      )}

      <ListDialog
        open={openListDialog}
        onClose={handleCloseRejections}
        title="KYC Rejection Reasons"
        list={rejectionList}
        itemKey="date"
      />
    </>
  );
}
