import React, { Fragment } from "react";
import { Button, Stack } from "@mui/material";
import ErrorBox from "components/misc/ErrorBox";
import { LoadingButton } from "@mui/lab";
import { useConfigQuery } from "features/config/hooks";
import { useForm } from "features/forms";
import General from "./General";
import DocManagement from "./DocManagement";
import FileImport from "./FileImport";
import Archiving from "./Archiving";

export default function EditorForm({
  doc,
  loading,
  errors,
  onSubmit,
  onDelete,
  sx = [],
  ...props
}) {
  const { isSuccess: configSuccess, error: configError } = useConfigQuery();
  const { values, touched, handleUserInput, handleSubmit } = useForm(
    { ...doc, update_of: doc.update_of_read },
    () =>
      onSubmit({
        ...values,
      })
  );

  const form_props = () => ({
    values,
    touched,
    errors,
    onChange: handleUserInput,
  });

  return !configSuccess ? (
    <ErrorBox
      errorList={configError || (errors && [errors?.non_field_errors])}
      sx={{ flex: "1 1 0%" }}
    />
  ) : (
    <Fragment>
      <ErrorBox
        errorList={[errors?.non_field_errors, errors?.detail]}
        sx={{ flex: "1 1 0%" }}
      />
      <Stack
        spacing={2}
        sx={[{ width: "100%", mt: 3 }, ...(Array.isArray(sx) ? sx : [sx])]}
        {...props}
      >
        <General {...form_props()} />
        <FileImport {...form_props()} />
        <DocManagement {...form_props()} />
        <Archiving {...form_props()} />
        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleSubmit}
          >
            {doc.pk ? "Modifier" : "Créer"}
          </Button>
          {doc.pk && (
            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              color="error"
              loading={loading}
              onClick={onDelete}
            >
              Supprimer
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Fragment>
  );
}
