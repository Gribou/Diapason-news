import React from "react";
import SvgIcon from "@mui/material/SvgIcon";
import { useTheme } from "@mui/material/styles";

export default function DiapasonIcon({ baseColor, accentColor, ...props }) {
  const theme = useTheme();

  const baseStyle = {
    fill: baseColor || "#fff",
  };

  const accentStyle = {
    fill: accentColor || theme.palette.primary.main,
  };

  return (
    <SvgIcon viewBox="0 0 32 32" {...props}>
      <g>
        <path
          style={baseStyle}
          d="M19,4c-0.6,0-1,0.4-1,1v10c0,1.1-0.9,2-2,2s-2-0.9-2-2V5c0-0.6-0.4-1-1-1s-1,0.4-1,1v10c0,1.9,1.3,3.4,3,3.9v7.4   c-0.6,0.3-1,1-1,1.7c0,1.1,0.9,2,2,2s2-0.9,2-2c0-0.7-0.4-1.4-1-1.7v-7.4c1.7-0.4,3-2,3-3.9V5C20,4.4,19.6,4,19,4z"
        />
        <path
          style={accentStyle}
          d="M23,7c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1s1-0.4,1-1V8C24,7.4,23.6,7,23,7z"
        />
        <path
          style={accentStyle}
          d="M27,4c-0.6,0-1,0.4-1,1v10c0,0.6,0.4,1,1,1s1-0.4,1-1V5C28,4.4,27.6,4,27,4z"
        />
        <path
          style={accentStyle}
          d="M9,7C8.4,7,8,7.4,8,8v4c0,0.6,0.4,1,1,1s1-0.4,1-1V8C10,7.4,9.6,7,9,7z"
        />
        <path
          style={accentStyle}
          d="M5,4C4.4,4,4,4.4,4,5v10c0,0.6,0.4,1,1,1s1-0.4,1-1V5C6,4.4,5.6,4,5,4z"
        />
      </g>
    </SvgIcon>
  );
}
