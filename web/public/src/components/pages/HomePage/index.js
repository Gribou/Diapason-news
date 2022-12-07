import React, { Fragment } from "react";
import { Container, Grid, Divider, Stack } from "@mui/material";
import { ROUTES } from "routes";
import { useAuthenticated, useMe } from "features/auth/hooks";
import { useMenuItems, useSafety } from "features/config/hooks";
import ShortcutIcon from "components/misc/ShortcutIcon";
import { ExternalLinkBox, InternalLinkBox } from "components/misc/HostBox";
import HeroContent from "./HeroContent";
import HomeButton, {
  FavoritesButton,
  UnreadButton,
  AllButton,
  AdminButton,
  EditorButton,
} from "./HomeButton";

export default function HomePage() {
  const is_authenticated = useAuthenticated();
  const { is_safe } = useSafety();
  const { favorite_count, unread_count, is_staff, can_edit_doc } = useMe();
  const items = useMenuItems();

  return (
    <Stack
      sx={{
        flexGrow: 1,
        overflow: "auto",
      }}
    >
      <HeroContent is_safe={is_safe} is_authenticated={is_authenticated} />
      <Divider />
      {(is_safe || is_authenticated) && (
        <Container sx={{ py: { xs: 2, md: 4 } }} maxWidth="md">
          <Grid
            container
            justifyContent="space-evenly"
            spacing={2}
            sx={{ mb: 2 }}
          >
            {is_authenticated && (
              <Fragment>
                <Grid item xs>
                  <UnreadButton count={unread_count} />
                </Grid>
                <Grid item xs>
                  <FavoritesButton count={favorite_count} />
                </Grid>
              </Fragment>
            )}
            <Grid item xs>
              <AllButton />
            </Grid>
          </Grid>
          <Grid container justifyContent="space-evenly" spacing={2}>
            {items?.map(({ title, icon, query }) => (
              <Grid item key={title} xs>
                <HomeButton
                  to={{
                    pathname: ROUTES.doc_list.path,
                    search: query,
                  }}
                  icon={icon && <ShortcutIcon name={icon} />}
                  title={title}
                />
              </Grid>
            ))}
          </Grid>
          {(can_edit_doc || is_staff) && (
            <Grid
              container
              justifyContent="space-evenly"
              spacing={2}
              sx={{ mt: 4 }}
            >
              {can_edit_doc && (
                <Grid item xs>
                  <EditorButton />
                </Grid>
              )}
              {is_staff && (
                <Grid item xs>
                  <AdminButton />
                </Grid>
              )}
            </Grid>
          )}
        </Container>
      )}

      {is_safe ? <ExternalLinkBox /> : <InternalLinkBox />}
    </Stack>
  );
}
