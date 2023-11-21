import React, { useEffect } from 'react';
import axios from 'axios';
import { useStore } from './StoreContext';
import { excludedPaths } from './components/subdomain/ExcludedPaths';

const SubdomainHandler = () => {
  const { setStoreData, setHasSubdomain } = useStore();

  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Ensure pathname and hostname are not null
    if (!pathname || !hostname) {
      setHasSubdomain(false);
      return;
    }

    if (excludedPaths.some((path) => pathname.includes(path))) {
      setHasSubdomain(false);
      return;
    }

    let storeUrl;

    if (pathname.includes('reset-password')) {
      setHasSubdomain(false);
      return;
    }

    if (hostname.includes('pldt-vaas-frontend')) {
      const pathParts = pathname.split('/');
      storeUrl = pathParts.length > 1 ? pathParts[1] : null;
    } else if (hostname.includes('localhost') && pathname !== '/') {
      storeUrl = pathname.slice(1);
    } else {
      const parts = hostname.split('.');
      storeUrl = parts.length > 2 ? parts[0] : null;
    }

    if (storeUrl && !storeUrl.includes('pldt-vaas-frontend')) {
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
