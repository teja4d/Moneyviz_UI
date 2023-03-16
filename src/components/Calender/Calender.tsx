import React, { ReactElement, useEffect, useState } from "react";
import "./Calender.css";
import {
  Card,
  Container,
  ListGroup,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import { formatText } from "../../helperfunctions/FormatText";
import ReactSelect from "react-select";
import { ReactSelectOption } from "../../App";
import { returnMonth } from "../../helperfunctions/Daterange";

type Props = {
  type: "credit" | "debit";
  description: string;
};
type TimeLine = {
  transaction_date: string;
  amount: number;
  transaction_type: string;
  transaction_description: string;
  debit_amount: number;
  credit_amount: number;
  balance: number;
  id: number;
  date: number;
  month: number;
  year: number;
  first_transaction_date: string;
  last_transaction_date: string;
  payment_cycle: "monthly" | "irregular";
};

export type GroupedItemData = {
  transaction_date: string;
  amount: number;
  transaction_type: string;
  transaction_description: string;
  debit_amount: number;
  credit_amount: number;
  balance: number;
  id: number;
  date: number;
  month: number;
  year: number;
  first_transaction_date: string;
  last_transaction_date: string;
  payment_cycle: string;
};

export type GroupedData = {
  year: number;
  months: GroupedMonths[];
};

export type GroupedMonths = {
  month: number;
  data: GroupedItemData[];
};

function Calender({ type, description }: Props) {
  const [timeLine, setTimeLine] = useState<TimeLine[]>();
  const [currentView, setCurrentView] = useState<TimeLine>();
  const [options, setOptions] = useState<ReactSelectOption[]>();
  const [select, setSelect] = useState<ReactSelectOption>();
  const [groupedData, setGroupeddata] = useState<GroupedData>();

  useEffect(() => {
    if (type) {
      (async () => {
        try {
          await fetch(`http://localhost:5000/getfrequency?type=${type}`)
            .then((res) => res.json())
            .then((data: TimeLine[]) => {
              setTimeLine(data);
            });
        } catch (err) {
          console.log(err);
        }
      })();
    }
    //cancel if other request is made
    return () => {
      setTimeLine(undefined);
    };
  }, [type]);

  useEffect(() => {
    if (timeLine) {
      setCurrentView(
        timeLine.find((x) => x.transaction_description === description)
      );
      setOptions(
        timeLine
          .filter((x) => x.transaction_description === description)
          .map((x) => x.year)
          .filter((item, index, self) => self.indexOf(item) === index)
          .map((x) => {
            return { value: x, label: x };
          })
      );
    }
  }, [description, timeLine]);

  useEffect(() => {
    const groupTimeLine = () => {
      //group timeLine based on year and with same transaction_description
      if (timeLine) {
        const grouped = timeLine
          ?.filter((x) => x.transaction_description === description)
          .reduce((prev: any, curr: any) => {
            if (!prev[curr.year]) {
              prev[curr.year] = [];
            }
            prev[curr.year].push(curr);
            return prev;
          }, {});

        const groupedByMonth = Object.keys(grouped).map((x) => {
          return {
            year: +x,
            month: grouped[x].reduce((prev: any, curr: any) => {
              if (!prev[curr.month]) {
                prev[curr.month] = [];
              }
              prev[curr.month].push(curr);
              return prev;
            }, {}),
          };
        });
        //group now by month return as array of obj
        return groupedByMonth
          .map((x) => {
            return {
              year: x.year,
              months: Object.keys(x.month).map((y) => {
                return {
                  month: +y,
                  data: [...x.month[y]] as GroupedItemData[],
                };
              }),
            };
          })
          .find((x) => x.year === select?.value) as GroupedData;
      }
      return;
    };
    setGroupeddata(groupTimeLine());
  }, [description, select?.value, timeLine]);

  useEffect(() => {
    options && setSelect(options[0]);
  }, [options]);

  return (
    <Container style={{maxWidth:"1200px"}}>
      {timeLine && groupedData && (
        <>
          {timeLine && options && (
            <>
              <div className="d-flex justify-content-between">
                <div>
                  <div className="select mt-4">
                    <ReactSelect
                      options={options}
                      onChange={(value) => setSelect(value || undefined)}
                      value={options.find((x) => x.value === select?.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <Card
                      style={{ width: "18rem", height: "94%" }}
                      className="m-3"
                    >
                      <Card.Header className="text-center">
                        {formatText(description)}
                      </Card.Header>
                      <Card.Body>
                        <ListGroup className="text-start">
                          <ListGroup.Item>
                            Payment type:&nbsp;
                            <b>{currentView?.payment_cycle}</b>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Total amount :&nbsp;
                            <b>
                              {" "}
                              {timeLine
                                .filter(
                                  (x) =>
                                    x.transaction_description === description
                                )
                                ?.reduce((prev, curr) => prev + curr.amount, 0)
                                .toFixed(2)}
                            </b>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            First payment:&nbsp;
                            <b> {currentView?.first_transaction_date}</b>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Last payment: &nbsp;
                            <b>{currentView?.last_transaction_date}</b>
                          </ListGroup.Item>
                          <ListGroup.Item>
                          Transaction Frequency:&nbsp;
                            <b>{currentView?.transaction_type}</b>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
                <Container className="d-flex justify-content-cente flex-wrap m-2">
                  <>
                    <span style={{ width: "90px" }}>
                      <p className="text-white mx-4 text-center"></p>
                    </span>
                    {Array(31)
                      .fill(0)
                      .map((_, j) => (
                        <div className="mb-2 border border-0" key={j}>
                          <div className="chunksDate">
                            <span className="text-white">{j + 1}</span>
                          </div>
                        </div>
                      ))}
                    {Array(12)
                      .fill(0)
                      .map((_, j) => (
                        <>
                          {groupedData &&
                            groupedData.months.length > 0 &&
                            groupedData.months?.map(
                              (y: GroupedMonths, i: number) => (
                                <>
                                  <>
                                    {y.month === j + 1 && (
                                      <div
                                        className="d-flex justify-content-between bottomLine"
                                        key={j}
                                      >
                                        <span
                                          className="text-end text-white px-2"
                                          style={{ width: "90px" }}
                                        >
                                          {returnMonth(y.month)}
                                        </span>

                                        {y.month === j + 1 && (
                                          <CalenderBlock data={y.data} />
                                        )}
                                      </div>
                                    )}
                                  </>
                                </>
                              )
                            )}
                          {
                            <>
                              {groupedData?.months.findIndex(
                                (x) => x.month === j + 1
                              ) === -1 && (
                                <div className="d-flex justify-content-between bottomLine">
                                  <span
                                    className="text-white text-end px-2"
                                    style={{ width: "90px" }}
                                  >
                                    {returnMonth(j + 1)}
                                  </span>
                                  {Array(31)
                                    .fill(0)
                                    .map((_, j) => (
                                      <div className=" border border-0" key={j}>
                                        <div className="chunks chunksFailue"></div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </>
                            ///comment
                          }
                        </>
                      ))}
                  </>
                </Container>
              </div>
            </>
          )}
        </>
      )}
      {!timeLine && (
        <div className=" d-flex justify-content-center mt-5">
          <Spinner
            typeof="grow"
            animation="border"
            variant="success"
            className=""
          ></Spinner>
        </div>
      )}
    </Container>
  );
}
export default Calender;

function TooltipMsg({
  children,
  date,
  data,
}: {
  children: ReactElement;
  date: number;
  data?: GroupedItemData[];
}) {
  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {data
        ?.filter((x) => x.date === date)
        .map((x,i) => (
          <div className="d-flex text-start" key={i}>
            <div>
              <p className="text-white text-start">Amount: {x.amount}</p>
              <br></br>
              <p className="text-white text-start">
                Category: {x.payment_cycle}
              </p>
            </div>
            <span className="bottomLines"></span>
          </div>
        ))}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 120, hide: 200 }}
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  );
}

const CalenderBlock = ({ data }: { data: GroupedItemData[] | undefined }) => {
  const BlockMemo = ({ itemData }: { itemData: GroupedItemData }) => (
    <>
      <div className="position-absolute">
        <TooltipMsg date={itemData.date} data={data}>
          <div className="border border-0">
            <div
              className={
                itemData.payment_cycle === "monthly"
                  ? "chunks chunksSuccess"
                  : "chunks chunksWarning"
              }
            >
              <p className="text-white mb-1 calenderText">
                {itemData &&
                data &&
                data?.filter((x) => x.date === itemData?.date).length > 1
                  ? data?.filter((x) => x.date === itemData.date).length
                  : ""}
              </p>
            </div>
          </div>
        </TooltipMsg>
      </div>
    </>
  );
  return (
    <>
      {Array(31)
        .fill(0)
        .map((_, j) => (
          <div key={j}>
            <>
              {data &&
                data.map(
                  (x: GroupedItemData, i: any) =>
                    x.date === j + 1 && <BlockMemo key={i} itemData={x} />
                )}
              {
                <div className="border border-0">
                  <div className="chunks">
                    <span className="text-white"></span>
                  </div>
                </div>
              }
            </>
          </div>
        ))}
    </>
  );
};
