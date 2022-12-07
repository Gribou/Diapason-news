import React from "react";
import { Button, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import { DotsVertical } from "mdi-material-ui";
import { Link as RouterLink } from "react-router-dom";
import { useMenu } from "features/ui";
import { ROUTES } from "routes";

export default function AnonymousMenu() {
  const action_menu = useMenu();

  const popupmenu = (
    <Menu
      anchorEl={action_menu.anchor}
      keepMounted
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={action_menu.isOpen()}
      onClose={action_menu.close}
      PaperProps={{ variant: "outlined", elevation: 0 }}
    >
      <MenuItem
        dense
        component={RouterLink}
        to={ROUTES.login.path}
        onClick={action_menu.close}
      >
        Connexion
      </MenuItem>
    </Menu>
  );

  return (
    <Stack direction="row" alignItems="center">
      <Button
        variant="outlined"
        size="small"
        color="inherit"
        component={RouterLink}
        to={ROUTES.login.path}
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        Connexion
      </Button>
      <IconButton
        color="inherit"
        onClick={action_menu.open}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <DotsVertical />
      </IconButton>
      {popupmenu}
    </Stack>
  );
}
