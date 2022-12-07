import React from "react";
import {
  List,
  Divider,
  useMediaQuery,
  ListItemIcon,
  ListItemText,
  ListItem,
  Skeleton,
} from "@mui/material";

import PaginationToolbox from "./PaginationToolbox";
import { LIST_ITEM_MIN_WIDTH, LIST_ITEM_MIN_WIDTH_SM } from "constants/config";

function SkeletonDocListItem(props) {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <ListItem
      {...props}
      divider
      alignItems="flex-start"
      sx={{
        minWidth: { xs: LIST_ITEM_MIN_WIDTH_SM, md: LIST_ITEM_MIN_WIDTH },
      }}
    >
      {!smDown && (
        <ListItemIcon>
          <Skeleton edge="start" variant="circle" width={40} height={40} />
        </ListItemIcon>
      )}
      <ListItemText
        primary={<Skeleton width="60%" />}
        secondary={<Skeleton width="80%" />}
      />
    </ListItem>
  );
}

export default function SkeletonList(props) {
  return (
    <List {...props}>
      <PaginationToolbox
        sx={{ display: "flex", justifyContent: "center", px: { md: 1 } }}
      />
      <Divider />
      {[...Array(10)].map((x, i) => (
        <SkeletonDocListItem key={i} />
      ))}
      <PaginationToolbox
        sx={{ display: "flex", justifyContent: "center", px: { md: 1 } }}
      />
      <Divider />
    </List>
  );
}
