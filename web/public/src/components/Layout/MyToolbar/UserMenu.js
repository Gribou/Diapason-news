import React from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  ListSubheader,
  Link,
  Stack,
} from "@mui/material";
import { AlertCircleOutline, AccountCircle } from "mdi-material-ui";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "routes";

import { useLogoutMutation, useMe } from "features/auth/hooks";
import { useMenu } from "features/ui";

export default function UserMenu() {
  const { username, isError, error } = useMe();
  const [logout] = useLogoutMutation();
  const user_menu = useMenu();

  const handleLogoutClick = () => {
    user_menu.close();
    logout();
  };

  const subheader = (
    <ListSubheader>
      {isError && (
        <IconButton disabled>
          <AlertCircleOutline color="error" />
        </IconButton>
      )}
      {isError ? error?.non_field_errors : username}
    </ListSubheader>
  );

  const popupmenu = (
    <Menu
      anchorEl={user_menu.anchor}
      keepMounted
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={user_menu.isOpen()}
      onClose={user_menu.close}
      MenuListProps={{ subheader }}
      PaperProps={{ variant: "outlined", elevation: 0 }}
    >
      <MenuItem
        component={RouterLink}
        to={ROUTES.account.path}
        onClick={user_menu.close}
      >
        Mon compte
      </MenuItem>
      <MenuItem onClick={handleLogoutClick}>Déconnexion</MenuItem>
    </Menu>
  );

  const error_display = <AlertCircleOutline />;
  //const loading_display = <CircularProgress color="inherit" size={20} />;

  return (
    <Stack direction="row" alignItems="center">
      <Link
        component={RouterLink}
        to={ROUTES.account.path}
        color="inherit"
        underline="hover"
        sx={{ fontWeight: 600, display: { xs: "none", sm: "block" } }}
      >
        {username || ""}
      </Link>
      <IconButton onClick={user_menu.open} color="inherit">
        {isError && error_display}
        {!isError && <AccountCircle />}
      </IconButton>
      {popupmenu}
    </Stack>
  );
}
