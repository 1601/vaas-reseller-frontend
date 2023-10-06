import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { Container, Stack, Link, Button } from '@mui/material';
import axios from 'axios';
import BillsImage from '../images/logos/bills.svg';
import LoadImage from '../images/logos/load.svg';
import VoucherImage from '../images/logos/voucher.svg';
import { useStore } from '../StoreContext';

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
  console.log('enableBills:', platformVariables.enableBills);
  console.log('enableLoad:', platformVariables.enableLoad);
  console.log('enableGift:', platformVariables.enableGift);

  useEffect(() => {
    let subdomainOrStoreUrl;

    console.log('Current Hostname:', window.location.hostname);
    const hostnameParts = window.location.hostname.split('.');
    const subdomain = hostnameParts[0];

    console.log('Subdomain:', subdomain);

    if (
      subdomain === 'localhost' ||
      subdomain === 'lvh' || // note that it's 'lvh' not 'lvh.me'
      subdomain === 'sevenstarjasem' ||
      subdomain === 'pldt-vaas-frontend'
    ) {
      subdomainOrStoreUrl = storeUrl;
    } else {
      const hostnameParts = window.location.hostname.split('.');
      console.log('hostnameParts:', hostnameParts);
      subdomainOrStoreUrl = hostnameParts[0];
    }

    if (
      subdomainOrStoreUrl === 'www' ||
      subdomainOrStoreUrl === 'sevenstarjasem' ||
      subdomainOrStoreUrl === 'pldt-vaas-frontend'
    ) {
      subdomainOrStoreUrl = storeUrl;
    }

    // Check if the subdomain is empty
    if (!subdomainOrStoreUrl) {
      // Extract storeName from the path, assuming the format is "/storeName"
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 1) {
        subdomainOrStoreUrl = pathParts[1];
      }
    }

    // Check if running on localhost and no subdomainOrStoreUrl was found
    if (window.location.hostname === 'localhost' || !subdomainOrStoreUrl) {
      // Extract subdomainOrStoreUrl from the URL in the format "localhost:3000/subdomainOrStoreUrl"
      console.log('Running on localhost');
      const pathParts = window.location.href.split('/');
      if (pathParts.length > 3) {
        subdomainOrStoreUrl = pathParts[3];
      }
    }

    if (subdomainOrStoreUrl) {
      console.log('Fetching data for store URL:', subdomainOrStoreUrl);
      const fetchStoreData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/stores/url/${subdomainOrStoreUrl}`
          );
          console.log('Response from API:', response.data);

          setStoreData(response.data);

          if (response.data.platformVariables) {
            console.log('platformVariables from API:', response.data.platformVariables);
            setPlatformVariables(response.data.platformVariables);
          }
        } catch (error) {
          console.error('Could not fetch store data', error);
          setStoreData('domainNotFound');
          console.log('setStoreData (incorrect):', storeData);
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
