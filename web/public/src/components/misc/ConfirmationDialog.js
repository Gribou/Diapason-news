import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useDialog } from "features/ui";

export default function useConfirmationDialog({
  title,
  message,
  onConfirm,
  onCancel,
}) {
  const { isOpen, open, close } = useDialog();

  const onClose = (confirmed) => {
    if (confirmed && typeof onConfirm == "function") {
      onConfirm();
    }
    if (!confirmed && typeof onCancel == "function") {
      onCancel();
    }
    close();
  };

  const display = (
    <Dialog
      open={isOpen}
      onClose={() => onClose(false)}
      PaperProps={{ variant: "outlined", elevation: 0 }}
    >
      <DialogTitle>{title}</DialogTitle>
      {message && (
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Annuler
        </Button>
        <Button onClick={() => onClose(true)} color="primary">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { open, display };
}
