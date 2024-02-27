import React, { useEffect } from 'react';
import axios from 'axios';
import { useStore } from './StoreContext';
import { excludedPaths } from './components/subdomain/ExcludedPaths';

const SubdomainHandler = () => {
  const { setStoreData, setHasSubdomain } = useStore();

  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    if (excludedPaths.some((path) => pathname.includes(path)) || pathname.includes('reset-password')) {
      setHasSubdomain(false);
      return;
    }

    let storeUrl = null;
    const pathParts = pathname.split('/').filter(Boolean); // Filter out empty strings

    // Adjust logic for extracting storeUrl from pathname
    if (hostname.includes('localhost') && pathParts.length) {
      if (pathParts.length) {
        console.log(pathParts);
        storeUrl = pathParts[0]; // Also assumes the first part is the dealer for custom hostnames
      }
    } else if (hostname.includes('vortex-vaas-frontend') || hostname.includes('pldt-vaas-frontend')) {
      if (pathParts.length) {
        storeUrl = pathParts[0]; // Also assumes the first part is the dealer for custom hostnames
      }
    } else {
      const parts = hostname.split('.');
      storeUrl = parts.length > 2 ? parts[0] : null; // For handling subdomains in a live environment
    }

    if (storeUrl) {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}`, {
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
