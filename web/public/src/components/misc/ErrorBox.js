import React from "react";
import { Alert } from "@mui/material";

//TODO improve algo

export default function ErrorBox({ errorList, errorDict, noKeys, ...props }) {
  const hasContent = () => {
    let values = [];
    if (errorDict) {
      values = Object.values(errorDict);
    }
    if (errorList) {
      values = errorList;
    }
    return values.filter((error) => error).length > 0;
  };

  const getContent = () => {
    const list = errorList || [];
    if (errorDict) {
      return list.concat(
        [errorDict.non_field_errors, errorDict.detail].concat(
          Object.entries(errorDict)
            .filter(
              ([key, error]) =>
                error !== "" && key !== "non_field_errors" && key !== "detail"
            )
            .map(([key, error]) => (noKeys ? error : `${key} : ${error}`))
        )
      );
    }
    return list;
  };

  return (
    hasContent() && (
      <Alert severity="error" align="justify" variant="filled" {...props}>
        {getContent()
          .filter((error) => error)
          .map((error, i) => (
            <div key={i}>{error}</div>
          ))}
      </Alert>
    )
  );
}
