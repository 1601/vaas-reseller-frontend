import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDataFetch = (userId) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Could not fetch user data', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return userData;
};

export default UserDataFetch;
