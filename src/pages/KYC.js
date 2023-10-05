import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
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
import CircularProgress from "@mui/material/CircularProgress";
import PlaceIcon from '@mui/icons-material/Place';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDropzone } from 'react-dropzone';
import KycImage from '../images/Rectangle 52.png'
import { postDataKyc, putFileKyc, autoCompleteAddress } from '../api/public/kyc'




const Responsive = styled('Typography')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '.6rem'
  }
}))


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
    color:#BA61E8;
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

const CircularLoading = () => (
  <>
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        opacity: 0.5,
        zIndex: 1
      }}
    />
    <Box
      sx={{
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        textAlign: "center",
        color: "#fff",
      }}
    >
      <CircularProgress size={70} />
      <Typography variant='h4'>Uploading Files</Typography>
    </Box>
  </>
);

export default function KYC() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const fileInputRef = useRef(null);
  const docsInputRef = useRef(null);
  const [businessType, setBusinessType] = useState('');
  const [linkFieldsData, setLinkFieldsData] = useState([{ externalLinkAccount: '' }]);
  const [fileUploaded, setFileUploaded] = useState(false)
  const [preload, setPreload] = useState(0)
  const [isError, setIsError] = useState(false)
  const [autoComplete, setAutoComplete] = useState()
  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [isActive4, setIsActive4] = useState(false);

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
    if (activeStep === 1) {
      if (values[0] === '' ||
        values[1] === '' ||
        values[2] === '' ||
        values[3] === '' ||
        values[4] === '' ||
        values[7] === '') {
        return setIsError(true)
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
    return setIsError(false)
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // const handleChange = (event) => {
  //   const { name, value, type, checked } = event.target;

  //   // Handle different input types (text, checkbox, number)
  //   const newValue = type === 'checkbox' ? checked : value;

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: newValue,
  //   }));
  // };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage([...selectedImage, file]);
  };

  const handleDocsChange = (event) => {
    const file = event.target.files[0];
    setSelectedDocs([...selectedDocs, file])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Merge textFieldsData into formData
    const mergedFormData = {
      ...formData,
      externalLinkAccount: linkFieldsData.map((item) => item.externalLinkAccount),
    };
    // Send formData to the backend API
    try {
      const result = await postDataKyc(mergedFormData);
      if (result.status === 200) {
        // Submit File 
        const mergeFileData = [
          ...selectedImage,
          ...selectedDocs]
        console.log("Sulod kaayu")
        const fileResult = await putFileKyc(mergeFileData)
        if (fileResult.status === 200) {
          const userData = JSON.parse(localStorage.getItem('user'));
          const userId = userData._id;

          await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/kyc/submit`, {}, {
            headers: {
              Authorization: `Bearer ${userId}`
            }
          });

          // console.log(result)
          setFormData(initialFormData)
          setLinkFieldsData([{ externalLinkAccount: '' }])
          setSelectedDocs([])
          setSelectedImage([])
          setPreload(1)
          setTimeout(() => {
            setPreload(2)
          }, 3000)

        }
      }
    } catch (error) {
      window.alert('Error')
    }
  };

  const handleInputChange = (e) => {

    const { name, value, type, checked } = e.target;

    if (name === 'streetAddress' && value !== '') {
      autoCompleteAddress(value)
        .then((result) => {
          setAutoComplete(result.data.features)
        })
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };


  const handleClick = (type, number) => {
    if(number === 1){
      setIsActive1(!isActive1)
      setIsActive2(false)
      setIsActive3(false)
      setIsActive4(false)
    }
    if(number === 2){
      setIsActive1(false)
      setIsActive2(!isActive2)
      setIsActive3(false)
      setIsActive4(false)
    }
    if(number === 3){
      setIsActive1(false)
      setIsActive2(false)
      setIsActive3(!isActive3)
      setIsActive4(false)
    }
    if(number === 4){
      setIsActive1(false)
      setIsActive2(false)
      setIsActive3(false)
      setIsActive4(!isActive4)
    }
    setBusinessType(type)
    setFormData({ ...formData, businessType: type });
  }

  const handleAddressClick = (datas) => {
    // Update the selected address and the TextField value when an option is clicked

    setFormData({
      ...formData,
      streetAddress: datas.properties.address_line1,
      cityAddress: datas.properties.city,
      regionAddress: datas.properties.state,
      zipCodeAddress: datas.properties.postcode
    });
  };

  const handleInputChangeLink = (index, event) => {
    const updatedData = [...linkFieldsData];
    updatedData[index].externalLinkAccount = event.target.value;
    setLinkFieldsData(updatedData);
  };


  const handleProceed = () => {
    setFileUploaded(false)
    window.location.href = "/dashboard/app"
  }

  const isLastStep = activeStep === steps.length - 1;


  useEffect(() => {
    if (preload === 2) {
      setFileUploaded(true)
    }
  }, [preload])

  // useEffect(() =>{
  //   autoCompleteAddress(autoComplete)
  //   .then((result) =>{
  //     console.log(result)
  //   })
  // },[autoComplete])

  return (
    <>
      {preload === 1 ? <CircularLoading /> : <></>}
      <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '50px' }}>

        <Card style={{ paddingTop: '50px', paddingBottom: '50px' }}>
          {fileUploaded === false ? <Box sx={{ width: '100%', backgroundColor: 'white' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel><Responsive>{label}</Responsive></StepLabel>
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
                      <Typography variant="caption" color='text.secondary'> This is a landline or mobile number your customer can contact</Typography>
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

                      {autoComplete && (
                        autoComplete.map((datas, index) => {
                          return (
                            <Box key={index}
                              style={
                                {
                                  backgroundColor: '#f5f5f5',
                                  border: '1px solid #ddd',
                                  padding: '10px',
                                  margin: '5px 0',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.2s ease',
                                  fontSize: '.8rem',
                                  display: 'flex',
                                  alignItems: 'center'

                                }
                              }
                              onClick={() => {
                                handleAddressClick(datas)
                                setAutoComplete('')
                              }}
                            >
                              <PlaceIcon sx={{ fontSize: '14px' }} />
                              <p>{datas.properties.formatted}</p>
                            </Box>
                          )
                        })
                      )}

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
                        </Grid>
                      </Grid>

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
                      <Typography variant="caption" color='text.secondary'> Help us get to know your businese more by
                        providing atleast one link for either business website or social media
                        account
                      </Typography>
                      <Typography variant="body2" style={{ marginTop: "20px" }}>Business website or social media</Typography>
                      <Typography variant="caption" color='text.secondary'>Provide the link/s of your website
                        and/ or social media where you conduct business with your customers.
                        Business pages with your catalog of products and services are preferred
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
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {index > 0 ? <IconButton>
                                  <DeleteForeverIcon onClick={() => handleDeleteField(index)} />
                                </IconButton> : null}
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
                    <Typography variant="caption" color='text.secondary'> Provide more details about your business. We ask questions specific to your business type.</Typography>
                    <Box style={{
                      marginTop: "40px",
                      border: "solid 2px #e0e0e0",
                      borderRadius: "20px",
                      padding: "30px"
                    }}>
                      <Typography> Choose your type of business</Typography>
                      <Typography variant="caption" color='text.secondary'> Select appropriately to avoid delays in your application. This will be reviewd by our Onboarding team.</Typography>
                      <Box style={{
                        display: 'flex',
                        gap: '10px',
                        textAlign: "center",
                        marginTop: "30px",
                      }}>
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
                            <HoverableCard active={isActive2} onClick={() => handleClick('Sole Proprietorship', 2)} >
                              <CardContent>
                                <AccountBoxIcon style={{ fontSize: "4rem" }} />
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
                                <GroupIcon style={{ fontSize: "4rem" }} />
                                <Typography variant="h5" component="div">
                                  Partnership
                                </Typography>
                                <Typography color="text.secondary">
                                  Your businese owner by two or more individuals or partners, and it is registered with the SEC.
                                </Typography>
                              </CardContent>
                            </HoverableCard>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <HoverableCard active={isActive4} onClick={() => handleClick('Corporation', 4)}>
                              <CardContent>
                                <CorporateFareIcon style={{ fontSize: "4rem" }} />
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
                  <Container maxWidth="md" style={{ marginTop: "50px" }}>
                    <Typography variant="h6"> {businessType}- Business Information</Typography>
                    <Typography variant="caption" color='text.secondary'> Details about your business like bank details, business documents and others</Typography>
                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                      <Typography> Upload IDs</Typography>
                      <Typography variant="caption" color='text.secondary'> Guidlines for uploading IDs</Typography>
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
                        <Typography variant='body2'> Valid Identification Documents</Typography>
                        <Typography variant='caption' color='text.secondary'> Upload one(1) Primary ID or two(2) Secondary IDs( only if you cannot provide a primary ID)</Typography>
                      </div>

                      <HoverableButton>
                        {/* <Dropzone onDrop={acceptedFiles => setSelectedImage([...selectedImage, acceptedFiles])}>
                          {({ getRootProps, getInputProps }) => (
                            <section>
                              <div {...getRootProps()}>
                                {/* <input {...getInputProps()} /> 
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  multiple
                                  onChange={handleFileChange}
                                  style={{ display: 'none' }}
                                  id="file-input"
                                  {...getInputProps()}
                                />
                                <div
                                  style={{ display: 'flex', alignContent: 'flex-end' }}
                                >
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
                                  <Typography style={{ alignSelf: 'center', justifySelf: 'center' }}> Or Drag 'n' Drop file here </Typography>
                                </div>
                              </div>
                            </section>
                          )}
                        </Dropzone> */}
                         <input
                          ref={fileInputRef}
                          type="file"
                          multiple
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
                      <Typography variant="caption" color='text.secondary'> Guidlines for uploading documents</Typography>
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
                        <Typography variant='body2'> DTI Business Name Registration certificate </Typography>
                      </div>

                      <HoverableButton>
                        <input
                          ref={docsInputRef}
                          type="file"
                          multiple
                          onChange={handleDocsChange}
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
                            if (docsInputRef.current) {
                              docsInputRef.current.click();
                            }
                          }}
                        >
                          Select File
                        </Button>
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
                  </Container>
                </div>
              )}
              {isError === true && (
                <Container maxWidth='md'>
                  <Box style={{
                    marginTop: '20px',
                    textAlign: 'center',
                    backgroundColor: '#fde4f2',
                    border: 'solid #eea1cd 1px',
                    borderRadius: '10px',
                    width: '100%'
                  }}>
                    <Typography
                      variant='subtitle1'
                      color='#ff6b6b'
                    > Please fill all necessary fields!</Typography>
                  </Box>
                </Container>
              )}
              <div style={{ marginTop: '40px' }}>
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
          </Box> :
            <div style={{ marginTop: '50px', textAlign: 'center', height: '250px' }}>
              <Container maxWidth="md" style={{ marginTop: "50px" }}>
                <Typography variant='h5'> Your Files are Successfuly Uploaded </Typography>
                <Button onClick={handleProceed} style={{ color: "white", backgroundColor: "#873EC0", marginTop: '30px', paddingLeft: '30px', paddingRight: '30px' }}> PROCEED </Button>
              </Container>
            </div>
          }
        </Card>
      </Container>
    </>
  );
}
