export const tags = ["EDITOR_DOC"];

const makeFormQuery = (data) => {
  const form = new FormData();
  for (let key in data) {
    if (["verificateurs", "destinataires"].includes(key)) {
      //this should be sent as a list
      for (let i in data[key]) {
        form.append(key, data[key][i]);
      }
    } else if (data[key] !== undefined && data[key] !== null) {
      form.append(key, data[key]);
    } else {
      form.append(key, "");
    }
  }
  return {
    data: form,
    headers: { "Content-Type": "multipart/form-data" },
  };
};

export default (builder) => ({
  readEditorDoc: builder.query({
    query: (pk) => `doc-for-editors/${pk}/`,
    providesTags: (result, error, id) => [
      { type: "EDITOR_DOC", id },
      "PRIVATE",
    ],
  }),
  createEditorDoc: builder.mutation({
    query: (data) => ({
      url: "doc-for-editors/",
      method: "POST",
      ...makeFormQuery(data),
    }),
    invalidatesTags: [
      { type: "DOC", id: "LIST" },
      "PROFILE",
      "CONFIG", //references will change
    ],
  }),
  updateEditorDoc: builder.mutation({
    query: ({ pk, ...data }) => ({
      url: `doc-for-editors/${pk}/`,
      method: "PUT",
      ...makeFormQuery(data),
    }),
    invalidatesTags: (result, error, { pk }) => [
      { type: "DOC", id: pk },
      { type: "EDITOR_DOC", id: pk },
      "CONFIG", //references will change
    ],
  }),
  deleteEditorDoc: builder.mutation({
    query: (pk) => ({
      url: `doc-for-editors/${pk}/`,
      method: "DELETE",
    }),
    invalidatesTags: (result, error, id) => [
      { type: "DOC", id },
      { type: "EDITOR_DOC", id },
      { type: "DOC", id: "LIST" },
      "CONFIG", //references will change
    ],
  }),
});
