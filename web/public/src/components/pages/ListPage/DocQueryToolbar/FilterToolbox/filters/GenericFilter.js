import React from "react";
import { MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { useSearchParams } from "features/router";
import useFilterDialog from "../FilterDialog";
import FilterChip from "../FilterChip";

export default function GenericFilter({
  keyword,
  icon,
  dialogTitle,
  choices = [],
  getMenuLabel = (value) => value,
  getChipLabel = (value) => value,
  onClose,
  noMenu,
}) {
  const [{ [keyword]: value, ...params }, push] = useSearchParams();

  const dialog = useFilterDialog({
    title: dialogTitle,
    defaultIcon: icon,
    choices,
    onChosen: (choice) => {
      push({
        ...params,
        page: 1,
        [keyword]: choice,
      });
      onClose();
    },
    onCancel: onClose,
  });

  const menu = choices?.length > 1 && (
    <MenuItem dense onClick={() => dialog.open()}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{getMenuLabel(value)}</ListItemText>
    </MenuItem>
  );

  const chips = value && (
    <FilterChip label={getChipLabel(value)} icon={icon} param={keyword} />
  );

  return {
    chips,
    menu: !noMenu && menu,
    dialog: !noMenu && dialog,
    is_active: !noMenu && !!value,
  };
}
