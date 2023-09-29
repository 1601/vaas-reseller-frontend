import {
  ListItem,
  Divider,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import React, { useState } from "react"
import { primaryVortexTheme } from "../config/theme"
import VortexBillerLogoComponent from "./VortexBillerLogoComponent"

import { BillerIcon } from "./VortexBillerCategory"

const VortexBillerListItem = ({
  id = "",
  title = "Lorem ipsum",
  category = "",
  onClick = () => {},
  icon,
}) => {
  return (
    <>
      <ListItem
        button
        onClick={() => {
          onClick()
        }}
        divider
      >
        <Stack
          padding={"0.5em"}
          width={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <VortexBillerLogoComponent
              id={id}
              billerName={title}
              altComponent={<BillerIcon categoryName={category}/>}
            />

            <Typography
              component="div"
              sx={{ flexGrow: 1 }}
              style={{
                fontWeight: "bold",
                color: `${primaryVortexTheme.primarytextcolor}`,
              }}
            >
              {title}
            </Typography>
          </Stack>
        </Stack>

        <ListItemIcon>
          <KeyboardArrowRightIcon />
        </ListItemIcon>
      </ListItem>
      <Divider />
    </>
  )
}

export default VortexBillerListItem
