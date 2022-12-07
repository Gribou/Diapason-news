import { useLogo } from "features/config/hooks";
import { LFFF_LOGO, DEFAULT_LOGO } from "constants/api";
import LFFFIcon from "./LFFFIcon";
import DiapasonIcon from "./DiapasonIcon";

export default function useAppIcon() {
  const logo = useLogo();
  switch (logo) {
    case LFFF_LOGO:
      return LFFFIcon;
    case DEFAULT_LOGO:
    default:
      return DiapasonIcon;
  }
}
