import React, { useEffect, useState } from "react"
import { InputBase } from "@mui/material"

const VortexVoucherSearchBar = ({ onInput = () => {} }) => {
  let [input, setInput] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      onInput(input)
    }, 500)
    return () => clearTimeout(timeout)
  }, [input])

  return (
    <div
      style={{
        margin: "1em",
      }}
    >
      <div className="heading-search-container">
        <div className="heading-search-shape">
          <InputBase
            disabled={false}
            style={{
              width: "100%",
              fontFamily: "montserrat",
              fontSize: "1em",
              fontWeight: "500",
              color: "#6b6b6b",
              paddingLeft: "0.3em",
              zIndex: 999,
            }}
            placeholder="Search for products here"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            // onKeyPress={(e) => {
            //   // alert(e.key)

            //   if (e.key === 'Enter') {
            //     navigate('/search')
            //   }
            // }}
          />
          {input?.length > 0 && (
            <div
              style={{
                color: "grey",
                fontWeight: "bold",
              }}
              onClick={() => {
                setInput("")
                onInput("")
              }}
            >
              X
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VortexVoucherSearchBar
