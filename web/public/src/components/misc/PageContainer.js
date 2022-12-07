import React, { Fragment } from "react";
import { Typography, Divider, Stack } from "@mui/material";

export default function PageContainer({
  title,
  children,
  titleAddOn,
  divider,
  sx = [],
  ...props
}) {
  const title_div = titleAddOn ? (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      justifyContent="space-between"
    >
      <Typography component="h2" variant="h6" color="primary">
        {title}
      </Typography>
      {titleAddOn}
    </Stack>
  ) : (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {title}
    </Typography>
  );

  return (
    <Fragment>
      <Stack
        {...props}
        sx={[
          {
            overflow: "auto",
            p: 2,
            pb: 1,
            mb: { md: 3 },
            borderRadius: { md: "4px" },
            boxShadow: { md: 1 },
            bgcolor: { md: "background.paper" },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {title_div}
        {children}
      </Stack>
      {divider && <Divider sx={{ display: { md: "none" } }} />}
    </Fragment>
  );
}
