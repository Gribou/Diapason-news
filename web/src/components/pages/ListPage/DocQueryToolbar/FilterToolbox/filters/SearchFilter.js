import React from "react";
import { Magnify } from "mdi-material-ui";
import useGenericFilter from "./GenericFilter";

export default function useSearchFilter() {
  return useGenericFilter({
    keyword: "search",
    icon: <Magnify />,
    noMenu: true,
  });
}
