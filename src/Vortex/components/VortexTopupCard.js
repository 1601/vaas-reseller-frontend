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

import Divider from "@material-ui/core/Divider"
import { primaryVortexTheme } from "../config/theme"

const VortexTopupCard = ({
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
    <>
      <ListItem
        button
        onClick={() => {
          onClick()
        }}
      >
        {/* <ListItemIcon>
          <Avatar>{name.substring(0, 1)}</Avatar>
        </ListItemIcon> */}
        <Stack
          direction={"row"}
          alignItems={"center"}
          width="100%"
          margin="1em"
        >
          <Stack direction='column' width='24%'>
            <Typography
              margin={2}
              fontFamily={"Visby"}
              fontWeight={700}
              style={{
                margin: "0px",
                fontSize: "1.6em",
                color: primaryVortexTheme.secondarytextcolor,
              }}
            >
              {price.toFixed(2)}
            </Typography>
            <Typography
              textAlign={"start"}
              fontFamily={"Visby"}
              style={{
                fontSize: "1em",
                color: primaryVortexTheme.secondarytextcolor,
              }}
            >
              {unit}
            </Typography>
          </Stack>
          <Stack direction='column' width='90%' marginLeft={3}>
            <Typography
              fontFamily={"Visby"}
              fontWeight={"bold"}
              style={{
                color: primaryVortexTheme.primarytextcolor,
              }}
            >
              {name}
            </Typography>
            <Typography
              textAlign={"start"}
              fontSize={"12px"}
              color={primaryVortexTheme.primarytextcolor}
            >
              {desc}
            </Typography>
            {/* <Stack direction={"row"} spacing={1}>
            <Typography>{price}</Typography>
            <Typography>{unit}</Typography>
          </Stack> */}
          </Stack>
        </Stack>
        <ListItemIcon>
          <ChevronRightIcon style={{ color: "#0060bf" }} />
        </ListItemIcon>
      </ListItem>
      <Divider />
    </>
  )
}

export default VortexTopupCard
