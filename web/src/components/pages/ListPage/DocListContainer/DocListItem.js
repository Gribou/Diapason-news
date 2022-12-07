import React from "react";
import { alpha } from "@mui/material/styles";
import {
  ListItem,
  ListItemIcon,
  IconButton,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { StarOutline, Star } from "mdi-material-ui";
import { DocStatusIndicator } from "components/docs/DocStatusIndicator";
import { useAuthenticated } from "features/auth/hooks";
import { useMarkDocAsFavoriteMutation } from "features/docs/hooks";
import { LIST_ITEM_MIN_WIDTH, LIST_ITEM_MIN_WIDTH_SM } from "constants/config";

export default function DocListItem({
  doc = {},
  selected,
  autoFocus,
  ...props
}) {
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const is_authenticated = useAuthenticated();
  const [markDocAsFavorite] = useMarkDocAsFavoriteMutation();

  const handleOnStarClick = () =>
    markDocAsFavorite({ pk: doc.pk, favorite: !doc.is_favorite });

  const showUnread = () => is_authenticated && doc.is_read === false;

  return (
    <ListItem
      selected={selected}
      divider
      sx={{
        minWidth: { xs: LIST_ITEM_MIN_WIDTH_SM, md: LIST_ITEM_MIN_WIDTH },
        ...(showUnread()
          ? {
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
              "&:hover": {
                bgcolor: "background.paper",
                //Reset on touch devices, it doesn't add specificity
                "@media (hover: none)": {
                  bgcolor: () => "transparent",
                },
              },
              "&.Mui-selected": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3),
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.primary.light, 0.3),
                  // Reset on touch devices, it doesn't add specificity
                  "@media (hover: none)": {
                    bgcolor: () => "transparent",
                  },
                },
              },
            }
          : {}),
      }}
      alignItems="flex-start"
      button
      autoFocus={autoFocus}
    >
      {is_authenticated && !mdDown && (
        <ListItemIcon sx={{ mt: 0 }}>
          <IconButton edge="start" onClick={handleOnStarClick} tabIndex={-1}>
            {doc.is_favorite ? <Star /> : <StarOutline />}
          </IconButton>
        </ListItemIcon>
        //button should be unfocusable
      )}
      <ListItemText
        primary={doc.reference}
        secondary={doc.title}
        primaryTypographyProps={{
          sx: {
            fontWeight: showUnread() && 800,
            color: "common.white",
          },
        }}
        secondaryTypographyProps={{
          noWrap: mdDown,
          sx: { fontWeight: showUnread() && 800 },
        }}
        {...props}
      />
      <DocStatusIndicator doc={doc} mini={mdDown} />
    </ListItem>
  );
}
