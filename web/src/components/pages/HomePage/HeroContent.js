import React from "react";
import { Box, Stack, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import useAppIcon from "components/logos/AppIcon";

import { ROUTES } from "routes";

export default function HeroContent({ is_safe, is_authenticated }) {
  const LogoComponent = useAppIcon();
  return (
    <Box sx={{ bgcolor: "background.paper", px: 2, py: { xs: 2, md: 4 } }}>
      <Stack
        direction="row"
        sx={{ maxWidth: "md", mx: "auto" }}
        alignItems="center"
      >
        {LogoComponent && (
          <LogoComponent
            sx={{
              m: 2,
              width: { xs: "4em", md: "5em" },
              height: { xs: "4em", md: "5em" },
            }}
          />
        )}
        <Typography
          component="h1"
          variant="h2"
          color="textPrimary"
          gutterBottom
          sx={{ flexGrow: 1, ml: 4, typography: { xs: "h4", md: "h2" } }}
        >
          Bienvenue sur eNews
        </Typography>
      </Stack>
      <Typography
        variant="h6"
        color="textSecondary"
        align="justify"
        paragraph
        sx={{
          maxWidth: "md",
          mx: "auto",
          typography: { xs: "body1", md: "h6" },
        }}
      >
        Vous trouverez ici toutes les publications issues du service
        exploitation.
        <br />
        {is_safe || is_authenticated ? (
          "Choisissez ci-dessous la catégorie qui vous intéresse ou utilisez les raccourcis dans le menu de navigation à gauche."
        ) : (
          <Link component={RouterLink} to={ROUTES.login.path}>
            Veuillez utiliser votre compte utilisateur.
          </Link>
        )}
      </Typography>
    </Box>
  );
}
