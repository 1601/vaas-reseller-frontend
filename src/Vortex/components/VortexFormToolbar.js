import { IconButton, Stack, Toolbar, Typography, AppBar } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import { primaryVortexTheme } from "../config/theme"


const VortexFormToolbar = ({ title = "", onClickBack = () => {} }) => (
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
          <p>powered by &nbsp; </p>
           Vortex
        </div>
      </Toolbar>
    </AppBar>
  )

export default VortexFormToolbar
