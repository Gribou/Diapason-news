import React from "react";
import { Typography, Stack } from "@mui/material";

export default function EmptyMessage({ count, ...props }) {
  return (
    <Stack
      sx={{ maxWidth: "xs", mx: "auto", p: 3, color: "text.disabled" }}
      {...props}
    >
      {count === 0 ? (
        <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4 }}>
          Aucun document à afficher
        </Typography>
      ) : (
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          Sélectionnez un document dans la liste pour le voir en détail.
        </Typography>
      )}
    </Stack>
  );
}
