import {
  Avatar,
  ButtonBase,
  Card,
  CardContent,
  ListItem,
  ListItemButton,
  Divider,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import React from "react"
import { randomGradiantColorPicker } from "../styles/avatar_gradient_randomizer"

const VortexBillerHCard = ({ title = "Lorem ipsum", onClick = () => {} }) => {
  return (
    <>
      <Stack>
        <Avatar style={{ backgroundColor: "#0060bf" }}>
          {title.substring(0, 1)}
        </Avatar>
        <Typography
          component="div"
          sx={{ flexGrow: 1 }}
          style={{ fontWeight: "bold", color: "gray" }}
        >
          {title}
        </Typography>
      </Stack>
    </>
  )
}

export default VortexBillerHCard
