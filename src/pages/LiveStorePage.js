import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../StoreContext';

const LiveStorePage = () => {
  const { storeData, setStoreData } = useStore();
  const { storeUrl } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const notFound = queryParams.get('notFound');

  useEffect(() => {
    if (storeUrl) {
      const fetchStoreData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stores/url/${storeUrl}`);
          setStoreData(response.data);
        } catch (error) {
          console.error('Could not fetch store data', error);
        }
      };
      fetchStoreData();
    }
  }, [storeUrl]);

  if (storeData === null || notFound === 'true') {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Domain Not Found</h1>
      </div>
    );
  }

  if (!storeData) {
    return <div>Loading...</div>;
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
      </div>
    </div>
  );  
};

export default LiveStorePage;
