import React from "react";
import moment from "moment";
import { Grid } from "@mui/material";
import { useConfigQuery } from "features/config/hooks";
import { FormSelectField, FormTextField } from "components/forms/fields";
import UpdateReferenceField from "./UpdateReferenceField";

export default function General(form_props) {
  const { data, isLoading } = useConfigQuery();
  const { doctypes, themes } = data || {};

  // all years from 2000 to this year + 2
  const year_choices = () =>
    [...Array(moment().year() - 2000 + 2).keys()]
      .map((y) => y + 2000)
      .reverse();

  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <FormSelectField
          id="year_ref"
          required
          label="Année"
          choices={year_choices()}
          inputProps={{ autoFocus: true }}
          {...form_props}
        />
      </Grid>
      <Grid item xs>
        <FormSelectField
          id="doctype"
          required
          label="Type"
          loading={isLoading}
          choices={["", ...(doctypes || [])]}
          {...form_props}
        />
      </Grid>
      <Grid item xs>
        <FormTextField
          required
          id="number_ref"
          label="Numéro du document"
          type="number"
          InputProps={{ inputProps: { min: 1 } }}
          {...form_props}
        />
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={4}>
        <UpdateReferenceField {...form_props} />
      </Grid>
      <Grid item xs={12}>
        <FormTextField required id="title" label="Titre" {...form_props} />
      </Grid>
      <Grid item xs={themes?.length > 0 ? 8 : 12}>
        <FormTextField
          id="keywords"
          label="Mots-clés"
          helperText="Donnez ici des indications au moteur de recherche"
          {...form_props}
        />
      </Grid>
      {themes?.length > 0 && (
        <Grid item xs={4}>
          <FormSelectField
            id="theme"
            label="Thème"
            loading={isLoading}
            choices={["", ...(themes || [])]}
            {...form_props}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <FormTextField
          multiline
          rows={6}
          id="descriptive"
          label="Description"
          {...form_props}
        />
      </Grid>
    </Grid>
  );
}
