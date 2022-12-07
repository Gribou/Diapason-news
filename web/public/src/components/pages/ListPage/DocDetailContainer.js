import React from "react";
import { Stack } from "@mui/material";
import DocDetail from "components/docs/DocDetail";
import ErrorBox from "components/misc/ErrorBox";
import EmptyMessage from "./EmptyMessage";
import SkeletonDocDetail from "components/docs/SkeletonDetail";

export default function DocDetailContainer({
  error,
  selected,
  isLoading,
  data,
}) {
  return (
    <Stack
      sx={{
        flex: "1 1 0%",
        minHeight: "0%",
        maxHeight: "100%",
        overflow: "hidden",
        alignSelf: "flex-start",
      }}
    >
      <ErrorBox errorDict={error} />
      {!selected && isLoading ? (
        <SkeletonDocDetail />
      ) : !selected ? (
        <EmptyMessage count={data?.results?.length || 0} />
      ) : (
        <DocDetail pk={selected} />
      )}
    </Stack>
  );
}
