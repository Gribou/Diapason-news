import React from "react";
import { Typography, Link, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useSafety } from "features/config/hooks";
import { URL_ROOT } from "constants/config";
import AppAvatar from "components/logos/AppAvatar";

function ErrorPage({ title, children }) {
  return (
    <Stack
      component="main"
      sx={{
        mt: 8,
        maxWidth: "sm",
        mx: "auto",
      }}
    >
      <AppAvatar size="large" sx={{ alignSelf: "center" }} />
      <Typography variant="h4" align="center" gutterBottom>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

export default function Error404() {
  return (
    <ErrorPage title="Page introuvable">
      <Typography variant="subtitle1" align="center">
        La page que vous cherchez n&apos;existe pas.
      </Typography>
    </ErrorPage>
  );
}

export function ErrorPrivate({ redirect, from }) {
  return (
    <ErrorPage title="Page privée">
      {from ? (
        <Typography variant="subtitle1" align="center">
          La page{" "}
          <Link
            variant="subtitle1"
            align="center"
            component={RouterLink}
            to={from?.pathname}
          >
            {from?.pathname}
          </Link>{" "}
          n&apos;est pas accessible sans authentification.
        </Typography>
      ) : (
        <Typography variant="subtitle1" align="center">
          Cette page n&apos;est pas accessible sans authentification.
        </Typography>
      )}
      <Link
        variant="subtitle1"
        align="center"
        component={RouterLink}
        to={redirect}
      >
        Veuillez vous connecter à votre compte.
      </Link>
    </ErrorPage>
  );
}

export function ErrorUnsafe({ redirect, from }) {
  const { safe_host } = useSafety();
  const safe_address = () => {
    const from_location =
      from?.pathname?.replace(URL_ROOT, "")?.substring(1) || "";
    return `${safe_host}${from_location}`;
  };

  return (
    <ErrorPage title="Page interne">
      <Typography variant="subtitle1" align="justify">
        Cette page est accessible seulement en interne ou avec authentification.
      </Typography>
      <Typography variant="subtitle1" align="justify">
        Si vous êtes connecté au réseau en interne, utilisez l&apos;adresse{" "}
        <Link href={safe_address()}>{safe_address()}</Link>
      </Typography>
      <Typography variant="subtitle1" align="justify">
        Sinon,{" "}
        <Link component={RouterLink} to={redirect}>
          veuillez vous connecter à votre compte.
        </Link>
      </Typography>
    </ErrorPage>
  );
}

export function ErrorEditorOnly({ redirect }) {
  return (
    <ErrorPage title="Droits insuffisants">
      <Typography variant="subtitle1" align="justify">
        Cette page est accessible seulement aux utilisateurs pouvant créer et
        mettre à jour des publications.
      </Typography>
      <Link
        component={RouterLink}
        to={redirect}
        variant="subtitle1"
        align="justify"
      >
        Veuillez vous connecter avec un compte disposant des droits
        correspondants et sur le réseau interne.
      </Link>
    </ErrorPage>
  );
}
