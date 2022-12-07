import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { useMe, useUpdateProfileMutation } from "features/auth/hooks";
import { useForm } from "features/forms";
import { useConfigQuery } from "features/config/hooks";

import FormMultiSelectField from "components/forms/fields/FormMultiSelectField";

export default function useProfileForm() {
  const { statuts } = useMe();
  const { data } = useConfigQuery();
  const { is_safe } = data?.safety || {};
  const statut_list = data?.statuts_for_user || [];
  const [updateProfile, { isLoading, isSuccess, error }] =
    useUpdateProfileMutation();
  const { values, touched, handleUserInput, handleSubmit, reset } = useForm(
    {
      statuts: statuts || [],
    },
    () => updateProfile(values)
  );

  useEffect(() => {
    reset({
      statuts: statuts || [],
    });
  }, [statuts]);

  const form_props = {
    values,
    errors: error,
    touched,
    onChange: handleUserInput,
  };

  const display = (
    <Stack
      component="form"
      spacing={2}
      sx={{ width: "100%", my: 1 }}
      noValidate
      onSubmit={handleSubmit}
    >
      <FormMultiSelectField
        id="statuts"
        label="Statuts"
        choices={statut_list}
        {...form_props}
        helperText="Cochez les statuts correspondants à votre poste"
        disabled={!is_safe}
      />
      <LoadingButton
        fullWidth
        variant="contained"
        color="primary"
        disabled={!is_safe}
        loading={isLoading}
        sx={{ mt: 1 }}
        onClick={handleSubmit}
      >
        Mettre à jour
      </LoadingButton>
    </Stack>
  );

  return { isLoading, isSuccess, error, display };
}
