import React from "react"
import {
  Avatar,
  Card,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { randomGradiantColorPicker } from "../styles/avatar_gradient_randomizer"

const VortexProductCategoryCard = ({
  name = "Product Name",
  onClick = () => {},
}) => {
  return (
    <ListItem>
      <ListItemButton
        onClick={() => {
          onClick()
        }}
      >
        <ListItemIcon>
          <Avatar style={randomGradiantColorPicker()}>
            {name.substring(0, 1)}
          </Avatar>
        </ListItemIcon>
        <Stack
          width={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Typography textAlign={"start"} fontWeight={"bold"}>
            {name}
          </Typography>
        </Stack>
        <ListItemIcon>
          <ChevronRightIcon />
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  )
}

export default VortexProductCategoryCard
