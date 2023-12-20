import { useState, useEffect } from 'react';

function capitalizeFirstLetter(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
        email: role ? capitalizeFirstLetter(role) : role,
        photoURL: '/assets/images/avatars/avatar_default.jpg',
      };
      setAccount(updatedAccount);
    }
  }, []);

  return account;
}

export default useAccount;
