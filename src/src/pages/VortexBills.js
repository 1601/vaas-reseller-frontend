/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-plusplus */
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  List,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
  InputBase,
  AlertTitle,
  Alert,
  Grid,
} from "@mui/material"
import { Form, Formik } from "formik"
import { Box } from "@mui/system"
// import { navigate } from "gatsby" //commented out for testing now turn all navigate to console.log
import React, { useState, useEffect, useReducer, useContext } from "react"
import * as yup from "yup"
import SecureLS from "secure-ls"

import { BillerIcon } from "../Vortex/components/VortexBillerCategory"
import VortexBillerCard from "../Vortex/components/VortexBillerCard"

import {
  createBillsPaymentTransaction,
  getBillerById,
  getBillers,
} from "../api/public/vortex/billspayment_service"
import { getVortexTokenBase, signIn } from "../api/public/vortex/token_service"


import CenteredProgress from "../Vortex/components/centeredProgress"
import VortexFormToolbar from "../Vortex/components/VortexFormToolbar"
import VortexError from "../Vortex/components/VortexError"
import jsonFieldsToArray from "../Vortex/helpers/jsonfieldstoarray"

import VortexCustomTextField from "../Vortex/components/VortexCustomTextField"
import {
  saveVortexBillsPaymentTransaction,
  updateVortexByRefId,
} from "../api/public/vortex/transaction_db"
import VortexBillerAccordionList from "../Vortex/components/VortexBillerAccordionList"

// import {
//   LoginState,
//   PlatformVariables,
//   StoreStatus,
//   UserStatus,
// } from "../../globalstates"

// import LoginPage from "../../LoginPage"
import { primaryVortexTheme } from "../Vortex/config/theme"
import VortexBillerLogoComponent from "../Vortex/components/VortexBillerLogoComponent"
import VortexBillerListItem from "../Vortex/components/VortexBillerListItem"
import VortexBottomGradient from "../Vortex/components/VortexBottomGradient"

// import BottomNavigator from "../../Homemade/BottomNavigator"
// import useLoggedUser from "../../../custom-hooks/useLoggedUser" // remove all user related

import getBillerAbbreviation from "../Vortex/functions/getBillerAbbreviation"
import trimObjValues from "../Vortex/helpers/trimobjectvalues"
import BlockPrompt from "../Vortex/Prompts/BlockPrompt"
import StoreBlockPrompt from "../Vortex/Prompts/StoreBlockPrompt"
// import { getStoreEnvById } from "../../../api/public/store-env" remove all store related
import ServiceDisabledPrompt from "../Vortex/Prompts/ServiceDisabledPrompt"
import PhoneTextfield from '../Vortex/Textfields/PhoneTextfield'

const LoginPage = () => (
    <Box>
      <div> Login Page</div>
    </Box>
  )

const BottomNavigator = () => (
    <Box>
      <div> Bottom Navigator</div>
    </Box>
  )

const VortexBillsPaymentPage = () => {
  const forApi = signIn("ilagandarlomiguel@gmail.com", "GrindGr@titud3")
  const ls = new SecureLS({ encodingType: "aes" })

  const [error, setErrorData] = useState({ isError: false, message: "" })

  const [transactionDocId, setTransactionDocId] = useState(null)

  const [transactionReferenceId, setTransactionReferenceId] = useState(null)

  const [platformVariables, setPlatformVariables] = useState({})

  const [userStatus, setUserStatus] = useState(null)

  const [storeStatus, setstoreStatus] = useState(null)

  const [activeStep, setActiveStep] = useState(0)

  const [data, setData] = useState([])

  const [renderData, setRenderData] = useState([])

  const [categories, setcategories] = useState([])

  const [selectedBiller, setSelectedBiller] = useState(null)

  const [billDetails, setBillDetails] = useState(null)

  const [inputFormData, setinputFormData] = useState({})

  const [transactionDetails, setTransactionDetails] = useState()

  const [currentSelectedCategory, setCurrentSelectedCategory] = useState(null)

  const [isLoggin, setisLoggin] = useState(null)

  const [dealerSettings, setDealerSettings] = useState(null);

  const [isLoading, setisLoading] = useState(false)

  const [paymentStatus, setPaymentStatus] = useState(null);

  // Getting store env and user status
  // const { getUser } = useLoggedUser()

  // useEffect(async () => {

  //   let store = ls.get("store")

  //   let storeEnvId = store?.storeEnv?._id || store?.storeEnv

  //   let x = await getStoreEnvById({ storeEnvId: storeEnvId })

  //   setPlatformVariables(x)

  // }, [])

  const getServiceFee = ({ amount, currency }) => {
    // let paypalPercentage = amount * 0.0355
    // let foreignFee = amount * 0.01
    // let paypalFee = Math.round(paypalPercentage) + Math.round(foreignFee)
    const amountInDirham = parseFloat(
      amount / platformVariables.billsCurrencyToPeso
    )
    let convenienceFee = parseFloat(platformVariables.billsConvenienceFee) // convenience fee only for bills/vouchers  -platformVariables.convenienceFeeInDirham
    let grandTotalFee = parseFloat(amountInDirham) + parseFloat(convenienceFee)

    convenienceFee = parseFloat(convenienceFee).toFixed(2)
    grandTotalFee = parseFloat(grandTotalFee).toFixed(2)

    return { convenienceFee, grandTotalFee }
  }

  function stepBack() {
    setActiveStep(activeStep - 1)
  }

  function stepForward() {
    const nextStep = activeStep + 1;
    // console.log("Current step:", activeStep, "Next step:", nextStep);
    setActiveStep(nextStep);
  }  

  async function handleVortexRequestGCash({ paymentData }) {
    try {
      setisLoading(true)

      // save transaction only as for manual Gcash
      setTransactionDetails(paymentData)

      const saveTransaction = await updateVortexByRefId({
        refId: transactionReferenceId,
        data: {
          paymentId: "Awaiting for GCash Payment",
          paymentMethod: "GCash",
          totalAmount: paymentData.grandTotalFee,
        },
      })

      // navigate(
      //   `/vortextransactions/billspayment/${saveTransaction.referenceNumber}`,
      //   { state: saveTransaction }
      // )
      // console.log('saveTransaction', saveTransaction)
      // console.log("go to /vortextransactions/billspayment/$ { saveTransaction.referenceNumber}")

      setisLoading(false)
    } catch (error) {
      setErrorData({
        isError: true,
        message: error,
      })
      throw Error(error)
    }
  }

  async function handleVortexRequest({ docId, paymentData }) {
    try {
      const vortexTokenResponse = await getVortexTokenBase()

      if (vortexTokenResponse.status === 200) {
        const vortextTokenResult = await vortexTokenResponse.json()

        const vortexBillPaymentTransactionResponse =
          await createBillsPaymentTransaction(
            vortextTokenResult.access_token,
            docId,
            process.env.GATSBY_APP_VORTEX_CLIENTREQID,
            selectedBiller.id,
            billDetails,
            paymentData?.data?.orderID,
            paymentData?.details?.purchase_units[0]?.amount?.value
          )

        const vortexBillPaymentTransactionResult =
          await vortexBillPaymentTransactionResponse.json()

        if (vortexBillPaymentTransactionResponse.status === 200) {
          const refNo = vortexBillPaymentTransactionResult?.referenceNumber

          // Check if the response is error
          if (typeof refNo === "undefined") {
            setErrorData({
              isError: true,
              message: `Error code: ${vortexBillPaymentTransactionResult.message}`,
            })

            return
          }

          if (vortexBillPaymentTransactionResult.transactionData)
            setTransactionDetails(vortexBillPaymentTransactionResult)

          // navigate(
          //   `/vortextransactions/billspayment/${vortexBillPaymentTransactionResult.referenceNumber}`
          // )
          // console.log('vortexBillPaymentTransactionResult', vortexBillPaymentTransactionResult)
          // console.log("go to /vortextransactions/billspayment/$ { vortexBillPaymentTransactionResult.referenceNumber}")
        } else {
          setErrorData({
            isError: true,
            message: "There is an error on the request to vortex",
          })
        }
      } else {
        setErrorData({
          isError: true,
          message: "There is an error on the request to vortex",
        })
      }
    } catch (error) {
      setErrorData({
        isError: true,
        message: `${error}`,
      })
    }
  }

  async function handleVortexCashRequest({ docId, total }) {
    try {
      const vortexTokenResponse = await getVortexTokenBase()

      if (vortexTokenResponse.status === 200) {
        const vortextTokenResult = await vortexTokenResponse.json()

        const vortexBillPaymentTransactionResponse =
          await createBillsPaymentTransaction({
            access_token: vortextTokenResult.access_token,
            docId,
            clientRequestId: process.env.GATSBY_APP_VORTEX_CLIENTREQID,
            billerId: selectedBiller.id,
            billDetails,
            paymentId: "Payment via Store",
            totalAmount: total,
            oneAedToPhp: platformVariables.billsCurrencyToPeso,
            convenienceFee: platformVariables.billsConvenienceFee,
            currencySymbol: platformVariables?.currencySymbol,
            currencyToPhp: platformVariables?.billsCurrencyToPeso,
            callbackUrl: ""
          })

        const vortexBillPaymentTransactionResult =
          await vortexBillPaymentTransactionResponse.json()

        if (vortexBillPaymentTransactionResponse.status === 200) {
          const refNo = vortexBillPaymentTransactionResult?.referenceNumber

          // Check if the response is error
          if (typeof refNo === "undefined") {
            setErrorData({
              isError: true,
              message: `Error code: ${vortexBillPaymentTransactionResult.message}`,
            })

            return
          }

          if (vortexBillPaymentTransactionResult.transactionData)
            setTransactionDetails(vortexBillPaymentTransactionResult)

          // navigate(
          //   `/vortextransactions/billspayment/${vortexBillPaymentTransactionResult.referenceNumber}`
          // )
          // console.log('vortexBillPaymentTransactionResult', vortexBillPaymentTransactionResult)
          // console.log("go to /vortextransactions/billspayment/$ { vortexBillPaymentTransactionResult.referenceNumber}")
        } else {
          setErrorData({
            isError: true,
            message: "There is an error on the request to vortex",
          })
        }
      } else {
        setErrorData({
          isError: true,
          message: "There is an error on the request to vortex",
        })
      }
    } catch (error) {
      setErrorData({
        isError: true,
        message: `${error}`,
      })
    }
  }

  const extractStoreUrl = () => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    let storeUrl;
  
    // Check if the hostname contains 'pldt-vaas-frontend'
    if (hostname.includes('pldt-vaas-frontend') || hostname.includes('localhost')) {
      storeUrl = pathname.split('/')[1];
    } else {
      const parts = hostname.split('.');
      if (parts.length >= 3) {
        storeUrl = parts[0];
      } else {
        storeUrl = pathname.split('/')[1];
      }
    }
    return storeUrl;
  };  

  // Function to flatten the dealerData object
  function flattenDealerData(dealerData) {
    const flatData = {};
    Object.keys(dealerData).forEach(category => {
      Object.keys(dealerData[category]).forEach(biller => {
        flatData[biller] = dealerData[category][biller];
      });
    });
    return flatData;
  }

  function calculateSimilarity(str1, str2) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    const totalLength = Math.max(str1.length, str2.length);
    let matches = 0;
  
    for (let i = 0; i < totalLength; i++) {
      if (str1[i] && str2[i] && str1[i] === str2[i]) {
        matches++;
      }
    }
  
    return (matches / totalLength);
  }  

  function isBillerEnabled(billerName, dealerData) {
    let isEnabled = true; 
    let bestMatchScore = 0;
  
    Object.entries(dealerData).forEach(([category, billers]) => {
      Object.keys(billers).forEach(dealerBillerName => {
        const similarityScore = calculateSimilarity(billerName, dealerBillerName);
        if (similarityScore > bestMatchScore) {
          bestMatchScore = similarityScore;
          isEnabled = similarityScore >= 0.5 ? (billers[dealerBillerName] !== undefined ? billers[dealerBillerName] : true) : true;
        }
      });
    });
  
    return isEnabled;
  }  

  useEffect(() => {
    async function fetchUserDataAndBillers() {
      // console.log("Starting to fetch user data and billers");
      setisLoading(true);
  
      const storeUrl = extractStoreUrl();
      // console.log("Extracted Store URL:", storeUrl);
  
      try {
        const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}/user`);
        // console.log("User Response Status:", userResponse.status);
  
        if (userResponse.status === 200) {
          const { userId } = await userResponse.json();
          // console.log("User ID:", userId);
  
          const dealerResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/billertoggles/public`);
          // console.log("Dealer Response Status:", dealerResponse.status);
  
          if (dealerResponse.status === 200) {
            const dealerData = await dealerResponse.json();
            // console.log("Dealer Data:", dealerData);
            setDealerSettings(dealerData);
  
            const vortexTokenResponse = await getVortexTokenBase();
            // console.log("Vortex Token Response Status:", vortexTokenResponse.status);
  
            if (vortexTokenResponse.status === 200) {
              const vortexTokenResult = await vortexTokenResponse.json();
              const response = await getBillers(vortexTokenResult.access_token, 1, 1000);
              // console.log("Billers Response Status:", response.status);
  
              if (response.status === 200) {
                const billers = await response.json();
                // console.log("All Billers:", billers);
          
                const filteredBillers = billers.filter(biller => {
                  const isEnabled = isBillerEnabled(biller.name, dealerData);
                  // console.log(`Biller: ${biller.name}, Enabled: ${isEnabled}`);
                  return isEnabled;
                });
          
                // console.log("Filtered Billers:", filteredBillers);
                setData(filteredBillers);
              }
            }
          }
        }
        setisLoading(false);
      } catch (error) {
        console.error('Error in fetchUserDataAndBillers:', error);
        setisLoading(false);
      }
    }
  
    fetchUserDataAndBillers();
  }, []);

  // This will compile all biller categories when data is received
  useEffect(() => {
    const gatheredCategories = []
    if (data?.length > 0) {
      for (let index = 0; index < data?.length; index++) {
        if (!gatheredCategories.includes(data[index].category)) {
          gatheredCategories.push(data[index].category)
        }
      }
      setcategories(gatheredCategories)
    }
  }, [data])

  // This will display all compiled categories
  const BillsPaymentCategoriesPage = () => {
    const [_billers, _setBillers] = useState([])
    const [search, setSearch] = useState([])

    const [_currentSelectedCategory, _setCurrentSelectedCategory] = useReducer(
      filterBillerByCategories,
      ""
    )

    // This will filter all biller by categories
    function filterBillerByCategories(state, category) {
      const filteredBillers = []
      if (data?.length > 0) {
        for (let index = 0; index < data?.length; index++) {
          if (data[index]?.category === category) {
            filteredBillers.push(getBillerAbbreviation(data[index]))
          }
        }
        _setBillers(filteredBillers)
      }

      return category
    }

    function searchBillers(search) {
      if (search.trim().replaceAll(" ", "").length === 0) {
        setSearch([])
        return
      }

      const filteredBillers = []
      if (data?.length > 0) {
        for (let index = 0; index < data?.length; index++) {
          const billerName = data[index].name
            .toLowerCase()
            .replaceAll(" ", "")
          if (billerName.includes(search.toLowerCase()))
            filteredBillers.push(data[index])
        }
      }

      setSearch(filteredBillers)
    }

    return (
      <Box>
        <VortexFormToolbar
          title={"Bills"}
          onClickBack={() => {
            // navigate(-1)
            // console.log(" navigate back")
            window.history.back()
          }}
        />
        <Toolbar />

        {!isLoading && (
          <>
            <VortexBillerSearch onInput={searchBillers} />
            {search.length === 0 ? (
              <>
                <VortexBillerAccordionList
                  categories={categories}
                  billers={_billers}
                  onSelectCategory={(category) => {
                    _setCurrentSelectedCategory(category)
                  }}
                  onSelectBiller={(biller) => {
                    setCurrentSelectedCategory(_currentSelectedCategory)

                    setSelectedBiller(biller)
                    stepForward()
                  }}
                />
              </>
            ) : (
              <VortexBillerSearchResult
                billers={search}
                onBillerSelect={(biller) => {
                  setCurrentSelectedCategory(biller.category)
                  setSelectedBiller(biller)
                  stepForward()
                }}
              />
            )}
          </>
        )}
      </Box>
    )
  }

  const VortexBillerSearchResult = ({ billers, onBillerSelect }) => billers.map((biller) => (
        <VortexBillerListItem
          id={biller.id}
          title={biller.name}
          category={biller.category}
          onClick={() => {
            onBillerSelect(biller)
          }}
        />
      ))

  const VortexBillerSearch = ({ onInput }) => {
    const [input, setInput] = useState("")
    const delay = (function (callback, ms) {
      let timer = 0
      return function (callback, ms) {
        clearTimeout(timer)
        timer = setTimeout(callback, ms)
      }
    })()

    const searchAfterDelay = (e) => {
      setInput(e.target.value)
      delay(() => {
        // search here
        onInput(e.target.value)
      }, 1000)
    }

    return (
      <div
        style={{
          margin: "1em",
        }}
      >
        <div className="heading-search-container">
          <div className="heading-search-shape" style={{display: "flex"}}>
            <InputBase
              disabled={false}
              style={{
                width: "100%",
                fontFamily: "montserrat",
                fontSize: "1em",
                fontWeight: "500",
                color: "#6b6b6b",
                paddingLeft: "0.3em",
                zIndex: 999,
              }}
              placeholder="Search for products here"
              onInput={searchAfterDelay}
              value={input}
            />
            {input?.length > 0 && (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                style={{
                  color: "grey",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  setInput("")
                  onInput("")
                }}
              >
                X
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // This will display billers by category
  const BillersListByCategory = () => {
    if (currentSelectedCategory === null) {
      return <div />
    }

    return (
      <Box>
        <VortexFormToolbar
          title={"Bills"}
          onClickBack={() => {
            stepBack()
          }}
        />
        <Toolbar />
        <List
          dense
          sx={{ width: "100%", bgcolor: "background.paper", marginLeft: "1em" }}
        >
          {renderData.map((v) => (
              <VortexBillerCard
                title={v.name}
                onClick={() => {
                  setSelectedBiller(v);
                  setActiveStep(1);
                }}                
              />
            ))}
        </List>
      </Box>
    )
  }

  // This is the main layout for biller details
  const BillerDetails = () => {
    const [billerDetails, setbillerDetails] = useState(null)
    const [isLoadingBiller, setIsLoadingBiller] = useState(false)

    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoadingBiller(true);
          const vortexTokenResponse = await getVortexTokenBase();
          
          if (vortexTokenResponse.status === 200) {
            const vortextTokenResult = await vortexTokenResponse.json();
            const response = await getBillerById(
              vortextTokenResult.access_token,
              selectedBiller.id
            );
            
            if (response.status === 200) {
              const result = await response.json();
              // console.log(result);
              setbillerDetails(result);
              setIsLoadingBiller(false);
            }
          } else {
            setIsLoadingBiller(false);
          }
        } catch (error) {
          console.error(error);
          setIsLoadingBiller(false);
        }
      };
    
      fetchData();
    }, []);

    if (isLoadingBiller) {
      return <CenteredProgress />
    }

    return (
      <Box>
          <Box>
            <VortexFormToolbar
              title={"Bills"}
              onClickBack={() => {
                setActiveStep(0);
              }}
            />
            <Toolbar />
            <Box style={{ margin: "1em", paddingTop: "1em" }}>
              <Stack spacing={1} textAlign={"center"}>
                <Stack direction={"row"} justifyContent={"center"}>
                  <VortexBillerLogoComponent
                    id={billerDetails?.id}
                    billerName={billerDetails?.name}
                    altComponent={
                      <BillerIcon categoryName={billerDetails?.category} />
                    }
                  />
                </Stack>
                <Typography
                  color="gray"
                  style={{ fontSize: "1.5em", fontWeight: "bold" }}
                >
                  {billerDetails?.name.toUpperCase()}
                </Typography>
                <Alert severity="info" style={{display: "flex", alignSelf: "center"}}>
                  <AlertTitle>Please note</AlertTitle>
                  <Stack textAlign={"start"}>
                    <Typography fontSize={10}>
                      {" "}
                      1. Input the exact amount based on customer's provided
                      bill. (Ex. 8016.40 instead of 8,016.4)
                    </Typography>
                    <Typography fontSize={10}>
                      2. Bills, especially utility bills, should be processed on
                      or Before due date.
                    </Typography>
                    <Typography fontSize={10}>
                      3. Make sure to check previous SUCCESSFUL transactions to
                      avoid double transaction.
                    </Typography>
                  </Stack>
                </Alert>
                <BillerFormGenerator formFields={billerDetails?.form} />
              </Stack>
            </Box>
          </Box>
      </Box>
    )
  }

  // This will generate the form base on the response
  const BillerFormGenerator = ({ formFields = [] }) => {
    const [isFormLoading, setIsFormLoading] = useState(false)

    // for (let index = 0; index < formFields?.length; index++) {
    //   initValues[`${formFields[index]?.fieldRules[0].elementName}`] = ""
    // }

    const formSchema = yup.object({
      AmountDue: yup
        .number()
        .oneOf(
          [yup.ref("AmountPaid"), null],
          "AmountDue and Amount paid must match"
        ),
      AmountPaid: yup
        .number()
        .oneOf(
          [yup.ref("AmountDue"), null],
          "AmountDue and AmountPaid must match"
        ),
    })

    // console.log(formFields)

    return (
      <Box>
        <Formik
          initialValues={inputFormData}
          onSubmit={async (data) => {
            try {
              // console.log(data)
              setinputFormData(data)

              // setIsFormLoading(true)

              // todo: add minimum value for money validation - can't add it on html form as we are using strings

              if (Reflect.has(data, "billAmount"))
                data.billAmount = parseFloat(data.billAmount).toFixed(2)

              if (Reflect.has(data, "AmountPaid"))
                data.AmountPaid = parseFloat(data.AmountPaid).toFixed(2)

              if (Reflect.has(data, "amount"))
                data.amount = parseFloat(data.amount).toFixed(2)

              const { convenienceFee, grandTotalFee } = getServiceFee({
                amount: data?.billAmount || data?.AmountPaid || data?.amount,
                currency: platformVariables.currency,
              })

              // console.log("Grand total", platformVariables.billsCurrencyToPeso)

              const collectedBillDetails = {
                ...trimObjValues(data),
                name: `${data.first_name} ${data.last_name}`, // Concatenate first name and last name
                accountNumber: data.account_number, // Capture the account number
              };
          
              // Log the collected bill details including Name and Account Number
              // console.log("billDetails with Name and Account Number:", collectedBillDetails);
              
              // Update the billDetails state with the collected data
              setBillDetails(collectedBillDetails);
          
              // Proceed to the next step
              stepForward();

              // const reqInputPayload = {
              //   billerId: selectedBiller.id,
              //   billDetails: { ...collectedBillDetails },
              //   callbackUrl: "app.sparkles.com.ph",
              // }

              // const result = await saveVortexBillsPaymentTransaction({
              //   requestInputPayload: reqInputPayload,
              //   totalAmount: grandTotalFee,
              // })

              // setTransactionDocId(result._id)

              // setTransactionReferenceId(result.referenceNumber)

              // setIsFormLoading(false)

              // setBillDetails(collectedBillDetails)

              // stepForward()

              
            } catch (error) {
              setErrorData({
                isError: true,
                message: `${error}`,
              })
            }
          }}
          validationSchema={formSchema}
        >
          {({ handleChange, values }) => (
            <Form>
              <Stack spacing={2} margin={2}>
                {formFields.map((v) => {
                  // Date input
                  if (v?.fieldRules[0]?.inputType === "date") {
                    const date = new Date()
                    const today = `${date.getFullYear()}-${date
                      .getMonth()
                      .toString()
                      .padStart(2, 0)}-${date
                        .getDay()
                        .toString()
                        .padStart(2, 0)}`

                    return (
                      <TextField
                        name={v?.fieldRules[0]?.elementName}
                        helperText={v?.fieldName}
                        required={v?.fieldRules[0]?.requiredField}
                        type={v?.fieldRules[0]?.inputType}
                        disabled={
                          v?.fieldRules[0]?.state !== "enabled"
                        }
                        hidden={v?.fieldRules[0]?.hidden}
                        inputProps={{
                          maxLength: v?.fieldRules[0]?.maxFieldLength,
                          minLength: v?.fieldRules[0]?.minFieldLength,
                        }}
                        onChange={handleChange}
                      />
                    )
                  }

                  // Select or drop down input
                  if (v?.fieldRules[0]?.inputType === "select") {
                    const selectOptions =
                      v?.fieldRules[0]?.inputTypeOption.split(",")
                    return (
                      <FormControl>
                        <InputLabel id="demo-simple-select-helper-label">
                          {v?.fieldName}
                        </InputLabel>
                        <Select
                          name={v?.fieldRules[0]?.elementName}
                          label={v?.fieldName}
                          required={v?.fieldRules[0]?.requiredField}
                          type={v?.fieldRules[0]?.inputType}
                          disabled={
                            v?.fieldRules[0]?.state !== "enabled"
                          }
                          onChange={handleChange}
                        >
                          {selectOptions.map((option) => (
                            <MenuItem value={option.split(":")[0]}>
                              {option.split(":")[1]}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {v?.fieldRules[0]?.inputFormat}
                        </FormHelperText>
                      </FormControl>
                    )
                  }

                  if (v?.fieldRules[0]?.inputType === 'text' && v?.fieldRules[0]?.elementName === 'mobile_number') {
                    return <PhoneTextfield
                      countryCodeIndex={971}
                      name={v?.fieldRules[0]?.elementName}
                      label={v?.fieldName}
                      required={v?.fieldRules[0]?.requiredField}
                      type={v?.fieldRules[0]?.inputType}
                      disabled={
                        v?.fieldRules[0]?.state !== "enabled"
                      }
                      hidden={v?.fieldRules[0]?.hidden}
                      inputProps={{
                        datatype: v?.fieldRules[0]?.dataType,
                        maxLength: v?.fieldRules[0]?.maxFieldLength,
                        minLength: v?.fieldRules[0]?.minFieldLength,
                      }}
                      helperText={v?.fieldRules[0]?.inputFormat}
                    />
                  }

                  // Default text input
                  return (
                    <VortexCustomTextField
                      name={v?.fieldRules[0]?.elementName}
                      label={v?.fieldName}
                      required={v?.fieldRules[0]?.requiredField}
                      type={v?.fieldRules[0]?.inputType}
                      disabled={
                        v?.fieldRules[0]?.state !== "enabled"
                      }
                      hidden={v?.fieldRules[0]?.hidden}
                      inputProps={{
                        datatype: v?.fieldRules[0]?.dataType,
                        maxLength: v?.fieldRules[0]?.maxFieldLength,
                        minLength: v?.fieldRules[0]?.minFieldLength,
                      }}
                      helperText={v?.fieldRules[0]?.inputFormat}
                    />
                  )
                })}
                <Button
                  disabled={isFormLoading}
                  variant="contained"
                  type="submit"
                  sx={{
                    width: "100%",
                    marginTop: "1em",
                    borderRadius: "2em",
                    height: "3em",
                    color: "white !important",
                    background: "blue !important",
                  }}
                >
                  {isFormLoading ? "Please wait..." : "CONTINUE"}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Box sx={{ height: "10em" }} />
      </Box>
    )
  }

  const createLink = async (amount, description) => {
    // console.log(`Creating link with amount: ${amount} and description: ${description}`);
    const url = 'https://api.paymongo.com/v1/links';
  
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', 'Basic c2tfdGVzdF84VWhHVXBBdVZEWVBKU3BHRWVpV250Qm46');
    // console.log(amount, description)
    // console.log(parseInt(parseInt(amount, 10)*100, 10))
    const raw = JSON.stringify({
      data: {
        attributes: {
          amount,
          description,
          remarks: 'remarks test',
        },
      },
    });
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
  
    try {
      const response = await fetch(url, requestOptions);
  
      if (response.ok) {
        const responseData = await response.json();
        return responseData.data.attributes.checkout_url;
      }
  
      const textResult = await response.text();
      return null;
    } catch (error) {
      console.error('Error while making the request:', error);
      return null;
    }
  };

  const ReviewConfirmationForm = () => {
    const paymentMethodType = ls.get("paymentMethodType")
    const fields = jsonFieldsToArray(billDetails);
    // console.log("Transformed fields:", fields);
    
    // let [paymentDetails, setPaymentDetails] = useState({})

    // const { email, name, phone, address } = getUser()

    const { convenienceFee, grandTotalFee } = getServiceFee({
      amount:
        billDetails?.billAmount ||
        billDetails?.AmountPaid ||
        billDetails?.amount,
      currency: "PHP",
    })

    const [isLoadingPrivate, setIsLoadingPrivate] = useState(false); // true for render testing
    const [isPaymentMethodGCash, setisPaymentMethodGCash] = useState(false)
    const [expanded, setExpanded] = useState("panel1")

    const handleAccordionChange = (panel) => (event, isExpanded) => {
      // console.log(panel, isExpanded)
      // setExpanded(isExpanded ? panel : false)
      if (panel === "panel1" && isExpanded === false) {
        setExpanded("panel2")
      } else if (panel === "panel1" && isExpanded) {
        setExpanded("panel1")
      } else if (panel === "panel2" && isExpanded === false) {
        setExpanded("panel1")
      } else if (panel === "panel2" && isExpanded) {
        setExpanded("panel2")
      }
    }

    const simulateTransactionFailure = () => {
      setActiveStep(4);
    };

    return (
      <Box>
        
          <div style={{ zIndex: 0 }}>
            {/* {isLoading && <CenteredProgress />} */}
            {!isLoadingPrivate && (
              <>
                <VortexFormToolbar
                  title={"Bills payment"}
                  onClickBack={() => {
                    setActiveStep(1);
                  }}
                />
                <Toolbar />
                <Box style={{ margin: "2em 1em 1em 1em  " }}>
                  <Stack style={{ margin: "0.5em" }}>
                    <Typography
                      style={{
                        color: "#0060bf",
                        marginTop: "1em",
                      }}
                      fontWeight={"bold"}
                      fontSize={30}
                    >
                      Account Details
                    </Typography>
                    <Divider />
                  </Stack>
                  <Stack spacing={2} style={{ marginBottom: "1em" }}>
                    {/* <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography
                        fontWeight={"bold"}
                        style={{
                          color: "grey",
                        }}
                        sx={{ textTransform: "capitalize" }}
                      >
                        Account Name
                      </Typography>

                      <Typography fontWeight={"bold"}>
                        {paymentDetails?.name}
                      </Typography>
                    </Stack> */}
                    {fields.map((field, index) => (
                      <Stack
                        key={index}
                        direction={"row"}
                        justifyContent={"space-between"}
                      >
                        <Typography
                          fontWeight={"bold"}
                          style={{
                            color: "grey",
                          }}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {field[0]
                            .replace("_", " ")
                            .trim()
                            .replace(/[A-Z]/g, " $&")
                            .trim()}
                        </Typography>

                        <Typography
                          fontWeight={"bold"}
                          style={{ color: "black" }} 
                        >
                          {field[1]}
                        </Typography>
                      </Stack>
                    ))}
                  <Divider />

                  <Typography
                    style={{
                      color: "black", 
                      marginTop: "1em",
                    }}
                    fontWeight={"bold"}
                    fontSize={15}
                  >
                    You're about to pay
                  </Typography>

                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography
                      fontWeight={"bold"}
                      style={{ color: "black" }}
                      sx={{ textTransform: "capitalize" }}
                    >
                      Convenience Fee
                    </Typography>

                    <Typography
                      fontWeight={"bold"}
                      style={{ color: "black", marginRight: "2em" }}
                    >
                      {expanded === "panel2" ? "0 PHP" : `${(convenienceFee && !Number.isNaN(parseFloat(convenienceFee)) ? parseFloat(convenienceFee).toFixed(2) : '0')} 
                      ${platformVariables.currencySymbol || 'PHP'}`}
                    </Typography>
                  </Stack>

                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography
                      fontWeight={"bold"}
                      style={{ color: "black" }}
                    >
                      Total Amount
                    </Typography>
                    <Typography
                      fontWeight={"bold"}
                      style={{ color: "black", marginRight: "2em" }}
                    >
                      {`${(Number.isNaN(parseFloat(convenienceFee)) || convenienceFee == null ? 0 : parseFloat(convenienceFee)) + parseFloat(billDetails?.billAmount || 0)
                      } ${platformVariables.currencySymbol || 'PHP'}`}
                    </Typography>
                  </Stack>

                  <Box height={20} />
                  <Button
                    disabled={isLoadingPrivate}
                    variant="outlined"
                    onClick={async () => {
                      const grandTotalFee = (Number.isNaN(parseFloat(convenienceFee)) || convenienceFee == null ? 0 : parseFloat(convenienceFee)) + parseFloat(billDetails?.billAmount || 0);
                      const url = await createLink(grandTotalFee * 100, `Payment for ${selectedBiller?.name}`);
                      const paymentWindow = window.open(url, '_blank');
                      // console.log('Link Created: ', createLink);
                      // console.log('Amount: ', grandTotalFee);
                      // console.log('Description: ', `Payment for ${selectedBiller?.name}`);
                      // 'https://pm.link/123123123123123za23/test/de4YiYw'
                      // Polling to check if the payment window has been closed
                      const paymentWindowClosed = setInterval(() => {
                        if (paymentWindow.closed) {
                          clearInterval(paymentWindowClosed);
                          // Once the payment window is closed, set the transaction data
                          setTransactionDetails({
                            productName: `Payment for ${selectedBiller?.name}`,
                            price: billDetails?.billAmount || billDetails?.AmountPaid || billDetails?.amount,
                            convenienceFee,
                            totalPrice: grandTotalFee,
                            currency: platformVariables?.currencySymbol,
                          });
                          setActiveStep(3);
                        }
                      }, 500);
                      // setIsLoadingTransaction(true)
  
                      // const sure = window.confirm(`Are you sure you received: ${grandTotalFee} ${platformVariables?.currencySymbol}?`)
  
                      // if (sure)
                      //   await handleVortexCashRequest({
                      //     docId: transactionDocId,
                      //     total: grandTotalFee
                      //   })
                      // else
                      //   setIsLoadingTransaction(false)
                    }}
                    >
                      {isLoadingPrivate ? "Please wait..." : "PAY"}
                    </Button>
                  </Stack>

                  {/* <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Credit/Debit Card</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <PayPalScriptProvider
                        options={{
                          "client-id": process.env.GATSBY_PAYPAL_CLIENT_ID,
                          currency: "PHP",
                        }}
                      >
                        <PayPalButtons
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    //Vortex transaction amount
                                    value: grandTotalFee,
                                  },
                                  description: `Payment for ${selectedBiller?.name}`,
                                },
                              ],
                              application_context: {
                                brand_name: "Sparkle Star International",
                                shipping_preference: "NO_SHIPPING",
                              },
                            })
                          }}
                          onApprove={(data, actions) => {
                            return actions.order.capture().then(async (details) => {
                              let paymentData = {
                                data: data,
                                details: details,
                              }

                              await handleVortexRequest({
                                docId: transactionDocId,
                                paymentData: paymentData,
                              })
                            })
                          }}
                          style={{ layout: "vertical" }}
                        />
                      </PayPalScriptProvider>
                    </AccordionDetails>
                  </Accordion> */}
                  {/* <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography>e-Wallet</Typography>
                    </AccordionSummary>
                    <AccordionDetails> */}
                  {/* <Typography>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                      malesuada lacus ex, sit amet blandit leo lobortis eget.
                    </Typography> */}

                  {/* </AccordionDetails>
                  </Accordion> */}

                <Box textAlign="center" mt={1.5}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={simulateTransactionFailure}
                    style={{ marginLeft: '10px', marginTop: '10px' }}
                  >
                    Test Fail
                  </Button>
                </Box>
              </Box>
              </>
            )}
            <Backdrop
              sx={{ zIndex: 900 }}
              open={isLoadingPrivate}
              onClick={() => { }}
            >
              <CircularProgress />
            </Backdrop>
          </div>
        
       </Box>
    )
  }

  const TransactionCompletedForm = ({ setActiveStep, transactionDetails, billDetails }) => {
    const handleConfirmClick = () => {
      setActiveStep(0); 
    };

    const fullName = `${billDetails.first_name} ${billDetails.last_name}`;

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100vh',
          p: 3,
          border: '2px dashed grey',
          borderRadius: '10px',
          m: 2,
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        <Typography variant="h4" textAlign="center" mt={2} mb={4} fontWeight="bold" color="black">
          TRANSACTION RECEIPT
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography color="black">Name:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography color="black">{fullName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="black">Account Number:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography color="black">{billDetails.account_number}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="black">Product Name:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography color="black">
              {transactionDetails.productName.replace('Payment for ', '')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="black">Price:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography color="black">{transactionDetails.price}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography color="black">Convenience Fee:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography color="black">
              {Number.isFinite(transactionDetails.convenienceFee) ?
                `${transactionDetails.convenienceFee}` :
                `0`}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography color="black">Total Price:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography color="black">
              {`${Number(transactionDetails.totalPrice).toFixed(2)}`}
            </Typography>
          </Grid>
        </Grid>
        <Box textAlign="center" mt={10}>
          <Button variant="outlined" color="primary" onClick={handleConfirmClick}>
            Confirm Transaction
          </Button>
        </Box>
      </Box>
    );
  };

  const TransactionFailedForm = ({ setActiveStep }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          p: 3,
          border: '2px dashed grey',
          borderRadius: '10px',
          m: 2,
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        <Typography variant="h5" textAlign="center" mt={2} mb={4} fontWeight="bold" color="black">
          Transaction was not completed
        </Typography>
        <Box textAlign="center" mt={3}>
          <Button variant="outlined" color="primary" onClick={() => setActiveStep(2)} sx={{ mr: 2 }}>
            Try Again
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setActiveStep(0)}>
            Home
          </Button>
        </Box>
      </Box>
    );
  };
  
  function FormRender(step) {
    switch (step) {
      case 0:
        return <BillsPaymentCategoriesPage />;
      case 1:
        return <BillerDetails />;
      case 2:
        return <ReviewConfirmationForm setActiveStep={setActiveStep} setBillDetails={setBillDetails} transactionDetails={setTransactionDetails} />;
      case 3:
        return <TransactionCompletedForm setActiveStep={setActiveStep} transactionDetails={transactionDetails} billDetails={billDetails} />;
      case 4:
        return <TransactionFailedForm setActiveStep={setActiveStep} />;
      default:
        return <BillsPaymentCategoriesPage />;
    }
  }  

  return (
    <>
    <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            // pointerEvents: 'none',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#fff',
            color: 'white',
            fontSize: '1.5rem',
          }}>
            {/* center the whole content using 50% of the screen on desktop and full on mobile */}
            {/* <div className="flex flex-col justify-center items-center w-full md:w-1/2 mx-auto"> */}
              <Box style={{
                width: '100%',
                height: '100%',
                // marginTop: '14em',
              }}>
                {FormRender(activeStep)}
              </Box>
          {/* </div> */}
      </div>
      <VortexBottomGradient />


      {platformVariables?.enableBills === false && <ServiceDisabledPrompt />}
      {storeStatus === 0 && <StoreBlockPrompt />}
      {userStatus === 0 && <BlockPrompt />}
      {userStatus === 1 && storeStatus === 1 && platformVariables?.enableBills && (
        <div>
          <Backdrop sx={{ zIndex: 900 }} open={isLoading} onClick={() => { }}>
            <CircularProgress />
          </Backdrop>
          {error.isError ? (
            <VortexError
              message={error.message}
              onClick={() => {
                setErrorData({
                  isError: false,
                  message: "",
                })
                setActiveStep(0)
              }}
            />
          ) : (
            <div
              style={{
                marginBottom: "5em",
              }}
            >
              {FormRender(activeStep)}
            </div>
          )}
          <VortexBottomGradient />
          <BottomNavigator />
        </div>
      )}
    </>
  )
}

export default VortexBillsPaymentPage
