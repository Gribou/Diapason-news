import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "./configureAxios";
import authEndpoints, { tags as authTags } from "features/auth/api";
import configEndpoints, { tags as configTags } from "features/config/api";
import docEndpoints, { tags as docTags } from "features/docs/api";
import editorEndpoints, { tags as editorTags } from "features/editor/api";

const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axios(),
  tagsTypes: [],
  endpoints: () => ({}),
});

export default baseApi
  .enhanceEndpoints({
    addTagTypes: [...authTags, ...configTags, ...docTags, ...editorTags],
  })
  .injectEndpoints({ endpoints: authEndpoints, overrideExisting: false })
  .injectEndpoints({ endpoints: configEndpoints, overrideExisting: false })
  .injectEndpoints({ endpoints: docEndpoints, overrideExisting: false })
  .injectEndpoints({ endpoints: editorEndpoints, overrideExisting: false });
