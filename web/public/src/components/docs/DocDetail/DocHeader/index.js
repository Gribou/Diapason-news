import React from "react";
import moment from "moment";
import { Typography, Container, Link, Stack } from "@mui/material";
import Spacer from "components/misc/Spacer";
import { Link as RouterLink } from "react-router-dom";

import { DATE_FORMAT_SHORT } from "constants/config";
import { DocStatusIndicator } from "components/docs/DocStatusIndicator";
import { ROUTES } from "routes";
import { useAuthenticated, useCanEdit } from "features/auth/hooks";

import {
  DocDeleteStandaloneButton,
  DocEditStandaloneButton,
} from "./DocEditorButton";
import ReadSwitch from "./ReadSwitch";
import FavoriteButton from "./FavoriteButton";
import ThemeIndicator from "./DocThemeIndicator";

export default function DocHeader({ doc }) {
  const is_authenticated = useAuthenticated();
  const is_editor = useCanEdit();

  const read_switch = is_authenticated && <ReadSwitch doc={doc} edge="end" />;

  const favorite_button = is_authenticated && (
    <FavoriteButton edge="start" doc={doc} />
  );

  const title = (
    <Link
      variant="h6"
      component={RouterLink}
      color="inherit"
      to={ROUTES.doc_detail.path.replace(":pk", doc.pk)}
      sx={{ lineHeight: "28px", alignSelf: "center" }}
      underline="hover"
    >{`${doc.reference} - ${doc.title}`}</Link>
  );

  const publication_date = (
    <Typography variant="body2" color="textSecondary" align="right">{`Publié ${
      doc.redacteur ? `par ${doc.redacteur} ` : ""
    } le ${moment(doc.publication_date).format(
      DATE_FORMAT_SHORT
    )}`}</Typography>
  );

  return (
    <Container sx={{ py: 1 }}>
      <Stack
        sx={{ pb: 1 }}
        justifyContent="flex-start"
        direction="row"
        alignItems="center"
      >
        {favorite_button}
        {title}
        <Spacer />
        {read_switch}
      </Stack>
      {doc.descriptive && (
        <Typography
          variant="body1"
          align="justify"
          gutterBottom
          sx={{ mb: 2, whiteSpace: "pre-wrap" }}
        >
          {doc.descriptive}
        </Typography>
      )}
      <Stack
        direction="row"
        alignItems="center"
        sx={{ width: "100%", flexWrap: "noWrap", mb: 1 }}
      >
        <DocStatusIndicator doc={doc} fullText sx={{ mr: 1 }} />
        <ThemeIndicator doc={doc} sx={{ mr: 1 }} />
        <Spacer />
        {publication_date}
      </Stack>
      {is_editor && (
        <Stack
          sx={{
            width: "100%",
            flexWrap: "noWrap",
            flexDirection: "row-reverse",
            mb: 2,
          }}
        >
          <DocDeleteStandaloneButton doc={doc} />
          <DocEditStandaloneButton doc={doc} />
        </Stack>
      )}
    </Container>
  );
}
