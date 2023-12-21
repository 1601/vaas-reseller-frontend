import React, { useState, useEffect, useReducer, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SecureLS from 'secure-ls';
import { Box, Button, Divider, Stack, Grid, TextField, Toolbar, Typography, InputBase } from '@mui/material';
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
// import CenteredProgress from '../../Vortex/components/centeredProgress';
// import { sparkleTopupFee } from "../config/config"
// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
// import "../../assets/css/HorizontalCardList.css"
// import { LoginState, PlatformVariables, StoreStatus, UserStatus } from '../../Vortex/globalstates';
import { primaryVortexTheme } from '../../Vortex/config/theme';
import VortexBottomGradient from '../../Vortex/components/VortexBottomGradient';
// import BottomNavigator from '../../Homemade/BottomNavigator';
// import useLoggedUser from "../../../custom-hooks/useLoggedUser"
// import VortexVoucherSearchBar from '../../Vortex/components/VortexVoucherSearchBar';

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

const createLink = async (amount, description) => {
  console.log(`Creating link with amount: ${amount} and description: ${description}`);
  const url = 'https://api.paymongo.com/v1/links';

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', 'Basic c2tfdGVzdF84VWhHVXBBdVZEWVBKU3BHRWVpV250Qm46');

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

const ProductContext = React.createContext();

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

        // Reload the page if encountering "Could not parse JSON" error
        if (error.message.includes('Could not parse JSON')) {
          console.log('Encountered JSON parse error, reloading page.');
          window.location.reload();
        }
      }
    };

    fetchPlatformVariables();
  }, []);

  const navigate = useNavigate();

  const ls = new SecureLS({ encodingType: 'aes' });

  const { userId } = useParams();

  const [error, setErrorData] = useState({ isError: false, message: '' });

  const [retry, setRetry] = useState(null);

  const [userStatus, setUserStatus] = useState(null);

  const [storeStatus, setStoreStatus] = useState(null);

  const [transactionDocId, setTransactionDocId] = useState(null);

  const [transactionReferenceId, setTransactionReferenceId] = useState(null);

  const [activeStep, setActiveStep] = useState(0);
  console.log('activeStep:', activeStep);

  const [transactionData, setTransactionData] = useState({});

  const [accountOrMobileNumber, setAccountOrMobileNumber] = useState('');

  const [selectedBrand, setSelectedBrand] = useState('');

  const [selectedProduct, setSelectedProduct] = useState({});

  const [brands, setbrands] = useState([]);

  const [data, setData] = useContext(VortexProducts);

  const [renderData, setRenderData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  // const [isLoggin, setisLoggin] = useState(null);

  // const [platformVariables, setPlatformVariables] = useContext(PlatformVariables)

  // const [isLoadingPrivate, setIsLoadingPrivate] = useState(false);

  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  // const { getUser } = useLoggedUser()

  // const [productCategories, setProductCategories] = useState([])

  const [decryptedUserId, setDecryptedUserId] = useState(null);

  const [productInfo, setProductInfo] = useState({});

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

  const [topupToggles, setTopupToggles] = useState({});

  useEffect(() => {
    const fetchTopupToggles = async () => {
      try {
        const encryptedUserId = localStorage.getItem('encryptedUserId');
        const decryptedUserIdFromLS = ls.get('encryptedUserId');

        if (decryptedUserIdFromLS) {
          setDecryptedUserId(decryptedUserIdFromLS); // Update the state
          const togglesResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${decryptedUserIdFromLS}/topup-toggles/public`
          );
          setTopupToggles(togglesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching top-up toggles:', error);
      }
    };

    fetchTopupToggles();
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const collectedBrands = [];

      for (let index = 0; index < data.length; index += 1) {
        const product = data[index];

        // Update the condition to check the 'enabled' property
        if (
          topupToggles[product.brand]?.enabled &&
          (product.category === 'Electronic Load' || product.category === 'Data Bundles')
        ) {
          topUpProducts.push(product);
        }

        if (topupToggles[product.brand]?.enabled && product.category === 'Electronic Load') {
          if (product.brand === 'ROW') {
            addToInternationalLoad(product);
          }

          if (!collectedBrands.some((brand) => brand.name === product.brand)) {
            collectedBrands.push({
              name: product.brand,
              image: product.catalogImageURL,
              rank: localTelecomRankProvider(product.brand),
            });
          }
        }
      }

      console.log('Filtered and collected brands:', collectedBrands);
      setbrands(collectedBrands.sort((brand, previous) => previous.rank - brand.rank));
    }
  }, [data, topupToggles]);

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

    async function updateProductDetailsForAllDealers(brandName, products) {
      try {
        console.log(`Attempting to update product details for brand: ${brandName}`);
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/topup/products`, {
          brandName,
          products,
        });
        console.log(`Successfully updated product details for brand: ${brandName}`, response.data);
      } catch (error) {
        console.error(`Error updating product details for ${brandName}:`, error);
      }
    }

    // Fetch Dealer Product Config Function
    async function fetchDealerProductConfig(dealerId, brandName) {
      console.log(`fetchDealerProductConfig called with dealerId: ${dealerId}, brandName: ${brandName}`);
      try {
        console.log(`Attempting to fetch product configuration for dealer ${dealerId}, brand ${brandName}`);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/product-config/${dealerId}/${brandName}/public`
        );

        if (response.data && response.data.products) {
          console.log(
            `Fetched product configuration for dealer ${dealerId}, brand ${brandName}:`,
            response.data.products
          );
          return response.data.products; // Contains the products with enabled status and current price
        }

        console.log(`No products found for dealer ${dealerId}, brand ${brandName}`);
        return []; // Return an empty array if the response does not contain products
      } catch (error) {
        console.error(`Error fetching product configuration for dealer ${dealerId}, brand ${brandName}:`, error);
        return []; // Return an empty array in case of an error
      }
    }

    function navigateInternationalLoad(name, data, previous = {}) {
      console.log(`navigateInternationalLoad called with name: ${name}, data:`, data);

      if (name === 'brandProducts') {
        const brandName = data[0]?.brand;
        console.log(`Brand name in navigateInternationalLoad: ${brandName}`);

        // Mapping existing product data to prepare for update
        const products = data.map((product) => ({
          ...product,
          name: product.enabled ? product.name : `${product.name} (Not Available)`, // Append (Not Available) for products where enabled is false
          price: product.pricing.price,
          isAvailable: !!product.enabled, // Coerce `enabled` to a boolean
        }));

        console.log(`Preparing to update product details for brand: ${brandName}`, products);

        updateProductDetailsForAllDealers(brandName, products);

        if (decryptedUserId) {
          console.log(`DecryptedUserId available: ${decryptedUserId}`);

          fetchDealerProductConfig(decryptedUserId, brandName).then((dealerProductConfig) => {
            console.log(`Dealer Product Config:`, dealerProductConfig);

            const updatedProducts = products.map((product) => {
              // Find the dealer config for the product without the "(Not Available)" text
              const fetchedProduct = dealerProductConfig.find(
                (p) => p.name === product.name.replace(' (Not Available)', '')
              );

              console.log(`fetched Product:`, fetchedProduct);

              // If the fetchedProduct is null or undefined, it means it wasn't found in the dealer config
              if (!fetchedProduct) {
                return {
                  ...product,
                  isAvailable: false, // Set availability to false if product not found in dealer config
                };
              }

              // If the fetchedProduct is found but the enabled flag is false, keep the name appended
              const name = fetchedProduct.enabled ? fetchedProduct.name : `${fetchedProduct.name} (Not Available)`;

              return {
                ...product,
                name,
                price: fetchedProduct.currentPrice, // Use the current price from the fetched product
                isAvailable: fetchedProduct.enabled, // Set availability based on the fetched product
              };
            });

            // Sort the updated products so that unavailable products are at the bottom
            const sortedProducts = updatedProducts.sort((a, b) => {
              if (!a.isAvailable && b.isAvailable) {
                return 1; // Move 'a' towards the end
              }
              if (a.isAvailable && !b.isAvailable) {
                return -1; // Move 'a' towards the beginning
              }
              return 0; // Keep the original order
            });

            setNavigation({
              name,
              data: sortedProducts,
              previous: {
                ...navigation.previous,
                ...previous,
              },
            });
          });
        }
      }
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

    // Add state for search query
    const [searchQuery, setSearchQuery] = useState('');

    // Handler for search input changes
    const handleSearchInputChange = (event) => {
      setSearchQuery(event.target.value.toLowerCase());
    };

    // Filter brands based on the search query
    const filteredBrands = searchQuery
      ? brands.filter((brand) => brand.name.toLowerCase().includes(searchQuery))
      : brands;

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
        <div
          style={{
            margin: '1em',
          }}
        >
          <div className="heading-search-container">
            <div className="heading-search-shape" style={{ display: 'flex' }}>
              <InputBase
                disabled={false}
                style={{
                  width: '100%',
                  fontFamily: 'montserrat',
                  fontSize: '1em',
                  fontWeight: '500',
                  color: '#6b6b6b',
                  paddingLeft: '0.3em',
                  zIndex: 999,
                }}
                placeholder="Search Top-up brands..."
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              {searchQuery.length > 0 && (
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'grey',
                    fontWeight: 'bold',
                  }}
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchQuery('');
                    }
                  }}
                >
                  X
                </button>
              )}
            </div>
          </div>
        </div>

        {!isLoading && (
          <>
            {searchQuery && filteredBrands.length === 0 ? (
              <>
                <Typography margin={2} fontFamily={'Visby'} fontSize={17} color={'gray'} textAlign={'left'}>
                  No brands found
                </Typography>
              </>
            ) : (
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
                  {(searchQuery ? filteredBrands : brands).map((brand, index) => (
                    <div
                      key={index}
                      style={{
                        flexShrink: 0,
                        minWidth: '100px',
                        maxWidth: '100px',
                        height: '100px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '8px',
                        marginLeft: '8px',
                      }}
                    >
                      <VortexProductBrandCard
                        title={brand.name}
                        image={brand.image}
                        onClick={() => {
                          _setSelectedBrand(brand.name);
                        }}
                        imageStyle={{
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%',
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
    const [accountNumber, setAccountNumber] = useState(accountOrMobileNumber);

    const [isFormLoading, setIsFormLoading] = useState(false);

    const [inputValue, setInputValue] = useState('');

    const [error, setError] = useState('');

    const validateInput = (value, brand) => {
      let maxLength;
      let errorMessageTooLong;
      let errorMessageTooShort;

      switch (brand) {
        case 'MERALCO':
          maxLength = 16;
          errorMessageTooLong = 'Account Number is too long';
          errorMessageTooShort = 'Account Number is too short';
          break;
        case 'CIGNAL':
          maxLength = 10;
          errorMessageTooLong = 'Account Number is too long';
          errorMessageTooShort = 'Account Number is too short';
          break;
        default:
          maxLength = 12;
          errorMessageTooLong = 'Mobile Number is too long';
          errorMessageTooShort = 'Mobile Number is too short';
      }

      if (value.length > maxLength) {
        setError(errorMessageTooLong);
      } else if (value.length < maxLength) {
        setError(errorMessageTooShort);
      } else {
        setError('');
      }
    };

    const handleChange = (event) => {
      const value = event.target.value;
      const validValue = value.replace(/[^0-9]/g, '');
      setAccountNumber(validValue);
      validateInput(validValue, selectedBrand?.toUpperCase() || '');
    };

    const inputProps = (brand) => {
      let maxLength;
      switch (brand) {
        case 'MERALCO':
          maxLength = 16;
          break;
        case 'CIGNAL':
          maxLength = 10;
          break;
        default:
          maxLength = 12;
      }

      const showTypeYourMessage = accountNumber.length !== maxLength && !error;

      return {
        title: brand === 'MERALCO' ? 'Meralco Account Number' : brand === 'CIGNAL' ? 'CCA Number' : 'Mobile Number',
        maxLength,
        helperText:
          error ||
          (showTypeYourMessage
            ? `Type your ${
                brand === 'MERALCO'
                  ? 'meralco load account number'
                  : brand === 'CIGNAL'
                  ? 'account number'
                  : 'mobile number with country code'
              }`
            : ''),
        placeholder: brand === 'MERALCO' ? '1234567890123456' : brand === 'CIGNAL' ? '1234567890' : '639273342196',
        error: !!error,
        onChange: handleChange,
      };
    };

    useEffect(() => {
      validateInput(accountNumber, selectedBrand?.toUpperCase() || '');
    }, [selectedBrand, accountNumber]);

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
                  onChange={handleChange}
                  inputProps={{
                    maxLength: inputProps(selectedBrand?.toUpperCase() || '').maxLength,
                  }}
                  error={inputProps(selectedBrand?.toUpperCase() || '').error}
                />
              </Stack>
              <Stack direction={'row'} justifyContent={'center'}>
                <Button
                  disabled={isFormLoading || error !== ''}
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

  const ReviewConfirmationForm = ({ setActiveStep, setTransactionData }) => {
    const paymentMethodType = ls.get('paymentMethodType');

    // const { email, name, phone, address } = getUser();

    const { convenienceFee, grandTotalFee } = getServiceFee({
      amount: selectedProduct.price,
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
                  {selectedProduct.price}
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
                    selectedProduct.price / platformVariables?.topupCurrencyToPeso
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
                    const url = await createLink(grandTotalFee * 100, selectedProduct.name);
                    const paymentWindow = window.open(url, '_blank');
                    console.log('Link Created: ', createLink);
                    console.log('Amount: ', grandTotalFee);
                    console.log('Description: ', selectedProduct.name);
                    // 'https://pm.link/123123123123123za23/test/de4YiYw'
                    // Polling to check if the payment window has been closed
                    const paymentWindowClosed = setInterval(() => {
                      if (paymentWindow.closed) {
                        clearInterval(paymentWindowClosed);
                        // Once the payment window is closed, set the transaction data
                        setTransactionData({
                          productName: selectedProduct.name,
                          price: selectedProduct.price,
                          convenienceFee,
                          totalPrice: grandTotalFee,
                          currency: platformVariables?.currencySymbol,
                        });
                        // Update the activeStep to 3 to show the transaction completed message
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
                  {isLoadingTransaction ? 'PLEASE WAIT . . . TRANSACTION IN PROGRESS . . ' : 'PAY'}
                </Button>
              </Stack>
            </Stack>
          </div>
        </Box>
      </Box>
    );
  };

  const TransactionCompletedForm = ({ setActiveStep, transactionData }) => {
    const handleConfirmClick = () => {
      setActiveStep(0);
    };

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
        <Typography variant="h4" textAlign="center" mt={2} mb={4} fontWeight="bold">
          TRANSACTION RECEIPT
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Product Name:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography>{transactionData.productName}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>Price:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography>
              {transactionData.price} {transactionData.currency}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>Convenience Fee:</Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography>
              {transactionData.convenienceFee} {transactionData.currency}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 3, borderWidth: 2 }} />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              TOTAL AMOUNT:
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              {transactionData.totalPrice} {transactionData.currency}
            </Typography>
          </Grid>
        </Grid>
        <Box textAlign="center" mt={10}>
          {' '}
          <Button variant="outlined" color="primary" onClick={handleConfirmClick}>
            Confirm Transaction
          </Button>
        </Box>
      </Box>
    );
  };

  const FormRender = ({
    activeStep,
    setActiveStep,
    selectedBrand,
    setSelectedBrand,
    setTransactionData,
    transactionData,
  }) => {
    console.log('Active Step:', activeStep);
    console.log('Selected Brand in FormRender:', selectedBrand);

    switch (activeStep) {
      case 0:
        return <BrandSelectForm setSelectedBrand={setSelectedBrand} />;
      case 1:
        return <AccountNoInputForm selectedBrand={selectedBrand} />;
      case 2:
        return <ReviewConfirmationForm setActiveStep={setActiveStep} setTransactionData={setTransactionData} />;
      case 3:
        return <TransactionCompletedForm setActiveStep={setActiveStep} transactionData={transactionData} />;
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
            <FormRender
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              setTransactionData={setTransactionData}
              transactionData={transactionData}
            />
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
