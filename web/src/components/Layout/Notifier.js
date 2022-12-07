import React from "react";
import { useDispatch } from "react-redux";
import { Snackbar, IconButton } from "@mui/material";
import { Close } from "mdi-material-ui";

import { useMessage, clearMessage } from "features/messages";

export default function Notifier() {
  const dispatch = useDispatch();
  const message = useMessage();
  const isOpen = Boolean(message && message !== "");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    dispatch(clearMessage());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      message={message}
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      sx={{ mt: 6, mr: -2 }}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <Close fontSize="small" />
        </IconButton>
      }
    />
  );
}
