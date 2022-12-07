import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import { IconButton, InputBase, InputAdornment, Box } from "@mui/material";
import { Magnify, Close } from "mdi-material-ui";
import { useSearchParams, createSearchParams } from "features/router";
import { ROUTES } from "routes";

export default function SearchField({ sx = [], ...props }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [keyword, setKeyword] = useState(params.search || "");

  useEffect(() => {
    //update field value when location changes (ex : filters are cleared)
    setKeyword(params.search || "");
  }, [params.search]);

  const handleBlur = () => {
    setKeyword((v) => v.trim() || "");
  };

  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  const clear = () => {
    handleSearchRequest("");
  };

  const handleKeyUp = (e) => {
    if (e.charCode === 13 || e.key === "Enter") {
      handleSearchRequest(keyword);
    } else if (e.charCode === 27 || e.key === "Escape") {
      clear();
    }
  };

  const handleSearchRequest = (keyword) => {
    setKeyword(keyword);
    navigate({
      pathname: ROUTES.doc_list.path,
      search: createSearchParams({ ...params, search: keyword }).toString(),
    });
  };

  return (
    <Box
      sx={[
        {
          position: "relative",
          borderRadius: 1,
          bgcolor: (theme) => alpha(theme.palette.common.white, 0.15),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.common.white, 0.25),
          },
          width: { xs: "100%", sm: "auto" },
          ml: { xs: 0, md: 3 },
          mr: { xs: 2, sm: 4 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <InputBase
        placeholder="Recherche…"
        sx={{
          color: "inherit",
          "& .MuiInputBase-input": {
            p: 1,
            pl: (theme) => `calc(1em + ${theme.spacing(4)})`,
            transition: (theme) => theme.transitions.create("width"),
            width: { xs: "100%", sm: "12ch" },
            "&:focus": {
              width: { sm: "20ch" },
            },
          },
        }}
        inputProps={{ "aria-label": "search" }}
        onBlur={handleBlur}
        onChange={handleInput}
        onKeyUp={handleKeyUp}
        value={keyword || ""}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={clear} size="small" disabled={!keyword}>
              <Close sx={{ opacity: !keyword ? 0 : 1 }} />
            </IconButton>
            <IconButton
              onClick={() => handleSearchRequest(keyword)}
              size="small"
            >
              <Magnify />
            </IconButton>
          </InputAdornment>
        }
      />
    </Box>
  );
}
