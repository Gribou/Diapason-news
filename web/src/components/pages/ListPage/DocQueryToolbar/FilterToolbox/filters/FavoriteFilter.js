import React from "react";
import { Star, Replay } from "mdi-material-ui";
import useGenericFilter from "./GenericFilter";

const FILTERS_FAVORITES = [
  { label: "Oui", value: "true", icon: <Star /> },
  { label: "Tous", value: undefined, icon: <Replay /> },
];

export default function useFavoriteFilter({ onClose }) {
  return useGenericFilter({
    keyword: "favorite",
    icon: <Star />,
    dialogTitle: "Filtrer par favoris",
    choices: FILTERS_FAVORITES,
    getMenuLabel: (value) => `Favoris : ${value ? "Oui" : "Tous"}`,
    getChipLabel: () => "favoris",
    onClose,
  });
}
