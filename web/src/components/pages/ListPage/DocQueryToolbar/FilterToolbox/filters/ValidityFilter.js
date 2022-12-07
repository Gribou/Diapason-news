import React from "react";
import {
  CalendarBlank,
  Calendar,
  CalendarArrowRight,
  Replay,
} from "mdi-material-ui";
import useGenericGroupFilter from "./GenericGroupFilter";

const FILTERS_VALIDITY = [
  {
    label: "Non périmées",
    value: { in_effect: "true", to_come: "true" },
    icon: <CalendarBlank />,
  },
  {
    label: "En vigueur",
    value: { in_effect: "true", to_come: undefined },
    icon: <Calendar />,
  },
  {
    label: "A venir",
    value: { in_effect: undefined, to_come: "true" },
    icon: <CalendarArrowRight />,
  },
  {
    label: "Tout",
    value: { in_effect: undefined, to_come: undefined },
    icon: <Replay />,
  },
];

function getValidityForDisplay(search) {
  if (search.in_effect || search.to_come) {
    return (
      FILTERS_VALIDITY.find(({ value }) => {
        (search.in_effect === value.in_effect ||
          value.in_effect === undefined) &&
          (search.to_come === value.to_come || value.to_come === undefined);
      })?.label || "Tout"
    );
  }
  return "Tout";
}

export default function useValidityFilter({ onClose }) {
  return useGenericGroupFilter({
    keywordConfig: {
      in_effect: { icon: <Calendar />, getChipLabel: () => "en vigueur" },
      to_come: { icon: <CalendarArrowRight />, getChipLabel: () => "à venir" },
    },
    dialogTitle: "Filtrer par validité",
    mainIcon: <CalendarBlank />,
    choices: FILTERS_VALIDITY,
    getMenuLabel: (params) => `Validité : ${getValidityForDisplay(params)}`,
    onClose,
  });
}
