export const handleLogout = (closePopover, navigateTo) => {
    localStorage.clear(); 
    closePopover(); 
    navigateTo('/', { replace: true }); 
};