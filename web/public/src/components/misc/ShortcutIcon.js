import { createElement } from "react";
import {} from "react-error-boundary";
import * as icons from "mdi-material-ui";

//Do not use lazy loading : bundle size increases way too much !
//The icon choice is limited in database so load only those

const CHOICES = {
  AlertCircleOutline: icons.AlertCircleOutline,
  PlusBoxOutline: icons.PlusBoxOutline,
  PoundBoxOutline: icons.PoundBoxOutline,
  StarBoxOutline: icons.StarBoxOutline,
  HeartBoxOutline: icons.HeartBoxOutline,
  MinusBoxOutline: icons.MinusBoxOutline,
  MusicBoxOutline: icons.MusicBoxOutline,
  CircleBoxOutline: icons.CircleBoxOutline,
  CloseBoxOutline: icons.CloseBoxOutline,
  ChartBoxOutline: icons.ChartBoxOutline,
  AlertBoxOutline: icons.AlertBoxOutline,
  AccountBoxOutline: icons.AccountBoxOutline,
  CheckBoxOutline: icons.CheckboxOutline,
  Numeric0BoxOutline: icons.Numeric0BoxOutline,
  Numeric1BoxOutline: icons.Numeric1BoxOutline,
  Numeric2BoxOutline: icons.Numeric2BoxOutline,
  Numeric3BoxOutline: icons.Numeric3BoxOutline,
  Numeric4BoxOutline: icons.Numeric4BoxOutline,
  Numeric5BoxOutline: icons.Numeric5BoxOutline,
  Numeric6BoxOutline: icons.Numeric6BoxOutline,
  Numeric7BoxOutline: icons.Numeric7BoxOutline,
  Numeric8BoxOutline: icons.Numeric8BoxOutline,
  Numeric9BoxOutline: icons.Numeric9BoxOutline,
  Numeric10BoxOutline: icons.Numeric10BoxOutline,
  AlphaAboxOutline: icons.AlphaABoxOutline,
  AlphaBboxOutline: icons.AlphaBBoxOutline,
  AlphaCboxOutline: icons.AlphaCBoxOutline,
  AlphaDboxOutline: icons.AlphaDBoxOutline,
  AlphaEboxOutline: icons.AlphaEBoxOutline,
  AlphaFboxOutline: icons.AlphaFBoxOutline,
  AlphaGboxOutline: icons.AlphaGBoxOutline,
  AlphaHboxOutline: icons.AlphaHBoxOutline,
  AlphaIboxOutline: icons.AlphaIBoxOutline,
  AlphaJboxOutline: icons.AlphaJBoxOutline,
  AlphaKboxOutline: icons.AlphaKBoxOutline,
  AlphaLboxOutline: icons.AlphaLBoxOutline,
  AlphaMboxOutline: icons.AlphaMBoxOutline,
  AlphaNboxOutline: icons.AlphaNBoxOutline,
  AlphaOboxOutline: icons.AlphaOBoxOutline,
  AlphaPboxOutline: icons.AlphaPBoxOutline,
  AlphaQboxOutline: icons.AlphaQBoxOutline,
  AlphaRboxOutline: icons.AlphaRBoxOutline,
  AlphaSboxOutline: icons.AlphaSBoxOutline,
  AlphaTboxOutline: icons.AlphaTBoxOutline,
  AlphaUboxOutline: icons.AlphaUBoxOutline,
  AlphaVboxOutline: icons.AlphaVBoxOutline,
  AlphaWboxOutline: icons.AlphaWBoxOutline,
  AlphaXboxOutline: icons.AlphaXBoxOutline,
  AlphaYboxOutline: icons.AlphaYBoxOutline,
  AlphaZboxOutline: icons.AlphaZBoxOutline,
};

export default function ShortcutIcon({ name }) {
  return createElement(CHOICES[name]);
}
