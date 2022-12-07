import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { URL_ROOT } from "constants/config";
import { ROUTES, ERROR_ROUTES } from "routes";
import {
  useAuthenticated,
  useForceLogoutOnUnauthorized,
} from "features/auth/hooks";
import { useSafety } from "features/config/hooks";
import { ErrorPrivate, ErrorUnsafe } from "components/pages/Errors";
import Layout from "components/Layout";

/** Renders error page if private and not authenticated
 * or if route and host is not safe and not authenticated
 *
 * Do not redirect to error page because it would redirect on fresh page loading and not recover after loading safety/auth conf from server
 */

function makeElementForRoute({
  element,
  is_private,
  is_safe,
  is_authenticated,
  host_is_safe,
}) {
  const location = useLocation();
  if (!is_authenticated && is_private) {
    return <ErrorPrivate redirect={ROUTES.login.path} from={location} />;
  }
  if (!is_authenticated && !(host_is_safe || is_safe)) {
    return <ErrorUnsafe redirect={ROUTES.login.path} from={location} />;
  }
  return element;
}

export default function Routing() {
  useForceLogoutOnUnauthorized();
  const is_authenticated = useAuthenticated();
  const { is_safe: host_is_safe } = useSafety();
  return (
    <Routes>
      <Route path={URL_ROOT} element={<Layout />}>
        {Object.values(ROUTES).map(
          ({ element, is_private, is_safe, ...props }, i) => (
            <Route
              key={i}
              element={makeElementForRoute({
                element,
                is_private,
                is_safe,
                is_authenticated,
                host_is_safe,
              })}
              {...props}
            />
          )
        )}
        {Object.values(ERROR_ROUTES).map((route, i) => (
          <Route key={i} {...route} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.home.path} />} />
    </Routes>
  );
}
