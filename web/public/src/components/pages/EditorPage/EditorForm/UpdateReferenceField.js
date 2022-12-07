import React from "react";
import { useConfigQuery } from "features/config/hooks";
import { FormSelectField } from "components/forms/fields";

export default function UpdateReferenceField({ values, ...props }) {
  const { data, isLoading } = useConfigQuery();
  const { references } = data || {};

  return (
    <FormSelectField
      freeSolo
      loading={isLoading}
      id="update_of"
      label="Annule et remplace"
      choices={references || []}
      filterOptions={(options, state) =>
        options?.filter((ref) =>
          ref?.includes(state?.inputValue?.toUpperCase())
        )
      }
      isOptionEqualToValue={(choice, value) => choice === value}
      includeInputInList
      autoSelect={false}
      autoHighlight={false}
      values={values}
      {...props}
    />
  );
}
