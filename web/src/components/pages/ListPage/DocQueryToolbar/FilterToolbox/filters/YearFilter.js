import React from "react";
import { AlphaYCircle } from "mdi-material-ui";
import useGenericFilter from "./GenericFilter";

export default function useYearFilter() {
  return useGenericFilter({
    keyword: "year",
    icon: <AlphaYCircle />,
    noMenu: true,
  });
}
