import React from "react";
import { Typography, Switch, FormControlLabel } from "@mui/material";
import { useMarkDocAsReadMutation } from "features/docs/hooks";

export default function ReadSwitch({ doc, ...props }) {
  const [markDocAsRead] = useMarkDocAsReadMutation();

  const toggleReadStatus = (e) =>
    markDocAsRead({ pk: doc.pk, read: e.target.checked });

  return (
    <FormControlLabel
      {...props}
      labelPlacement="start"
      control={
        <Switch
          checked={doc.is_read}
          color="primary"
          onChange={toggleReadStatus}
        />
      }
      label={
        <Typography variant="body2" color="textSecondary" noWrap>
          {doc.is_read ? "Lu" : "Non lu"}
        </Typography>
      }
    />
  );
}
