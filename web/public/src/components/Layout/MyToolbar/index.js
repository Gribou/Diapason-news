import React, { useState, useEffect } from "react";
import { Toolbar, Typography, Link, IconButton, Tooltip } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Menu } from "mdi-material-ui";

import { ROUTES, getRouteForPath } from "routes";
import { DEBUG } from "constants/config";
import { useAuthenticated } from "features/auth/hooks";
import { useSafety, useVersion } from "features/config/hooks";
import AnonymousMenu from "./AnonymousMenu";
import UserMenu from "./UserMenu";
import SearchField from "components/Layout/MyToolbar/SearchField";
import Spacer from "components/misc/Spacer";

function useTitle() {
  const location = useLocation();
  const [title, setTitle] = useState("404 Page inconnue");

  useEffect(() => {
    const route = getRouteForPath(location.pathname);
    if (route) {
      setTitle(route.title);
    } else {
      setTitle("404 Page inconnue");
    }
  }, [location.pathname]);
  return title;
}

export default function MyToolbar({ noButton, onDrawerOpenClick }) {
  const title = useTitle();
  const is_authenticated = useAuthenticated();
  const { is_safe } = useSafety();
  const version = useVersion();

  const app_display = (
    <Tooltip title={version || "version ?"}>
      <Link
        component={RouterLink}
        to={ROUTES.home.path}
        sx={{
          mr: { md: 6 },
          display: (is_safe || is_authenticated) && { xs: "none", md: "block" },
        }}
        variant="h5"
        color="inherit"
        underline="none"
        noWrap
      >{`eNews${DEBUG ? " Debug" : ""}`}</Link>
    </Tooltip>
  );

  const route_title = (
    <Typography
      variant="h6"
      color="inherit"
      noWrap
      sx={{ display: { xs: "none", sm: "block" } }}
    >
      {title}
    </Typography>
  );

  return (
    <Toolbar>
      {!noButton && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onDrawerOpenClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <Menu />
        </IconButton>
      )}
      {app_display}
      {route_title}
      <Spacer />
      {(is_safe || is_authenticated) && <SearchField />}
      <div edge="end">
        {!is_authenticated && <AnonymousMenu />}
        {is_authenticated && <UserMenu />}
      </div>
    </Toolbar>
  );
}
