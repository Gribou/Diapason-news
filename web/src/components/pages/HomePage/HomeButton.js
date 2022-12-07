import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button, Link } from "@mui/material";
import { Plus, Tune, Email, Star } from "mdi-material-ui";
import { BACKEND_ROUTES, ROUTES, ALL_SHORTCUT } from "routes";

export default function HomeButton({
  color,
  to,
  href,
  title,
  icon,
  sx = [],
  ...props
}) {
  return (
    <Button
      component={href ? Link : RouterLink}
      to={to}
      href={href}
      variant="outlined"
      color={color || "inherit"}
      startIcon={icon}
      fullWidth
      size="large"
      sx={[{ whiteSpace: "nowrap" }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
      is_private={undefined}
    >
      {title}
    </Button>
  );
}

export function UnreadButton({ count = 0 }) {
  return (
    <HomeButton
      to={ROUTES.unread.path}
      icon={<Email />}
      color="error"
      title={`${count} Non lus`}
    />
  );
}

export function FavoritesButton({ count = 0 }) {
  return (
    <HomeButton
      to={ROUTES.favorites.path}
      icon={<Star />}
      color="warning"
      title={`${count} Favoris`}
    />
  );
}

export function AllButton() {
  const { route, ...button } = ALL_SHORTCUT;
  return <HomeButton {...button} to={route.path} color="primary" />;
}

export function EditorButton() {
  return (
    <HomeButton
      to={ROUTES.doc_create.path}
      color="success"
      title={"Ajouter publication"}
      icon={<Plus />}
    />
  );
}

export function AdminButton() {
  return (
    <HomeButton
      color="success"
      href={BACKEND_ROUTES.admin}
      title="Administration"
      icon={<Tune />}
    />
  );
}
