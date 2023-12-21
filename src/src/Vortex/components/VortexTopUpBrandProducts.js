import React, { useState, useEffect } from 'react';
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
    // Set the products directly from brandProducts; sorting will be handled in the render
    setProducts(brandProducts);
  }, [brandProducts]);

  return (
    <Box>
      <Typography margin={2} fontFamily={'Visby'} fontSize={20} color={'gray'} textAlign={'left'}>
        Select Load
      </Typography>
      <div style={{ position: 'fixed', bottom: '-100px' }}>{products.length - products.length}</div>
      {products
        .sort((a, b) => {
          // Sort products with 'enabled: false' to the bottom
          if (!a.enabled && b.enabled) return 1;
          if (a.enabled && !b.enabled) return -1;
          return a.price - b.price;
        })
        .map((product) => {
          console.log(product);
          console.log(
            'Price before calculation:',
            product.price,
            'Currency to Peso:',
            platformVariables?.topupCurrencyToPeso
          );
          // Calculate price only if product is not disabled
          const calculatedPrice = product.disabled
            ? 'Not Available'
            : parseFloat(product.price) / (parseFloat(platformVariables?.topupCurrencyToPeso) || 1);
          return (
            <VortexTopupCard
              name={
                product.name.includes('(Not Available)') ? (
                  <span style={{ color: 'gray' }}>{product.name}</span>
                ) : (
                  product.name
                )
              }
              imageUrl={product.catalogImageURL}
              desc={
                product.name.includes('(Not Available)') ? (
                  <span style={{ color: 'gray' }}>{product.description}</span>
                ) : (
                  product.description
                )
              }
              price={calculatedPrice}
              unit={platformVariables?.currencySymbol}
              key={product.name}
              onClick={() => {
                if (!product.name.includes('(Not Available)') && !product.disabled) {
                  setSelectedProduct(product);
                  setSelectedBrand(selectedBrand);
                  stepForward();
                }
              }}
              style={{
                color: product.disabled ? 'gray' : 'inherit', // Grey out the text when disabled
                pointerEvents: product.name.includes('(Not Available)') ? 'none' : 'auto', // Disable click events for (Not Available) products
                backgroundColor: product.name.includes('(Not Available)') ? 'lightgray' : 'white', // Gray background for (Not Available) products
              }}
            />
          );
        })}
    </Box>
  );
};

export default VortexTopUpBrandProducts;
