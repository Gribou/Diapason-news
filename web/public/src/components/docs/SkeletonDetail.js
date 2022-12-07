import React from "react";
import { Container, Box, Skeleton, Stack } from "@mui/material";

export default function SkeletonDocDetail(props) {
  return (
    <Box {...props}>
      <Container sx={{ py: 1 }}>
        <Skeleton
          width="80%"
          sx={{ lineHeight: "28px", alignSelf: "center" }}
        />
        <Skeleton height={10} sx={{ mb: 2 }} />
        <Skeleton height={10} />
        <Skeleton width="60%" height={10} />
        <Stack
          direction="row"
          alignItems="center"
          sx={{ width: "100%", flexWrap: "noWrap", mb: 1 }}
        >
          <Skeleton width="100px" />
          <Skeleton width="20%" />
        </Stack>
      </Container>
      <Skeleton variant="rect" width="100%" height="500px" />
    </Box>
  );
}
