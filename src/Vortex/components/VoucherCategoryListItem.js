import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import React from "react"

const VoucherCategoryListItem = ({ title, onClick = () => {} }) => {
  return (
    <ListItemButton
      onClick={() => {
        onClick()
      }}
    >
      <ListItem>
        <Stack direction={"row"} justifyContent={"space-between"} width="100%">
          <Typography>{title}</Typography>
          <ListItemIcon>
            <ChevronRightIcon />
          </ListItemIcon>
        </Stack>
      </ListItem>
    </ListItemButton>
  )
}

export default VoucherCategoryListItem
