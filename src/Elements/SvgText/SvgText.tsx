import { formatText } from "../../helperfunctions/FormatText";
import { RectsProps } from "../SvgRect/SvgRect";
import "./SvgText.css";

type Props = {
  rects: RectsProps;
  label: string;
};

function SvgText({ rects, label }: Props) {
 
  return (
    <foreignObject
      x={rects.x}
      y={rects.y}
      width={rects.dx}
      height={rects.dy}
      fontFamily="Verdana"
      fill="white"
    >
      {rects.dx * rects.dy > 8000 && (
        <>
          <p className="rectangleChildText">{formatText(label)}</p>
          <hr className="divideLine"></hr>
          <div className="rectangleChildHead">
            {/* <span>{d.percentage.toFixed(2)}%</span> */}
          </div>
        </>
      )}
    </foreignObject>
  );
}

export default SvgText;
