import React, { useState, useEffect, useContext } from "react";
import { Typography, Box } from "@mui/material";
import VortexTopupCard from "./VortexTopupCard";

const VortexTopUpBrandProducts = ({ brandProducts, selectedBrand, setSelectedProduct = () => { }, setSelectedBrand = () => { }, stepForward = () => { }, platformVariables }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(brandProducts);
  }, [brandProducts]);

  return (
    <Box>
      <Typography margin={2} fontFamily={"Visby"} fontSize={20} color={"gray"} textAlign={'left'}>
        Select Load
      </Typography>
      <div style={{ position: 'fixed', bottom: '-100px' }}>{products.length - products.length}</div>
      {products
        .sort(
          (brand, anotherbrand) =>
            brand.pricing.price - anotherbrand.pricing.price
        )
        .map((v) => {
          console.log(v);
          return (
            <VortexTopupCard
              name={v.name}
              imageUrl={v.catalogImageURL}
              desc={v.description}
              price={parseFloat(v.pricing.price) / parseFloat(platformVariables?.topupCurrencyToPeso)}
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
}

export default VortexTopUpBrandProducts;
