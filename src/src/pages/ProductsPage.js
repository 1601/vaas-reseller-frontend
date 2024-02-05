import { Helmet } from 'react-helmet-async';
import React, { useState } from 'react';
import SecureLS from 'secure-ls';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import UserDataFetch from '../components/user-account/UserDataFetch';
import AccountStatusModal from '../components/user-account/AccountStatusModal';
import StoreDataFetch from '../components/user-account/StoreDataFetch';
// mock
import PRODUCTS from '../_mock/products';

// ----------------------------------------------------------------------

const ls = new SecureLS({ encodingType: 'aes' });

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const user = ls.get('user'); 
  const userId = user ? user._id : null;

  const userData = UserDataFetch(userId);
  const { storeData, editedData, platformVariables, error } = StoreDataFetch(userId);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | VAAS </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={PRODUCTS} />
        <ProductCartWidget />
        <AccountStatusModal open userData={userData} storeData={storeData} />
      </Container>
    </>
  );
}
