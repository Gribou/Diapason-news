import React from "react";
import {
  CssBaseline,
  Toolbar,
  AppBar,
  Box,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { DEBUG } from "constants/config";

export default function Loading() {
  return (
    <Stack sx={{ minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar enableColorOnDark color="secondary">
        <Toolbar>
          <Typography variant="h5" color="inherit" noWrap>{`eNews${
            DEBUG ? " Debug" : ""
          }`}</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    </Stack>
  );
}
