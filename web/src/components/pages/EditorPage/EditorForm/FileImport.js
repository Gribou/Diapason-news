import React from "react";
import {
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Link,
  Button,
  Box,
} from "@mui/material";
import { Eye, FilePdfBox } from "mdi-material-ui";

export default function FileImport({ errors, values, onChange }) {
  const show_file_name = () => {
    if (values?.file?.name) {
      //new file
      return values.file.name;
    }
    if (values?.file_url) {
      //existing file
      return values.file_url.split("/").pop();
    }
    //no file
    return "Aucun";
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ mr: 3, flexGrow: 1 }}>
        <div>
          <Typography component="span" variant="button" sx={{ mr: 1 }}>
            {"Fichier (format PDF) : "}
          </Typography>
          <Typography component="span" color="textSecondary" noWrap>
            {show_file_name()}
          </Typography>
        </div>
        {errors.file && (
          <Typography color="error" variant="subtitle1">
            {errors.file}
          </Typography>
        )}
      </Box>
      {values?.file_url && (
        <Tooltip title="Aperçu du fichier" arrow>
          <IconButton
            component={Link}
            href={values.file_url}
            target="_blank"
            rel="noreferrer"
            size="small"
          >
            <Eye />
          </IconButton>
        </Tooltip>
      )}
      <Button
        variant="outlined"
        component="label"
        endIcon={<FilePdfBox />}
        color="primary"
      >
        Importer
        <input
          hidden
          type="file"
          id="file"
          onChange={(e) =>
            onChange({
              target: { name: "file", value: e.target.files[0] },
            })
          }
        />
      </Button>
      <Button
        variant="outlined"
        component="label"
        endIcon={<FilePdfBox />}
        color="error"
        onClick={() => {
          onChange([
            { target: { name: "file_url", value: null } },
            { target: { name: "file", value: null } },
          ]);
        }}
      >
        Supprimer
      </Button>
    </Stack>
  );
}
