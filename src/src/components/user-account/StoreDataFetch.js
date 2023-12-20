import { useState, useEffect } from 'react';
import axios from 'axios';

const StoreDataFetch = (userId) => {
  const [storeData, setStoreData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [platformVariables, setPlatformVariables] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => { 
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/stores/owner/${userId}`);
        setStoreData(response.data);
        setEditedData(response.data);
        setPlatformVariables(response.data.platformVariables);
      } catch (err) {
        console.error('Could not fetch store data', err);
        setError(err);
      }
    };
    fetchStoreData();
  }, [userId]);

  return { storeData, editedData, platformVariables, error };
};

export default StoreDataFetch;
