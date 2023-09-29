import React, { useState, useEffect, useReducer, useContext } from "react"
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  ListItem,
  ListItemIcon,
  Toolbar,
  Typography,
  ChevronRight,
  ThemeProvider,
} from "@mui/material"
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { navigate } from "gatsby"
import VortexTopupCard from "../components/VortexTopupCard"

import moment from "moment"
import VortexFormToolbar from "../components/VortexFormToolbar"
import {
  IsloadingProducts,
  ReloadProductsTrigger,
  VortexContextError,
  VortextProducts,
} from "../context/VortexContext"
import { useParams } from "@reach/router"
import { createVortexTopupTransaction } from "../../../api/public/vortex/topup_service"
import { getVortexTokenBase } from "../../../api/public/vortex/token_service"
import { getPlatformVariables } from "../../../api/public/platform_vars"
import { saveVortexTopUpTransaction, updateVortexByRefId, getVortexTransactionByRefId } from "../../../api/public/vortex/transaction_db"
import VortexError from "../components/VortexError"
import VortexProductBrandCard from "../components/VortexProductBrandCard"
import CenteredProgress from "../../misc/centeredProgress"
import SecureLS from "secure-ls"
import { sparkleTopupFee } from "../config/config"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import "../../../assets/css/HorizontalCardList.css"
import { LoginState, PlatformVariables, StoreStatus, UserStatus } from "../../globalstates"
import LoginPage from "../../LoginPage"
import { primaryVortexTheme } from "../config/theme"
import VortexBottomGradient from "../components/VortexBottomGradient"
import BottomNavigator from "../../Homemade/BottomNavigator"
import useLoggedUser from "../../../custom-hooks/useLoggedUser"
import VortexVoucherSearchBar from "../components/VortexVoucherSearchBar"

import { getContinents, addToInternationalLoad, getCountriesOnTopUp, getBrandsByCountry, getProductsOfBrand } from "../functions/getCountriesOnTopUp"
import VortexTopUpBrandProducts from "../components/VortexTopUpBrandProducts"
import VortexContinentList from "../components/VortexContinentList"
import VortexCountriesList from "../components/VortexTopUpCountriesList"
import VortexTopUpInternationalBrands from "../components/VortexTopUpInternationalBrands"

import localTelecomRankProvider from "../functions/localTelecomRankProvider"
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

let topUpProducts = []

const VortexTopUpPage = () => {
  // const params = useParams()

  // const [platformVariables, setPlatformVariables] = useState(null)



  const ls = new SecureLS({ encodingType: "aes" })

  const [error, setErrorData] = useContext(VortexContextError)

  const [retry, setRetry] = useContext(ReloadProductsTrigger)

  const [userStatus, setUserStatus] = useContext(UserStatus)

  const [storeStatus, setstoreStatus] = useContext(StoreStatus)

  const [transactionDocId, setTransactionDocId] = useState(null)

  const [transactionReferenceId, setTransactionReferenceId] = useState(null)

  const [activeStep, setActiveStep] = React.useState(0)

  const [accountOrMobileNumber, setAccountOrMobileNumber] = useState("")

  const [selectedBrand, setSelectedBrand] = useState(null)

  const [selectedProduct, setSelectedProduct] = useState({})

  const [brands, setbrands] = useState([])

  const [data, setData] = useContext(VortextProducts)

  const [renderData, setRenderData] = useState([])

  const [isLoading, setisLoading] = useContext(IsloadingProducts)

  const [isLoggin, setisLoggin] = useContext(LoginState)

  const [platformVariables, setPlatformVariables] = useContext(PlatformVariables)

  const [isLoadingPrivate, setIsLoadingPrivate] = useState(false)

  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false)

  const { getUser } = useLoggedUser()

  // const [productCategories, setProductCategories] = useState([])

  const [transactionDetails, setTransactionDetails] = useState({
    status: 200,
    message: "Fulfillment Failed.",
    clientRequestId: "SPARKLEPWAh5f7n7sasGd9gD",
    referenceNumber: "220223170501bkka",
    accountName: "Jay ar Sta Ana",
    mobileNumber: "639273342196",
    wallet: "MAIN",
    walletType: "TU",
    currency: "PHP",
    walletDeduction: 0,
    beginningBalance: 500,
    endingBalance: 500,
    transactionDate: "2022-02-23T17:05:01.487Z",
    productName: "Smart Load 100",
    productPrice: 100,
    dispensingDiscount: 4.44,
    dealerDispensingDiscount: 0,
    dealerCommission: 0,
    fulfillmentResponse: {
      id: "220223170501bkka",
      status: "FAILED",
      remarks:
        "23-Feb 17:05: Error is encountered in Target Number validation. Contact SMART Hotline. This message is free. Ref:119135804015|1|",
      returnCode: "5217",
      isSuccess: false,
    },
    smartReferenceNumber: "119135804015",
  })


  const [selectedCategory, setSelectedCategory] = useReducer(
    filterProductsBySelectedCategory,
    "Electronic Load"
  )

  // useEffect(async () => {
  //   setSelectedCategory(convertParamToCat(params.category))
  // }, [data])

  // useEffect(async () => {
  //   let x = await getPlatformVariables()
  //   setPlatformVariables(x[0])
  // }, [])

  useEffect(async () => {

    let store = ls.get("store")

    let storeEnvId = store?.storeEnv?._id || store?.storeEnv

    let x = await getStoreEnvById({ storeEnvId: storeEnvId })

    console.log("platform variables", x)

    setPlatformVariables(x)

  }, [])



  useEffect(() => {
    if (data.length > 0) {
      let collectedBrands = []

      for (let index = 0; index < data.length; index++) {
        if (
          data[index].category === "Electronic Load" ||
          data[index.category] === "Data Bundles" ||
          data[index].category === "Data Bundles"
        ) {
          topUpProducts.push(data[index])
        }

        if (data[index].category === "Electronic Load") {
          if (data[index].brand === "ROW") addToInternationalLoad(data[index])
          if (
            !collectedBrands.filter((brand) => brand.name === data[index].brand)
              .length > 0
          ) {
            collectedBrands.push({
              name: data[index].brand,
              image: data[index].catalogImageURL,
              rank: localTelecomRankProvider(data[index].brand),
            })
          }
        }
      }

      console.log("the collected brands are")
      console.log(collectedBrands)

      setbrands(
        collectedBrands.sort((brand, previous) => previous.rank - brand.rank)
      )
    }
  }, [data])

  const getServiceFee = ({ amount, currency }) => {

    // let paypalPercentage = amount * 0.0355
    // let foreignFee = amount * 0.01
    // let paypalFee = Math.round(paypalPercentage) + Math.round(foreignFee)
    let amountInDirham = parseFloat(amount / platformVariables?.topupCurrencyToPeso).toFixed(2)
    let convenienceFee = parseFloat(platformVariables?.topupConvenienceFee).toFixed(2); //convenience fee only for bills/vouchers  -platformVariables.convenienceFeeInDirham
    let grandTotalFee = parseFloat(amountInDirham) + parseFloat(convenienceFee)


    return { convenienceFee, grandTotalFee }
  }

  const stepForward = () => {
    setActiveStep(activeStep + 1)
  }

  const stepBack = () => {
    setActiveStep(activeStep - 1)
  }

  function filterProductsBySelectedCategory(state, category) {
    let productsByCategory = []

    for (let index = 0; index < data.length; index++) {
      if (
        data[index].category === "Data Bundles" ||
        data[index].category === "Electronic Load"
      ) {
        productsByCategory.push(data[index])
      }
    }

    setRenderData(productsByCategory)

    return category
  }

  async function handleVortexRequestGCash({ paymentData }) {
    try {
      setisLoading(true)

      //save transaction only as for manual Gcash
      setTransactionDetails(paymentData)

      let s = await updateVortexByRefId({
        refId: transactionReferenceId,
        data: {
          paymentId: "Awaiting for GCash Payment",
          paymentMethod: "GCash",
          totalAmount: paymentData.grandTotalFee
        }
      })

      navigate(`/vortextransactions/topup/${s.referenceNumber}`, { state: s })

      setisLoading(false)
    } catch (error) {
      setErrorData({
        isError: true,
        message: error,
      })
      throw error
    }
  }

  async function handleVortexRequest({ docId, paymentData }) {
    try {
      // setisLoading(true)
      let vortexTokenResponse = await getVortexTokenBase()

      if (vortexTokenResponse.status === 200) {
        let vortextTokenResult = await vortexTokenResponse.json()

        let vortexTopupTransactionResponse = await createVortexTopupTransaction(
          vortextTokenResult.access_token,
          docId,
          process.env.REACT_APP_VORTEX_CLIENTREQID,
          accountOrMobileNumber,
          selectedProduct.code,
          paymentData?.data?.orderID,
          paymentData?.details?.purchase_units[0]?.amount?.value
        )

        let vortexTopupTransactionResult =
          await vortexTopupTransactionResponse.json()

        if (vortexTopupTransactionResponse.status === 200) {
          // setTransactionDetails(vortexTopupTransactionResult)

          navigate(
            `/vortextransactions/topup/${vortexTopupTransactionResult.referenceNumber}`
          )
        } else {

          setErrorData({
            isError: true,
            message: `Something went wrong `,
          })

          throw Error(vortexTopupTransactionResponse)
        }
      } else {

        setErrorData({
          isError: true,
          message: `Something went wrong `,
        })

        throw Error(vortexTokenResponse)
      }
      // setisLoading(false)
    } catch (error) {
      setErrorData({
        isError: true,
        message: `${error}`,
      })
      throw error
    }
  }

  async function handleVortexCashRequest({ docId, total }) {
    try {
      // setisLoading(true)
      let vortexTokenResponse = await getVortexTokenBase()

      if (vortexTokenResponse.status === 200) {
        let vortextTokenResult = await vortexTokenResponse.json()

        let vortexTopupTransactionResponse = await createVortexTopupTransaction(
          {
            access_token: vortextTokenResult.access_token,
            docId: docId,
            clientRequestId: process.env.REACT_APP_VORTEX_CLIENTREQID,
            mobileNumber: accountOrMobileNumber,
            productCode: selectedProduct.code,
            paymentId: "Payment via Store",
            totalAmount: total,
            oneAedToPhp: platformVariables?.topupCurrencyToPeso,
            convenienceFee: platformVariables?.topupConvenienceFee,
            currencySymbol: platformVariables?.currencySymbol,
            currencyToPhp: platformVariables?.topupCurrencyToPeso,
            callbackUrl: ""
          }
        )

        let vortexTopupTransactionResult =
          await vortexTopupTransactionResponse.json()
        console.log(vortexTopupTransactionResult)

        if (vortexTopupTransactionResult.status === 400 || vortexTopupTransactionResult.error) {
          setIsLoadingTransaction(false)

          alert(` ${vortexTopupTransactionResult.cause} - Try again. Check your number.`)
        } else if (vortexTopupTransactionResult?.fulfillmentResponse?.isSuccess) {
          // setTransactionDetails(vortexTopupTransactionResult)
          // get transaction vortex by reference pass it on this navigate state
          let latest = await getVortexTransactionByRefId(vortexTopupTransactionResult.referenceNumber);
          console.log(latest);
          navigate(
            `/vortextransactions/topup/${vortexTopupTransactionResult.referenceNumber}`
          ) // add a state


        } else {

          setIsLoadingTransaction(false)

          alert(vortexTopupTransactionResult.fulfillmentResponse.remarks)
          // setErrorData({
          //   isError: true,
          //   message: `Something went wrong : ${vortexTopupTransactionResult.fulfillmentResponse.remarks}`,
          // })

          // throw Error(vortexTopupTransactionResponse)
        }
      } else {

        setErrorData({
          isError: true,
          message: `Something went wrong - vortex token failed`,
        })

        // throw Error(vortexTokenResponse)
      }
      // setisLoading(false)
    } catch (error) {
      setErrorData({
        isError: true,
        message: `${error}`,
      })
      throw error
    }
  }
  //FORMS

  const BrandSelectForm = () => {
    const [navigation, setNavigation] = useState({
      name: "brandProducts",
      data: [],
      previous: "",
    })

    const [searchResult, setSearchResult] = useState([])

    const [_selectedBrand, _setSelectedBrand] = useReducer(
      filterProductBySelectedBrand
    )

    function getCountriesOfContinent(continent) {
      navigateInternationalLoad("countries", getCountriesOnTopUp(continent), {
        continent: continent,
      })
    }

    function getBrandsOfTheCountry(country) {
      console.log("getting brands")
      console.log(country, navigation.previous?.continent)
      navigateInternationalLoad(
        "countryBrands",
        getBrandsByCountry(navigation.previous?.continent, country),
        { country: country }
      )
    }

    function getProductsByBrand(country, brand) {
      console.log("getting products of brand")
      navigateInternationalLoad(
        "brandProducts",
        getProductsOfBrand(
          navigation.previous.continent,
          navigation.previous.country,
          brand
        ),
        { brand: brand }
      )
    }

    function navigateInternationalLoad(name, data, previous = {}) {
      console.log(data)
      setNavigation({
        name: name,
        data: data,
        previous: {
          ...navigation.previous,
          ...previous,
        },
      })
    }

    function filterProductBySelectedBrand(state, brand) {
      let products = []
      console.log("filtering product by selected brand")

      if (brand !== "ROW") {
        for (let index = 0; index < data.length; index++) {
          if (data[index].brand === brand) {
            products.push(data[index])
          }
        }

        navigateInternationalLoad("brandProducts", products)

        return brand
      } else {
        //sort by country here
        navigateInternationalLoad("continents", getContinents(data))
      }
    }

    function searchLoad(keyword) {
      let result = []
      if (keyword.trim().length > 0) {
        for (let a = 0; a < topUpProducts.length; a++) {
          if (topUpProducts[a].name.trim().toLowerCase().includes(keyword.toLowerCase()))
            result.push(topUpProducts[a])
        }
      } else {
        result = []
      }
      setSearchResult(result)
    }

    return (
      <Box>
        <VortexFormToolbar
          title={"Load"}
          onClickBack={() => {
            navigate(-1)
          }}
        />
        <Toolbar />
        <VortexVoucherSearchBar onInput={searchLoad} />

        <>
          {searchResult.length === 0 ? (
            <>
              <Typography
                margin={2}
                fontFamily={"Visby"}
                fontSize={17}
                color={"gray"}
              >
                Select brand
              </Typography>

              {isLoading && <CenteredProgress />}
              {!isLoading && (
                <div>
                  <div className="horizontallist scrollbar-hidden">
                    {brands.map((brand) => {
                      return (
                        <VortexProductBrandCard
                          title={brand.name}
                          image={brand.image}
                          onClick={() => {
                            _setSelectedBrand(brand.name)
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              <div style={{ position: "fixed", bottom: "-100px" }}>
                {navigation.name}
              </div>

              {navigation.name === "countries" && (
                <VortexCountriesList
                  countries={navigation.data}
                  onClick={getBrandsOfTheCountry}
                />
              )}
              {navigation.name === "brandProducts" && (
                <VortexTopUpBrandProducts
                  brandProducts={navigation.data}
                  selectedBrand={_selectedBrand ? _selectedBrand : "ROW"}
                  setSelectedProduct={setSelectedProduct}
                  setSelectedBrand={setSelectedBrand}
                  stepForward={stepForward}
                />
              )}

              {navigation.name === "continents" && (
                <VortexContinentList
                  continents={navigation.data}
                  onClick={getCountriesOfContinent}
                />
              )}

              {navigation.name === "countryBrands" && (
                <VortexTopUpInternationalBrands
                  onClick={getProductsByBrand}
                  brands={navigation.data}
                  country={navigation.previous}
                />
              )}
            </>
          ) : (
            <VortexTopUpBrandProducts
              brandProducts={searchResult}
              selectedBrand={_selectedBrand ? _selectedBrand : "ROW"}
              setSelectedProduct={setSelectedProduct}
              setSelectedBrand={setSelectedBrand}
              stepForward={stepForward}
            />
          )}
        </>
      </Box>
    )
  }

  const ProductSelectForm = () => {
    return (
      <Box>
        <Typography
          margin={2}
          fontWeight={"bold"}
          fontFamily={"Visby"}
          fontSize={20}
          color="#0060bf"
        >
          Select Load
        </Typography>
        {renderData.map((v) => {
          return (
            <VortexTopupCard
              name={v.name}
              imageUrl={v.catalogImageURL}
              desc={v.description}
              price={v.pricing.price}
              unit={v.pricing.unit}
              onClick={() => {
                setSelectedProduct(v)
                stepForward()
              }}
            />
          )
        })}
      </Box>
    )
  }

  const AccountNoInputForm = () => {

    let { convenienceFee, grandTotalFee } = getServiceFee({
      amount: selectedProduct.pricing.price,
      currency: selectedProduct.pricing.unit,
    })


    // const [countryCode, setcountryCode] = useState("63")
    const [accountNumber, setAccountNUmber] = useState(accountOrMobileNumber)

    const [isFormLoading, setIsFormLoading] = useState(false)

    const inputProps = (brand) => {
      switch (brand) {
        case "MERALCO":
          return {
            title: "Meralco Account Number",
            maxLength: 12,
            helperText: "Type your meralco load account number",
            placeholder: "111122223333",
          }
        case "CIGNAL":
          return {
            title: "CCA Number",
            maxLength: 12,
            helperText: "Type your account number",
            placeholder: "111122223333",
          }
        default:
          return {
            title: "Mobile Number",
            maxLength: 12,
            helperText: "Type your mobile number with country code",
            placeholder: "639273342196",
          }
      }
    }



    return (
      <Box>
        {!isLoggin ? (
          <LoginPage />
        ) : (<Box>
          <VortexFormToolbar
            title={"Load"}
            onClickBack={() => {
              stepBack()
            }}
          />
          <Toolbar />
          <Box
            style={{
              margin: "1em",
            }}
          >
            <Stack spacing={1} marginTop={5}>
              <Stack
                direction={"row"}
                justifyContent="center"
                alignItems="center"
              >
                <PhoneIphoneIcon />
                <Typography fontSize={20} textAlign={"center"}>
                  {inputProps(selectedBrand.toUpperCase()).title}
                </Typography>
              </Stack>
              <Stack direction={"row"} justifyContent={"center"} spacing={0.5}>
                <TextField
                  id="account-input-field"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: "1em",
                  }}
                  size="medium"
                  variant="standard"
                  type="number"
                  value={accountNumber}
                  placeholder={
                    inputProps(selectedBrand.toUpperCase()).placeholder
                  }
                  helperText={inputProps(selectedBrand.toUpperCase()).helperText}
                  onChange={(e) => {
                    setAccountNUmber(e.target.value)
                  }}
                  inputProps={{
                    maxLength: inputProps(selectedBrand.toUpperCase()).maxLength,
                  }}
                />
              </Stack>
              <Stack direction={"row"} justifyContent={"center"}>
                <Button
                  disabled={isFormLoading}
                  variant="contained"
                  sx={{
                    width: "100%",
                    marginTop: "1em",
                    borderRadius: "10em",
                    background: primaryVortexTheme.button,
                  }}
                  onClick={async () => {
                    try {
                      if (accountNumber.length <= 0) {
                        return
                      }

                      setIsFormLoading(true)

                      let reqInputPayload = { "clientRequestId": "Empty", "mobileNumber": accountNumber.trim(), "productCode": selectedProduct.code }

                      let result = await saveVortexTopUpTransaction({
                        requestInputPayload: reqInputPayload,
                        totalAmount: grandTotalFee
                      })
                      setTransactionDocId(result._id)

                      setTransactionReferenceId(result.referenceNumber)

                      setAccountOrMobileNumber(`${accountNumber.trim()}`)

                      setIsFormLoading(false)

                      stepForward()

                    } catch (error) {
                      setErrorData({
                        isError: true,
                        message: `${error}`,
                      })
                      throw error
                    }
                  }}
                >
                  {isFormLoading ? "Please wait..." : "CONTINUE"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>)}
      </Box>
    )
  }

  const ReviewConfirmationForm = () => {
    let paymentMethodType = ls.get("paymentMethodType")

    const { email, name, phone, address } = getUser()

    let { convenienceFee, grandTotalFee } = getServiceFee({
      amount: selectedProduct.pricing.price,
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
          <Box>
            <VortexFormToolbar
              title={"Load Payment"}
              onClickBack={() => {
                stepBack()
              }}
            />
            <Toolbar />
            {isLoadingPrivate && <CenteredProgress />}
            {!isLoadingPrivate && (
              <div>
                {/* Product Hero */}
                <Stack
                  direction={"row"}
                  alignItems="center"
                  marginTop={"2em"}
                  marginLeft={"2em"}
                  marginBottom={"2em"}
                >
                  <Stack sx={{ marginRight: "2em" }} textAlign="center">
                    <Typography
                      fontSize={"3em"}
                      fontWeight={"bold"}
                      color={primaryVortexTheme.secondarytextcolor}
                    >
                      {selectedProduct.pricing.price}
                    </Typography>
                    <Typography
                      fontSize={"1em"}
                      fontWeight={"bold"}
                      color={primaryVortexTheme.secondarytextcolor}
                    >
                      {selectedProduct.pricing.unit}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography
                      fontWeight={"bold"}
                      color={primaryVortexTheme.primarytextcolor}
                    >
                      {selectedProduct.name}
                    </Typography>
                    <Typography color={primaryVortexTheme.primarytextcolor}>
                      {selectedProduct.description}
                    </Typography>
                  </Stack>
                </Stack>
                <Divider />

                {/* Buy load for */}
                <Stack style={{ marginBottom: "1em" }}>
                  <Stack style={{ margin: "0.5em" }}>
                    <Typography
                      style={{
                        color: `${primaryVortexTheme.primarytextcolor}`,
                        marginTop: "1em",
                        marginBottom: "1em",
                      }}
                      fontSize={15}
                      fontWeight="bold"
                    >
                      Buy load for
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent={"center"}>
                    <Box
                      style={{
                        border: "solid 2px #707070",
                        borderRadius: "1em",
                      }}
                    >
                      <Typography
                        style={{
                          color: `${primaryVortexTheme.secondarytextcolor}`,
                          marginTop: "0.1em",
                          marginBottom: "0.1em",
                          marginLeft: "1em",
                          marginRight: "1em",
                        }}
                        fontWeight="bold"
                        fontSize={50}
                      >
                        {accountOrMobileNumber}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                {/* You are about to pay */}
                <Divider />
                <Stack>
                  <Stack style={{ margin: "0.5em" }}>
                    <Typography
                      style={{
                        color: `${primaryVortexTheme.primarytextcolor}`,
                        marginTop: "1em",
                      }}
                      fontSize={20}
                      fontWeight="bold"
                    >
                      You are about to pay
                    </Typography>
                  </Stack>
                  <Stack style={{ margin: "1em" }}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      style={{
                        color: "black",
                        marginBottom: "0.5em",
                      }}
                    >
                      <Typography
                        fontWeight={"bold"}
                      >{`Amount Due `}</Typography>

                      <Typography
                        fontWeight={"bold"}
                        style={{ marginRight: "2em" }}
                      >{`${parseFloat(selectedProduct.pricing.price / platformVariables?.topupCurrencyToPeso).toFixed(2)} ${platformVariables?.currencySymbol}`}</Typography>
                    </Stack>

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      style={{
                        color: "black",
                        marginBottom: "0.5em",
                      }}
                    >
                      <Typography
                        fontWeight={"bold"}
                      >{`Convenience Fee `}</Typography>

                      {expanded === "panel2" ? (
                        <Typography
                          fontWeight={"bold"}
                        >{`0 ${platformVariables?.currencySymbol}`}</Typography>
                      ) : (
                        <Typography
                          fontWeight={"bold"}
                          style={{ marginRight: "2em" }}
                        >{`${convenienceFee} ${platformVariables?.currencySymbol}`}{"        "}</Typography>
                      )}
                    </Stack>

                    <Divider />

                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      style={{
                        color: "black",
                        marginTop: "0.5em",
                      }}
                    >
                      <Typography fontWeight={"bold"} fontSize={"25px"}>
                        TOTAL AMOUNT
                      </Typography>
                      <Typography fontWeight={"bold"} fontSize={"25px"}>
                        {`${grandTotalFee} ${platformVariables?.currencySymbol}`}
                      </Typography>
                    </Stack>
                    <Box height={20} />
                    <Button
                      disabled={isLoadingTransaction}
                      variant="contained"
                      onClick={async () => {
                        const url = 'https://pm.link/123123123123123za23/test/DGSwn7b';
      window.open(url, '_blank');
                        // setIsLoadingTransaction(true)

                        // let sure = window.confirm(`Are you sure you received: ${grandTotalFee} ${platformVariables?.currencySymbol}?`)

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
                </Stack>
              </div>
            )}
          </Box>
        )}
      </Box>
    )
  }

  const FormRender = (step) => {
    switch (step) {
      case 0:
        return <BrandSelectForm />
      case 1:
        return <AccountNoInputForm />
      case 2:
        return <ReviewConfirmationForm />
      default:
        return <AccountNoInputForm />
    }
  }

  return (
    <>
      {platformVariables?.enableLoad === false &&
        <ServiceDisabledPrompt />
      }
      {storeStatus === 0 &&
        <StoreBlockPrompt />
      }
      {userStatus === 0 && (
        <BlockPrompt />
      )}
      {userStatus === 1 && storeStatus === 1 && platformVariables?.enableLoad && (
        <Box>
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

          <Box sx={{ height: "10em" }} />
          <VortexBottomGradient />
          <BottomNavigator />
        </Box>
      )}
    </>
  )
}

export default VortexTopUpPage
