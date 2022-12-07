import React from "react";
import { Typography, Link, Container, Box } from "@mui/material";
import { useSafety } from "features/config/hooks";

export function InternalLinkBox() {
  const { other_host, safe_host } = useSafety();

  return !other_host ? (
    <Box sx={{ mt: 2, p: 2 }} />
  ) : (
    <Typography
      variant="subtitle2"
      color="textSecondary"
      align="center"
      paragraph
      sx={{ mt: 2, p: 2 }}
    >
      Ce site est accessible depuis le réseau interne à cette adresse :
      <br />
      <Link href={safe_host}>{safe_host}</Link>
    </Typography>
  );
}

export function ExternalLinkBox() {
  const { other_host } = useSafety();

  return !other_host ? (
    <Box sx={{ mt: 2, p: 2 }} />
  ) : (
    <Container maxWidth="md" sx={{ mt: 2, p: 2 }}>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        align="center"
        paragraph
      >
        Ce site est accessible depuis l&apos;extérieur (avec un compte
        utilisateur) à cette adresse :
        <br />
        <Link href={other_host}>{other_host}</Link>
      </Typography>
    </Container>
  );
}
