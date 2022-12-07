import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import {
  FormSelectField,
  FormMultiSelectField,
  FormDateField,
} from "components/forms/fields";
import { useConfigQuery } from "features/config/hooks";

export default function DocManagement(form_props) {
  const { data, isLoading } = useConfigQuery();
  const { editors, statuts } = data || {};

  return (
    <Box border={1} borderRadius={5} p={1} px={2}>
      <Typography component="span" variant="button">
        Gestion documentaire
      </Typography>
      <Grid container spacing={2} sx={{ my: 1 }}>
        <Grid item xs>
          <FormDateField
            id="publication_date"
            required
            label="Date de publication"
            {...form_props}
          />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs>
          <FormDateField
            id="begin_date"
            required
            label="Début de validité"
            {...form_props}
          />
        </Grid>
        <Grid item xs>
          <FormDateField
            id="end_date"
            nullable
            label="Fin de validité"
            {...form_props}
          />
        </Grid>
        <Grid item xs={12}>
          <FormMultiSelectField
            id="destinataires"
            label="Destinataires"
            loading={isLoading}
            choices={statuts || []}
            {...form_props}
          />
        </Grid>
        <Grid item xs>
          <FormSelectField
            id="redacteur"
            label="Rédacteur"
            loading={isLoading}
            choices={["", ...(editors || [])]}
            {...form_props}
          />
        </Grid>
        <Grid item xs>
          <FormMultiSelectField
            id="verificateurs"
            label="Vérificateurs"
            loading={isLoading}
            choices={editors || []}
            {...form_props}
          />
        </Grid>
        <Grid item xs>
          <FormSelectField
            id="approbateur"
            label="Approbateur"
            loading={isLoading}
            choices={["", ...(editors || [])]}
            {...form_props}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
