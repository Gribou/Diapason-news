import api from "api";

export const {
  useReadEditorDocQuery,
  useUpdateEditorDocMutation,
  useCreateEditorDocMutation,
  useDeleteEditorDocMutation,
} = api;

export const useEditorDocsMutations = () => ({
  create: useCreateEditorDocMutation(),
  update: useUpdateEditorDocMutation(),
  delete: useDeleteEditorDocMutation(),
});
