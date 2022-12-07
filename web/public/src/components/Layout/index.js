import React from "react";
import { useMediaQuery } from "@mui/material";

import {
  useAuthenticated,
  useSession,
  useSsoLoginCallback,
} from "features/auth/hooks";
import { useSafety } from "features/config/hooks";
import LayoutBasis from "./LayoutBasis";

export default function Layout() {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const is_authenticated = useAuthenticated();
  const { is_safe } = useSafety();
  useSession();
  useSsoLoginCallback();
  //Callback needs to be done here so that it runs only once per code
  //Due to safety hook and ErrorUnsafe always displaying at first, hook would run twice if placed on LoginPage directly (see Routing.js)

  return (
    <LayoutBasis
      hideDrawer={!is_safe && !is_authenticated}
      drawerVariant={mdUp ? "permanent" : "overlay"}
    />
  );
}
