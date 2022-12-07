import React, { Fragment } from "react";
import { CircularProgress } from "@mui/material";
import { EmailOpenMultiple } from "mdi-material-ui";
import {
  useListDocsQuery,
  useMarkPageAsReadMutation,
} from "features/docs/hooks";
import { useSearchParams } from "features/router";
import ResponsiveButton from "components/misc/ResponsiveButton";
import useConfirmationDialog from "components/misc/ConfirmationDialog";

export default function MarkAsReadToolbox(props) {
  const [params] = useSearchParams();
  const { data } = useListDocsQuery(params);
  const pk_list = data?.results?.map(({ pk }) => pk);
  const [markPageAsRead, { isLoading }] = useMarkPageAsReadMutation();
  const pageDialog = useConfirmationDialog({
    title: "Marquer cette page comme lue ?",
    onConfirm: () => markPageAsRead({ docs: pk_list }),
  });

  return (
    <Fragment>
      <ResponsiveButton
        text="Lu"
        tooltipText="Marquer cette page comme lue"
        size="small"
        startIcon={
          isLoading ? (
            <CircularProgress size={16} color="inherit" sx={{ mr: 8 }} />
          ) : (
            <EmailOpenMultiple />
          )
        }
        onClick={pageDialog.open}
        disabled={isLoading}
        {...props}
      />
      {pageDialog.display}
    </Fragment>
  );
}
