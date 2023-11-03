import React, { useState, useEffect, useReducer, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SecureLS from 'secure-ls';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Backdrop,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  ListItem,
  ListItemIcon,
  Toolbar,
  Typography,
  ChevronRight,
  ThemeProvider,
  Grid,
} from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { navigate } from "gatsby"
import VortexTopupCard from '../../Vortex/components/VortexTopupCard';

// import moment from "moment"
import VortexFormToolbar from '../../Vortex/components/VortexFormToolbar';
import {
  IsloadingProducts,
  ReloadProductsTrigger,
  VortexContextError,
  VortexProducts,
} from '../../Vortex/context/VortexContext';
import { createVortexTopupTransaction } from '../../api/public/vortex/topup_service';
import { getVortexTokenBase, signIn } from '../../api/public/vortex/token_service';
import { getPlatformVariables } from '../../api/public/vortex/platform_vars';
import {
  saveVortexTopUpTransaction,
  updateVortexByRefId,
  getVortexTransactionByRefId,
} from '../../api/public/vortex/transaction_db';
import VortexError from '../../Vortex/components/VortexError';
import VortexProductBrandCard from '../../Vortex/components/VortexProductBrandCard';
import CenteredProgress from '../../Vortex/components/centeredProgress';
// import { sparkleTopupFee } from "../config/config"
// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
// import "../../assets/css/HorizontalCardList.css"
// import { LoginState, PlatformVariables, StoreStatus, UserStatus } from '../../Vortex/globalstates';
import { primaryVortexTheme } from '../../Vortex/config/theme';
import VortexBottomGradient from '../../Vortex/components/VortexBottomGradient';
// import BottomNavigator from '../../Homemade/BottomNavigator';
// import useLoggedUser from "../../../custom-hooks/useLoggedUser"
import VortexVoucherSearchBar from '../../Vortex/components/VortexVoucherSearchBar';

import {
  getContinents,
  addToInternationalLoad,
  getCountriesOnTopUp,
  getBrandsByCountry,
  getProductsOfBrand,
} from '../../Vortex/functions/getCountriesOnTopUp';
import VortexTopUpBrandProducts from '../../Vortex/components/VortexTopUpBrandProducts';
import VortexContinentList from '../../Vortex/components/VortexContinentList';
import VortexCountriesList from '../../Vortex/components/VortexTopUpCountriesList';
import VortexTopUpInternationalBrands from '../../Vortex/components/VortexTopUpInternationalBrands';

import localTelecomRankProvider from '../../Vortex/functions/localTelecomRankProvider';
import BlockPrompt from '../../Vortex/Prompts/BlockPrompt';
import StoreBlockPrompt from '../../Vortex/Prompts/StoreBlockPrompt';
// import { getStoreEnvById } from '../../api/public/store-env';
import ServiceDisabledPrompt from '../../Vortex/Prompts/ServiceDisabledPrompt';

function convertParamToCat(paramCategory) {
  switch (paramCategory) {
    case 'electronic_load':
      return 'Electronic Load';
    case 'food':
      return 'Food';
    case 'shop':
      return 'Shop';
    case 'data_bundles':
      return 'Data Bundles';
    default:
      return 'Electronic Load';
  }
}

const LoginPage = () => (
  <Box>
    <div> Login Page</div>
  </Box>
);

const BottomNavigator = () => (
  <Box>
    <div> </div>
  </Box>
);

const topUpProducts = [];

const VortexTopUp = () => {
  // const params = useParams()

  const forApi = signIn('ilagandarlomiguel@gmail.com', 'GrindGr@titud3');

  const defaultPlatformVariables = {
    billsCurrencyToPeso: 1,
    topupCurrencyToPeso: 1,
    giftCurrencyToPeso: 1,
    billsConvenienceFee: 5.25,
    topupConvenienceFee: 0,
    createdAt: '2022-07-20T13:37:28.743Z',
    currencySymbol: 'PHP',
    enableBills: true,
    enableGift: true,
    enableLoad: true,
    environmentName: 'Dubai Default Environment',
    giftConvenienceFee: 5.25,
    isArchived: false,
    updatedAt: '2022-10-05T13:11:51.615Z',
    _id: '62d805186eab3a1cd07725ca',
  };

  const [platformVariables, setPlatformVariables] = useState(defaultPlatformVariables);

  useEffect(() => {
    const fetchPlatformVariables = async () => {
      console.log('Attempting to fetch platform variables...');
      try {
        const [data] = await getPlatformVariables();
        console.log('Successfully fetched platform variables:', data);
        setPlatformVariables((prevState) => {
          const mergedData = { ...prevState, ...data };
          console.log('Merged platform variables:', mergedData);
          return mergedData;
        });
      } catch (error) {
        console.error('Failed to fetch platform variables:', error);
      }
    };

    fetchPlatformVariables();
  }, []);

  const navigate = useNavigate();

  const ls = new SecureLS({ encodingType: 'aes' });

  const [error, setErrorData] = useState({ isError: false, message: '' });

  const [retry, setRetry] = useState(null);

  const [userStatus, setUserStatus] = useState(null);

  const [storeStatus, setStoreStatus] = useState(null);

  const [transactionDocId, setTransactionDocId] = useState(null);

  const [transactionReferenceId, setTransactionReferenceId] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  console.log('activeStep:', activeStep);

  const [accountOrMobileNumber, setAccountOrMobileNumber] = useState('');

  const [selectedBrand, setSelectedBrand] = useState('');

  const [selectedProduct, setSelectedProduct] = useState({});

  const [brands, setbrands] = useState([]);

  const [data, setData] = useContext(VortexProducts);

  const [renderData, setRenderData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // const [isLoggin, setisLoggin] = useState(null);

  // const [platformVariables, setPlatformVariables] = useContext(PlatformVariables)

  const [isLoadingPrivate, setIsLoadingPrivate] = useState(false);

  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  // const { getUser } = useLoggedUser()

  // const [productCategories, setProductCategories] = useState([])

  const [transactionDetails, setTransactionDetails] = useState({
    status: 200,
    message: 'Fulfillment Failed.',
    clientRequestId: 'SPARKLEPWAh5f7n7sasGd9gD',
    referenceNumber: '220223170501bkka',
    accountName: 'Jay ar Sta Ana',
    mobileNumber: '639273342196',
    wallet: 'MAIN',
    walletType: 'TU',
    currency: 'PHP',
    walletDeduction: 0,
    beginningBalance: 500,
    endingBalance: 500,
    transactionDate: '2022-02-23T17:05:01.487Z',
    productName: 'Smart Load 100',
    productPrice: 100,
    dispensingDiscount: 4.44,
    dealerDispensingDiscount: 0,
    dealerCommission: 0,
    fulfillmentResponse: {
      id: '220223170501bkka',
      status: 'FAILED',
      remarks:
        '23-Feb 17:05: Error is encountered in Target Number validation. Contact SMART Hotline. This message is free. Ref:119135804015|1|',
      returnCode: '5217',
      isSuccess: false,
    },
    smartReferenceNumber: '119135804015',
  });

  // const [selectedCategory, setSelectedCategory] = useReducer(filterProductsBySelectedCategory, 'Electronic Load');

  // useEffect(async () => {
  //   setSelectedCategory(convertParamToCat(params.category))
  // }, [data])

  // useEffect(async () => {
  //   let x = await getPlatformVariables()
  //   setPlatformVariables(x[0])
  // }, [])

  // useEffect(async () => {

  //   let store = ls.get("store")

  //   let storeEnvId = store?.storeEnv?._id || store?.storeEnv

  //   let x = await getStoreEnvById({ storeEnvId: storeEnvId })

  //   setPlatformVariables(x)

  // }, [])

  useEffect(() => {
    if (data && data.length > 0) {
      const collectedBrands = [];

      for (let index = 0; index < data.length; index += 1) {
        if (data[index].category === 'Electronic Load' || data[index].category === 'Data Bundles') {
          topUpProducts.push(data[index]);
        }

        if (data[index].category === 'Electronic Load') {
          if (data[index].brand === 'ROW') addToInternationalLoad(data[index]);
          console.log('CollectedBrands:', collectedBrands);

          if (
            Array.isArray(collectedBrands) &&
            !collectedBrands.filter((brand) => brand.name === data[index].brand).length > 0
          ) {
            collectedBrands.push({
              name: data[index].brand,
              image: data[index].catalogImageURL,
              rank: localTelecomRankProvider(data[index].brand),
            });
          }
        }
      }

      console.log('the collected brands are');
      console.log(collectedBrands);

      setbrands(collectedBrands.sort((brand, previous) => previous.rank - brand.rank));
    }
  }, [data]);

  const getServiceFee = ({ amount, currency }) => {
    // let paypalPercentage = amount * 0.0355
    // let foreignFee = amount * 0.01
    // let paypalFee = Math.round(paypalPercentage) + Math.round(foreignFee)
    const amountInDirham = parseFloat(amount / platformVariables?.topupCurrencyToPeso).toFixed(2);
    const convenienceFee = parseFloat(platformVariables?.topupConvenienceFee).toFixed(2);
    const grandTotalFee = parseFloat(amountInDirham) + parseFloat(convenienceFee);

    return { convenienceFee, grandTotalFee };
  };

  const stepForward = useCallback(() => {
    setActiveStep((prevStep) => prevStep + 1);
  }, []);

  const stepBack = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
  }, []);

  function filterProductsBySelectedCategory(state, category) {
    const productsByCategory = [];

    for (let index = 0; index < data.length; index += 1) {
      if (data[index].category === 'Data Bundles' || data[index].category === 'Electronic Load') {
        productsByCategory.push(data[index]);
      }
    }

    setRenderData(productsByCategory);

    return category;
  }

  async function handleVortexRequestGCash({ paymentData }) {
    try {
      setIsLoading(true);

      // save transaction only as for manual Gcash
      setTransactionDetails(paymentData);

      const s = await updateVortexByRefId({
        refId: transactionReferenceId,
        data: {
          paymentId: 'Awaiting for GCash Payment',
          paymentMethod: 'GCash',
          totalAmount: paymentData.grandTotalFee,
        },
      });

      // navigate(`/vortextransactions/topup/${s.referenceNumber}`, { state: s });

      setIsLoading(false);
    } catch (error) {
      setErrorData({
        isError: true,
        message: error,
      });
      throw error;
    }
  }

  async function handleVortexRequest({ docId, paymentData }) {
    try {
      // setisLoading(true)
      const vortexTokenResponse = await getVortexTokenBase();

      if (vortexTokenResponse.status === 200) {
        const vortexTokenResult = await vortexTokenResponse.json();

        const vortexTopupTransactionResponse = await createVortexTopupTransaction(
          vortexTokenResult.access_token,
          docId,
          process.env.GATSBY_APP_VORTEX_CLIENTREQID,
          accountOrMobileNumber,
          selectedProduct.code,
          paymentData?.data?.orderID,
          paymentData?.details?.purchase_units[0]?.amount?.value
        );

        const vortexTopupTransactionResult = await vortexTopupTransactionResponse.json();

        if (vortexTopupTransactionResponse.status === 200) {
          // setTransactionDetails(vortexTopupTransactionResult)

          navigate(`/vortextransactions/topup/${vortexTopupTransactionResult.referenceNumber}`);
        } else {
          setErrorData({
            isError: true,
            message: `Something went wrong `,
          });

          throw Error(vortexTopupTransactionResponse);
        }
      } else {
        setErrorData({
          isError: true,
          message: `Something went wrong `,
        });

        throw Error(vortexTokenResponse);
      }
      // setisLoading(false)
    } catch (error) {
      setErrorData({
        isError: true,
        message: `${error}`,
      });
      throw error;
    }
  }

  async function handleVortexCashRequest({ docId, total }) {
    try {
      // setisLoading(true)
      const vortexTokenResponse = await getVortexTokenBase();

      if (vortexTokenResponse.status === 200) {
        const vortexTokenResult = await vortexTokenResponse.json();

        const vortexTopupTransactionResponse = await createVortexTopupTransaction({
          access_token: vortexTokenResult.access_token,
          docId,
          clientRequestId: process.env.REACT_APP_VORTEX_CLIENTREQID,
          mobileNumber: accountOrMobileNumber,
          productCode: selectedProduct.code,
          paymentId: 'Payment via Store',
          totalAmount: total,
          oneAedToPhp: platformVariables?.topupCurrencyToPeso,
          convenienceFee: platformVariables?.topupConvenienceFee,
          currencySymbol: platformVariables?.currencySymbol,
          currencyToPhp: platformVariables?.topupCurrencyToPeso,
          callbackUrl: '',
        });

        const vortexTopupTransactionResult = await vortexTopupTransactionResponse.json();
        console.log(vortexTopupTransactionResult);

        if (vortexTopupTransactionResult.status === 400 || vortexTopupTransactionResult.error) {
          setIsLoadingTransaction(false);

          alert(` ${vortexTopupTransactionResult.cause} - Try again. Check your number.`);
        } else if (vortexTopupTransactionResult?.fulfillmentResponse?.isSuccess) {
          // setTransactionDetails(vortexTopupTransactionResult)
          // get transaction vortex by reference pass it on this navigate state
          const latest = await getVortexTransactionByRefId(vortexTopupTransactionResult.referenceNumber);
          console.log(latest);
          navigate(`/vortextransactions/topup/${vortexTopupTransactionResult.referenceNumber}`); // add a state
        } else {
          setIsLoadingTransaction(false);

          alert(vortexTopupTransactionResult.fulfillmentResponse.remarks);
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
        });

        // throw Error(vortexTokenResponse)
      }
      // setisLoading(false)
    } catch (error) {
      setErrorData({
        isError: true,
        message: `${error}`,
      });
      throw error;
    }
  }

  // FORMS

  const BrandSelectForm = ({ setSelectedBrand }) => {
    const [loading, setLoading] = useState(true);
    const [navigation, setNavigation] = useState({
      name: 'brandProducts',
      data: [],
      previous: '',
    });

    const [searchResult, setSearchResult] = useState([]);

    const [_selectedBrand, _setSelectedBrand] = useReducer(filterProductBySelectedBrand);

    const getCountriesOfContinent = useCallback(
      (continent) => {
        navigateInternationalLoad('countries', getCountriesOnTopUp(continent), {
          continent,
        });
      },
      [navigateInternationalLoad, getCountriesOnTopUp]
    );

    const getBrandsOfTheCountry = useCallback(
      (country) => {
        console.log('getting brands');
        console.log(country, navigation.previous?.continent);
        navigateInternationalLoad('countryBrands', getBrandsByCountry(navigation.previous?.continent, country), {
          country,
        });
      },
      [navigation.previous]
    );

    const getProductsByBrand = useCallback(
      (country, brand) => {
        console.log('getting products of brand');
        navigateInternationalLoad(
          'brandProducts',
          getProductsOfBrand(navigation.previous.continent, navigation.previous.country, brand),
          { brand }
        );
      },
      [navigateInternationalLoad, getProductsOfBrand, navigation.previous]
    );

    function navigateInternationalLoad(name, data, previous = {}) {
      console.log(data);
      setNavigation({
        name,
        data,
        previous: {
          ...navigation.previous,
          ...previous,
        },
      });
    }

    function filterProductBySelectedBrand(state, brand) {
      const products = [];
      console.log('filtering product by selected brand');

      if (brand !== 'ROW') {
        for (let index = 0; index < data.length; index += 1) {
          if (data[index].brand === brand) {
            products.push(data[index]);
          }
        }

        navigateInternationalLoad('brandProducts', products);

        return brand;
      }

      navigateInternationalLoad('continents', getContinents(data));
      return null;
    }

    const searchLoad = useCallback(
      (keyword) => {
        let result = [];
        if (keyword.trim().length > 0) {
          for (let a = 0; a < topUpProducts.length; a += 1) {
            if (topUpProducts[a].name.trim().toLowerCase().includes(keyword.toLowerCase())) {
              result.push(topUpProducts[a]);
            }
          }
        } else {
          result = [];
        }
        setSearchResult(result);
      },
      [topUpProducts]
    );

    return (
      <>
        <VortexFormToolbar
          title={'Load'}
          onClickBack={() => {
            console.log(' navigate back');
            window.history.back();
          }}
        />
        <Toolbar />
        <VortexVoucherSearchBar onInput={searchLoad} />

        {!isLoading && (
          <>
            {searchResult.length === 0 ? (
              <>
                <Typography margin={2} fontFamily={'Visby'} fontSize={17} color={'gray'} textAlign={'left'}>
                  Select brand
                </Typography>

                <div
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '1px',
                  }}
                >
                  {Array.isArray(brands) &&
                    brands.map((brand, index) => (
                      <div
                        key={index}
                        style={{
                          flexShrink: 0,
                          width: '115px',
                          height: '115px',
                          display: 'flex', 
                          justifyContent: 'center',
                          alignItems: 'center', 
                        }}
                      >
                        <VortexProductBrandCard
                          title={brand.name}
                          image={brand.image}
                          onClick={() => {
                            _setSelectedBrand(brand.name);
                          }}
                        />
                      </div>
                    ))}
                </div>

                {navigation.name === 'countries' && (
                  <VortexCountriesList countries={navigation.data} onClick={getBrandsOfTheCountry} />
                )}
                {navigation.name === 'brandProducts' && (
                  <VortexTopUpBrandProducts
                    brandProducts={navigation.data}
                    selectedBrand={_selectedBrand || 'ROW'}
                    setSelectedProduct={setSelectedProduct}
                    setSelectedBrand={setSelectedBrand}
                    stepForward={stepForward}
                    platformVariables={platformVariables}
                  />
                )}

                {navigation.name === 'continents' && (
                  <VortexContinentList continents={navigation.data} onClick={getCountriesOfContinent} />
                )}

                {navigation.name === 'countryBrands' && (
                  <VortexTopUpInternationalBrands
                    onClick={getProductsByBrand}
                    brands={navigation.data}
                    country={navigation.previous}
                  />
                )}
              </>
            ) : (
              <Grid container spacing={2} style={{ justifyContent: 'center' }}>
                {searchResult.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} style={{ width: '100%' }}>
                    <div style={{ paddingTop: '100%', position: 'relative' }}>
                      <VortexTopUpBrandProducts
                        product={product}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                      />
                    </div>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </>
    );
  };

  /* 
  const ProductSelectForm = () => {
    return (
      <Box>
        <Typography margin={2} fontWeight={'bold'} fontFamily={'Visby'} fontSize={20} color="#0060bf">
          Select Load
        </Typography>
        {console.log('RenderData:', renderData)}
        {renderData.map((v) => {
          return (
            <VortexTopupCard
              name={v.name}
              imageUrl={v.catalogImageURL}
              desc={v.description}
              price={v.pricing.price}
              unit={v.pricing.unit}
              onClick={() => {
                setSelectedProduct(v);
                stepForward();
              }}
            />
          );
        })}
      </Box>
    );
  }; 
  */

  const AccountNoInputForm = ({ selectedBrand }) => {
    const { convenienceFee, grandTotalFee } = getServiceFee({
      amount: selectedProduct.pricing.price,
      currency: selectedProduct.pricing.unit,
    });

    // const [countryCode, setcountryCode] = useState('63');
    const [accountNumber, setAccountNUmber] = useState(accountOrMobileNumber);

    const [isFormLoading, setIsFormLoading] = useState(false);

    const inputProps = (brand) => {
      switch (brand) {
        case 'MERALCO':
          return {
            title: 'Meralco Account Number',
            maxLength: 12,
            helperText: 'Type your meralco load account number',
            placeholder: '111122223333',
          };
        case 'CIGNAL':
          return {
            title: 'CCA Number',
            maxLength: 12,
            helperText: 'Type your account number',
            placeholder: '111122223333',
          };
        default:
          return {
            title: 'Mobile Number',
            maxLength: 12,
            helperText: 'Type your mobile number with country code',
            placeholder: '639273342196',
          };
      }
    };

    return (
      <Box>
        {/* } {!isLoggin ? (
          <LoginPage />
       ) : ( */}
        <Box>
          <VortexFormToolbar
            title={'Load'}
            onClickBack={() => {
              stepBack();
            }}
          />
          <Toolbar />
          <Box
            style={{
              margin: '1em',
            }}
          >
            <Stack spacing={1} marginTop={5}>
              <Stack direction={'row'} justifyContent="center" alignItems="center">
                <PhoneIphoneIcon />
                <Typography fontSize={20} textAlign={'center'}>
                  {inputProps(selectedBrand?.toUpperCase() || '').title}
                </Typography>
              </Stack>

              {/* Add console.log statements here */}
              {console.log('selectedBrand:', selectedBrand)}
              {console.log('inputProps(selectedBrand.toUpperCase()):', inputProps(selectedBrand.toUpperCase()))}

              <Stack direction={'row'} justifyContent={'center'} spacing={0.5}>
                <TextField
                  id="account-input-field"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '1em',
                  }}
                  size="medium"
                  variant="standard"
                  type="number"
                  value={accountNumber}
                  placeholder={inputProps(selectedBrand?.toUpperCase() || '').placeholder}
                  helperText={inputProps(selectedBrand?.toUpperCase() || '').helperText}
                  onChange={(e) => {
                    setAccountNUmber(e.target.value);
                  }}
                  inputProps={{
                    maxLength: inputProps(selectedBrand?.toUpperCase() || '').maxLength,
                  }}
                />
              </Stack>
              <Stack direction={'row'} justifyContent={'center'}>
                <Button
                  disabled={isFormLoading}
                  variant="outlined"
                  sx={{
                    width: '100%',
                    marginTop: '1em',
                    borderRadius: '10em',
                    background: primaryVortexTheme.button,
                  }}
                  onClick={async () => {
                    try {
                      if (accountNumber.length <= 0) {
                        return;
                      }

                      setIsFormLoading(true);

                      const reqInputPayload = {
                        clientRequestId: 'Empty',
                        mobileNumber: accountNumber.trim(),
                        productCode: selectedProduct.code,
                      };

                      const result = await saveVortexTopUpTransaction({
                        requestInputPayload: reqInputPayload,
                        totalAmount: grandTotalFee,
                      });
                      setTransactionDocId(result._id);

                      setTransactionReferenceId(result.referenceNumber);

                      setAccountOrMobileNumber(`${accountNumber.trim()}`);

                      setIsFormLoading(false);

                      stepForward();
                    } catch (error) {
                      setErrorData({
                        isError: true,
                        message: `${error}`,
                      });
                      throw error;
                    }
                  }}
                >
                  {isFormLoading ? 'Please wait...' : 'CONTINUE'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
        {/* }  )} */}
      </Box>
    );
  };

  const ReviewConfirmationForm = () => {
    const paymentMethodType = ls.get('paymentMethodType');

    // const { email, name, phone, address } = getUser();

    const { convenienceFee, grandTotalFee } = getServiceFee({
      amount: selectedProduct.pricing.price,
      currency: selectedProduct.pricing.unit,
    });

    // const [isPaymentMethodGCash, setisPaymentMethodGCash] = useState(false);
    const [expanded, setExpanded] = useState('panel1');

    const handleAccordionChange = (panel) => (event, isExpanded) => {
      console.log(panel, isExpanded);

      if (panel === 'panel1') {
        setExpanded(isExpanded ? 'panel1' : 'panel2');
      } else if (panel === 'panel2') {
        setExpanded(isExpanded ? 'panel2' : 'panel1');
      }
    };

    return (
      <Box>
        <Box>
          <VortexFormToolbar
            title={'Load Payment'}
            onClickBack={() => {
              stepBack();
            }}
          />
          <Toolbar />
          <div>
            {/* Product Hero */}
            <Stack direction={'row'} alignItems="center" marginTop={'2em'} marginLeft={'2em'} marginBottom={'2em'}>
              <Stack sx={{ marginRight: '2em' }} textAlign="center">
                <Typography fontSize={'3em'} fontWeight={'bold'} color={primaryVortexTheme.secondarytextcolor}>
                  {selectedProduct.pricing.price}
                </Typography>
                <Typography fontSize={'1em'} fontWeight={'bold'} color={primaryVortexTheme.secondarytextcolor}>
                  {selectedProduct.pricing.unit}
                </Typography>
              </Stack>
              <Stack>
                <Typography fontWeight={'bold'} color={primaryVortexTheme.primarytextcolor}>
                  {selectedProduct.name}
                </Typography>
                <Typography color={primaryVortexTheme.primarytextcolor}>{selectedProduct.description}</Typography>
              </Stack>
            </Stack>
            <Divider />

            {/* Buy load for */}
            <Stack style={{ marginBottom: '1em' }}>
              <Stack style={{ margin: '0.5em' }}>
                <Typography
                  style={{
                    color: `${primaryVortexTheme.primarytextcolor}`,
                    marginTop: '1em',
                    marginBottom: '1em',
                  }}
                  fontSize={15}
                  fontWeight="bold"
                >
                  Buy load for
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent={'center'}>
                <Box
                  style={{
                    border: 'solid 2px #707070',
                    borderRadius: '1em',
                  }}
                >
                  <Typography
                    style={{
                      color: `${primaryVortexTheme.secondarytextcolor}`,
                      marginTop: '0.1em',
                      marginBottom: '0.1em',
                      marginLeft: '1em',
                      marginRight: '1em',
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
              <Stack style={{ margin: '0.5em' }}>
                <Typography
                  style={{
                    color: `${primaryVortexTheme.primarytextcolor}`,
                    marginTop: '1em',
                  }}
                  fontSize={20}
                  fontWeight="bold"
                >
                  You are about to pay
                </Typography>
              </Stack>
              <Stack style={{ margin: '1em' }}>
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  style={{
                    color: 'black',
                    marginBottom: '0.5em',
                  }}
                >
                  <Typography fontWeight={'bold'}>{`Amount Due `}</Typography>

                  <Typography fontWeight={'bold'} style={{ marginRight: '2em' }}>{`${parseFloat(
                    selectedProduct.pricing.price / platformVariables?.topupCurrencyToPeso
                  ).toFixed(2)} ${platformVariables?.currencySymbol}`}</Typography>
                </Stack>

                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  style={{
                    color: 'black',
                    marginBottom: '0.5em',
                  }}
                >
                  <Typography fontWeight={'bold'}>{`Convenience Fee `}</Typography>

                  {expanded === 'panel2' ? (
                    <Typography fontWeight={'bold'}>{`0 ${platformVariables?.currencySymbol}`}</Typography>
                  ) : (
                    <Typography fontWeight={'bold'} style={{ marginRight: '2em' }}>
                      {`${convenienceFee} ${platformVariables?.currencySymbol}`}
                      {'        '}
                    </Typography>
                  )}
                </Stack>

                <Divider />

                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  style={{
                    color: 'black',
                    marginTop: '0.5em',
                  }}
                >
                  <Typography fontWeight={'bold'} fontSize={'25px'}>
                    TOTAL AMOUNT
                  </Typography>
                  <Typography fontWeight={'bold'} fontSize={'25px'}>
                    {`${grandTotalFee} ${platformVariables?.currencySymbol}`}
                  </Typography>
                </Stack>
                <Box height={20} />
                <Button
                  disabled={isLoadingTransaction}
                  variant="outlined"
                  onClick={async () => {
                    const url = 'https://pm.link/123123123123123za23/test/DGSwn7b';
                    window.open(url, '_blank');
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
                  {isLoadingTransaction ? 'PLEASE WAIT . . . TRANSACTION IN PROGRESS . . ' : 'PAY'}
                </Button>
              </Stack>
            </Stack>
          </div>
        </Box>
      </Box>
    );
  };

  const FormRender = () => {
    console.log('Active Step:', activeStep);
    console.log('Selected Brand in FormRender:', selectedBrand);

    switch (activeStep) {
      case 0:
        return <BrandSelectForm setSelectedBrand={setSelectedBrand} />;
      case 1:
        return <AccountNoInputForm selectedBrand={selectedBrand} />;
      case 2:
        return <ReviewConfirmationForm />;
      default:
        return <AccountNoInputForm selectedBrand={selectedBrand} />;
    }
  };

  useEffect(() => {
    if (activeStep === 0) {
      setStoreStatus(1);
      setUserStatus(1);
    }
  }, [activeStep]);

  return (
    <div
      style={{
        display: 'block',
        flexDirection: 'column',
        position: 'absolute',
        textAlign: 'center',
        top: 0,
        left: 0,
        width: '100%',
        minHeight: '100vh',
        background: '#fff',
        color: 'black',
        fontSize: '1.5rem',
        padding: '0 0 2em 0',
      }}
    >
      {platformVariables?.enableLoad === false && <ServiceDisabledPrompt />}
      {storeStatus === 0 && <StoreBlockPrompt />}
      {userStatus === 0 && <BlockPrompt />}

      {userStatus === 1 && storeStatus === 1 && platformVariables?.enableLoad ? (
        <>
          {error.isError ? (
            <VortexError
              message={error.message}
              onClick={() => {
                setErrorData({
                  isError: false,
                  message: '',
                });
                setRetry(!retry);
                setActiveStep(0);
              }}
            />
          ) : (
            <FormRender />
          )}
          <Box sx={{ height: '10em' }} />
          <VortexBottomGradient />
          <BottomNavigator />
        </>
      ) : null}
    </div>
  );
};

export default VortexTopUp;
