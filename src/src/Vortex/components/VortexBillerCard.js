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

const VortexBillerCard = ({
  id = "",
  title = "Lorem ipsum",
  onClick = () => {},
  icon,
}) => {
  return (
    <>
        <Stack
          onClick = {onClick}
          padding={"0.5em"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          style = {{
            width: '100px',
            height: '100%',
            textAlign: 'center',
            padding: '2px', 
            marginLeft: '0.5em', 
            marginRight: '0.5em'
          }}
        >
          <Stack direction={"column"} alignItems={"center"} spacing={2}>
            <VortexBillerLogoComponent
              id={id}
              billerName={title}
              altComponent={icon}
            />

            <Typography
              component="div"
              sx={{ flexGrow: 1 }}
              style={{
                height: '2em', 
                fontWeight: "bold",
                fontSize: '0.6em',
                color: `${primaryVortexTheme.primarytextcolor}`,
              }}
            >
              {title}
            </Typography>
          </Stack>
        </Stack>
      <Divider />
    </>
  )
}

export default VortexBillerCard
