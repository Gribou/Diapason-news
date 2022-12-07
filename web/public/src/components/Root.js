import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { Worker } from "@react-pdf-viewer/core";
import { BACKEND_HOST } from "constants/api";
import { LocalizationProvider } from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { Alert } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";

import Theming from "./Theming";
import Routing from "./Routing";
import Loading from "./Loading";

//ensure compatibility of pdf.js library with older browsers
//const pdfWorker = `${BACKEND_HOST}/static/front/pdfjs-dist/build/pdf.worker.min.js`;
const pdfWorker = `${BACKEND_HOST}/static/front/pdfjs-dist/legacy/build/pdf.worker.min.js`;

function Fallback({ error }) {
  return <Alert severity="error">{error.message}</Alert>;
}

export default function Root({ store, persistor }) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Provider store={store}>
        <Theming>
          <PersistGate loading={<Loading />} persistor={persistor}>
            <BrowserRouter>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Worker workerUrl={pdfWorker}>
                  <Routing />
                </Worker>
              </LocalizationProvider>
            </BrowserRouter>
          </PersistGate>
        </Theming>
      </Provider>
    </ErrorBoundary>
  );
}
