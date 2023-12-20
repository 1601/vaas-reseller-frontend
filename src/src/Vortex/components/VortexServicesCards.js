import { ButtonBase, Card, Typography } from "@mui/material"
import React from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"

const VortexServicesCards = ({
  img = "https://via.placeholder.com/150",
  title = "Vortex title",
  onClick = () => {},
}) => {
  return (
    <div style={{ textAlign: "center", margin: "0.5em" }}>
      <ButtonBase onClick={onClick}>
        <Card sx={{ margin: 0, padding: 0 }}>
          <LazyLoadImage
            src={img}
            alt={img}
            height={"100px"}
            width={"100px"}
            effect="blur"
          />
        </Card>
      </ButtonBase>
      <Typography paddingTop={"0.5em"} fontFamily={"Visby"} fontWeight={"bold"}>
        {title}
      </Typography>
    </div>
  )
}

export default VortexServicesCards
