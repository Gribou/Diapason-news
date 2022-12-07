import React, { Fragment } from "react";
import { Drawer, List, Divider } from "@mui/material";
import { useAuthenticated, useMe } from "features/auth/hooks";
import { useMenuItems } from "features/config/hooks";
import { useDrawer } from "features/drawer";

import {
  HomeItem,
  FavoriteItem,
  UnreadItem,
  EditorItem,
  AdminItem,
  PortalItem,
  AllItem,
  ShortcutItem,
} from "./DrawerItem";
import DrawerHeader from "./DrawerHeader";

export default function MyDrawer({ onClose, sx = [], ...props }) {
  const { favorite_count, unread_count, is_staff, can_edit_doc } = useMe();
  const is_authenticated = useAuthenticated();
  const items = useMenuItems();
  const { open, width } = useDrawer();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={{
        variant: "outlined",
        elevation: 0,
        sx: { overflowX: "hidden" },
      }}
      sx={[
        {
          minHeight: "0%",
          maxHeight: "100%",
          width,
          flex: "0 0 0%",
          whiteSpace: "nowrap",
          "& .MuiDrawer-paper": {
            width,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <DrawerHeader onClick={onClose} />
      <Divider />
      <List
        sx={{ overflowX: "hidden", overflowY: "auto", scrollbarWidth: "thin" }}
      >
        <HomeItem />
        <Divider />
        {is_authenticated && (
          <Fragment>
            <FavoriteItem count={favorite_count} />
            <UnreadItem count={unread_count} />
            <Divider />
          </Fragment>
        )}
        <AllItem />
        {items?.map(({ rank, ...item }) => (
          <ShortcutItem key={rank} {...item} />
        ))}
        {(is_staff || can_edit_doc) && (
          <Fragment>
            <Divider />
            {can_edit_doc && <EditorItem />}
            {is_staff && <AdminItem />}
          </Fragment>
        )}

        <Divider />
        <PortalItem />
      </List>
    </Drawer>
  );
}
