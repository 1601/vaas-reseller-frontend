import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import SecureLS from 'secure-ls';
import { Container, Stack, Link, Button } from '@mui/material';
import axios from 'axios';
import BillsImage from '../images/logos/bills.svg';
import LoadImage from '../images/logos/load.svg';
import VoucherImage from '../images/logos/voucher.svg';
import { useStore } from '../StoreContext';

const ls = new SecureLS({ encodingType: 'aes' });

const LiveStorePage = () => {
  const { storeData, setStoreData } = useStore();
  const { storeUrl } = useParams();
  const location = useLocation();
  const [previewStoreUrl, setPreviewStoreUrl] = useState(storeUrl);
  const [showNotFoundError, setShowNotFoundError] = useState(false);
  const [platformVariables, setPlatformVariables] = useState({
    enableBills: true,
    enableLoad: true,
    enableGift: true,
  });

  let baseUrl;
  if (window.location.hostname.includes('lvh.me')) {
    baseUrl = `http://${storeUrl}.lvh.me:3000`;
  } else {
    baseUrl = `https://${storeUrl}.sevenstarjasem.com`;
  }

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const newStoreUrl = `/${pathParts[1]}`;
    setPreviewStoreUrl(newStoreUrl);
  }, [location.pathname]);

  const gradientStyle = storeData
    ? {
        background: `linear-gradient(45deg, ${storeData.primaryColor}, ${storeData.secondaryColor})`,
      }
    : {};

  const queryParams = new URLSearchParams(location.search);
  const notFound = queryParams.get('notFound');
  const user = JSON.parse(localStorage.getItem('user'));

  const getSubdomainOrStoreUrl = () => {
    const hostname = window.location.hostname;
    let subdomain = hostname.split('.')[0];

    // Check if the hostname is 'localhost' or another known development environment
    if (['localhost', 'lvh', 'sevenstarjasem', 'pldt-vaas-frontend', 'vortex-vaas-frontend'].includes(subdomain)) {
      return storeUrl;
    }

    // Handle 'lvh.me' domain with development environment subdomains
    if (hostname.endsWith('lvh.me')) {
      // Extract subdomain and check if it's a development environment identifier
      subdomain = hostname.split('.')[0];
      if (subdomain.startsWith('pldt-vaas-frontend') || subdomain.startsWith('vortex-vaas-frontend')) {
        // Extract the actual store URL from the path
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1) {
          return pathParts[1];
        }
      }
      return subdomain;
    }

    // For production or other environments
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1) {
      return pathParts[1];
    }

    // Return the subdomain or extracted path part as the store URL
    return subdomain;
  };

  useEffect(() => {
    setPreviewStoreUrl(`/${storeUrl}`);
  }, [storeUrl]);

  useEffect(() => {
    const subdomainOrStoreUrl = getSubdomainOrStoreUrl();

    if (subdomainOrStoreUrl) {
      const fetchStoreData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${subdomainOrStoreUrl}`
          );
          setStoreData(response.data);
          if (response.data.platformVariables) {
            setPlatformVariables(response.data.platformVariables);
          }
        } catch (error) {
          console.error('Could not fetch store data', error);
          setStoreData('domainNotFound');
        }
      };
      fetchStoreData();
    }
  }, [storeUrl, setStoreData]);

  useEffect(() => {
    if ((!storeData || storeData === 'domainNotFound') && notFound !== 'true') {
      const timer = setTimeout(() => {
        setShowNotFoundError(true);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if ((storeData && storeData !== 'domainNotFound') || notFound === 'true') {
      setShowNotFoundError(false);
    }

    return () => {};
  }, [storeData, notFound]);

  useEffect(() => {
    if (storeData && storeData.storeUrl) {
      const fetchUserId = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeData.storeUrl}/user`
          );
          const userId = response.data.userId;

          ls.set('encryptedUserId', userId);
        } catch (error) {
          console.error('Could not fetch user ID for store', error);
        }
      };
      fetchUserId();
    }
  }, [storeData]);

  useEffect(() => {
    if (storeData && storeData.storeName) {
      document.title = `${storeData.storeName} | VAAS`;
    } else if (showNotFoundError) {
      document.title = 'Domain Not Found | VAAS';
    } else {
      document.title = 'Store Page | VAAS';
    }
  }, [storeData, showNotFoundError]);

  if (showNotFoundError) {
    return (
      <div
        style={{
          ...gradientStyle,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '3rem',
        }}
      >
        <h1>Domain Not Found</h1>
      </div>
    );
  }

  if (storeData && ((user && user._id === storeData.ownerId) || storeData.isLive)) {
    return (
      <div
        style={{
          ...gradientStyle,
          display: 'flex',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        {/* banner to alert the user that this is a preview only if the storeData is not yet live and the owner is the user.id -
        the preview is always there but I should be able to interact still on the UI */}
        <div
          style={{
            display: storeData.isLive ? 'none' : 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: 0.3,
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            fontSize: '1.5rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1>Preview Only</h1>
            <h3>This store is not yet live</h3>
            <Button variant="outlined" color="inherit" href={`/dashboard/store`} style={{ pointerEvents: 'all' }}>
              Edit Store
            </Button>
          </div>
        </div>
        <Outlet />
        <div style={{ textAlign: 'center' }}>
          <img
            src={storeData ? storeData.storeLogo : '/vortex_logo_black.png'}
            alt={`${storeData ? storeData.storeName : 'Your Store'}'s Logo`}
            style={{ maxWidth: '400px', maxHeight: '400px' }}
          />
          <h1>{storeData.storeName}</h1>
          <h1>{`${location.pathname}`}</h1>

          <Container>
            {/* Using Flexbox to Center the Items */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '16px',
                '@media (max-width: 600px)': {
                  flexDirection: 'column',
                  alignItems: 'center',
                },
              }}
            >
              {platformVariables.enableBills && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Link href={storeUrl ? `${previewStoreUrl}/bills` : './bills'}>
                    <img src={BillsImage} height="100px" alt="Home" />
                    <div className="menu--text">Bills</div>
                  </Link>
                </div>
              )}
              {platformVariables.enableLoad && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Link href={storeUrl ? `${previewStoreUrl}/topup` : './topup'}>
                    <img src={LoadImage} height="100px" alt="Express" />
                    <div className="menu--text">Load</div>
                  </Link>
                </div>
              )}

              {platformVariables.enableGift && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Link href={storeUrl ? `${previewStoreUrl}/voucher` : './voucher'}>
                    <img src={VoucherImage} height="100px" alt="Express" />
                    <div className="menu--text">Vouchers</div>
                  </Link>
                </div>
              )}
            </div>

            <Stack m={3} direction={'row'} justifyContent={'center'}>
              <Link href={storeUrl ? `${previewStoreUrl}/transactions` : './transactions'}>View transactions</Link>
            </Stack>
          </Container>
        </div>
      </div>
    );
  }

  if (storeData && storeData !== 'domainNotFound' && !storeData.isLive) {
    return (
      <div
        style={{
          ...gradientStyle,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '3rem',
        }}
      >
        <h1>Store is currently Offline</h1>
      </div>
    );
  }

  return <></>;
};

export default LiveStorePage;
