import React from "react";
import { MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import useFilterDialog from "../FilterDialog";
import FilterChip from "../FilterChip";
import { useSearchParams } from "features/router";

export default function useValidityFilter({
  keywordConfig = {},
  dialogTitle,
  mainIcon,
  choices = [],
  getMenuLabel = () => "",
  onClose,
}) {
  const [params, push] = useSearchParams();

  const dialog = useFilterDialog({
    title: dialogTitle,
    defaultIcon: mainIcon,
    choices: choices,
    onChosen: (choice) => {
      push({ ...params, page: 1, ...choice });
      onClose();
    },
    onCancel: onClose,
  });

  const menu = choices?.length > 1 && (
    <MenuItem dense onClick={() => dialog.open()}>
      <ListItemIcon>{mainIcon}</ListItemIcon>
      <ListItemText>{getMenuLabel(params)}</ListItemText>
    </MenuItem>
  );

  const chips = Object.entries(keywordConfig).map(
    ([keyword, { icon, getChipLabel }]) =>
      params?.[keyword] && (
        <FilterChip
          key={keyword}
          label={getChipLabel(params?.[keyword])}
          icon={icon}
          param={keyword}
        />
      )
  );

  return {
    chips,
    menu,
    dialog,
    is_active: Object.keys(keywordConfig)?.some((k) => !!params?.[k]),
  };
}
