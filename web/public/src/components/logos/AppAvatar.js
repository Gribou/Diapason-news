import React from "react";
import { Avatar, CircularProgress } from "@mui/material";
import useAppIcon from "./AppIcon";

export default function AppAvatar({ loading, size, sx = [] }) {
  const LogoComponent = useAppIcon();

  return (
    <Avatar
      sx={[
        {
          m: 1,
          bgcolor: "background.default",
        },
        size === "large"
          ? {
              width: (theme) => theme.spacing(7),
              height: (theme) => theme.spacing(7),
            }
          : {},
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {loading ? (
        <CircularProgress sx={{ color: "primary.main", p: 1 }} />
      ) : (
        <LogoComponent sx={{ height: "100%", width: "100%", p: 1 }} />
      )}
    </Avatar>
  );
}
