import React from "react";
import { Bullseye, Replay } from "mdi-material-ui";
import useGenericFilter from "./GenericFilter";
import { useConfigQuery } from "features/config/hooks";

function getDestinatairesForDisplay(search, filters) {
  return (
    (search && filters?.find(({ value }) => search === value)?.label) ||
    search ||
    "Tout"
  );
}

function useDestinataireChoices() {
  const { data } = useConfigQuery();
  return [
    ...(data?.filters?.destinataires || []),
    { label: "Tout", value: undefined, icon: <Replay /> },
  ];
}

export default function useDestinataireFilter({ onClose }) {
  const choices = useDestinataireChoices();

  return useGenericFilter({
    keyword: "dest",
    icon: <Bullseye />,
    dialogTitle: "Filtrer par destinataires",
    choices,
    getMenuLabel: (value) =>
      `Destinataires : ${getDestinatairesForDisplay(value, choices)}`,
    getChipLabel: (value) => getDestinatairesForDisplay(value, choices),
    onClose,
  });
}
