import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { FormCheckBoxField, FormDateField } from "components/forms/fields";

export default function Archiving(form_props) {
  return (
    <Box border={1} borderRadius={5} p={1} px={2}>
      <Typography component="span" variant="button">
        Disponibilité sur eNews
      </Typography>
      <Grid container spacing={2} sx={{ my: 1 }}>
        <Grid item>
          <FormDateField
            id="obsolescence_date"
            fullWidth
            nullable
            label="Fin de disponibilité"
            {...form_props}
          />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs>
          <FormCheckBoxField
            id="delete_on_archive"
            label="Supprimer complètement en fin de disponibilité"
            {...form_props}
          />
        </Grid>
      </Grid>
      <Typography variant="caption" color="textSecondary" gutterBottom>
        En fin de disponibilité, le fichier PDF associé au document est supprimé
        du serveur afin d&apos;économiser l&apos;espace de stockage mais la
        publication est toujours référencée par le moteur de recherche. On peut
        aussi choisir que toute référence au document soit supprimée
        définitivement de eNews à cette date. La date de fin de disponibilité
        par défaut est configurée 3 ans après la publication.
      </Typography>
    </Box>
  );
}
