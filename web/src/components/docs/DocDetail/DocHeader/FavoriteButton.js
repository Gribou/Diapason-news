import React from "react";
import { IconButton } from "@mui/material";
import { Star, StarOutline } from "mdi-material-ui";
import { useMarkDocAsFavoriteMutation } from "features/docs/hooks";

export default function FavoriteButton({ doc, ...props }) {
  const [markDocAsFavorite] = useMarkDocAsFavoriteMutation();

  const handleOnStarClick = () =>
    markDocAsFavorite({ pk: doc.pk, favorite: !doc.is_favorite });

  return (
    <IconButton {...props} sx={{ mr: 1 }} onClick={handleOnStarClick}>
      {doc.is_favorite ? <Star /> : <StarOutline />}
    </IconButton>
  );
}
