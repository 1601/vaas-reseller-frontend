import {
  Avatar,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { primaryVortexTheme } from "../config/theme";

const VortexTopupCard = ({
  code = "W100",
  imageUrl = "https://via.placeholder.com/150",
  name = "Product Name",
  desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  price = 100.0,
  unit = "USD",
  onClick = () => { },
}) => {
  const [imgUrl, setImgUrl] = useState(imageUrl);
  return (
    <>
      <ListItem
        button
        onClick={() => {
          onClick();
        }}
      >
        <Grid container alignItems="center">
          <Grid item xs={4} sm={3}>
            <Stack direction="column" spacing={0.75}>
              <Typography
                fontFamily="Visby"
                fontWeight={700}
                style={{
                  fontSize: "1.2em",
                  color: primaryVortexTheme.secondarytextcolor,
                }}
              >
                {price.toFixed(2)}
              </Typography>
              <Typography
                fontFamily="Visby"
                style={{
                  fontSize: "0.8em",
                  color: primaryVortexTheme.secondarytextcolor,
                }}
              >
                {unit}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6} sm={7}>
            <Stack direction="column" spacing={1}>
              <Typography
                fontFamily="Visby"
                fontWeight="bold"
                style={{
                  color: primaryVortexTheme.primarytextcolor,
                }}
              >
                {name}
              </Typography>
              <Typography
                fontSize={"0.5em"}
                color={primaryVortexTheme.primarytextcolor}
              >
                {desc}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={2} sm={2}>
            <ListItemIcon>
              <ChevronRightIcon style={{ color: "#0060bf" }} />
            </ListItemIcon>
          </Grid>
        </Grid>
      </ListItem>
      <Divider />
    </>
  );
};

export default VortexTopupCard;
