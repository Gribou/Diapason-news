import React, { Fragment } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Replay, FilterOutline, MenuDown } from "mdi-material-ui";

import { useSearchParams } from "features/router";
import { useMenu } from "features/ui";
import { useAuthenticated } from "features/auth/hooks";

import ResponsiveButton from "components/misc/ResponsiveButton";
import ActiveFiltersLabel from "./ActiveFiltersDisplay";
import {
  useValidityFilter,
  useDestinataireFilter,
  useFavoriteFilter,
  useDoctypeFilter,
  useForMeFilter,
  useReadFilter,
  useYearFilter,
  useSearchFilter,
  useThemeFilter,
} from "./filters";

function ResetButton({ onClose }) {
  const [, push] = useSearchParams();

  const onClick = () => {
    push({ page: 1 });
    onClose();
  };

  return (
    <MenuItem dense onClick={onClick}>
      <ListItemIcon>
        <Replay />
      </ListItemIcon>
      <ListItemText>Tout afficher</ListItemText>
    </MenuItem>
  );
}

export default function FilterToolbox(props) {
  const [params] = useSearchParams();
  const is_authenticated = useAuthenticated();
  const filterMenu = useMenu();
  const filters = {
    validity: useValidityFilter({ onClose: filterMenu.close }),
    destinataire: useDestinataireFilter({ onClose: filterMenu.close }),
    favorite: useFavoriteFilter({ onClose: filterMenu.close }),
    doctype: useDoctypeFilter({ onClose: filterMenu.close }),
    theme: useThemeFilter({ onClose: filterMenu.close }),
    for_me: useForMeFilter({ onClose: filterMenu.close }),
    read: useReadFilter({ onClose: filterMenu.close }),
    year: useYearFilter(),
    search: useSearchFilter(),
  };

  const isActive = () =>
    Object.values(filters).some(({ is_active }) => is_active);

  return (
    <Fragment>
      <ResponsiveButton
        text="Filtrer"
        size="small"
        startIcon={<FilterOutline />}
        endIcon={<MenuDown />}
        onClick={filterMenu.open}
        sx={{ mr: 1, flex: "0 0 auto", verticalAlign: "middle", my: { lg: 1 } }}
        disableRipple
        active={isActive(params)}
        {...props}
      />
      <ActiveFiltersLabel>
        {filters.search.chips}
        {filters.read.chips}
        {filters.favorite.chips}
        {filters.for_me.chips}
        {filters.validity.chips}
        {filters.doctype.chips}
        {filters.theme.chips}
        {filters.destinataire.chips}
        {filters.year.chips}
      </ActiveFiltersLabel>
      <Menu
        anchorEl={filterMenu.anchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        keepMounted
        open={filterMenu.isOpen()}
        onClose={filterMenu.close}
        PaperProps={{ variant: "outlined", elevation: 0 }}
      >
        {is_authenticated && filters.read?.menu}
        {is_authenticated && filters.favorite?.menu}
        {is_authenticated && filters.for_me?.menu}
        {is_authenticated && <Divider />}
        {filters.validity?.menu}
        {filters.doctype?.menu}
        {filters.theme?.menu}
        {filters.destinataire?.menu}
        <Divider />
        <ResetButton onClose={filterMenu.close} />
      </Menu>
      {is_authenticated && filters.read.dialog.display}
      {is_authenticated && filters.favorite.dialog.display}
      {is_authenticated && filters.for_me.dialog.display}
      {filters.validity.dialog.display}
      {filters.doctype.dialog.display}
      {filters.theme.dialog.display}
      {filters.destinataire.dialog.display}
    </Fragment>
  );
}
