import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from './StoreContext';

const SubdomainHandler = () => {
  const navigate = useNavigate();
  const { setStoreData, setHasSubdomain } = useStore();

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    if (parts.length > 2) {
      const subdomain = parts[0];
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/stores/url/${subdomain}/live`, {
          headers: {
            'x-subdomain': subdomain,
          },
        })
        .then((response) => {
          if (response.data) {
            setStoreData({ subdomain, ...response.data });
            setHasSubdomain(true);
          } else {
            navigate(`/not-found`);
          }
        })
        .catch((error) => {
          console.error('Could not fetch live store', error);
          navigate(`/error`);
        });
    } else {
      setHasSubdomain(false);
    }
  }, [navigate, setStoreData, setHasSubdomain]);

  return null;
};

export default SubdomainHandler;
