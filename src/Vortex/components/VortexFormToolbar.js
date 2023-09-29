import { IconButton, Stack, Toolbar, Typography, AppBar } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"
import ArrowBackButton from "../../Buttons/ArrowBackButton"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft"
import { theme } from "../../../assets/mui"
import { primaryVortexTheme } from "../config/theme"
import Logo from "../../../assets/svg/logos/powered-by-pldt.png"

const VortexFormToolbar = ({ title = "", onClickBack = () => {} }) => {
  return (
    <AppBar
      position="fixed"
      style={{ background: primaryVortexTheme.accentColor }}
    >
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              onClickBack()
            }}
          >
            <ChevronLeftIcon style={{ color: "white" }} />
          </IconButton>
          <Typography
            component="div"
            sx={{ flexGrow: 1, color: "white", marginTop: "0.4em", textAlign: 'center', paddingTop: '4%' }}
          >
            {title}
          </Typography>
        </div>
        <div style = {{
          display: 'flex', 
          fontSize: '10px'
        }}>
          <p >powered by </p>
          <img
            style={{
              width: "61px",
              height: "21.4px",
              marginTop: '6px'
            }}
            src={Logo}
            alt="Spark Waving burstless"
          />
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default VortexFormToolbar
