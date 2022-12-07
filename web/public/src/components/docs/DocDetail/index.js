import React, { useEffect } from "react";
import { alpha } from "@mui/material/styles";
import { Typography, Button, Alert, Stack, useMediaQuery } from "@mui/material";
import { OpenInNew } from "mdi-material-ui";
import DocPdfViewer from "./PdfViewer";
import { useAuthenticated } from "features/auth/hooks";
import { useReadDocQuery, useMarkDocAsReadMutation } from "features/docs/hooks";
import DocHeader from "./DocHeader";

export default function DocDetail({ pk, sx = [], ...props }) {
  const is_authenticated = useAuthenticated();
  const [markDocAsRead] = useMarkDocAsReadMutation();
  const smUp = useMediaQuery((t) => t.breakpoints.up("sm"));

  const { data, isSuccess } = useReadDocQuery(pk);

  useEffect(() => {
    //auto mark as read when component loads
    //DO NOT mark as read on success, because doc cache is invalidated when user clicks on "read/unread" switch ->> loop
    if (isSuccess && is_authenticated && data?.read === false) {
      markDocAsRead({ pk, read: true });
    }
  }, [pk]);

  const showUnread = () => is_authenticated && data?.is_read === false;

  return data ? (
    <Stack
      sx={[
        {
          bgcolor: (theme) =>
            showUnread() && alpha(theme.palette.primary.dark, 0.3),
          overflowY: "hidden",
          alignSelf: "flex-start",
          width: "100%",
          flex: "1 1 0%",
          minHeight: "0%",
          maxHeight: "100%",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <DocHeader doc={data} />
      {data?.file &&
        (smUp ? (
          <DocPdfViewer filename={data?.file} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            href={data?.file}
            target="_blank"
            rel="noreferrer"
            endIcon={<OpenInNew />}
            fullWidth
            sx={{ m: 2 }}
          >
            Ouvrir PDF
          </Button>
        ))}

      {data?.archived && (
        <Alert severity="info" align="justify" variant="filled" sx={{ m: 2 }}>
          {`Cette publication a été archivée.${
            data?.archive_path
              ? `Vous trouverez sa version originale ici : ${data?.archive_path}`
              : ""
          }`}
        </Alert>
      )}
    </Stack>
  ) : (
    <Typography
      variant="body2"
      align="center"
      color="textSecondary"
      sx={{ m: 3 }}
    >
      Ce document n&apos;existe plus.
    </Typography>
  );
}
