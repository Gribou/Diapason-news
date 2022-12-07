import React from "react";
import { Navigate } from "react-router-dom";
import { createSearchParams } from "features/router";
import { ROUTES } from "routes";

export default function ShortcutListPage({ ...custom_params }) {
  return (
    <Navigate
      to={{
        pathname: ROUTES.doc_list.path,
        search: createSearchParams(custom_params).toString(),
      }}
    />
  );
}
