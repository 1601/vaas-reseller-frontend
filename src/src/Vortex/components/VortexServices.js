import { List, Stack } from "@mui/material"
import { navigate } from "gatsby"
import React from "react"
import VortexServicesCards from "./VortexServicesCards"

const VortexServices = () => {
  return (
    <div>
      <h2 style={{ paddingTop: "3rem", textAlign: "center" }}>
        {"Services you may like"}
      </h2>
      <div className="horizontallist scrollbar-hidden">
        <VortexServicesCards
          title="Load"
          onClick={() => {
            navigate("/vortextopup/electronic_load")
          }}
        />
        <VortexServicesCards
          title="Bills"
          onClick={() => {
            navigate("/vortexbillspayment")
          }}
        />
        <VortexServicesCards
          title="Vouchers"
          onClick={() => {
            navigate("/vortexvoucher")
          }}
        />
        {/* <VortexServicesCards
          title="Shop EGifts"
          onClick={() => {
            navigate("/vortextopup/shop")
          }}
        />
        <VortexServicesCards
          title="Data Bundles"
          onClick={() => {
            navigate("/vortextopup/data_bundles")
          }}
        /> */}
      </div>
    </div>
  )
}

export default VortexServices
