import React, { useMemo } from "react";
import { useEffect } from "react";
import { Badge, Container, Spinner, Table } from "react-bootstrap";
import { ReturnCategory } from "../helperfunctions/ReturnCategory";
import "./Rectangle.css";

type Props = {
  //parent: any;
};
type ListProps = {
  listData: any[];
  labelName: string;
};
type currentStateProps = {
  parent_type: string;
  child_type: string | undefined;
};

function RectangleBox() {
  const [parent, setParent] = React.useState<any>();
  const [list, setList] = React.useState<any>();
  const [labelName, setLabelName] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentState, setCurrentState] = React.useState<currentStateProps>({
    parent_type: "",
    child_type: "expense",
  });
  const [category, setCategory] = React.useState<string>();
  const expenseRef = React.useRef<boolean>(true);
  const [path, setPath] = React.useState<string[]>(["Transactions"]);

  useEffect(() => {
    const fetchparent = async () => {
      setLoading(true);
      const result = await fetch(
        //http://127.0.0.1:4000
        //https://moneyviz.azurewebsites.net/getsummary/category/summary/date?child_type=expense&parent_type=expense&expense_type=credit
        `https://moneyviz.azurewebsites.net/getsummary/category/summary/date?child_type=${currentState?.parent_type}&parent_type=${currentState?.child_type}&expense_type=${category}`
      );
      const parent = await result.json();
      setParent(parent);
      setLoading(false);
    };
    fetchparent();
  }, [category, currentState]);

  useEffect(() => {
    setPath((prev) => {
      if (
        parent &&
        ReturnCategory(parent[0].category) !== prev[prev.length - 1]
      ) {
        return [...prev, ReturnCategory(parent[0].category)];
      }
      return prev;
    });
  }, [parent]);
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
        parent_type: c.label,
        child_type: c.category,
      });
    };

    if (parent) {
      return (
        <>
          {parent?.map((d: any, i: any) => {
            const { rects, rects_children } = d;
            return (
              <g
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
                <rect
                  data-testid="parent-rect"
                  className="rectangleItemContainer"
                  key={i}
                  x={rects.x}
                  y={rects.y}
                  width={rects.dx}
                  height={rects.dy}
                  //generate random color
                  fill={`rgb(${Math.floor(Math.random() * 255)},${Math.floor(
                    Math.random() * 255
                  )},${Math.floor(Math.random() * 255)})`}
                  //rx="5"
                ></rect>

                {rects_children &&
                  rects_children.map((childRecData: any, index: number) => {
                    const { rects: childRect } = childRecData;
                    return (
                      <rect
                        data-testid="child-rect"
                        className="rectangleChildItemContainer"
                        key={index}
                        x={childRect.x}
                        y={childRect.y}
                        width={childRect.dx}
                        height={childRect.dy}
                        //generate random color
                        fill={childRect.color}
                      ></rect>
                    );
                  })}
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
                      <p className="rectangleChildText">
                        {d.label
                          .toString()
                          .split("_")
                          .map(
                            (s: string) =>
                              s.charAt(0).toUpperCase() + s.substring(1)
                          )
                          .join(" ")}
                      </p>
                      <hr className="divideLine"></hr>
                      <div className="rectangleChildHead">
                        {/* <span>{d.percentage.toFixed(2)}%</span> */}
                      </div>
                    </>
                  )}
                </foreignObject>
              </g>
            );
          })}
        </>
      );
    }
  }, [currentState, parent]);
  return (
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
          {!loading && (
            <div className="titleHeader">
              <div className="pt-3">
                <h3 className="text-center treeMapTitle">
                  Transaction category{" "}
                </h3>{" "}
                <div className="hireachy">
                  <>
                    {path.map((x) => {
                      return (
                        //if x is last element make it bold
                        <p
                          className={x === path[path.length - 1] ? "bold" : ""}
                        >
                          {x} <i className="fa-solid fa-angles-right"></i>{" "}
                          &nbsp;
                        </p>
                      );
                    })}
                  </>
                </div>
              </div>
              {/* {pathDirectory.split("/").map((d, i) => {
                return (
                  <>
                    <Badge
                      className="ml-2"
                      bg={`${
                        i % 2 === 0
                          ? "success"
                          : i % 3 === 0
                          ? "warning"
                          : "danger"
                      }`}
                      style={{ fontSize: "1rem" }}
                    >
                      {d}
                    </Badge>
                  </>
                );
              })} */}
            </div>
          )}
        </div>
        {!loading && (
          <div>
            <svg width="1200" height="600">
              {rectangles}
            </svg>
          </div>
        )}

        <div className="whiteBox" id="whitebox">
          {list && !loading && (
            <RectangleList labelName={labelName} listData={list} />
          )}
        </div>
      </div>
    </Container>
  );
}

function RectangleList({ listData, labelName}: ListProps) {
  return (
    <>
      <div className="font-bold">
        {labelName
          .toString()
          .split("_")
          .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ")}
      </div>

      <Table className="p-4">
        <thead>
          <tr>
            <th colSpan={10} className="bg-info tableHead">
              Recent Transactions
            </th>
          </tr>
          <tr>
            <th className="title">Date</th>
            <th className="title">Amount</th>
            <th className="title">Balance</th>
          </tr>
        </thead>

        <tbody>
          {listData?.map((d: any, i: any) => (
            <tr key={i}>
              <td>
                <Badge bg="primary" className="mr-2">
                  {d.transaction_date}
                </Badge>
              </td>
              <td className={"amount" + d.type}>
                {"£" + (d.credit_amount + d.debit_amount).toFixed(2)}
              </td>

              <td className="balanceAmount">{"£" + d.balance}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default RectangleBox;
