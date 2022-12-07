import React from "react";
import StickySecondaryToolbar from "components/misc/StickySecondaryToolbar";
import FilterToolbox from "components/pages/ListPage/DocQueryToolbar/FilterToolbox";
import SortToolbox from "./SortToolbox";
import MarkAsReadToolbox from "./MarkAsReadToolbox";

import { useAuthenticated } from "features/auth/hooks";

export default function SecondaryToolbar(props) {
  const isAuthenticated = useAuthenticated();

  return (
    <StickySecondaryToolbar
      {...props}
      sx={{
        position: "static",
        top: "default",
      }}
    >
      <SortToolbox />
      <FilterToolbox />
      {isAuthenticated && (
        <MarkAsReadToolbox sx={{ mr: 1, flex: "0 0 auto" }} />
      )}
    </StickySecondaryToolbar>
  );
}
