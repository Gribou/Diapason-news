import React, { useEffect, Fragment } from "react";
import { Button, Stack, Divider } from "@mui/material";
import FormTextField from "components/forms/fields/FormTextField";
import PasswordTextField from "components/forms/fields/PasswordTextField";
import { useConfig } from "features/config/hooks";
import { useLoginMutation } from "features/auth/hooks";
import { useForm } from "features/forms";
import SsoLoginButton from "./SsoLoginButton";

export default function useLoginForm() {
  const { sso } = useConfig();
  const [login, { isLoading, error, isSuccess, reset }] = useLoginMutation();
  const { values, touched, handleUserInput, handleSubmit } = useForm(
    { username: "", password: "" },
    login
  );

  useEffect(() => {
    reset();
  }, []); //reset mutation state when component loads

  const form_props = {
    values,
    touched,
    errors: error,
    onChange: handleUserInput,
  };

  const display = (
    <Stack
      component="form"
      sx={{ width: "100%", mt: 1 }}
      noValidate
      onSubmit={handleSubmit}
    >
      <FormTextField
        required
        margin="normal"
        id="username"
        label="Nom d'utilisateur"
        autoComplete="username"
        autoFocus
        {...form_props}
      />
      <PasswordTextField
        required
        margin="normal"
        id="password"
        label="Mot de passe"
        autoComplete="current-password"
        {...form_props}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2, mb: 2 }}
      >
        Connexion
      </Button>
      {sso && (
        <Fragment>
          <Divider flexItem sx={{ mb: 2 }} />
          <SsoLoginButton />
        </Fragment>
      )}
    </Stack>
  );

  return {
    loading: isLoading,
    errors: error || {},
    success: isSuccess,
    display,
  };
}
