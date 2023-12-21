import React from "react"
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import moment from "moment"

const VortexTransactionListItem = ({
  title = "Title",
  createdAt = "2022-02-23T17:05:01.487Z",
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
          <ReceiptLongIcon />
        </ListItemIcon>
        <Stack
          width={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack>
            <Typography fontSize={15} fontWeight={"bold"}>
              {title}
            </Typography>
            <Typography fontSize={10} color={"gray"}>
              {moment(createdAt).format("YYYY-MM-DD hh:mm:ss a")}
            </Typography>
          </Stack>
          <KeyboardArrowRightIcon />
        </Stack>
      </ListItemButton>
    </ListItem>
  )
}

export default VortexTransactionListItem
