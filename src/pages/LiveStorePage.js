import React, { useState, useEffect } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { Container, Grid, Stack, Link, Button } from '@mui/material';
import axios from 'axios';
import BillsImage from '../images/logos/bills.svg';
import LoadImage from '../images/logos/load.svg';
import VoucherImage from '../images/logos/voucher.svg';
import { useStore } from '../StoreContext';

const LiveStorePage = () => {
  const { storeData, setStoreData } = useStore();
  const { storeUrl } = useParams();
  const location = useLocation();
  const [platformVariables, setPlatformVariables] = useState({
    enableBills: true,
    enableLoad: true,
    enableGift: true,
  });

  const gradientStyle = storeData
    ? {
        background: `linear-gradient(45deg, ${storeData.primaryColor}, ${storeData.secondaryColor})`,
      }
    : {};

  const queryParams = new URLSearchParams(location.search);
  const notFound = queryParams.get('notFound');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (storeUrl) {
      console.log('Fetching data for store URL:', storeUrl);
      const fetchStoreData = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/stores/url/${storeUrl}`
          );
          setStoreData(response.data);
        } catch (error) {
          console.error('Could not fetch store data', error);
          setStoreData('domainNotFound');
        }
      };
      fetchStoreData();
    }
  }, [storeUrl, setStoreData]);

  if (!storeData || notFound === 'true') {
    return (
      <div style={{ ...gradientStyle, textAlign: 'center' }}>
        <h1>Loading . . .</h1>
      </div>
    );
  }

  if (storeData === 'domainNotFound') {
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

  if (user && user._id === storeData.ownerId || storeData.isLive) {
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
            <Button
              variant="outlined"
              color="inherit"
              href={`/dashboard/store`}
              style={{ pointerEvents: 'all' }}
            >
              Edit Store
            </Button>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img
            src={storeData ? storeData.storeLogo : '/vortex_logo_black.png'}
            alt={`${storeData ? storeData.storeName : "Your Store"}'s Logo`}
            style={{ maxWidth: '400px', maxHeight: '400px' }}
          />
          <h1>{storeData.storeName}</h1>
          <h1>{`${location.pathname}`}</h1>

          <Container>
            <Outlet />

            <Grid container spacing={4}>
              <Grid
                item
                xs={4}
                style={{
                  display: platformVariables.enableBills ? '' : 'none',
                }}
              >
                <Link href={`/${storeUrl}/bills`}>
                  <img src={BillsImage} height="100px" alt="Home" />
                  <div className="menu--text">Bills</div>
                </Link>
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  display: platformVariables.enableLoad ? '' : 'none',
                }}
              >
                <Link href={`/${storeUrl}/topup`}>
                  <img src={LoadImage} height="100px" alt="Express" />
                  <div className="menu--text">Load</div>
                </Link>
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  display: platformVariables.enableGift ? '' : 'none',
                }}
              >
                <Link href={`/${storeUrl}/voucher`}>
                  <img src={VoucherImage} height="100px" alt="Express" />
                  <div className="menu--text">Vouchers</div>
                </Link>
              </Grid>
            </Grid>
            <Stack m={3} direction={'row'} justifyContent={'center'}>
              <Link href={`/${storeUrl}/transactions`}>
                View transactions
              </Link>
            </Stack>
          </Container>
        </div>
      </div>
    );
  }

  if (!storeData.isLive) {
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
