import React from "react";
import { Tooltip, IconButton, Container, Box, Link } from "@mui/material";
import {
  MagnifyPlusOutline,
  MagnifyMinusOutline,
  ChevronUp,
  ChevronDown,
  Fullscreen,
  Download as DownloadIcon,
  Printer,
  OpenInNew,
} from "mdi-material-ui";

const makeButton = (icon, label, { isDisabled, onClick }) => {
  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          onClick={onClick}
          size="small"
          color="inherit"
          disabled={isDisabled}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};
//inner span is needed for when IconButton is disabled

export default function renderToolbar(slots, url) {
  const {
    CurrentPageInput,
    Download,
    EnterFullScreen,
    GoToNextPage,
    GoToPreviousPage,
    NumberOfPages,
    Print,
    Zoom,
    ZoomIn,
    ZoomOut,
  } = slots;

  return (
    <Container className="rpv-toolbar" disableGutters>
      <div className="rpv-toolbar__left">
        <div className="rpv-toolbar__item">
          <GoToPreviousPage>
            {(props) => makeButton(<ChevronUp />, "Page précédente", props)}
          </GoToPreviousPage>
        </div>
        <div className="rpv-toolbar__item">
          <CurrentPageInput /> / <NumberOfPages />
        </div>
        <div className="rpv-toolbar__item">
          <GoToNextPage>
            {(props) => makeButton(<ChevronDown />, "Page suivante", props)}
          </GoToNextPage>
        </div>
      </div>
      <div className="rpv-toolbar__center">
        <div className="rpv-toolbar__item">
          <ZoomOut>
            {(props) =>
              makeButton(<MagnifyMinusOutline />, "Zoom arrière", props)
            }
          </ZoomOut>
        </div>
        <div className="rpv-toolbar__item">
          <Zoom />
        </div>
        <div className="rpv-toolbar__item">
          <ZoomIn>
            {(props) => makeButton(<MagnifyPlusOutline />, "Zoom avant", props)}
          </ZoomIn>
        </div>
      </div>
      <div className="rpv-toolbar__right">
        <div className="rpv-toolbar__item">
          <EnterFullScreen>
            {(props) => makeButton(<Fullscreen />, "Plein écran", props)}
          </EnterFullScreen>
        </div>

        <Box
          className="rpv-toolbar__item"
          sx={{ display: { xs: "none", lg: "block" } }}
        >
          <Download>
            {(props) => makeButton(<DownloadIcon />, "Télécharger", props)}
          </Download>
        </Box>
        <Box
          className="rpv-toolbar__item"
          sx={{ display: { xs: "none", lg: "block" } }}
        >
          <Print>{(props) => makeButton(<Printer />, "Imprimer", props)}</Print>
        </Box>
        <div className="rpv-toolbar__item">
          <Tooltip title="Ouvrir dans un nouvel onglet">
            <span>
              <IconButton
                component={Link}
                href={url}
                target="_blank"
                size="small"
                color="inherit"
              >
                <OpenInNew />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
    </Container>
  );
}
