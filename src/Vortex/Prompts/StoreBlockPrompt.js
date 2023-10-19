import React from 'react'
import { Box, Stack, Typography, Button } from '@mui/material'

import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import SecureLS from "secure-ls"


const StoreBlockPrompt = () => {
  return (
    <div style={{
      position: "relative",
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Box>
        <Stack>
          <Stack direction={"row"} spacing={1} justifyContent={"center"}>
            <div>
              <DoDisturbIcon sx={{ fill: "red" }} />
            </div>
            <Typography>Your store is currently inactive.</Typography>
          </Stack>
          <Typography>Please contact FirstAsian <br/> Email: vortex.firstAsian@firstasian.com<br/> Number: +9112345678</Typography>
          <Box
            height={10}
          />
          <Stack direction={"row"} justifyContent={"end"}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            // className={classes.button}
            onClick={(e) => {
              const ls = new SecureLS({ encodingType: "aes" })
              ls.removeAll()
              // navigate(window.location.href)
              window.location.reload()

              // setisLoggin(false)
            }}
          >
            Log out
          </Button>
          </Stack>
        </Stack>
      </Box>
    </div>
  )
}

export default StoreBlockPrompt