import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "constants/config";

const initialState = { open: false };

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    openDrawer(state) {
      state.open = true;
    },
    closeDrawer(state) {
      state.open = false;
    },
    toggleDrawer(state) {
      state.open = !state.open;
    },
  },
});

export const { openDrawer, closeDrawer, toggleDrawer } = drawerSlice.actions;

export default drawerSlice.reducer;

export const useDrawerOpen = () =>
  useSelector((state) => !!state?.drawer?.open);

export const useDrawer = () => {
  const open = useDrawerOpen();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  return {
    open,
    width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
    permanent: mdUp,
    mini: mdUp && !open,
    full: mdUp && open,
  };
};
