import React, { useState, useEffect, useContext } from "react"
import VortexTopupCard from "./VortexTopupCard"
import { Typography, Box } from "@mui/material"
import { PlatformVariables } from "../../globalstates"


const VortexTopUpBrandProducts = ({ brandProducts, selectedBrand, setSelectedProduct = () => { }, setSelectedBrand = () => { }, stepForward = () => { } }) => {
  let [products, set] = useState([])

  const [platformVariables, setPlatformVariables] = useContext(PlatformVariables)

  useEffect(() => {
    set(brandProducts)
  }, [brandProducts])

  return (
    <Box>
      <Typography margin={2} fontFamily={"Visby"} fontSize={20} color={"gray"}>
        Select Load
      </Typography>
      <div style={{ position: 'fixed', bottom: '-100px' }}>{products.length - products.length}</div>
      {products
        .sort(
          (brand, anotherbrand) =>
            brand.pricing.price - anotherbrand.pricing.price
        )
        .map((v) => {
          console.log(v)
          return (
            <VortexTopupCard
              name={v.name}
              imageUrl={v.catalogImageURL}
              desc={v.description}
              price={parseFloat(v.pricing.price) / parseFloat(platformVariables?.topupCurrencyToPeso)}
              unit={platformVariables?.currencySymbol}
              key={v.name}
              onClick={() => {
                setSelectedProduct(v)
                setSelectedBrand(selectedBrand)
                stepForward(stepForward)
              }}
            />
          )
        })}
    </Box>
  )
}

export default VortexTopUpBrandProducts
