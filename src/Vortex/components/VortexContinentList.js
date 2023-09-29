import React from "react"
import {
  Typography,
  Box,
  ListItem,
  ListItemIcon,
  Stack,
  Divider,
} from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { primaryVortexTheme } from "../config/theme"

const VortexContinentList = ({ continents, onClick }) => {
  return (
    <>
      <Box>
        <Typography
          margin={2}
          fontFamily={"Visby"}
          fontSize={20}
          color={"gray"}
        >
          Select Continent
        </Typography>
        {continents.map((continent) => {
          return (
            <ListItem
              key={continent}
              button
              onClick={() => {
                onClick(continent)
              }}
            >
              <Stack
                direction={"row"}
                alignItems="center"
                width="100%"
                margin="1em"
              >
                <Typography
                  fontFamily={"Visby"}
                  fontWeight={"bold"}
                  style={{
                    color: primaryVortexTheme.primarytextcolor,
                  }}
                >
                  {continent}
                </Typography>
              </Stack>
              <ListItemIcon>
                <ChevronRightIcon style={{ color: "#0060bf" }} />
              </ListItemIcon>
            </ListItem>
          )
        })}

        <Divider />
      </Box>
    </>
  )
}

export default VortexContinentList
