import {
  Avatar,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import React, { useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"

const VortexVoucherCard = ({
  code = "W100",
  imageUrl = "https://via.placeholder.com/150",
  name = "Product Name",
  desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  price = 100.0,
  unit = "USD",
  onClick = () => { },
}) => {
  const [imgUrl, setImgUrl] = useState(imageUrl)
  return (
    <ListItem
      button
      onClick={() => {
        onClick()
      }}
    >
      {/* <ListItemIcon>
          <Avatar>{name.substring(0, 1)}</Avatar>
        </ListItemIcon> */}
      <Stack width={"100%"} margin="1em">
        {imageUrl && (
          <LazyLoadImage
            src={imgUrl}
            alt={"Vortex Product Image"}
            height={"200px"}
            maxWidth={"300px"}
            effect="blur"

            onError={() => {
              setImgUrl("https://via.placeholder.com/150?text=No+image")
            }}
            style={{
              // borderRadius: "10px",
              objectFit: "fill",
            }}
          />
        )}
        <Typography
          textAlign={"start"}
          fontWeight={"bold"}
          fontFamily={"Visby"}
          marginTop={1}
        >
          {name}
        </Typography>
        {/* <Typography textAlign={"start"} fontSize={"12px"} color={"grey"}>
          {desc}
        </Typography> */}
        {/* <Stack direction={"row"} spacing={1}>
            <Typography>{price}</Typography>
            <Typography>{unit}</Typography>
          </Stack> */}
      </Stack>
      {/* <ListItemIcon>
        <ChevronRightIcon />
      </ListItemIcon> */}
    </ListItem>
  )
}

export default VortexVoucherCard
