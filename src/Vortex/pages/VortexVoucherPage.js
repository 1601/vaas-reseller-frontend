import React, { useState, useEffect, useReducer, useContext } from "react"
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListSubheader,
  Stack,
  TextField,
  Toolbar,
  Typography,
  badgeUnstyledClasses,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { navigate } from "gatsby"
import VortexVoucherCard from "../components/VortexVoucherCard"

//Mock data

import VortexFormToolbar from "../components/VortexFormToolbar"
import {
  IsloadingProducts,
  ReloadProductsTrigger,
  VortexContextError,
  VortextProducts,
} from "../context/VortexContext"
import { getVortexTokenBase } from "../../api/public/vortex/token_service"
import { getPlatformVariables } from "../../api/public/platform_vars"
import { Form, Formik } from "formik"
import { createGiftPurchaseTransaction } from "../../api/public/vortex/gifts_service"
import NoDataFound from "../../misc/NoDataFound"
import VortexError from "../components/VortexError"
import { LoginState, PlatformVariables, StoreStatus, UserStatus } from "../../globalstates"
import Login from "../../LoginPage"
import { saveVortexGiftTransaction, updateVortexByRefId } from "../../api/public/vortex/transaction_db"
import MobileNumberFormat from "../../misc/number_formats/MobileNumberFormat"
import { sentryCatchException } from "../../../services/sentry/sentry"
import AnchorLink from "react-anchor-link-smooth-scroll"
import useLoggedUser from "../../../custom-hooks/useLoggedUser"
import { sparkleVoucherFee } from "../config/config"
import SecureLS from "secure-ls"
import * as yup from "yup"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import LoginPage from "../../LoginPage"
import { primaryVortexTheme } from "../config/theme"
import PhoneTextfield from "../../Textfields/PhoneTextfield"

import VortexBottomGradient from "../components/VortexBottomGradient"
import BottomNavigator from "../../Homemade/BottomNavigator"
import VortexVoucherCategories from "../components/VortexVoucherCategories"

import * as voucherFunctions from "../functions/categorizeVouchers"
import trimObjValues from "../../../helpers/trimobjectvalues"

import VortexVoucherSearchBar from "../components/VortexVoucherSearchBar"
import BlockPrompt from "../../Prompts/BlockPrompt"
import StoreBlockPrompt from "../../Prompts/StoreBlockPrompt"
import { getStoreEnvById } from "../../../api/public/store-env"
import ServiceDisabledPrompt from "../../Prompts/ServiceDisabledPrompt"

function convertParamToCat(paramCategory) {
  switch (paramCategory) {
    case "electronic_load":
      return "Electronic Load"
    case "food":
      return "Food"
    case "shop":
      return "Shop"
    case "data_bundles":
      return "Data Bundles"
    default:
      return "Electronic Load"
  }
}

//const { height, width } = useWindowDimensions()

const VortexVoucherPage = () => {
  // const params = useParams()

  const [platformVariables, setPlatformVariables] = useContext(PlatformVariables)

  const ls = new SecureLS({ encodingType: "aes" })



  const [error, setErrorData] = useContext(VortexContextError)

  const [userStatus, setUserStatus] = useContext(UserStatus)

  const [storeStatus, setstoreStatus] = useContext(StoreStatus)

  const [transactionDocId, setTransactionDocId] = useState(null)

  const [transactionReferenceId, setTransactionReferenceId] = useState(null)

  const [retry, setRetry] = useContext(ReloadProductsTrigger)

  const [activeStep, setActiveStep] = useState(0)

  const [selectedProduct, setSelectedProduct] = useState({})

  const [data, setData] = useContext(VortextProducts)

  const [isLoading, setisLoading] = useContext(IsloadingProducts)

  const [productCategories, setProductCategories] = useState([])

  const [productSubCategories, setProductSubCategories] = useState([])

  const [transactionDetails, setTransactionDetails] = useState(null)

  const [formData, setFormData] = useState({})

  const [inputFormData, setinputFormData] = useState({ quantity: 1 })

  const { getUser } = useLoggedUser()

  const [isLoggin, setisLoggin] = useContext(LoginState)

  const [isLoadingPrivate, setIsLoadingPrivate] = useState(false)

  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false)


  const [selectedCategory, setSelectedCategory] = useReducer(
    getSubCategories,
    "Food"
  )

  const [selectedSubCategory, setSelectedSubCategory] = useReducer(
    getFoodBySubCategory,
    "Artisan"
  )

  useEffect(async () => {

    let store = ls.get("store")

    let storeEnvId = store?.storeEnv?._id || store?.storeEnv

    let x = await getStoreEnvById({ storeEnvId: storeEnvId })

    setPlatformVariables(x)

  }, [])

  const getServiceFee = ({ amount, currency }) => {
    // let paypalPercentage = amount * 0.0355
    // let foreignFee = amount * 0.01
    // let paypalFee = Math.round(paypalPercentage) + Math.round(foreignFee)
    let amountInDirham = parseFloat(amount / platformVariables.giftCurrencyToPeso).toFixed(2)
    let convenienceFee = parseFloat(platformVariables.giftConvenienceFee).toFixed(2); //convenience fee only for bills/vouchers  -platformVariables.convenienceFeeInDirham
    let grandTotalFee = parseFloat(amountInDirham) + parseFloat(convenienceFee)


    return { convenienceFee, grandTotalFee }
  }

  const stepForward = () => {
    setActiveStep(activeStep + 1)
  }

  const stepBack = () => {
    setActiveStep(activeStep - 1)
  }

  async function getCategories() {
    try {
      if (data.length > 0) {
        setisLoading(true)

        let filteredCat = []

        for (let index = 0; index < data.length; index++) {
          if (data[index].brand === "GIFT") {
            if (!filteredCat.includes(data[index].category)) {
              filteredCat.push(data[index].category)
            }
          }
        }
        setProductCategories(filteredCat)

        setisLoading(false)
      }
    } catch (error) {
      alert(error)
    }
  }

  async function getSubCategories(state, category) {
    try {
      setisLoading(true)

      let filteredSubCategories = []
      for (let index = 0; index < data.length; index++) {
        if (data[index].category === category) {
          if (!filteredSubCategories.includes(data[index].subcategory)) {
            filteredSubCategories.push(data[index].subcategory)
          }
        }
      }

      setProductSubCategories(filteredSubCategories)

      setisLoading(false)
    } catch (error) {
      alert(error)
    }

    return category
  }

  async function getFoodBySubCategory(state, subCategory) {
    let productsBySubCategory = []

    for (let index = 0; index < data.length; index++) {
      if (data[index].subcategory === subCategory) {
        productsBySubCategory.push(data[index])
      }
    }

    // setRenderData(productsBySubCategory)

    return subCategory
  }

  async function handleVortexRequestGCash({ paymentData }) {
    try {
      setisLoading(true)

      //save transaction only as for manual Gcash
      setTransactionDetails(paymentData)

      let saveTransaction = await updateVortexByRefId({
        refId: transactionReferenceId,
        data: {
          paymentId: "Awaiting for GCash Payment",
          paymentMethod: "GCash",
          totalAmount: paymentData.grandTotalFee
        }
      })

      navigate(`/vortextransactions/gift/${saveTransaction.referenceNumber}`, {
        state: saveTransaction,
      })

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
      let vortexTokenResponse = await getVortexTokenBase()

      if (vortexTokenResponse.status === 200) {
        let vortextTokenResult = await vortexTokenResponse.json()

        let vortexGiftPurchaseTransactionResponse =
          await createGiftPurchaseTransaction({
            access_token: vortextTokenResult.access_token,
            docId: docId,
            clientRequestId: process.env.GATSBY_APP_VORTEX_CLIENTREQID,
            productCode: selectedProduct?.code,
            ...formData,
            paymentId: paymentData?.data?.orderID,
            totalAmount: paymentData?.details?.purchase_units[0]?.amount?.value,
          })

        let vortexGiftPurchaseTransactionResult =
          await vortexGiftPurchaseTransactionResponse.json()

        if (vortexGiftPurchaseTransactionResponse.status === 200) {
          let refNo = vortexGiftPurchaseTransactionResult?.referenceNumber

          //Check if the response is error
          if (typeof refNo === "undefined" || refNo === null) {


            setErrorData({
              isError: true,
              message: `We are now working to fix this! you might wanna try again later`,
            })

            throw Error(`Vortex Gift Request Error`)
          } else {

            navigate(
              `/vortextransactions/gift/${vortexGiftPurchaseTransactionResult.referenceNumber}`
            )
          }
        } else {
          let vortexGiftPurchaseTransactionResult =
            await vortexGiftPurchaseTransactionResponse.json()


          setErrorData({
            isError: true,
            message: `We are now working to fix this! you might wanna try again later`,
          })

          throw Error(`Vortex Gift Request Error`)


        }
      } else {
        let vortextTokenResult = await vortexTokenResponse.json()


        setErrorData({
          isError: true,
          message: `We are now working to fix this! you might wanna try again later`,
        })

        throw Error(
          `Vortex Gift Request Error ${vortextTokenResult?.error?.message}`
        )
      }
    } catch (error) {
      setErrorData({
        isError: true,
        message: `${error}`,
      })
      sentryCatchException({ error: error })
      throw Error(error)
    }
  }

  async function handleVortexCashRequest({ docId, total }) {
    try {
      let vortexTokenResponse = await getVortexTokenBase()

      if (vortexTokenResponse.status === 200) {
        let vortextTokenResult = await vortexTokenResponse.json()

        let vortexGiftPurchaseTransactionResponse =
          await createGiftPurchaseTransaction({
            access_token: vortextTokenResult.access_token,
            docId: docId,
            clientRequestId: process.env.GATSBY_APP_VORTEX_CLIENTREQID,
            productCode: selectedProduct?.code,
            ...formData,
            paymentId: "Payment via Store",
            totalAmount: total,
            oneAedToPhp: platformVariables.giftCurrencyToPeso,
            convenienceFee: platformVariables.giftConvenienceFee,
            currencyToPhp: platformVariables?.giftCurrencyToPeso,
            currencySymbol: platformVariables?.currencySymbol
          })

        let vortexGiftPurchaseTransactionResult =
          await vortexGiftPurchaseTransactionResponse.json()

        console.log(vortexGiftPurchaseTransactionResult)

        if (vortexGiftPurchaseTransactionResponse.status === 200) {
          let refNo = vortexGiftPurchaseTransactionResult?.referenceNumber

          //Check if the response is error
          if (typeof refNo === "undefined" || refNo === null) {

            alert("Kindly check the details of transaction. Transaction failed. ")
            setIsLoadingTransaction(false)
            // setErrorData({
            //   isError: true,
            //   message: `We are now working to fix this! you might wanna try again later`,
            // })

            // throw Error(`Vortex Gift Request Error`)
          } else {

            console.log("is it successful? - voucher")
            console.log(vortexGiftPurchaseTransactionResult)

            if (vortexGiftPurchaseTransactionResult?.remarks === "Successful") {
              console.log("success")
              navigate(
                `/vortextransactions/gift/${vortexGiftPurchaseTransactionResult.referenceNumber}`
              )
            }


          }
        } else {
          let vortexGiftPurchaseTransactionResult =
            await vortexGiftPurchaseTransactionResponse.json()
          alert("Kindly check the details of transaction. Transaction failed. ")

          // setErrorData({
          //   isError: true,
          //   message: `We are now working to fix this! you might wanna try again later`,
          // })

          // throw Error(`Vortex Gift Request Error`)

          // throw Error(
          //   `Vortex Gift Request Error ${vortexGiftPurchaseTransactionResult.errorCode ||
          //   vortexGiftPurchaseTransactionResult.error ||
          //   vortexGiftPurchaseTransactionResult.message
          //   }`
          // )
        }
      } else {
        let vortextTokenResult = await vortexTokenResponse.json()

        alert("Kindly check the details of transaction. Transaction failed. ")
        // setErrorData({
        //   isError: true,
        //   message: `We are now working to fix this! you might wanna try again later`,
        // })

        // throw Error(
        //   `Vortex Gift Request Error ${vortextTokenResult?.error?.message}`
        // )
      }
    } catch (error) {
      // setErrorData({
      //   isError: true,
      //   message: `${error}`,
      // })
      // sentryCatchException({ error: error })
      // throw Error(error)

      alert(`Kindly check the details of transaction. Transaction failed. ${error}`)
    }
  }
  //FORMS

  const ProductSelectForm2 = () => {
    const [expanded, setExpanded] = React.useState(false)

    const [vouchersList, setVouchersList] = useState([])

    const [renderData, setRenderData] = useState([])

    const [brandRenderData, setBrandRenderData] = useState([])

    // console.log(`Render data length ${renderData.length}`)
    // console.log(`Voucher list length ${vouchersList.length}`)
    //console.log('render data', renderData)
    // console.log('voucher list', vouchersList)

    useEffect(async () => {
      let mounted = true

      if (mounted && data.length > 0) {
        setRenderData([])
        let vouchersList = voucherFunctions.getAllVouchers(data)
        sortAndCategorizeVouchers(vouchersList)
      }

      return () => {
        mounted = false
      }
    }, [data])

    function searchVouchersByKeyword(keyword) {
      if (keyword.trim().length > 0) {
        let result = voucherFunctions.searchVouchersByKeyword(keyword)
        let { brandCategories, voucherList } =
          voucherFunctions.categorizeSearchResult(result)
        setBrandRenderData(brandCategories)
        setRenderData(voucherList)
      } else {
        //show normal list
        let vouchersList = voucherFunctions.getAllVouchers(data)
        sortAndCategorizeVouchers(vouchersList)
      }
    }

    function sortAndCategorizeVouchers(vouchers) {
      console.log("sort and categorize")
      let { brandCategories, voucherList } =
        voucherFunctions.categorizeVouchers(vouchers)
      setBrandRenderData(brandCategories)
      setRenderData(voucherList)
    }

    function getVouchersByBrand(category, brandname) {
      setVouchersList([])

      setTimeout(() => {
        let productsByCategory = renderData.filter(
          (cat) => cat.categoryheader === category
        )

        let vouchersByProducts = productsByCategory[0].products.filter(
          (product) => product.name.includes(brandname)
        )

        setVouchersList(vouchersByProducts)
      }, 10)
    }

    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false)
      setVouchersList([])
    }

    const onVoucherSelect = (product) => {
      setSelectedProduct(product)
      stepForward()
    }

    return (
      <Box>
        <VortexFormToolbar
          title={"Vouchers"}
          onClickBack={() => {
            navigate(-1)
          }}
        />
        <Toolbar />
        <List
          sx={{
            width: "100%",
            maxWidth: "100%",
            bgcolor: "background.paper",
            position: "relative",
            // overflow: "auto", // if enabled would create another scroller and that bigger scroller will move for the anchors ( bug ) category sticky header
            maxHeight: window.innerHeight,
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          <VortexVoucherSearchBar onInput={searchVouchersByKeyword} />
          <VortexVoucherCategories
            brandRenderData={brandRenderData}
            getVouchersByBrand={getVouchersByBrand}
            vouchersList={vouchersList}
            onVoucherSelect={onVoucherSelect}
            handleChange={handleChange}
            expanded={expanded}
          />
          <div style={{ paddingBottom: "10em" }}></div>
        </List>
      </Box>
    )
  }

  const VoucherInputForm = () => {
    return <VoucherInputFormV2 />
  }

  const VoucherInputFormV2 = () => {



    const [isFormLoading, setIsFormLoading] = useState(false)

    const validationSchema = yup.object({
      quantity: yup.number().min(1, "Minimum quantity is 1"),
      senderFirstName: yup.string(),
      senderLastName: yup.string(),
      senderMobile: yup.string().min(11, "Mobile number too short"),
      senderEmail: yup.string().email("Invalid email"),
      recipientFirstName: yup.string(),
      recipientLastName: yup.string(),
      recipientMobile: yup.string().min(11, "Mobile number too short"),
      recipientEmail: yup.string().email("Invalid email"),
    })

    const { email, name, phone } = getUser()

    let FormFields = selectedProduct.catalogForm[0]

    return (
      <Box>
        <VortexFormToolbar
          title={"Vouchers"}
          onClickBack={() => {
            stepBack()
          }}
        />
        <Toolbar />
        {!isLoggin && <Login />}
        {isLoggin && (
          <Box style={{ margin: "1em" }}>
            <Formik
              initialValues={
                inputFormData
              }
              onSubmit={async (data) => {
                try {

                  setinputFormData(data)

                  let { convenienceFee, grandTotalFee } = getServiceFee({
                    amount: selectedProduct.pricing.price * data.quantity,
                    currency: selectedProduct.pricing.unit,
                  })


                  setIsFormLoading(true)

                  let senderName = `${data.senderFirstName.trim()} ${data.senderLastName.trim()}`

                  let recipientName = `${data.recipientFirstName.trim()} ${data.recipientLastName.trim()}`

                  let finalData = {
                    quantity: data.quantity,
                    senderName: senderName,
                    senderMobile: data.senderMobile?.replace("-", ""),
                    senderEmail: data?.senderEmail,
                    recipientName: recipientName,
                    recipientMobile: data.recipientMobile?.replace("-", ""),
                    recipientEmail: data.recipientEmail,
                    message: data.message,
                  }

                  let trimmedFinalData = trimObjValues(finalData)

                  let reqInputPayload = {
                    productCode: selectedProduct?.code,
                    clientRequestId: "",
                    formData: {
                      ...trimmedFinalData
                    },
                  }

                  let result = await saveVortexGiftTransaction({
                    requestInputPayload: reqInputPayload,
                    totalAmount: grandTotalFee
                  })

                  setTransactionDocId(result._id)

                  setTransactionReferenceId(result.referenceNumber)

                  setIsFormLoading(false)

                  setFormData(trimmedFinalData)

                  stepForward()

                } catch (error) {
                  setErrorData({
                    isError: true,
                    message: `${error}`,
                  })
                }
              }}
              validationSchema={validationSchema}
            >
              {({ handleChange, values, errors }) => {
                return (
                  <Form>
                    <Stack spacing={2}>
                      <Typography variant="h5">
                        Please fill all fields
                      </Typography>

                      <TextField
                        name={"quantity"}
                        onChange={handleChange}
                        label={"Quantity"}
                        type={"number"}
                        placeholder={"Enter Quantity"}
                        required
                        value={values.quantity}
                        error={errors.quantity}
                        helperText={errors.quantity}
                      />
                      <TextField
                        name={"senderFirstName"}
                        onChange={handleChange}
                        label={"Sender's First Name"}
                        type={"text"}
                        placeholder={"Enter Sender's First Name"}
                        required
                        value={values.senderFirstName}
                        error={errors.senderFirstName}
                        helperText={errors.senderFirstName}
                      />
                      <TextField
                        name={"senderLastName"}
                        onChange={handleChange}
                        label={"Sender's Last Name"}
                        type={"text"}
                        placeholder={"Enter Sender's Last Name"}
                        required
                        value={values.senderLastName}
                        error={errors.senderLastName}
                        helperText={errors.senderLastName}
                      />
                      <PhoneTextfield
                        name={"senderMobile"}
                        label={"Sender mobile number"}
                        countryCodeIndex={63}
                        placeholder={"Sender's mobile number"}
                        value={values.senderMobile}
                      />
                      <TextField
                        name={"senderEmail"}
                        onChange={handleChange}
                        label={"Sender's Email Address"}
                        type={"text"}
                        placeholder={"Enter Sender's Email Address"}
                        required
                        value={values.senderEmail}
                        error={errors.senderEmail}
                        helperText={errors.senderEmail}
                      />
                      <TextField
                        name={"recipientFirstName"}
                        onChange={handleChange}
                        label={"Recipient's First Name"}
                        type={"text"}
                        placeholder={"Enter Recipient's First Name"}
                        required
                        value={values.recipientFirstName}
                        error={errors.recipientFirstName}
                        helperText={errors.recipientFirstName}
                      />
                      <TextField
                        name={"recipientLastName"}
                        onChange={handleChange}
                        label={"Recipient's Last Name"}
                        type={"text"}
                        placeholder={"Enter Recipient's Last Name"}
                        required
                        value={values.recipientLastName}
                        error={errors.recipientLastName}
                        helperText={errors.recipientLastName}
                      />
                      <PhoneTextfield
                        name={"recipientMobile"}
                        label={"Recipient's Mobile Number"}
                        countryCodeIndex={63}
                        placeholder={"Recipient's Mobile Number"}
                        value={values.recipientMobile}
                      />
                      <TextField
                        name={"recipientEmail"}
                        onChange={handleChange}
                        label={"Recipient's Email Address"}
                        type={"text"}
                        placeholder={"Enter Recipient's Email Address"}
                        required
                        value={values.recipientEmail}
                        error={errors.recipientEmail}
                        helperText={errors.recipientEmail}
                      />
                      <TextField
                        name={"message"}
                        onChange={handleChange}
                        label={"Message to Recipient"}
                        type={"text"}
                        placeholder={"Enter Message to Recipient"}
                        required
                        value={values.message}
                        error={errors.message}
                        helperText={errors.message}
                      />

                      <Divider />
                      <Button
                        variant="contained"
                        type={"submit"}
                        disabled={isFormLoading}
                        sx={{
                          width: "100%",
                          borderRadius: "2em",
                          marginTop: "1em",
                          borderRadius: "10em",
                          background: primaryVortexTheme.button,
                          height: "3em",
                          color: "white",
                        }}
                      >
                        {isFormLoading ? "Please wait..." : "CONTINUE"}
                      </Button>
                    </Stack>
                  </Form>
                )
              }}
            </Formik>
          </Box>
        )}
      </Box>
    )
  }

  const ReviewConfirmationForm = () => {
    let paymentMethodType = ls.get("paymentMethodType")

    const { email, name, phone, address } = getUser()

    let { convenienceFee, grandTotalFee } = getServiceFee({
      amount: selectedProduct.pricing.price * formData.quantity,
      currency: selectedProduct.pricing.unit,
    })

    const [isPaymentMethodGCash, setisPaymentMethodGCash] = useState(false)
    const [expanded, setExpanded] = useState("panel1")

    const handleAccordionChange = (panel) => (event, isExpanded) => {
      console.log(panel, isExpanded)
      // setExpanded(isExpanded ? panel : false)
      if (panel === "panel1" && isExpanded == false) {
        setExpanded("panel2")
      } else if (panel === "panel1" && isExpanded) {
        setExpanded("panel1")
      } else if (panel === "panel2" && isExpanded == false) {
        setExpanded("panel1")
      } else if (panel === "panel2" && isExpanded) {
        setExpanded("panel2")
      }
    }
    return (
      <Box>
        {!isLoggin ? (
          <LoginPage />
        ) : (
          <Box style={{ margin: "2em 1em 1em 1em" }}>
            <VortexFormToolbar
              title={"Vouchers Payment"}
              onClickBack={() => {
                stepBack()
              }}
            />
            <Toolbar />
            <Stack spacing={2}>
              <Typography
                fontWeight={"bold"}
                fontSize={20}
                textAlign={"center"}
                style={{
                  color: "#0060bf",
                }}
              >
                {"Review details of your transaction"}
              </Typography>
              <Divider />

              <Typography
                fontWeight="bold"
                style={{
                  color: "#0060bf",
                }}
              >
                Sender Details
              </Typography>

              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography fontWeight={"bold"}>{`Sender Name: `}</Typography>
                <Typography
                  fontWeight={"bold"}
                >{`${formData.senderName}`}</Typography>
              </Stack>

              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography fontWeight={"bold"}>{`Sender Mobile: `}</Typography>
                <Typography
                  fontWeight={"bold"}
                >{`${formData.senderMobile}`}</Typography>
              </Stack>

              <Typography
                fontWeight="bold"
                style={{
                  color: "#0060bf",
                  marginTop: "2em",
                }}
              >
                Receiver Details
              </Typography>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography
                  fontWeight={"bold"}
                >{`Recipient Name: `}</Typography>

                <Typography
                  fontWeight={"bold"}
                >{`${formData.recipientName}`}</Typography>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography
                  fontWeight={"bold"}
                >{`Receiver Mobile: `}</Typography>

                <Typography
                  fontWeight={"bold"}
                >{`${formData.recipientMobile}`}</Typography>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography fontWeight={"bold"}>{`Product: `}</Typography>

                <Typography
                  fontWeight={"bold"}
                >{` ${selectedProduct.name}`}</Typography>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography
                  fontWeight={"bold"}
                >{`Payment Method: `}</Typography>

                <Typography
                  fontWeight={"bold"}
                >{` ${paymentMethodType}`}</Typography>
              </Stack>

              <Divider />

              <Typography
                fontWeight="bold"
                style={{
                  color: "#0060bf",
                  marginTop: "2em",
                }}
              >
                Product Details
              </Typography>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography fontWeight={"bold"}>{`Quantity: `}</Typography>
                <Typography
                  fontWeight={"bold"}
                >{`${formData.quantity}`}</Typography>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography fontWeight={"bold"}>{`Product price: `}</Typography>
                <Typography
                  fontWeight={"bold"}

                >{`${parseFloat(selectedProduct.pricing.price / platformVariables.giftCurrencyToPeso).toFixed(2)} ${platformVariables.currencySymbol}`}</Typography>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography
                  fontWeight={"bold"}
                >{`Total Product Price: `}</Typography>
                <Typography fontWeight={"bold"}
                >
                  {`${(parseFloat(selectedProduct.pricing.price / platformVariables.giftCurrencyToPeso).toFixed(2)) * formData.quantity} ${platformVariables.currencySymbol}`}</Typography>
              </Stack>

              <Divider />
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography
                  fontWeight={"bold"}
                >{`Convenience Fee: `}</Typography>
                {expanded === "panel2" ? (
                  <Typography
                    fontWeight={"bold"}
                  >{`0 ${platformVariables.currency}`}</Typography>
                ) : (
                  <Typography
                    fontWeight={"bold"}

                  >{`${convenienceFee} ${platformVariables.currencySymbol}`}</Typography>
                )}
              </Stack>
              {/* <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography fontWeight={"bold"}>{`Foreign Fee: `}</Typography>
                <Typography
                  fontWeight={"bold"}
                >{`${foreignFee} DIRHAM`}</Typography>
              </Stack> */}
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                style={{ color: "grey" }}
              >
                <Typography
                  fontWeight={"bold"}
                >{`Total amount to pay: `}</Typography>
                <Typography
                  fontWeight={"bold"}
                >{`${grandTotalFee} ${platformVariables.currencySymbol}`}</Typography>
              </Stack>

              <Divider />
              <Box height={20} />
              <Button
                id="checkout-button"
                disabled={isLoadingTransaction}
                variant="contained"
                onClick={async () => {
                  const url = 'https://pm.link/123123123123123za23/test/DGSwn7b';
      window.open(url, '_blank');
                  // setIsLoadingTransaction(true)

                  // let sure = window.confirm(`Are you sure you received: ${grandTotalFee} ${platformVariables.currencySymbol}?`)

                  // if (sure)
                  //   await handleVortexCashRequest({
                  //     docId: transactionDocId,
                  //     total: grandTotalFee
                  //   })
                  // else
                  //   setIsLoadingTransaction(false)

                }}>{isLoadingTransaction ? "PLEASE WAIT . . . TRANSACTION IN PROGRESS . . " : "PAY"}
              </Button>
            </Stack>

            <Backdrop
              sx={{ zIndex: 900 }}
              open={isLoadingPrivate}
              onClick={() => { }}
            >
              <CircularProgress />
            </Backdrop>
          </Box>
        )}
      </Box>
    )
  }

  const FormRender = (step) => {
    switch (step) {
      case 0:
        return <ProductSelectForm2 />
      case 1:
        return <VoucherInputForm />
      case 2:
        return <ReviewConfirmationForm />
      default:
        return <ProductSelectForm2 />
    }
  }

  return (
    <>
      {platformVariables?.enableGift === false &&
        <ServiceDisabledPrompt />
      }
      {storeStatus === 0 &&
        <StoreBlockPrompt />
      }
      {userStatus === 0 && (
        <BlockPrompt />
      )}
      {userStatus === 1 && storeStatus === 1 && platformVariables?.enableGift && (
        <div>
          {error.isError ? (
            <VortexError
              message={error.message}
              onClick={() => {
                setErrorData({
                  isError: false,
                  message: "",
                })
                setRetry(!retry)
                setActiveStep(0)
              }}
            />
          ) : (
            <>{FormRender(activeStep)}</>
          )}
          <Backdrop sx={{ zIndex: 900 }} open={isLoading} onClick={() => { }}>
            <CircularProgress />
          </Backdrop>
          <Box sx={{ height: "10em" }} />
          <VortexBottomGradient />
          <BottomNavigator />
        </div>
      )}
    </>
  )
}

export default VortexVoucherPage
