import React from "react";
import { Toolbar } from "@mui/material";

export default function StickySecondaryToolbar({
  children,
  sx = [],
  ...props
}) {
  return (
    <Toolbar
      variant="dense"
      sx={[
        {
          boxShadow: 1,
          bgcolor: "background.paper",
          position: "sticky",
          zIndex: "speedDial",
        },
        (theme) => ({
          top: "56px",
          [`${theme.breakpoints.up("sm")}`]: {
            top: "64px",
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      {children}
    </Toolbar>
  );
}
