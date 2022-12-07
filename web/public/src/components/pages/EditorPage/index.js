import React from "react";
import moment from "moment";
import { useParams, Navigate, useLocation } from "react-router-dom";
import { Container, Typography, CircularProgress, Stack } from "@mui/material";
import EditorForm from "./EditorForm";

import {
  useReadEditorDocQuery,
  useEditorDocsMutations,
} from "features/editor/hooks";
import { useSafety } from "features/config/hooks";
import { useCanEdit } from "features/auth/hooks";
import useConfirmationDialog from "components/misc/ConfirmationDialog";
import { ErrorEditorOnly } from "components/pages/Errors";
import { ROUTES } from "routes";

export default function EditorPage() {
  const { is_safe } = useSafety();
  const is_editor = useCanEdit();
  const location = useLocation();
  const { pk } = useParams();
  const {
    data: current_doc,
    isLoading,
    error,
    isFetching,
    isSuccess,
  } = useReadEditorDocQuery(pk, { skip: !pk });
  const {
    create: [
      createEditorDoc,
      { isSuccess: isCreateSuccess, data: created, error: createError },
    ],
    update: [updateEditorDoc, { error: updateError }],
    delete: [deleteEditorDoc],
  } = useEditorDocsMutations();
  const delete_dialog = useConfirmationDialog({
    title: `Supprimer la consigne ${current_doc ? current_doc.reference : ""}?`,
    onConfirm: () => deleteEditorDoc(pk),
  });

  const get_doc = () =>
    current_doc || {
      year_ref: moment().year(),
      number_ref: 1,
      publication_date: moment().format("YYYY-MM-DD"),
      begin_date: moment().format("YYYY-MM-DD"),
      descriptive: "", //must not be null
    };

  const handleSubmit = (values) => {
    if (pk) updateEditorDoc({ pk, ...values });
    else createEditorDoc(values);
  };

  const does_not_exist = Boolean(pk && current_doc?.error?.detail);

  //if no pk and current_doc has pk, create has succeeded -> redirect to doc page
  return !is_safe || !is_editor ? (
    <ErrorEditorOnly redirect={location.pathname} />
  ) : isCreateSuccess ? (
    <Navigate to={ROUTES.doc_detail.path.replace(":pk", created?.pk)} />
  ) : does_not_exist ? (
    <Navigate to={ROUTES.doc_list.path} />
  ) : (
    <Stack sx={{ overflow: "auto", flexGrow: 1 }}>
      <Container
        maxWidth="lg"
        disableGutters
        sx={{ p: 2, pb: 1, mb: { md: 3 } }}
      >
        <Stack direction="row" alignItems="center">
          <Typography
            component="h2"
            variant="h6"
            color="primary"
            display="inline"
          >
            {pk ? "Modifier la publication" : "Créer une publication"}
          </Typography>
          {isLoading && <CircularProgress size={16} sx={{ m: 1, ml: 3 }} />}
        </Stack>
        {(!pk || isSuccess) && (
          /* do not show form when doc is still being loaded. Or the form will not be populated properly*/ <EditorForm
            doc={get_doc()}
            loading={isFetching}
            errors={createError || updateError || error || {}}
            onSubmit={handleSubmit}
            onDelete={delete_dialog.open}
          />
        )}
        {delete_dialog.display}
      </Container>
    </Stack>
  );
}
