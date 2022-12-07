import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Box } from "@mui/material";

import { useAuthenticated } from "features/auth/hooks";
import { ROUTES } from "routes";

import useLoginForm from "./LoginForm";
import ErrorBox from "components/misc/ErrorBox";
import AuthPage from "./AuthPage";

export default function LoginPage() {
  const is_authenticated = useAuthenticated();
  const form = useLoginForm();
  const [searchParams] = useSearchParams();
  const sso_error = searchParams.get("error");

  const errorbox = (
    <Box sx={{ mt: 2, width: "100%" }}>
      <ErrorBox errorList={[form?.errors?.non_field_errors, sso_error]} />
    </Box>
  );

  return is_authenticated ? (
    <Navigate to={ROUTES.home.path} />
  ) : (
    <AuthPage loading={form.loading} title="Connexion">
      {errorbox}
      {form.display}
    </AuthPage>
  );
}
