import React, { useState, useEffect, useContext } from 'react';
import { Typography, Box } from '@mui/material';
import VortexTopupCard from './VortexTopupCard';

const VortexTopUpBrandProducts = ({
  brandProducts,
  selectedBrand,
  setSelectedProduct = () => {},
  setSelectedBrand = () => {},
  stepForward = () => {},
  platformVariables,
}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(brandProducts);
  }, [brandProducts]);

  return (
    <Box>
      <Typography margin={2} fontFamily={'Visby'} fontSize={20} color={'gray'} textAlign={'left'}>
        Select Load
      </Typography>
      <div style={{ position: 'fixed', bottom: '-100px' }}>{products.length - products.length}</div>
      {products
        .sort((brand, anotherbrand) => brand.price - anotherbrand.price) // Change to brand.price
        .map((v) => {
          console.log(v);
          console.log('Price before calculation:', v.price, 'Currency to Peso:', platformVariables?.topupCurrencyToPeso);
          return (
            <VortexTopupCard
              name={v.name}
              imageUrl={v.catalogImageURL}
              desc={v.description}
              price={parseFloat(v.price) / (parseFloat(platformVariables?.topupCurrencyToPeso) || 1)}
              unit={platformVariables?.currencySymbol}
              key={v.name}
              onClick={() => {
                setSelectedProduct(v);
                setSelectedBrand(selectedBrand);
                stepForward();
              }}
            />
          );
        })}
    </Box>
  );
};

export default VortexTopUpBrandProducts;
