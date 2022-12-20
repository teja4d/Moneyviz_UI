import React from "react";
import { lightenRgbColor } from "../../helperfunctions/LightenRgbColor";
import "./SvgRect.css";

type Props = {
  rects: RectsProps;
  fillColor: boolean;
  category:string|undefined;
  color:string;
};
export type RectsProps = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
};

const SvgRect = ({ rects, fillColor , category ,color }: Props) => {
  console.log(color,lightenRgbColor(color,50))
  return (
    <>
      <rect
        data-testid="parent-rect"
        className={fillColor ? "rectangleItemContainer":"rectHover" }
        x={rects.x}
        y={rects.y}
        width={rects.dx - 0.5}
        height={rects.dy - 0.5}
      ></rect>
      <linearGradient id="gradient" gradientUnits="userSpaceOnUse">
        <stop stopColor={color} offset="0%" />
        <stop stopColor={lightenRgbColor(color,90)} offset="100%" />
      </linearGradient>
    </>
  );
};
export default SvgRect;
  