import {Box, Typography} from '@mui/material'
import CircularProgress from "@mui/material/CircularProgress";

const CircularLoading = () => (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 1)",
          opacity: 0.5,
          zIndex: 3
        }}
      />
      <Box
        sx={(theme) => ({
          position: "fixed",
          left: "50%", // Default position
          [theme.breakpoints.up('md')]: {
            left: "60%", // Adjust for medium screens and above
          },
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 3,
          textAlign: "center",
          color: "#fff",
        })}
      >
         <CircularProgress size={60} />
        <Typography variant='h5'>Downloading data ...</Typography>
      </Box>
    </>
  );

export default CircularLoading;