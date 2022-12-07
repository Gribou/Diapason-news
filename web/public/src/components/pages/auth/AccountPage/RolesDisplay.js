import React from "react";
import { Stack, Typography, Alert } from "@mui/material";
import {
  CheckboxMarkedCircleOutline,
  CloseCircleOutline,
} from "mdi-material-ui";

import { useMe } from "features/auth/hooks";
import { useConfig } from "features/config/hooks";

function RoleTypo({ enabled, children, ...props }) {
  return (
    <Stack direction="row" alignItems="center" {...props}>
      {enabled ? (
        <CheckboxMarkedCircleOutline color="success" />
      ) : (
        <CloseCircleOutline color="error" />
      )}
      <Typography
        component="span"
        variant="body2"
        align="justify"
        sx={{
          ml: 2,
          textDecorationLine: enabled ? "none" : "line-through",
          textDecorationColor: "inherit",
          color: enabled ? "inherit" : "text.disabled",
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

export default function RolesDisplay({ sx }) {
  const { email_admin } = useConfig();
  const { can_edit_doc, is_staff } = useMe();

  return (
    <Stack spacing={2} sx={sx}>
      <RoleTypo enabled={can_edit_doc}>
        Je peux ajouter ou modifier des publications.
      </RoleTypo>
      <RoleTypo enabled={is_staff}>
        J&apos;ai accès à l&apos;interface d&apos;administration.
      </RoleTypo>
      <Alert severity="info" variant="outlined">
        {
          "Si ces droits d'accès ne correspondent pas à vos fonctions, contactez l'administrateur "
        }
        {email_admin ? `(${email_admin}) ` : ""}
        {"pour les mettre à jour."}
      </Alert>
    </Stack>
  );
}
