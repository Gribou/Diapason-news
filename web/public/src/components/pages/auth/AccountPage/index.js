import React from "react";
import { Container, Alert, Link, Divider, Stack } from "@mui/material";

import ErrorBox from "components/misc/ErrorBox";
import PageContainer from "components/misc/PageContainer";
import { useSafety } from "features/config/hooks";
import useStatutsForm from "./StatutsForm";
import RolesDisplay from "./RolesDisplay";

export default function AccountPage() {
  const statuts_form = useStatutsForm();
  const { is_safe, safe_host } = useSafety();

  const success_box = (
    <Alert sx={{ my: 1, width: "100%" }} severity="success" variant="filled">
      Votre profil a été enregistré !
    </Alert>
  );

  const safety_box = !is_safe && (
    <Alert sx={{ my: 1, width: "100%" }} severity="warning" variant="filled">
      {"Ce formulaire est accessible seulement depuis le "}
      <Link color="inherit" href={safe_host}>
        réseau interne
      </Link>
      {"."}
    </Alert>
  );

  return (
    <Stack sx={{ overflow: "auto", flexGrow: 1 }}>
      <Container maxWidth="sm" sx={{ mt: 2 }}>
        <PageContainer title="Profil">
          {statuts_form.isSuccess && success_box}
          {safety_box}
          <ErrorBox
            sx={{ my: 1, width: "100%" }}
            errorList={[statuts_form.error?.non_field_errors]}
          />
          {statuts_form.display}
          <Divider sx={{ mt: 2 }} />
          <RolesDisplay sx={{ my: 2 }} />
        </PageContainer>
      </Container>
    </Stack>
  );
}
