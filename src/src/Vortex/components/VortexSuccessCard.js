import { Box, Button, Stack, Typography } from "@mui/material"
import React from "react"
import SuccessAnim from "../../../assets/gif/accepted_check.gif"

const VortexSuccessCard = ({ onContinue = () => {} }) => {
  return (
    <Stack textAlign={"center"} spacing={2}>
      <Stack direction={"row"} justifyContent="center">
        <img src={SuccessAnim} alt="success" height={"300px"} width={"400px"} />
      </Stack>
      <Typography variant="h6">Transaction Success</Typography>
      <Box>
        <Button
          variant="outlined"
          onClick={() => {
            onContinue()
          }}
        >
          CONTINUE
        </Button>
      </Box>
    </Stack>
  )
}

export default VortexSuccessCard
