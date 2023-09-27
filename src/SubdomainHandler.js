import React, { useEffect } from 'react';
import axios from 'axios';
import { useStore } from './StoreContext';

const SubdomainHandler = () => {
  const { setStoreData, setHasSubdomain } = useStore();
  const excludedSubdomains = ['pldt-vaas-frontend', 'www', 'admin-approval.pldt-vaas-frontend'];
  
  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    if (parts.length > 2) {
      const subdomain = parts[0];
      if (excludedSubdomains.includes(subdomain)) {
        setHasSubdomain(false);
        return;
      }

      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/stores/url/${subdomain}`, {
          headers: {
            'x-subdomain': subdomain,
          },
        })
        .then((response) => {
          if (response.data) {
            setStoreData({ subdomain, ...response.data });
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
