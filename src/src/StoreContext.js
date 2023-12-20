import React, { createContext, useContext, useState } from 'react';

export const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [storeData, setStoreData] = useState(null);
  const [hasSubdomain, setHasSubdomain] = useState(false); 

  const value = { 
    storeData,
    setStoreData,
    hasSubdomain, 
    setHasSubdomain  
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
