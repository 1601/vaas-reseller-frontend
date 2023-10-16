// ----------------------------------------------------------------------

import { useState, useEffect } from 'react';

function useAccount() {
  const [account, setAccount] = useState({
    displayName: 'Guest',
    email: 'guest@email.com',
    photoURL: '/assets/images/avatars/avatar_default.jpg',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('role');

    if (user) {
      const updatedAccount = {
        displayName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username,
        email: user.email,
        photoURL: '/assets/images/avatars/avatar_default.jpg',
      };
      setAccount(updatedAccount);
      
      console.log("Email from localStorage:", user.email);
      console.log("First Name from localStorage:", user.firstName);
      console.log("Last Name from localStorage:", user.lastName);
      console.log("Role from localStorage:", role);
    }
  }, []);

  return account;
}

export default useAccount;