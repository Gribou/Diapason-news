import React, { Fragment } from "react";
import {
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  Stack,
  Divider,
} from "@mui/material";
import {
  ChevronRight,
  ChevronLeft,
  PageFirst,
  PageLast,
} from "mdi-material-ui";
import { LIST_PAGE_SIZE } from "constants/config";
import { useDocSearchCount } from "features/docs/hooks";
import { useSearchParams } from "features/router";

const usePagination = (params) => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const size = LIST_PAGE_SIZE;
  const count = useDocSearchCount(params);
  const page = Number(params?.page) || 1;

  const start_index = () => (count === 0 ? 0 : (page - 1) * size + 1);
  const end_index = () => Math.min(count, page * size);
  const nb_pages = () => Math.floor(count / size) + 1;

  const label =
    start_index() !== 0
      ? `${start_index()}-${end_index()} ${smDown ? "/" : "sur"} ${count}`
      : "";

  return { current: page, nb_pages, label };
};

export default function PaginationToolbox() {
  const [params, push] = useSearchParams();
  const { current, nb_pages, label } = usePagination(params);

  const navigateToPage = (page_number) =>
    push({ ...params, page: page_number });

  const first_page = (
    <Tooltip title="Première page">
      <span>
        <IconButton
          size="small"
          onClick={() => navigateToPage(1)}
          disabled={current - 2 <= 0}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <PageFirst />
        </IconButton>
      </span>
    </Tooltip>
  );

  const last_page = (
    <Tooltip title="Dernière page">
      <span>
        <IconButton
          size="small"
          onClick={() => navigateToPage(nb_pages())}
          disabled={current + 2 > nb_pages()}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <PageLast />
        </IconButton>
      </span>
    </Tooltip>
  );

  const prev_page = (
    <Tooltip title="Page précédente">
      <span>
        <IconButton
          size="small"
          onClick={() => navigateToPage(current - 1)}
          disabled={current - 1 <= 0}
        >
          <ChevronLeft />
        </IconButton>
      </span>
    </Tooltip>
  );

  const next_page = (
    <Tooltip title="Page suivante">
      <span>
        <IconButton
          size="small"
          onClick={() => navigateToPage(current + 1)}
          disabled={current + 1 > nb_pages()}
        >
          <ChevronRight />
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <Fragment>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{
          px: { xs: 0, md: 1 },
          flex: "0 0 auto",
        }}
      >
        {first_page}
        {prev_page}
        <Typography
          variant="overline"
          sx={{ mx: 1, flexGrow: 1 }}
          align="center"
          noWrap
        >
          {label}
        </Typography>
        {next_page}
        {last_page}
      </Stack>
      <Divider />
    </Fragment>
  );
}
