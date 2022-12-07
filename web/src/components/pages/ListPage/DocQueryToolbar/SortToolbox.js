import React, { Fragment } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  SortAlphabeticalAscending,
  SortAlphabeticalDescending,
  SortCalendarAscending,
  SortCalendarDescending,
  Replay,
  Sort,
  MenuDown,
} from "mdi-material-ui";
import { useSearchParams } from "features/router";
import { useMenu } from "features/ui";
import FilterChip from "./FilterToolbox/FilterChip";

import ResponsiveButton from "components/misc/ResponsiveButton";

const SORT_CHOICES = [
  {
    label: "Référence ascendante",
    order: "year_ref,doctype,number_ref",
    icon: <SortAlphabeticalAscending />,
  },
  {
    label: "Référence descendante",
    order: "-year_ref,-doctype,-number_ref",
    icon: <SortAlphabeticalDescending />,
  },
  {},
  {
    label: "Validité récente",
    order: "-begin_date,end_date",
    icon: <SortCalendarDescending />,
  },
  {
    label: "Validité ancienne",
    order: "begin_date,-end_date",
    icon: <SortCalendarAscending />,
  },
  {},
  {
    label: "Par défaut",
    icon: <Replay />,
    order: undefined,
  },
];

function getSortOrderForDisplay(ordering) {
  return SORT_CHOICES.find((sort) => ordering === sort.order) || {};
}

export function SortChip() {
  const [{ ordering }] = useSearchParams();
  return (
    <FilterChip
      label=""
      key="ordering"
      icon={getSortOrderForDisplay(ordering)?.icon || <Sort />}
      param="ordering"
    />
  );
}

export default function SortToolbox(props) {
  const [{ ordering, ...params }, push] = useSearchParams();
  const sortMenu = useMenu();

  const is_active = !!ordering;

  const setSortOrder = (ordering) => {
    push({ ...params, page: 1, ordering });
    sortMenu.close();
  };

  return (
    <Fragment>
      <ResponsiveButton
        text="Trier"
        size="small"
        startIcon={<Sort />}
        endIcon={<MenuDown />}
        onClick={sortMenu.open}
        sx={{ mr: 1 }}
        active={is_active}
        {...props}
      />
      <Menu
        anchorEl={sortMenu.anchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        keepMounted
        open={sortMenu.isOpen()}
        onClose={sortMenu.close}
        PaperProps={{ variant: "outlined", elevation: 0 }}
      >
        {SORT_CHOICES.map(({ label, order, icon }, i) =>
          label ? (
            <MenuItem
              key={i}
              dense
              onClick={() => setSortOrder(order)}
              selected={order && ordering === order}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          ) : (
            <Divider key={i} />
          )
        )}
      </Menu>
    </Fragment>
  );
}
