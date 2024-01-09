import React, { useEffect } from 'react';
import axios from 'axios';
import { useStore } from './StoreContext';
import { excludedPaths } from './components/subdomain/ExcludedPaths';

const SubdomainHandler = () => {
  const { setStoreData, setHasSubdomain } = useStore();

  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Exclude certain paths from being processed as a subdomain
    if (excludedPaths.some((path) => pathname.includes(path)) || pathname.includes('reset-password')) {
      setHasSubdomain(false);
      return;
    }

    // Extract storeUrl based on hostname and pathname
    let storeUrl = null;

    // Check for custom hostname pattern from environment variable
    const custom1stSubdomain = process.env.REACT_APP_CUSTOM_1ST_SUBDOMAIN;
    if (custom1stSubdomain && hostname.includes(custom1stSubdomain)) {
      const pathParts = pathname.split('/');
      storeUrl = pathParts.length > 1 ? pathParts[1] : null;
    } else if (hostname.includes('vortex-vaas-frontend')) {
      // Handling for new URL
      const pathParts = pathname.split('/');
      storeUrl = pathParts.length > 1 ? pathParts[1] : null;
    } else if (hostname.includes('pldt-vaas-frontend')) {
      const pathParts = pathname.split('/');
      storeUrl = pathParts.length > 1 ? pathParts[1] : null;
    } else if (hostname.includes('localhost') && pathname !== '/') {
      storeUrl = pathname.slice(1);
    } else {
      const parts = hostname.split('.');
      storeUrl = parts.length > 2 ? parts[0] : null;
    }

    // Fetch store data if storeUrl is valid
    if (storeUrl && !storeUrl.includes('pldt-vaas-frontend') && !storeUrl.includes('vortex-vaas-frontend')) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/url/${storeUrl}`, {
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
