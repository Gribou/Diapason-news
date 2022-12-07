import React from "react";
import { Stack } from "@mui/material";
import { useCurrentDocSearch } from "features/docs/hooks";
import DocListContainer from "./DocListContainer";
import useSelection from "./useSelection";
import SecondaryToolbar from "./DocQueryToolbar";
import DocDetailContainer from "./DocDetailContainer";

export default function ListPage() {
  const query = useCurrentDocSearch();
  const { selected, handleKeyUp, handleItemClick } = useSelection(query);
  const { data, isLoading } = query;

  return (
    <Stack
      alignItems="stretch"
      sx={{
        flex: "1 1 0%",
        minHeight: 0,
        maxHeight: "100%",
        overflow: "hidden",
      }}
      tabIndex={0}
      onKeyUp={handleKeyUp}
    >
      <SecondaryToolbar />
      <Stack
        direction="row"
        alignItems="stretch"
        sx={{
          flex: "1 1 0%",
          minHeight: 0,
          maxHeight: "100%",
          overflow: "hidden",
          bgcolor: "background.default",
        }}
      >
        <DocListContainer
          isLoading={isLoading}
          results={data?.results}
          onClick={handleItemClick}
          selected={selected}
        />
        <DocDetailContainer selected={selected} {...query} />
      </Stack>
    </Stack>
  );
}
