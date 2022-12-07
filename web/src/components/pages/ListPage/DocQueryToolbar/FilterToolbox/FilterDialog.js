import React from "react";
import {
  Dialog,
  DialogTitle,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useDialog } from "features/ui";
import ShortcutIcon from "components/misc/ShortcutIcon";

export default function useFilterDialog({
  title,
  choices,
  onChosen,
  onCancel,
  defaultIcon,
  ...props
}) {
  const { isOpen, open, close } = useDialog();

  const onClose = (confirmed, value) => {
    if (confirmed) {
      onChosen(value);
    } else {
      onCancel();
    }
    close();
  };

  const display = (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={isOpen}
      onClose={() => onClose()}
      PaperProps={{ variant: "outlined", elevation: 0 }}
      {...props}
    >
      <DialogTitle>{title}</DialogTitle>
      <MenuList>
        {choices.map(({ label, value, icon }) => (
          <MenuItem key={label} onClick={() => onClose(true, value)}>
            <ListItemIcon>
              {typeof icon === "string" ? (
                <ShortcutIcon name={icon} />
              ) : (
                icon || defaultIcon
              )}
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </Dialog>
  );

  return { open, display };
}
