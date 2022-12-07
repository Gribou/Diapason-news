import React from "react";
import { Email, EmailOpen, Replay } from "mdi-material-ui";
import useGenericGroupFilter from "./GenericGroupFilter";

const FILTERS_READ_STATUS = [
  {
    label: "Non lu",
    value: { read: undefined, unread: "true" },
    icon: <Email />,
  },
  {
    label: "Lu",
    value: { read: "true", unread: undefined },
    icon: <EmailOpen />,
  },
  {
    label: "Tous",
    values: { read: undefined, unread: undefined },
    icon: <Replay />,
  },
];

function getReadStatusForDisplay({ read, unread }) {
  if (read || unread) {
    return (
      FILTERS_READ_STATUS.find(
        ({ value }) =>
          (read === value.read || value.read === undefined) &&
          (unread === value.unread || value.unread === undefined)
      )?.label || "Tout"
    );
  }
  return "Tous";
}

export default function useReadFilter({ onClose }) {
  return useGenericGroupFilter({
    keywordConfig: {
      read: { icon: <EmailOpen />, getChipLabel: () => "lu" },
      unread: { icon: <Email />, getChipLabel: () => "non lu" },
    },
    dialogTitle: "Filtrer par lecture",
    mainIcon: <EmailOpen />,
    choices: FILTERS_READ_STATUS,
    getMenuLabel: (params) => `Lecture : ${getReadStatusForDisplay(params)}`,
    onClose,
  });
}
