import React, { useEffect } from 'react';
import axios from 'axios';
import { useStore } from './StoreContext';

const SubdomainHandler = () => {
  const { setStoreData, setHasSubdomain } = useStore();
  const excludedSubdomains = ['pldt-vaas-frontend', 'www', 'lvh', 'localhost', 'sevenstarjasem'];

  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    const parts = hostname.split('.');

    let storeUrl;

    if (pathname.includes('reset-password')) {
      setHasSubdomain(false);
      return;
    }

    if (hostname.includes('localhost') && pathname !== '/') {
      storeUrl = pathname.slice(1);
    } else if (hostname.includes('lvh.me') || hostname.includes('localhost')) {
      storeUrl = parts[0];
    } else {
      storeUrl = parts.length > 2 ? parts[0] : null;
    }

    if (storeUrl && !excludedSubdomains.includes(storeUrl)) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/stores/url/${storeUrl}`, {
          headers: {
            'x-subdomain': storeUrl,
          },
        })
        .then((response) => {
          if (response.data) {
            setStoreData({ subdomain: storeUrl, ...response.data });
            setHasSubdomain(true);
          } else {
            setHasSubdomain(false);
          }
        })
        .catch((error) => {
          console.error('Could not fetch live store', error);
          setHasSubdomain(false);
        });
    } else {
      setHasSubdomain(false);
    }
  }, [setStoreData, setHasSubdomain]);

  return null;
};

export default SubdomainHandler;
