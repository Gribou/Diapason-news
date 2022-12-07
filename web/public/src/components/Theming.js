import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { indigo, blue, green, orange } from "@mui/material/colors";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

const enews_theme = createTheme({
  palette: {
    mode: "dark",
    secondary: {
      main: indigo[900],
    },
    primary: blue,
    background: {
      paper: "#424242",
      default: "#303030",
    },
    success: {
      ...green,
      contrastText: "#fff",
    },
    warning: {
      ...orange,
      contrastText: "#fff",
    },
  },
});

const Theming = ({ children }) => (
  <ThemeProvider theme={enews_theme}>{children}</ThemeProvider>
);

export default Theming;
