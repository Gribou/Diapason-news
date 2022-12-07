import React from "react";
import moment from "moment";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/lab";

export default function FormDateField({
  id,
  label,
  values = {},
  errors = {},
  touched = {},
  onChange,
  nullable,
  ...props
}) {
  return (
    <DatePicker
      inputFormat="DD/MM/yyyy"
      id={id}
      name={id}
      value={values?.[id] || null}
      clearable={nullable}
      onChange={(value) =>
        onChange({
          target: { name: id, value: moment(value).format("YYYY-MM-DD") },
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          error={Boolean(errors[id]) && !touched[id]}
          helperText={errors[id]}
        />
      )}
      {...props}
    />
  );
}
