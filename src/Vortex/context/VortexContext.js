import React, { useState, useEffect } from 'react';
import SecureLS from 'secure-ls';
import { getVortexProducts } from '../../api/public/vortex/product_service';
import { getVortexTokenBase } from '../../api/public/vortex/token_service';
import socket from '../services/socketio';

export const IsloadingProducts = React.createContext(false);

export const VortexProducts = React.createContext([]);

export const VortexContextError = React.createContext({
  isError: false,
  message: '',
});

export const ReloadProductsTrigger = React.createContext(false);

const VortexContext = ({ children }) => {
  const ls = new SecureLS({ encodingType: 'aes' });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setErrorData] = useState({ isError: false, message: '' });

  const [vortexProductData, setVortexProductData] = useState([]);

  const [retry, setRetry] = useState(false);

  const loadVortexProducts = async () => {
    setIsLoading(true);
    const vortexTokenResponse = await getVortexTokenBase();

    console.log('Vortex Token Response:', vortexTokenResponse);

    if (vortexTokenResponse.status === 200) {
      const vortexTokenResult = await vortexTokenResponse.json();
      console.log('Vortex Token Result:', vortexTokenResult);

      const response = await getVortexProducts(vortexTokenResult.access_token);
      console.log('Vortex Products Response:', response);

      setIsLoading(false);
      if (response.status === 200) {
        const result = await response.json();
        console.log('Vortex Products Data:', result);

        setVortexProductData(result);
      } else {
        const result = await response.json();
        console.log('Error in Vortex Products Response:', result);

        setIsLoading(false);
        setErrorData({
          isError: true,
          message: result.error.message,
        });
      }
    } else {
      const vortexTokenResult = await vortexTokenResponse.json();
      console.log('Error in Vortex Token Response:', vortexTokenResult);

      setIsLoading(false);
      setErrorData({
        isError: true,
        message: vortexTokenResult.error.message,
      });
    }
  };

  useEffect(() => {
    loadVortexProducts();
  }, [retry]);

  if (isLoading) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#fff',
        }}
      />
    );
  }

  return (
    <ReloadProductsTrigger.Provider value={[retry, setRetry]}>
      <VortexContextError.Provider value={[error, setErrorData]}>
        <IsloadingProducts.Provider value={[isLoading, setIsLoading]}>
          <VortexProducts.Provider value={[vortexProductData, setVortexProductData]}>
            {children}
          </VortexProducts.Provider>
        </IsloadingProducts.Provider>
      </VortexContextError.Provider>
    </ReloadProductsTrigger.Provider>
  );
};

export default VortexContext;
