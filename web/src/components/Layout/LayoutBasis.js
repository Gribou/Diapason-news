import React from "react";

import { Outlet } from "react-router-dom";
import { CssBaseline, AppBar, Stack, Box, Toolbar } from "@mui/material";
import { useDispatch } from "react-redux";
import { toggleDrawer, useDrawer } from "features/drawer";
import Notifier from "./Notifier";
import MyToolbar from "./MyToolbar";
import MyDrawer from "./MyDrawer";

//drawerVariant = "none" or "permanent" or "overlay"

export default function LayoutBasis({ hideDrawer, drawerVariant = "none" }) {
  const dispatch = useDispatch();
  const handleDrawerToggle = () =>
    drawerVariant !== "none" && dispatch(toggleDrawer());
  const { width } = useDrawer();

  const drawer = (
    <MyDrawer
      variant={drawerVariant === "permanent" ? "permanent" : undefined}
      onClose={handleDrawerToggle}
      sx={
        drawerVariant === "permanent"
          ? {
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                transition: (theme) =>
                  theme.transitions.create(["width"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
              },
            }
          : {}
      }
    />
  );

  return (
    <Stack
      sx={{
        height: "100vh",
        "@supports (-webkit-touch-callout: none)": {
          //Safari only https://browserstrangeness.bitbucket.io/css_hacks.html#safari
          height: "-webkit-fill-available",
        },
        overflow: "hidden",
      }}
    >
      <CssBaseline />
      <AppBar
        enableColorOnDark
        color="secondary"
        sx={
          drawerVariant === "permanent"
            ? {
                zIndex: (theme) => theme.zIndex.drawer + 1,
                transition: (theme) =>
                  theme.transitions.create(["width", "margin"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
              }
            : {}
        }
      >
        <MyToolbar
          onDrawerOpenClick={handleDrawerToggle}
          noButton={drawerVariant === "none" || hideDrawer}
        />
      </AppBar>
      <Notifier />
      {drawerVariant !== "none" && !hideDrawer && drawer}
      <Toolbar />
      <Box
        component="main"
        sx={[
          {
            flex: "1 1 0%",
            minHeight: "0%",
            display: "flex",
            maxHeight: "100%",
            overflow: "hidden",
          },
          ...(drawerVariant === "permanent"
            ? [
                {
                  ml: hideDrawer ? 0 : width,
                  transition: (theme) =>
                    theme.transitions.create(["margin-left"], {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.leavingScreen,
                    }),
                },
              ]
            : [{}]),
        ]}
      >
        <Outlet />
      </Box>
    </Stack>
  );
}
