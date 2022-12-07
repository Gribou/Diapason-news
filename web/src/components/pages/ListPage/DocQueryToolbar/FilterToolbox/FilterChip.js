import React from "react";
import { Chip } from "@mui/material";
import { useSearchParams } from "features/router";

export default function FilterChip({ label, icon, param, ...props }) {
  const [params, push] = useSearchParams();
  return (
    <Chip
      size="small"
      label={label}
      icon={icon}
      onDelete={() =>
        push({
          ...params,
          page: 1,
          [param]: undefined,
        })
      }
      sx={{ mr: 1 }}
      {...props}
    />
  );
}
