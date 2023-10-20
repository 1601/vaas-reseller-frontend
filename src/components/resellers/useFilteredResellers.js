import { useState, useEffect } from 'react';

function useFilteredResellers(allResellers, searchValue, tab) {
  const [filteredResellers, setFilteredResellers] = useState([]);

  useEffect(() => {
    const results = allResellers.filter((reseller) => {
      const matchesSearch =
        searchValue.trim() === "" ||
        reseller.firstName.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
        reseller.lastName.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
        reseller.email.toLowerCase().includes(searchValue.trim().toLowerCase()) ||
        reseller.mobileNumber.includes(searchValue) ||
        reseller.companyName.toLowerCase().includes(searchValue.trim().toLowerCase());
      
      const matchesTab = tab === 'All' || reseller.status === tab;

      return matchesSearch && matchesTab;
    });

    setFilteredResellers(results);
  }, [allResellers, searchValue, tab]);

  return filteredResellers;
}

export default useFilteredResellers;
