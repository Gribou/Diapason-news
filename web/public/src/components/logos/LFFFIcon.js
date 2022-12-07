import React from "react";
import SvgIcon from "@mui/material/SvgIcon";
import { useTheme } from "@mui/material/styles";

export default function LFFFIcon({ baseColor, accentColor, ...props }) {
  const theme = useTheme();

  const baseStyle = {
    fill: baseColor || "#fff",
    strokeWidth: 0.32,
  };

  const accentStyle = {
    display: "inline",
    fill: accentColor || theme.palette.primary.main,
    stroke: "none",
    strokeWidth: 0.32,
  };

  return (
    <SvgIcon viewBox="0 0 191.67964 186.58902" {...props}>
      <g
        id="layer3"
        style={{ display: "inline" }}
        transform="translate(-62.919947,-1.4382287)"
      >
        <path
          style={baseStyle}
          d="m 125.11465,149.29436 -0.29172,-0.01 -5.43598,-3.27021 -5.43598,-3.2702 -4.18797,-6.72 -4.18796,-6.72001 -2.93605,-6.31652 -2.93606,-6.31653 v -0.60908 -0.60907 l 1.1128,-5.20053 1.1128,-5.20053 0.0872,-0.0634 0.0872,-0.0634 5.08943,-1.00657 5.08943,-1.00657 0.14638,-0.14638 0.14638,-0.14638 3.8236,-11.297524 3.82359,-11.297523 1.04943,-4.381462 1.04943,-4.381463 -1.64852,-1.628045 -1.64853,-1.628048 1.41292,-10.470492 1.41292,-10.47049 0.13693,-0.143494 0.13693,-0.143492 17.0526,3.276215 17.0526,3.276217 9.25724,-4.821667 9.25725,-4.821667 8.8,-4.336877 8.8,-4.33688 5.87552,-2.722656 5.87552,-2.722655 0.23675,0.268478 0.23675,0.268478 5.17528,15.960854 5.17528,15.960855 -3.80565,7.894409 -3.80565,7.89441 0.90693,9.226896 0.90692,9.226896 0.0912,0.08011 0.0912,0.08012 2.73976,0.829635 2.73977,0.829638 4.30023,3.713244 4.30024,3.71324 v 0.46072 0.46071 l -13.23345,18.07435 -13.23339,18.07414 h -4.10976 -4.10976 l -3.75447,-5.6 -3.75446,-5.6 h -21.64997 -21.64998 l -1.71362,4.24 -1.71362,4.24 -0.85107,1.92 -0.85107,1.92 -3.676,2.8 -3.67601,2.8 -0.29171,-0.01 z m -0.35282,-4.4954 0.25889,0.0252 2.46111,-1.88745 2.4611,-1.88745 2.72,-6.74656 2.72,-6.74656 23.85468,-0.006 23.85467,-0.006 3.91777,5.76001 3.91778,5.76 1.98755,-0.0122 1.98756,-0.0121 0.82388,-1.18786 0.82388,-1.18785 11.06737,-15.09882 11.06738,-15.09882 -2.94726,-2.55521 -2.94725,-2.55522 -3.53037,-1.03454 -3.53037,-1.034547 -1.10376,-11.130714 -1.10376,-11.130713 3.6007,-7.460714 3.6007,-7.46071 0.009,-0.444487 0.009,-0.444518 -4.33265,-13.23551 -4.33179,-13.235464 h -0.12097 -0.12096 l -4.74639,2.209568 -4.74638,2.209568 -6.72,3.314509 -6.72,3.314509 -10.98848,5.715472 -10.98848,5.715468 -15.89153,-3.045808 -15.89152,-3.045808 -0.0658,0.05878 -0.0659,0.05877 -1.02241,7.608567 -1.0224,7.608566 1.64825,1.668982 1.64825,1.668983 v 0.512393 0.512391 l -1.26219,5.241885 -1.2622,5.241884 -4.16181,12.273005 -4.16182,12.273003 -0.1008,0.10079 -0.10079,0.1008 -4.9552,1.02264 -4.95519,1.02265 -0.2075,0.32551 -0.2075,0.32552 -0.7008,3.56603 -0.7008,3.56603 2.84895,6.06767 2.84894,6.06767 3.75647,5.98987 3.75646,5.98985 3.90289,2.38494 3.90289,2.38494 0.2589,0.0252 z"
          id="path106"
        />
        <path
          style={accentStyle}
          d="m 101.58556,15.684191 c -1.9696,1.814016 -4.47456,4.844192 -6.9488,5.88224 -1.15296,0.483808 -2.43136,-0.357248 -3.6112,-0.351872 -1.75456,0.008 -3.42144,1.651072 -4.16,3.109632 5.37952,2.514528 6.52224,5.394176 9.28,10.24 l 3.28256,-3.520256 0.20192,-3.835072 6.75552,-6.084672 c 1.17024,4.278976 3.40384,10.027712 5.87616,13.71744 1.23776,1.84672 3.74272,1.16384 4.26176,-0.918656 1.39808,-5.60656 -4.42048,-12.01344 -3.34816,-17.598784 0.74624,-3.885952 12.33472,-8.412993 7.84096,-13.046916 -4.76288,-4.911709 -9.82656,6.927747 -13.99072,7.015811 -5.66624,0.119808 -11.2368,-6.9512 -16.96,-6.387664 -2.17088,0.213747 -3.20544,2.679408 -1.52704,4.167408 3.36544,2.983265 8.9072,5.878689 13.04704,7.611361 m 135.36001,21.44 c -1.23072,0.39232 -4.29472,1.5952 -4.1536,3.21376 0.23072,2.6464 3.50496,6.22432 4.71424,8.62624 3.28128,6.51648 6.20768,13.12864 8.21408,20.160003 8.65472,30.327996 0.0832,62.471356 -20.98912,85.759996 -25.5808,28.27136 -70.61665,36.98816 -104.90561,20.39744 -22.6544,-10.9616 -39.54144,-30.97312 -47.65472,-54.63744 -7.32128,-21.35392 -5.4656,-44.851196 3.9136,-65.279999 1.9664,-4.2832 4.15392,-8.53184 6.7312,-12.48 1.70048,-2.6048 4.07232,-5.1776 5.32992,-8 -0.97056,-0.73888 -2.48992,-2.683456 -3.8112,-2.54816 -1.02592,0.105056 -1.80672,1.487232 -2.3536,2.22816 -1.82592,2.47296 -3.45504,5.0464 -5.0352,7.68 -6.2784,10.46432 -10.5536,21.94784 -12.86304,33.920003 -6.11296,31.690556 6.0448,64.775996 28.86304,87.035196 31.26208,30.49632 82.22273,33.32512 118.40001,10.02336 15.52448,-9.99936 27.80992,-25.07104 35.06336,-42.01856 9.26976,-21.65952 10.30496,-45.800316 2.85184,-68.159999 -3.09664,-9.28928 -8.21888,-17.1568 -12.3152,-25.92"
          id="path309"
        />
      </g>
    </SvgIcon>
  );
}