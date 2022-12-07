import { ROUTES } from "routes";

export const tags = ["PROFILE", "PRIVATE"];

const redirect_uri = () =>
  `${window.location.protocol}//${window.location.host}${ROUTES.login.path}`;

export default (builder) => ({
  login: builder.mutation({
    query: (data) => ({
      url: "account/token/login/",
      method: "POST",
      data,
    }),
    invalidatesTags: ["PRIVATE", "PROFILE"],
  }),
  logout: builder.mutation({
    query: () => ({
      url: "account/token/logout/",
      method: "POST",
    }),
    invalidates: ["PRIVATE", "PROFILE"], //clear cache on logout
  }),
  session: builder.query({
    query: () => "account/session/",
  }),
  profile: builder.query({
    query: () => "users/me/",
    providesTags: ["PRIVATE", "PROFILE"],
  }),
  updateProfile: builder.mutation({
    query: (data) => ({
      url: "users/me/",
      method: "PUT",
      data,
    }),
    invalidatesTags: ["PROFILE"],
  }),
  ssoLogin: builder.mutation({
    query: () => ({
      url: "sso/login/",
      method: "POST",
      data: { redirect_uri: redirect_uri() },
    }),
  }),
  ssoCallback: builder.mutation({
    query: ({ code }) => ({
      url: "sso/login/callback/",
      method: "POST",
      data: { code, redirect_uri: redirect_uri() },
    }),
  }),
});
