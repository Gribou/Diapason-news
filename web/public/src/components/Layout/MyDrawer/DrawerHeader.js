import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Toolbar, Link, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChevronRight, ChevronLeft } from "mdi-material-ui";

import { ROUTES } from "routes";
import { DEBUG } from "constants/config";

export default function DrawerHeader({ onClick }) {
  const theme = useTheme();
  return (
    <Toolbar>
      <Link
        component={RouterLink}
        to={ROUTES.home.path}
        variant="h5"
        color="inherit"
        underline="none"
        noWrap
        sx={{ display: { xs: "block", lg: "none" } }}
      >{`eNews${DEBUG ? " Debug" : ""}`}</Link>
      <IconButton onClick={onClick}>
        {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
    </Toolbar>
  );
}
