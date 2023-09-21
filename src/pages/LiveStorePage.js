import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Outlet } from 'react-router-dom';

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

  const queryParams = new URLSearchParams(location.search);
  const notFound = queryParams.get('notFound');

  useEffect(() => {
    if (storeUrl) {
      const fetchStoreData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stores/url/${storeUrl}`);
          setStoreData(response.data);
        } catch (error) {
          setStoreData('domainNotFound');
          console.error('Could not fetch store data', error);
        }
      };
      fetchStoreData();
    }
  }, [storeUrl]);

  if (!storeData ||notFound === 'true') {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Loading . . .</h1>
      </div>
    );
  }

  if (  storeData === 'domainNotFound') {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Domain Not Found</h1>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      height: '100vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/public/img/${storeData.storeLogo}`}
          alt={`${storeData.storeName}'s Logo`}
          style={{ maxWidth: '400px', maxHeight: '400px' }}
        />
        <h1>{storeData.storeName}</h1>
        <h1>{`${location.pathname}`}</h1>

        <Container>
        <Outlet />

        <Grid container spacing={4}>                 
          <Grid item xs={4}
            style={{
              display: platformVariables.enableBills ? "" : "none"
            }}>
            <Link href={`/${storeUrl}/bills`}>
              <img src={BillsImage} height="100px" alt="Home" />
            </Link>
            <div className="menu--text">Bills</div>
          </Grid>
          <Grid item xs={4}
            style={{
              display: platformVariables.enableLoad ? "" : "none"
            }}>
            
            <Link href={`/${storeUrl}/topup`}>
              <img src={LoadImage} height="100px" alt="Express" />
            </Link>
            <div className="menu--text">Load</div>
          </Grid>
          <Grid item xs={4}
            style={{
              display: platformVariables.enableGift ? "" : "none"
            }}
          >
            <Link href={`/${storeUrl}/voucher`}>
              <img src={VoucherImage} height="100px" alt="Express" />
            </Link>
            <div className="menu--text">Vouchers</div>
          </Grid>
        </Grid>
        <Stack m={3} direction={"row"} justifyContent={"center"}>
          <Link href={`/${storeUrl}/transactions`}>
            View transactions
          </Link>
        </Stack>
        </Container>

                    
      </div>
    </div>
  );  
};

export default LiveStorePage;
