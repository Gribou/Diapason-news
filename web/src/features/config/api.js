export const tags = ["CONFIG"];

export default (builder) => ({
  menu: builder.query({
    query: () => "nav/",
    providesTags: ["MENU"],
  }),
  statuts: builder.query({
    query: () => "statut/",
    providesTags: ["STATUT"],
  }),
  doctypes: builder.query({
    query: () => "doctype/",
    providesTags: ["DOCTYPE"],
    transformResponse: (response) =>
      response?.map(({ short_name }) => short_name),
  }),
  config: builder.query({
    query: () => "config/",
    providesTags: ["CONFIG"],
  }),
});
