import React from "react";
import { Box, Stack } from "@mui/material";
import { Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import renderToolbar from "./renderToolbar";
import renderError from "./renderError";
import renderLoader from "./renderLoader";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";

export default function DocPdfViewer({ filename, sx, ...props }) {
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  return (
    <Stack
      {...props}
      sx={[
        {
          overflow: "hidden",
          width: "100%",
          position: "relative",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          p: "2px",
          alignItems: "center",
          color: "text.secondary",
          bgcolor: "background.paper",
          "& .rpv-toolbar": {
            display: "flex",
            flexDirection: "row",
          },
          "& span.rpv-zoom__popover-target-scale": {
            color: "text.secondary",
          },
          "& span.rpv-zoom__popover-target-arrow": {
            borderTopColor: "text.secondary",
          },
          "& div.rpv-core__popover-body": {
            bgcolor: "background.default",
            borderColor: "divider",
            "& .rpv-core__popover-body-arrow": {
              bgcolor: "background.default",
            },
            "& .rpv-core__menu-item": {
              color: "text.secondary",
            },
            "& .rpv-core__menu-divider": {
              borderColor: "divider",
            },
          },
        }}
      >
        <Toolbar>{(slots) => renderToolbar(slots, filename)}</Toolbar>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "1000px", //height must be fixed for gotopage buttons and initialPage to work
          maxHeight: "100%",
          overflowY: "auto",
          overscrollBehavior: "contain",
          touchAction: "none",
        }}
      >
        <Viewer
          theme="dark"
          fileUrl={filename}
          renderError={renderError}
          renderLoader={renderLoader}
          plugins={[toolbarPluginInstance]}
        />
      </Box>
    </Stack>
  );
}
