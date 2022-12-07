import api from "api";
import { useParams } from "react-router-dom";
import { useSearchParams } from "features/router";

export const {
  useListDocsQuery,
  useReadDocQuery,
  useMarkDocAsReadMutation,
  useMarkDocAsFavoriteMutation,
  useMarkPageAsReadMutation,
} = api;

export function useCurrentDoc() {
  const { pk } = useParams();
  return useReadDocQuery(pk);
}

export function useCurrentDocSearch() {
  const [params] = useSearchParams();
  return useListDocsQuery(params);
}

export function useDocSearchCount(params) {
  const { data } = useListDocsQuery(params);
  return data?.count || 0;
}
