import React, { Fragment } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Pencil, MenuDown, Delete } from "mdi-material-ui";

import { useMenu } from "features/ui";
import { ROUTES } from "routes";
import { useDeleteEditorDocMutation } from "features/editor/hooks";
import useConfirmationDialog from "components/misc/ConfirmationDialog";
import { useSafety } from "features/config/hooks";

export default function DocEditorButton({ doc, ...props }) {
  const { is_safe } = useSafety();
  const menu = useMenu();
  const [deleteEditorDoc] = useDeleteEditorDocMutation();
  const delete_dialog = useConfirmationDialog({
    title: `Supprimer la consigne ${doc?.reference}?`,
    onConfirm: () => deleteEditorDoc(doc?.pk),
  });

  const onDeleteClick = () => {
    menu.close();
    delete_dialog.open();
  };

  const edit_url = () => ROUTES.doc_update.path.replace(":pk", doc?.pk);

  return (
    <Fragment>
      <Button
        size="small"
        variant="outlined"
        startIcon={<Pencil />}
        endIcon={<MenuDown />}
        sx={{ ml: 1 }}
        color="success"
        disabled={!is_safe}
        onClick={menu.open}
        {...props}
      >
        Edition
      </Button>
      <Menu
        anchorEl={menu.anchor}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        keepMounted
        open={menu.isOpen()}
        onClose={menu.close}
        PaperProps={{ variant: "outlined", elevation: 0 }}
      >
        <MenuItem
          dense
          component={RouterLink}
          to={edit_url()}
          disabled={!is_safe}
          sx={{ color: "success.main" }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Pencil />
          </ListItemIcon>
          <ListItemText>Modifier la publication</ListItemText>
        </MenuItem>
        <MenuItem
          dense
          onClick={onDeleteClick}
          disabled={!is_safe}
          sx={{ color: "success.main" }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Delete />
          </ListItemIcon>
          <ListItemText>Supprimer la publication</ListItemText>
        </MenuItem>
      </Menu>
      {delete_dialog.display}
    </Fragment>
  );
}

export function DocDeleteStandaloneButton({ doc }) {
  const { is_safe } = useSafety();
  const [deleteEditorDoc] = useDeleteEditorDocMutation();
  const delete_dialog = useConfirmationDialog({
    title: `Supprimer la consigne ${doc?.reference}?`,
    onConfirm: () => deleteEditorDoc(doc?.pk),
  });

  return (
    <Fragment>
      <Tooltip title="Supprimer la publication" arrow>
        <span>
          <Button
            size="small"
            startIcon={<Delete />}
            variant="outlined"
            color="success"
            onClick={delete_dialog.open}
            disabled={!is_safe}
            sx={{ ml: 1 }}
          >
            Supprimer
          </Button>
        </span>
      </Tooltip>
      {delete_dialog.display}
    </Fragment>
  );
}

export function DocEditStandaloneButton({ doc }) {
  const { is_safe } = useSafety();
  const edit_url = () => ROUTES.doc_update.path.replace(":pk", doc?.pk);

  return (
    <Tooltip title="Modifier la publication" arrow>
      <span>
        <Button
          size="small"
          startIcon={<Pencil />}
          component={RouterLink}
          underline="none"
          variant="outlined"
          to={edit_url()}
          disabled={!is_safe}
          color="success"
          sx={{ ml: 1 }}
        >
          Modifier
        </Button>
      </span>
    </Tooltip>
  );
}
