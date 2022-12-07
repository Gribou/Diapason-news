import React from "react";
import { Box, List } from "@mui/material";
import { LIST_ITEM_MIN_WIDTH, LIST_ITEM_MIN_WIDTH_SM } from "constants/config";
import PaginationToolbox from "./PaginationToolbox";
import SkeletonList from "./SkeletonList";
import DocListItem from "./DocListItem";

export default function DocList({ isLoading, results, onClick, selected }) {
  const menu_item_props = (doc) => ({
    onClick: () => onClick(doc),
    selected: selected && selected === doc.pk,
    autoFocus: selected && selected === doc.pk,
  });

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        width: "auto",
        minWidth: "20%",
        maxWidth: { xs: LIST_ITEM_MIN_WIDTH_SM, md: LIST_ITEM_MIN_WIDTH },
        transition: (theme) =>
          theme.transitions.create("min-width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      {isLoading ? (
        <SkeletonList
          sx={{
            width: "100%",
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          }}
          disablePadding
        />
      ) : (
        results?.length > 0 && (
          <List
            sx={{
              width: "100%",
              borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            }}
            disablePadding
          >
            <PaginationToolbox />
            {results
              ?.filter((doc) => doc)
              ?.map((doc) => (
                <DocListItem key={doc.pk} doc={doc} {...menu_item_props(doc)} />
              ))}
            <PaginationToolbox />
          </List>
        )
      )}
    </Box>
  );
}
