import React from "react";
import { TextField } from "@mui/material";

export default function FormTextField({
  id,
  values = {},
  errors = {},
  touched = {},
  helperText,
  ...props
}) {
  return (
    <TextField
      fullWidth
      autoComplete="off"
      id={id}
      name={id}
      value={values?.[id] || ""}
      error={Boolean(errors?.[id]) && !touched?.[id]}
      helperText={errors?.[id] || helperText}
      {...props}
    />
  );
}
