export const tags = ["DOC"];

export default (builder) => ({
  listDocs: builder.query({
    query: (params) => ({
      url: "doc/",
      params: { page: 1, ...params },
    }),
    providesTags: (result) => [
      ...(result?.results || []).map(({ pk }) => ({
        type: "DOC",
        id: pk,
      })),
      { type: "DOC", id: "LIST" },
    ],
  }),
  readDoc: builder.query({
    query: (pk) => `doc/${pk}/`,
    providesTags: (result, error, id) => [{ type: "DOC", id }],
  }),
  markDocAsRead: builder.mutation({
    query: ({ pk, read }) => ({
      url: `doc/${pk}/read/`,
      data: { read },
      method: "POST",
    }),
    invalidatesTags: (result, error, { pk }) => [
      { type: "DOC", id: pk },
      { type: "DOC", id: "LIST" },
      "PROFILE",
    ],
  }),
  markDocAsFavorite: builder.mutation({
    query: ({ pk, favorite }) => ({
      url: `doc/${pk}/favorite/`,
      data: { favorite },
      method: "POST",
    }),
    invalidatesTags: (result, error, { pk }) => [
      { type: "DOC", id: pk },
      { type: "DOC", id: "LIST" },
      "PROFILE",
    ],
  }),
  markPageAsRead: builder.mutation({
    query: (data) => ({
      url: "doc/page_read/",
      data,
      method: "POST",
    }),
    invalidatesTags: (result) => [
      "PROFILE",
      { type: "DOC", id: "LIST" },
      ...(result?.map(({ pk }) => ({ type: "DOC", id: pk })) || []),
    ],
  }),
});
