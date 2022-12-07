import React from "react";
import { useParams } from "react-router-dom";
import { Container, Stack } from "@mui/material";
import { useCurrentDoc } from "features/docs/hooks";
import ErrorBox from "components/misc/ErrorBox";
import DocDetail from "components/docs/DocDetail";
import SkeletonDocDetail from "components/docs/SkeletonDetail";

export default function DetailPage() {
  const { pk } = useParams();
  const current_doc = useCurrentDoc();

  return (
    <Stack
      sx={{
        flex: "1 1 0%",
        minHeight: 0,
        maxHeight: "100%",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          flex: "1 1 0%",
          minHeight: 0,
          maxHeight: "100%",
          overflow: "hidden",
        }}
      >
        {current_doc.isLoading ? (
          <SkeletonDocDetail />
        ) : current_doc.isError ? (
          <ErrorBox errorDict={current_doc.error} />
        ) : (
          <DocDetail pk={pk} />
        )}
      </Container>
    </Stack>
  );
}
