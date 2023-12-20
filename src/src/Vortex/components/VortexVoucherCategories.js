import React, { useState, useEffect } from "react"
import {
  Accordion,
  AccordionSummary,
  Stack,
  Typography,
  AccordionDetails,
} from "@mui/material"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import VortexVoucherCategoryIcon from "./VortexVoucherCategoryIcon"
import VortexVoucherBrandLogo from "./VortexVoucherBrandLogo"
import VortexVoucherCard from "./VortexVoucherCard"

const VortexVoucherBrands = ({ brands, onSelect, category }) => {
  return (
    <>
      {brands.map((brand) => {
        return (
          <VortexVoucherBrandLogo
            key={brand.name}
            category={category}
            brand={brand.name}
            onClick={() => {
              let brandName = brand.name
              onSelect(category, brandName)
            }}
          />
        )
      })}
    </>
  )
}

const VortexVoucherCategories = ({
  brandRenderData,
  getVouchersByBrand,
  vouchersList ,
  onVoucherSelect,
  handleChange, 
  expanded
}) => {
  let [vouchers, setVouchers] = useState(vouchersList)


  return (
    <>
      {brandRenderData.map((v) => {
        return (
          <>
            <Accordion
              key={v.c}
              expanded={expanded === `${v.c}`}
              onChange={handleChange(`${v.c}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                style={{
                  width: "100%",
                  paddingLeft: "0.7em",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  style={{
                    width: "100%",
                  }}
                >
                  <VortexVoucherCategoryIcon category={v.c} />
                  <Typography sx={{ width: "50%", flexShrink: 0 }}>
                    {v.c}
                  </Typography>
                  <Typography sx={{ width: "50%", color: "text.secondary" }}>
                    {v.brands.length} Brand/s
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  style={{
                    display: "flex",
                    padding: "8px 16px 16px",
                    overflowY: "scroll",
                  }}
                >
                  <VortexVoucherBrands
                    category={v.c}
                    brands={v.brands}
                    onSelect={getVouchersByBrand}
                  />
                </div>
                {vouchersList.length > 0 && (
                  <>
                    <Typography style={{ fontWeight: "bold" }}>
                      Select Vouchers
                    </Typography>
                    {vouchersList.map((product, index) => {
                      return (
                        <VortexVoucherCard
                          key={index}
                          name={product.name}
                          imageUrl={product.catalogImageURL}
                          desc={product.description}
                          price={product.pricing.price}
                          unit={product.pricing.unit}
                          onClick={() => {
                            onVoucherSelect(product)
                          }}
                        />
                      )
                    })}
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          </>
        )
      })}
    </>
  )
}

export default VortexVoucherCategories
