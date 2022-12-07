import React from "react";
import { Shape, Replay } from "mdi-material-ui";
import { useConfigQuery } from "features/config/hooks";
import useGenericFilter from "./GenericFilter";

function getThemesForDisplay(value) {
  return value ? `${value}` : "Tous";
}

function useThemeChoices() {
  const { data } = useConfigQuery();
  return [
    ...(data?.filters?.themes || []),
    { label: "Tout", value: undefined, icon: <Replay /> },
  ];
}

export default function useThemeFilter({ onClose }) {
  const choices = useThemeChoices();

  return useGenericFilter({
    keyword: "theme",
    icon: <Shape />,
    dialogTitle: "Filtrer par thème",
    choices,
    getMenuLabel: (value) => `Thème : ${getThemesForDisplay(value)}`,
    getChipLabel: (value) => getThemesForDisplay(value),
    onClose,
  });
}
