import React from "react";
import { TextField, Checkbox, Autocomplete } from "@mui/material";

export default function FormMultiSelectField({
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
  ...props
}) {
  return (
    <Autocomplete
      multiple
      id={id}
      name={id}
      options={choices || []}
      fullWidth
      autoComplete
      noOptionsText="Aucune option"
      autoHighlight
      {...props}
      value={values?.[id] || []}
      onChange={(e, value) => onChange({ target: { name: id, value } })}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox sx={{ mr: 2 }} checked={selected} />
          {option}
        </li>
      )}
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
