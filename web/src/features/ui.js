import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

export function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      const matches = useMediaQuery((theme) => theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || "xs"
  );
}

export function useDialog() {
  const [isOpen, setOpen] = useState(false);

  const open = () => setOpen(true);

  const close = () => setOpen(false);

  return { isOpen, open, close };
}

export function useMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = () => Boolean(anchorEl);
  const open = (event) => setAnchorEl(event.currentTarget);
  const close = () => setAnchorEl(null);
  return { isOpen, anchor: anchorEl, open, close };
}

export function useTab(default_tab) {
  const [tab, setTab] = useState(default_tab);

  const onChange = (e, new_tab) => setTab(new_tab);

  return { tab, onChange };
}

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
