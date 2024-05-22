import SecureLS from 'secure-ls';
import intervalManager from "../../../components/intervalManager";

const ls = new SecureLS({ encodingType: 'aes' });

export const handleLogout = (closePopover, navigateTo) => {
  const rememberMeStatus = ls.get('rememberMe');
  const rememberMeEmail = ls.get('rememberMeEmail');
  const rememberMePassword = ls.get('rememberMePassword');
  const { setTrackedInterval, clearAllIntervals } = intervalManager();

  // Clear all localStorage and SecureLS items
  localStorage.clear();
  ls.removeAll();
  ls.clear()
  clearAllIntervals();

  // Retains if rememberMe is toggled
  if (rememberMeStatus) { 
    ls.set('rememberMeEmail', rememberMeEmail);
    ls.set('rememberMePassword', rememberMePassword);
    ls.set('rememberMe', rememberMeStatus);
  }

  closePopover();
  navigateTo('/', { replace: true });
};
