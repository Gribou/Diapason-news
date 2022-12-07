import React from "react";
import { Account, Replay } from "mdi-material-ui";
import useGenericFilter from "./GenericFilter";

const FILTERS_FOR_ME = [
  { label: "Pour moi", value: "true", icon: <Account /> },
  { label: "Tout", value: undefined, icon: <Replay /> },
];

export default function useForMeFilter({ onClose }) {
  return useGenericFilter({
    keyword: "for_me",
    icon: <Account />,
    dialogTitle: "Filtrer pour moi",
    choices: FILTERS_FOR_ME,
    getMenuLabel: (value) => `Pour moi : ${value ? "Oui" : "Tous"}`,
    getChipLabel: () => "pour moi",
    onClose,
  });
}
