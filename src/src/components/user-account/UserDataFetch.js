import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SecureLS from 'secure-ls';

const UserDataFetch = () => {
  const ls = new SecureLS({ encodingType: 'aes' });
  const user = ls.get('user');
  const userId = user ? user._id : null;
  const userRole = user ? user.role : null;

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) { 
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}`);
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Could not fetch user data', error);
      }
    };

    if (userId && userRole !== 'reseller') {
      fetchUserData();
    }
  }, [userId, userRole]);

  useEffect(() => {
    const fetchBillerToggles = async () => {
      try {
        if (userRole === 'reseller' && userId) { 
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/api/dealer/${userId}/billertoggles`);
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Could not fetch biller toggles', error);
      }
    };

    fetchBillerToggles();

    const intervalId = setInterval(() => {
      fetchBillerToggles();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [userId, userRole]);

  return userData;
};

export default UserDataFetch;
