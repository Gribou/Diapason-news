import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Badge,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Star, Email, Tune, Plus, ViewGrid, Home } from "mdi-material-ui";
import { ROUTES, BACKEND_ROUTES, ALL_SHORTCUT } from "routes";
import ShortcutIcon from "components/misc/ShortcutIcon";

export default function DrawerItem({
  route,
  title,
  icon,
  external,
  selected,
  sx = [],
  ...props
}) {
  return (
    <ListItem
      to={
        external
          ? undefined
          : { pathname: route?.path || route, search: route?.search }
      }
      href={external ? route : undefined}
      selected={selected}
      component={external ? Link : RouterLink}
      sx={[{ color: "text.primary" }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    >
      <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
      <ListItemText primary={title || route.title} />
    </ListItem>
  );
}

export function FavoriteItem({ count }) {
  const { pathname, search } = useLocation();
  return (
    <DrawerItem
      title="Favoris"
      icon={
        <Badge
          badgeContent={count}
          invisible={count === 0}
          color="warning"
          max={99}
        >
          <Star />
        </Badge>
      }
      route={ROUTES.favorites}
      selected={
        pathname === ROUTES.doc_list.path &&
        ROUTES.favorites.search === search.split("&page=")[0]
      }
    />
  );
}

export function UnreadItem({ count }) {
  const { pathname, search } = useLocation();
  return (
    <DrawerItem
      title="Non lus"
      selected={
        pathname === ROUTES.doc_list.path &&
        ROUTES.unread.search === search.split("&page=")[0]
      }
      route={ROUTES.unread}
      icon={
        <Badge
          badgeContent={count}
          invisible={count === 0}
          color="error"
          max={99}
        >
          <Email />
        </Badge>
      }
    />
  );
}

export function EditorItem() {
  const { pathname } = useLocation();
  return (
    <DrawerItem
      title="Ajouter publication"
      sx={{ color: "success.main" }}
      route={ROUTES.doc_create}
      selected={pathname === ROUTES.doc_create.path}
      icon={<Plus color="inherit" />}
    />
  );
}

export function AdminItem() {
  return (
    <DrawerItem
      route={BACKEND_ROUTES.admin}
      title="Administration"
      sx={{ color: "success.main" }}
      icon={<Tune color="inherit" />}
      external
    />
  );
}

export function PortalItem() {
  return (
    <DrawerItem
      route={BACKEND_ROUTES.portal}
      title="Portail"
      icon={<ViewGrid />}
      external
    />
  );
}

export function HomeItem() {
  const { pathname } = useLocation();
  return (
    <DrawerItem
      selected={pathname === ROUTES.home.path}
      route={ROUTES.home}
      title="Accueil"
      icon={<Home />}
    />
  );
}

export function AllItem() {
  const { pathname, search } = useLocation;
  return (
    <DrawerItem
      {...ALL_SHORTCUT}
      selected={
        pathname === ROUTES.doc_list.path && search.split("&page=")[0] === ""
      }
    />
  );
}

export function ShortcutItem({ query, icon, title }) {
  const { pathname, search } = useLocation;
  return (
    <DrawerItem
      selected={
        pathname === ROUTES.doc_list.path && query === search.split("&page=")[0]
      }
      route={{
        path: ROUTES.doc_list.path,
        search: query,
      }}
      icon={icon && <ShortcutIcon name={icon} />}
      title={title}
    />
  );
}
