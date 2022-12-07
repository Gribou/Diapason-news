import React from "react";
import { Button, IconButton, Tooltip, useMediaQuery } from "@mui/material";

export default function ResponsiveButton({
  text,
  tooltipText,
  startIcon,
  endIcon,
  active,
  ...props
}) {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  return (
    <Tooltip title={tooltipText || (smUp ? "" : text)} arrow>
      <span>
        {smUp ? (
          <Button
            variant={active ? "contained" : "outlined"}
            color={active ? "primary" : "inherit"}
            startIcon={startIcon}
            endIcon={endIcon}
            style={{ whiteSpace: "nowrap" }}
            {...props}
          >
            {text}
          </Button>
        ) : (
          <IconButton color={active ? "primary" : "inherit"} {...props}>
            {startIcon || endIcon}
          </IconButton>
        )}
      </span>
    </Tooltip>
  );
}
