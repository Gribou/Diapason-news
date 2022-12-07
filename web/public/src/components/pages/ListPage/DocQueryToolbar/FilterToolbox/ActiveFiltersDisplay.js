import React from "react";
import { Chip, Box } from "@mui/material";
import { useWidth } from "features/ui";
import { useSearchParams } from "features/router";
import { SortChip } from "../SortToolbox";

function useMaxLabels() {
  const width = useWidth();
  switch (width) {
    case "xl":
      return 99;
    case "lg":
      return 8;
    case "md":
      return 5;
    case "sm":
      return 3;
    default:
      return 0;
  }
}

export default function FilterLabel({ children }) {
  const max_labels = useMaxLabels();
  const [{ ordering }] = useSearchParams();

  return (
    <Box
      sx={{ overflow: "hidden", ml: 1, whiteSpace: "noWrap", flex: "1 1 0%" }}
    >
      {ordering && <SortChip />}
      {children?.slice(0, max_labels)}
      {max_labels > 0 && children?.length > max_labels && (
        <Chip size="small" label="..." sx={{ mr: 1 }} />
      )}
    </Box>
  );
}
