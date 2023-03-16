import React, { useEffect, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import SvgRect from "../../Elements/SvgRect/SvgRect";
import "./TreemapComponent.css";
type Props = {};

const DisplayCategory = (props: Props) => {
  const [category, setCategory] = React.useState<any[]>();
  const [loading,setLoading] = React.useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      const result = await fetch(
        "http://localhost:5000/getsummary/category/transaction?parent_type=sub_category"
      );
      const category = await result.json();
      setCategory(category);
      setLoading(false);
    };
    fetchCategory();
  }, []);

  const rectangles = useMemo(() => {
    if (category) {
      return category.map((item) => (
        <g
        className="rectangleContainer"
        >
          <SvgRect
            rects={item.rects}
            fillColor={true}
            category={undefined}
            color={"red"}          />
          <foreignObject
            x={item.rects.x}
            y={item.rects.y}
            width={item.rects.dx}
            height={item.rects.dy}
            fontFamily="Verdana"
            fill="white"
          >
            {item.rects.dx * item.rects.dy > 8000 &&
            <>
              <p className="rectangleChildText">{item.label.toUpperCase()}</p>
              <hr className="divideLine"></hr>
              <div className="rectangleChildHead">
                <p>{item.percentage.toFixed(2)}%</p>
              </div>
            </>}
          </foreignObject>
        </g>
      ));
    }
    return null;
  }, [category]);

  return (
    <div className="w-100">
     {loading && (
              <div className=" d-flex justify-content-center pt-1">
                <Spinner
                  typeof="grow"
                  animation="border"
                  variant="success"
                  className=""
                ></Spinner>
              </div>
            )}
      {!loading &&
      <svg width="1200" height="600">
        {rectangles}
      </svg>}
      
    </div>
  );
};

export default DisplayCategory;
