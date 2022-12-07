import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useLocation } from "react-router-dom";
import api from "api";
import { ROUTES } from "routes";
import { DEBUG } from "constants/config";

export const useForceLogoutOnUnauthorized = () => {
  const { is_authenticated, unauthorized } = useSelector(
    (state) => state?.credentials
  );
  const [logout] = useLogoutMutation();
  useEffect(() => {
    if (is_authenticated && unauthorized) {
      logout();
    }
  }, [unauthorized, is_authenticated]);
};

export const useAuthenticated = () =>
  useSelector((state) => state?.credentials?.is_authenticated);

export const getAuthToken = (state) => state?.credentials?.token || "";

export const {
  useLoginMutation,
  useLogoutMutation,
  useSessionQuery,
  useProfileQuery,
  useUpdateProfileMutation,
  useSsoLoginMutation,
  useSsoCallbackMutation,
} = api;

export const useMe = (options = {}) => {
  const is_authenticated = useAuthenticated();
  const { data, ...request } = useProfileQuery(
    {},
    { skip: !is_authenticated, ...options }
  );
  return is_authenticated ? { ...(data || {}), ...request } : {};
};

export function useIsStaff() {
  const { is_staff } = useMe();
  return useMemo(() => is_staff, [is_staff]);
}

export function useCanEdit() {
  const { can_edit_doc } = useMe();
  return useMemo(() => can_edit_doc, [can_edit_doc]);
}

function useIsLoginPage() {
  const { pathname } = useLocation();
  // pathname may or may not have a trailing slash
  return (
    pathname.replace(/\/?$/, "/") === ROUTES.login.path.replace(/\/?$/, "/")
  );
}

export function useSsoLoginCallback() {
  const is_login_page = useIsLoginPage();
  const [searchParams] = useSearchParams();
  const [callback, { isUninitialized }] = useSsoCallbackMutation();
  const code = searchParams?.get("code");
  const auth_error = searchParams.get("error");

  useEffect(() => {
    if (is_login_page && code && isUninitialized && !auth_error) {
      callback({ code });
    }
  }, [code, is_login_page, auth_error, isUninitialized]);
}

export function useSession() {
  //inhibit session when SSO callback is in progress, so that session response (is_authenticated) does not interfere with credentials slice
  //otherwise, session and SSO callback are both called when login page load after SSO redirection => running conditions

  const is_login_page = useIsLoginPage();
  const [searchParams] = useSearchParams();

  return useSessionQuery(
    {},
    {
      skip: DEBUG || (is_login_page && searchParams.has("code")),
    }
  );
}
