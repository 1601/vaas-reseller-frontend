export const handleLogout = (closePopover, navigateTo) => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  const rememberMeEmail = localStorage.getItem('rememberMeEmail');

  // Clear all items from localStorage
  localStorage.clear();
  
  // Conditionally retain the email and rememberMe status based on 'rememberMe' status
  if (rememberMe) {
    localStorage.setItem('rememberMeEmail', rememberMeEmail);
    localStorage.setItem('rememberMe', 'true');
  }

  closePopover();
  navigateTo('/', { replace: true });
};
