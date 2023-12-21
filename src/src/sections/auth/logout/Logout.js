import SecureLS from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });

export const handleLogout = (closePopover, navigateTo) => {
  // Retrieve rememberMe status and credentials before clearing SecureLS
  const rememberMeStatus = ls.get('rememberMe');
  const rememberMeEmail = ls.get('rememberMeEmail');
  const rememberMePassword = ls.get('rememberMePassword');

  // Clear all localStorage and SecureLS items
  localStorage.clear();
  ls.removeAll();

  // Conditionally retain the email, password, and rememberMe status based on 'rememberMe' status
  if (rememberMeStatus === 'true') {
    ls.set('rememberMeEmail', rememberMeEmail);
    ls.set('rememberMePassword', rememberMePassword);
    ls.set('rememberMe', 'true');
  }

  closePopover();
  navigateTo('/', { replace: true });
};
