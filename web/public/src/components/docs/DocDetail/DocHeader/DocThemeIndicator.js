import React from "react";
import { Chip, Box } from "@mui/material";
import { Shape } from "mdi-material-ui";

export default function DocThemeIndicator({ doc, ...props }) {
  return (
    <Box component="span" {...props}>
      {doc?.theme && <Chip size="small" label={doc.theme} icon={<Shape />} />}
    </Box>
  );
}
