import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import HireachyLabel from "../Elements/HireachyLabel/HireachyLabel";
import Hoverbox from "../Elements/Hoverbox/Hoverbox";
import SvgRect from "../Elements/SvgRect/SvgRect";
import SvgText from "../Elements/SvgText/SvgText";
import {
  labelCategory,
  ReturnCategory,
  ReturnCategoryType,
} from "../helperfunctions/ReturnCategory";
import "./TreemapComponent.css";

type currentStateProps = {
  parent_type: string;
  child_type: string | undefined;
};

function RectangleBox() {
  const [blockPickerColor, setBlockPickerColor] = useState("#37d67a");
  const [parent, setParent] = React.useState<any>();
  const [list, setList] = React.useState<any>();
  const [labelName, setLabelName] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentState, setCurrentState] = React.useState<currentStateProps>({
    parent_type: "expense",
    child_type: "",
  });
  const [category, setCategory] = React.useState<string>();
  const expenseRef = React.useRef<boolean>(true);
  const [path, setPath] = React.useState<ReturnCategoryType[]>([
    {
      label: "Incoming/Outgoing",
      parent: "expense",
      child: "",
    },
  ]);
  useEffect(() => {
    const fetchparent = async () => {
      setLoading(true);
      const result = await fetch(
        //http://127.0.0.1:4000
        //https://moneyviz.azurewebsites.net/getsummary/category/summary/date?child_type=expense&parent_type=expense&expense_type=credit
        `http://127.0.0.1:4000/getsummary/category/summary/date?child_type=${currentState?.child_type}&parent_type=${currentState?.parent_type}&expense_type=${category}`
      );
      const parent = await result.json();
      setParent(parent);
      setLoading(false);
    };
    fetchparent();
  }, [category, currentState]);

  useEffect(() => {
    parent &&
      setPath((prev) => {
        //change clicked to false for all
        const newPrev = prev.map((a) => {
          return { ...a, clicked: false };
        });
        return [
          ...newPrev,
          ReturnCategory(
            parent[0].category,
            currentState.child_type || "",
            true
          ),
        ];
      });
    //update the category
    parent && setCategory(parent[0].type);
  }, [currentState.child_type, parent]);

  const handleLabelClick = (x: labelCategory) => {
    if (path.length > 1) {
      //set label clicked to true in path and set all other to false
      setPath((prev) => {
        return prev.map((a) => {
          if (a.label === x) {
            return { ...a, clicked: true };
          } else {
            return { ...a, clicked: false };
          }
        });
      });
      setCurrentState((prev) => {
        return {
          ...prev,
          parent_type: path.find((a) => a.label === x)?.parent || "",
          child_type: path.find((a) => a.label === x)?.child,
        };
      });
    }
  };

  const showWhitebox = (event: any) => {
    event.preventDefault();
    const whitebox = document.getElementById("whitebox");
    if (whitebox) {
      whitebox.style.display = "block";
      //get x and y of mouse
      const x = event.clientX + 20;
      const y = event.clientY + 20;

      whitebox.style.left = x + "px";
      whitebox.style.top = y + "px";
      if (x + whitebox.offsetWidth > window.innerWidth) {
        whitebox.style.left = x - whitebox.offsetWidth + "px";
      }
      //if whitebox is out of screen move it to the top
      if (y + whitebox.offsetHeight > window.innerHeight) {
        whitebox.style.top = y - whitebox.offsetHeight + "px";
      }
    }
  };
  const rectangles = useMemo(() => {
    const handleRectangleClick = async (e: any, c: any) => {
      if (expenseRef.current) {
        if (c.credit_amount === 0) {
          setCategory("debit");
        } else {
          setCategory("credit");
        }
        expenseRef.current = false;
      }
      setCurrentState({
        ...currentState,
        parent_type: c.category,
        child_type: c.label,
      });
    };

    if (parent) {
      return (
        <>
          {parent?.map((d: any, i: any) => {
            const { rects } = d;
            return (
              <g
                key={i}
                transform="translate(0,0)"
                onClick={(e) => {
                  handleRectangleClick(e, d);
                }}
                className="rectangleContainer"
                onMouseMove={showWhitebox}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  document.getElementById("whitebox")!.style.display = "none";
                }}
                onMouseOver={() => {
                  setList(d.recent_transaction.reverse());
                  setLabelName(d.label);
                }}
              >
                {d.rects_children &&
                  d.rects_children.map((childRecData: any, index: number) => {
                    const { rects: childRect } = childRecData;
                    return (
                      <SvgRect
                        color={blockPickerColor}
                        category={category}
                        rects={childRect}
                        key={index}
                        fillColor={true}
                      ></SvgRect>
                    );
                  })}
                <SvgRect
                  color={blockPickerColor}
                  category={category}
                  rects={rects}
                  key={i}
                  fillColor={!d.rects_children}
                ></SvgRect>
                <SvgText rects={rects} label={d.label}></SvgText>
              </g>
            );
          })}
        </>
      );
    }
  }, [blockPickerColor, category, currentState, parent]);
  return (
    <>
      <Container className="w-100 mb-4">
        <div className="rectagleBackdrop">
          <div>
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
            <h3 className="text-center treeMapTitle">Transaction category </h3>{" "}
            {!loading && (
              <div className="titleHeader" style={{maxWidth:'1240px'}}>
                
                <div className="d-flex justify-content-between">
                <HireachyLabel
                    path={path}
                    onclick={handleLabelClick}
                  ></HireachyLabel>
                  <div style={{ float: "right" }}>
                    <p className="text-white mx-4">Selected color:</p>
                    <input
                      type="color"
                      value={blockPickerColor}
                      onChange={(color) => {
                        setBlockPickerColor(color.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {!loading && (
            <svg width="1200" height="600">
              {rectangles}
            </svg>
          )}
          {list && !loading && (
            <Hoverbox labelName={labelName} listData={list} />
          )}
        </div>
      </Container>
    </>
  );
}

export default RectangleBox;
