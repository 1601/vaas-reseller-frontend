import { useState, useEffect } from 'react';
import SecureLS from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });

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
    const user = ls.get('user');
    const role = user ? user.role : null;

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
