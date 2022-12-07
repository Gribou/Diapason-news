import React from "react";
import moment from "moment";
import { Chip, Box } from "@mui/material";
import { DATE_FORMAT_SHORT } from "constants/config";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "routes";

const INFINITY_CHAR = "∞";

const format_date = (date, inf) =>
  date ? moment(date).format(DATE_FORMAT_SHORT) : inf;

function validityPeriod(doc, inf) {
  return `${format_date(doc.begin_date, inf)} - ${format_date(
    doc.end_date,
    inf
  )}`;
}

function InEffectChip({ doc, fullText, mini }) {
  return (
    <Chip
      label={
        mini ? "" : fullText ? validityPeriod(doc, INFINITY_CHAR) : "en vigueur"
      }
      size="small"
      color="success"
    />
  );
}

function OutOfDateChip({ doc, fullText, mini }) {
  return (
    <Chip
      label={
        mini ? "" : fullText ? validityPeriod(doc, INFINITY_CHAR) : "périmé"
      }
      size="small"
      color="error"
    />
  );
}

function ReplacedChips({ doc, fullText, mini }) {
  return fullText ? (
    doc.updated_by.map(({ pk, ref }) => (
      <Chip
        key={pk}
        label={mini ? "" : ref}
        size="small"
        color="error"
        component={RouterLink}
        to={ROUTES.doc_detail.path.replace(":pk", pk)}
        clickable
      />
    ))
  ) : (
    <Chip label={mini ? "" : "remplacé"} size="small" color="error" />
  );
}

function ToComeChip({ doc, fullText, mini }) {
  return (
    <Chip
      label={
        mini ? "" : fullText ? validityPeriod(doc, INFINITY_CHAR) : "à venir"
      }
      size="small"
      color="warning"
    />
  );
}

export function DocStatusIndicator({
  doc,
  mini = false,
  fullText = false,
  ...props
}) {
  return (
    <Box component="span" {...props}>
      {doc?.out_of_date && (
        <OutOfDateChip fullText={fullText} doc={doc} mini={mini} />
      )}
      {doc?.in_effect && (
        <InEffectChip fullText={fullText} doc={doc} mini={mini} />
      )}
      {doc?.replaced && (
        <ReplacedChips fullText={fullText} doc={doc} mini={mini} />
      )}
      {doc?.to_come && <ToComeChip fullText={fullText} doc={doc} mini={mini} />}
    </Box>
  );
}
