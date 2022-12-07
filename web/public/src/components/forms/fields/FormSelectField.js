import React from "react";
import { TextField, Autocomplete } from "@mui/material";

export default function FormSelectField({
  id,
  values = {},
  errors = {},
  touched = {},
  helperText,
  label,
  onChange,
  choices,
  inputProps,
  required,
  loading,
  ...props
}) {
  return (
    <Autocomplete
      id={id}
      name={id}
      options={choices}
      getOptionLabel={(choice) => `${choice}`}
      isOptionEqualToValue={(choice, value) => choice === value || value === ""}
      fullWidth
      autoSelect
      autoComplete
      autoHighlight
      loading={loading}
      noOptionsText="Aucune suggestion"
      loadingText="Chargement..."
      {...props}
      value={loading ? "" : values?.[id] || ""}
      onChange={(e, value) => onChange({ target: { name: id, value } })}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={Boolean(errors[id]) && !touched[id]}
          helperText={errors[id] || helperText}
          {...inputProps}
        />
      )}
    />
  );
}
