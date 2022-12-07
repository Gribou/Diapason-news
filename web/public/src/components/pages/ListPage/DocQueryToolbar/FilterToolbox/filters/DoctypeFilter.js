import React from "react";
import { TextBoxOutline, Replay } from "mdi-material-ui";
import { useConfigQuery } from "features/config/hooks";
import useGenericFilter from "./GenericFilter";

function getDoctypesForDisplay(search, saved_searches) {
  return (
    (search && saved_searches?.find(({ value }) => value === search)?.label) ||
    search ||
    "Tous"
  );
}

function useDocTypeChoices() {
  const { data } = useConfigQuery();
  return [
    ...(data?.filters?.doctypes || []),
    { label: "Tout", value: undefined, icon: <Replay /> },
  ];
}

export default function useDoctypeFilter({ onClose }) {
  const choices = useDocTypeChoices();

  return useGenericFilter({
    keyword: "doctype",
    icon: <TextBoxOutline />,
    dialogTitle: "Filtrer par type",
    choices,
    getMenuLabel: (value) => `Type : ${getDoctypesForDisplay(value, choices)}`,
    getChipLabel: (value) => getDoctypesForDisplay(value, choices),
    onClose,
  });
}
