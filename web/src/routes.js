import React from "react";
import { matchPath } from "react-router";
import { FileDocumentMultipleOutline } from "mdi-material-ui";

import {
  ListPage,
  DetailPage,
  ShortcutListPage,
  HomePage,
  EditorPage,
  NotFoundPage,
} from "components/pages";
import { LoginPage, AccountPage } from "components/pages/auth";

import { BACKEND_HOST } from "constants/api";
import { URL_ROOT } from "constants/config";
import { createSearchParams } from "features/router";

export const ROUTES = {
  home: {
    path: `${URL_ROOT}/`,
    is_safe: true,
    element: <HomePage />,
  },
  login: {
    path: `${URL_ROOT}/login`,
    is_safe: true,
    element: <LoginPage />,
  },
  account: {
    path: `${URL_ROOT}/account`,
    title: "Mon compte",
    is_private: true,
    element: <AccountPage />,
  },
  favorites: {
    path: `${URL_ROOT}/docs/favorites`,
    title: "Favoris",
    is_private: true,
    search: createSearchParams({
      favorite: "true",
    }).toString(),
    element: <ShortcutListPage favorite="true" />,
  },
  unread: {
    path: `${URL_ROOT}/docs/unread`,
    title: "Non lus",
    is_private: true,
    search: createSearchParams({
      unread: "true",
    }).toString(),
    element: <ShortcutListPage unread="true" />,
  },
  doc_list: {
    path: `${URL_ROOT}/docs`,
    title: "Publications",
    element: <ListPage />,
  },
  doc_detail: {
    path: `${URL_ROOT}/doc/:pk`,
    title: "",
    element: <DetailPage />,
  },
  doc_update: {
    path: `${URL_ROOT}/editor/doc/:pk`,
    title: "Modifier la publication",
    element: <EditorPage />,
    is_private: true,
  },
  doc_create: {
    path: `${URL_ROOT}/editor/doc`,
    title: "Créer une publication",
    element: <EditorPage />,
    is_private: true,
  },
};

export const BACKEND_ROUTES = {
  admin: `${BACKEND_HOST}/admin/`,
  portal: "/",
};

export const ERROR_ROUTES = {
  error404: {
    path: "*",
    element: <NotFoundPage />,
  },
};

export function getRouteForPath(path) {
  for (let key in ROUTES) {
    const route = ROUTES[key];
    const match = matchPath(path, route.path);
    if (match) {
      return route;
    }
  }
  return {};
}

export const ALL_SHORTCUT = {
  route: ROUTES.doc_list,
  title: "Tout",
  icon: <FileDocumentMultipleOutline />,
};
