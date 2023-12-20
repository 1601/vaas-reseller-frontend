import { Divider, Typography } from "@mui/material"
import React from "react"
import VortexBillerCategory from "./VortexBillerCategory"

const VortexBillerGridList = ({ categories = [], onSelect = () => {} }) => {
  return (
    <>
      <Typography
        textAlign={"center"}
        fontSize={30}
        marginBottom={"0.5em"}
        fontWeight={"bold"}
        style={{
          color: "#0060bf",
        }}
      >
        CATEGORIES
      </Typography>
      <Divider style={{ marginBottom: "0.5em" }} />
      <div
        style={{
          margin: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "25% 25% 25% 25%",
            gridRowGap: "1.5em",
          }}
        >
          {categories.map((v) => {
            return (
              <VortexBillerCategory
                title={v}
                onClick={() => {
                  onSelect(v)
                }}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default VortexBillerGridList
