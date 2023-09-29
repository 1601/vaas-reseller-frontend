import React, { useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"

const AlternateComponent = ({ category, brand, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: "100px",
        height: "100px",
        textAlign: "center",
        padding: "2px",
        margin: "5px",
        border: "1px solid",
        display: "flex",
        alignItems: "center",
      }}
    >
      <p
        className="brandName"
        style={{
          width: "100px",
          overflowWrap: "break-word",
          margin: "0",
          lineHeight: "1",
        }}
      >
        {brand}
      </p>
    </div>
  )
}
const VortexVoucherBrandLogo = ({ category, brand, onClick }) => {
  const [isError, setIsError] = useState(false)
  return (
    <>
      {!isError ? (
        <div
          style={{
            width: "100px",
            height: "100px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            marginLeft: '0.5em', 
            marginRight: '0.5em'
          }}
          onClick={onClick}
        >
          <p
            className="brandName"
            style={{
              width: "100px",
              overflowWrap: "break-word",
              margin: "0",
              lineHeight: "1",
              height: '100px'
            }}
          >
            <LazyLoadImage
              key={brand}
              src={`https://sparkle-vortex.imgix.net/brand-logo/${brand
                .replaceAll(`"`, " ")
                .replaceAll(" ", "+")}.png?w=100&h=100`}
              alt="biller-logo"
              effect="blur"
              height={"100%"}
              width={"100%"}
              style={{
                objectFit: "scale-down",
                marginBottom: "1em",
                borderRadius: '10%', 
                borderColor: 'grey', 
                borderWidth:'0.2em', 
                borderStyle: 'solid'
              }}
              onError={() => {
                setIsError(true)
              }}
            />
          </p>
        </div>
      ) : (
        <AlternateComponent
          category={category}
          brand={brand}
          onClick={onClick}
        />
      )}
    </>
  )
}

export default VortexVoucherBrandLogo

/** */
