import React from "react";
import { Container, Stack, Typography, Paper } from "@mui/material";
import { InternalLinkBox } from "components/misc/HostBox";
import AppIcon from "components/logos/AppAvatar";

export default function AuthPage({ loading, title, children }) {
  return (
    <Stack sx={{ overflow: "auto", flexGrow: 1 }}>
      <Container maxWidth="sm">
        <Stack
          sx={{
            mt: { xs: 2, md: 4 },
            p: 2,
            pb: { xs: 2, md: 4 },
          }}
          alignItems="center"
          component={Paper}
          elevation={0}
        >
          <AppIcon size="large" loading={loading} />
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
          {children}
        </Stack>
        <InternalLinkBox />
      </Container>
    </Stack>
  );
}
