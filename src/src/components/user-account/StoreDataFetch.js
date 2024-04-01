import { useState, useEffect } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });

const getToken = () => {
  return ls.get('token'); 
};

const StoreDataFetch = (userId) => {
  const [storeData, setStoreData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [platformVariables, setPlatformVariables] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const token = getToken(); 
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        };
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/owner`, config);
        setStoreData(response.data);
        setEditedData(response.data);
        setPlatformVariables(response.data.platformVariables);
      } catch (err) {
        console.error('Could not fetch store data', err);
        setError(err);
      }
    };

    fetchStoreData();
  }, []);

  return { storeData, editedData, platformVariables, error };
};

export default StoreDataFetch;
