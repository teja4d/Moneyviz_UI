import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { apiData } from "../../App";
import { Button, Container, InputGroup } from "react-bootstrap";
import { formatDate } from "../../helperfunctions/Daterange";

type LinegraphProps = {
  apiData: apiData[];
  selectedYear?: string;
  fromDate?: Date | string;
  toDate?: Date | string;
  setFromDate: React.Dispatch<React.SetStateAction<Date | string | undefined>>;
  setToDate: React.Dispatch<React.SetStateAction<Date | string | undefined>>;
  setButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  buttonClicked: boolean;
  setShowcustomdate: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
};

const LineGraph = ({
  apiData,
  fromDate,
  toDate,
  selectedYear,
  setFromDate,
  setToDate,
  setButtonClicked,
  buttonClicked,
  setShowcustomdate,
  setRefresh,
  refresh,
}: LinegraphProps) => {
  let parseTime = d3.timeParse("%-d/%-m/%Y");
  const [dataSet, setDataSet] = React.useState<any[] | undefined>(undefined);
  const [maxValue, setMaxValue] = React.useState(undefined);
  const [minValue, setMinValue] = React.useState(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const svgRef = React.useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      if (containerRef.current.clientWidth > 720) {
        setWidth(containerRef.current.clientWidth * 0.75);
      }
      setWidth(containerRef.current.clientWidth);
      setHeight(
        containerRef.current.clientHeight < 200
          ? 300
          : containerRef.current.clientHeight
      );
    }
  }, []);

  useEffect(() => {
    if (apiData) {
      let newDataSet: any[] = [...apiData];
      newDataSet.forEach((d) => {
        d["transaction_date"] = parseTime(d["transaction_date"]);
        //wait for the data to be parsed

      });
      //console.log(newDataSet);
      setDataSet(newDataSet);
    }
  }, [apiData]);

  useEffect(() => {
    if (dataSet) {
      setMaxValue(d3.max(dataSet, (d: any) => d["closing_balance"]));
      setMinValue(d3.min(dataSet, (d: any) => d["closing_balance"]));
      //console.log(maxValue, minValue);
    }
  }, [dataSet]);

useEffect(() => {
     // svg.selectAll("*").remove();
      if (apiData && dataSet && maxValue && minValue && dataSet.length > 0 && svgRef.current !== null) {
        let svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        let margin = { top: 10, right: 10, bottom: 10, left: 10 };       
        let x = d3
          .scaleTime()
          .domain(
            d3.extent(dataSet, (d: any) => d["transaction_date"]) as [
              Date,
              Date
            ]
          )
          .range([0, width - margin.left - margin.right]);
          //console.log(dataSet);
          
        let y = d3
          .scaleLinear()
          .domain([0, maxValue])
          .range([height, 0])
          .nice();
        let line = d3
          .line()
          .curve(d3.curveMonotoneX)
          .x((d: any) => x(d["transaction_date"]))
          .y((d: any) => y(d["closing_balance"]));

        let line1 = d3
          .line()
          .x((d: any) => x(d["transaction_date"]))
          .y((d: any) => y(d["average_balance"]));

        svg
          .append("path")
          .datum(dataSet)
          .attr("fill", "none")
          .attr("stroke", "lightgreen")
          //add transition to line
          .attr("stroke-width", 2)
          .attr("stroke-width", 1.5)
          .attr("d", line);

        svg
          .append("path")
          .datum(dataSet.filter((d: any) => d["average_balance"] > 0))
          .attr("fill", "none")
          .attr("stroke", "red")
          //add transition to line
          .attr("stroke-width", 2)
          .attr("d", line1);

       // svg.append("g").call(d3.axisLeft(y));
        
        svg
          .append("path")
          .datum(dataSet)
          .attr("fill", "lightgreen")
          .attr("opacity", 0.1)
          .attr("stroke", "lightgreen")
          .attr("stroke-width", 1.5)
          .attr(
            "d",
            d3
              .area()
              .x((d: any) => x(d["transaction_date"]))
              //y0 to be dynamic
              .y0(y(0))
              .y1((d: any) => y(d["closing_balance"]))
          );
        //add heading to the graph
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", margin.top - 100 / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "20px")
          .style("text-decoration", "underline")
          .text("Average Balance over time")
          //text color
          .style("fill", "white");

        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          //change color of axis
          .attr("stroke", "white")
          .attr("stroke-width", 0.2)
          .attr("color", "white")
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

        svg
          .append("g")
          .call(d3.axisLeft(y))
          //change color of axis
          .attr("stroke", "white")
          .attr("stroke-width", 0.2)
          .attr("color", "white")
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Average_balance")
          .attr("fill", "white");
        //add horizontal grid lines
        svg
          .append("g")
          .attr("class", "grid")
          .call(
            d3
              .axisLeft(y)
              .tickSize(-width + 25)
              .tickFormat((d: any) => "")
            //change color of grid lines
          )
          .attr("stroke", "white")
          .attr("stroke-width", 0.5)
          .attr("color", "white")
          //x-axis width
          //remove top horizontal grid line
          .select(".domain")
          .remove();

        svg.selectAll(".grid line").attr("stroke-dasharray", "2,2");
        //scale the x axis to the width of the svg
        svg
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );
          //call x axis

        //increase x-axis and y-axis line width
        svg.selectAll(".domain").attr("stroke-width", 1.5)
        let bisect = d3.bisector((d: any) => d["transaction_date"]).left;
        let focus = svg.append("g").attr("class", "focus");
        focus
          .append("circle")
          .attr("display", "none")
          .attr("fill", "green")
          .attr("r", 5.5)
          //outline circle
          .attr("stroke", "white")
          .attr("stroke-width", 0.5)
          .attr("color", "white")
          .attr("fill", "white")
          .attr("font-size", "20px")
          .attr("font-family", "sans-serif");
        // Three function that change the tooltip when user hover / move / leave a cell
        svg
          .append("rect")
          .attr("class", "overlay")
          .attr("fill", "transparent")
          .attr("width", width- margin.left - margin.right)
          .attr("height", height)
          .on("mouseover", () => {
            focus.style("display", null);
            //change cursor to crosshair
            svg.style("cursor", "crosshair");
          })
          .on("mouseout", () => {
            focus.style("display", "none");
            //change cursor to default
            svg.style("cursor", "default");
          })
          .on("mousemove", () => {
            // eslint-disable-next-line no-restricted-globals
            let x0 = x.invert(d3.pointer(event)[0]) as any;
            let i = bisect(dataSet, x0, 1);
            let d0 = dataSet[i - 1];
            let d1 = dataSet[i];
            let d =
              (x0 as any) - x(d0["transaction_date"]) >
              x(d1["transaction_date"]) - x0
                ? d1
                : d0;
            focus.attr(
              "transform",
              "translate(" +
                x(d["transaction_date"]) +
                "," +
                y(d["closing_balance"]) +
                ")"
            );
            focus
              //rect for tooltip
              .append("rect")
              //assign id to rect
              .attr("id", "tooltip")
              .attr("x", 0)
              .attr("y", -5)
              .attr("width", 100)
              .attr("height", 58)
              //color the text
              .attr("fill", "white")
              .style("opacity", 0.1)
              .attr("stroke", "#120f07")
              .attr("stroke-width", 0.5)
              .attr("rx", 5)
              .attr("ry", 5)
              .attr("transform", "translate(0,-58)");
            //remove text if it already exists
            focus.selectAll("text").remove();
            focus
              .append("text")
              .attr("id", "tooltip-text")
              .attr("x", 0)
              .attr("y", -20)
              //add title
              .attr("transform", "translate(10,-28)")
              //text anchor set to start
              //add text in multiple lines using tspan
              .append("tspan")
              .attr("text-anchor", "start")
              .style("font-size", "8px")
              .text(
                "Date: " + new Date(d["transaction_date"]).toLocaleDateString()
              )
              .append("tspan")
              .attr("x", 0)
              .attr("dy", "1.5em")
              .text("Balance: £" + d["closing_balance"])
              .append("tspan")
              .attr("x", 0)
              .attr("dy", "1.5em")
              .text("Credit: £" + d["credit_amount"])
              .append("tspan")
              .attr("x", 0)
              .attr("dy", "1.5em")
              .text("Debit: £" + d["debit_amount"]);
            focus.select("circle").attr("display", null);
            //scrollable x-axis graph
            //reload graph on mousemove
          });
      }
    },
    [dataSet, maxValue, selectedYear, fromDate, toDate, apiData, width, height, refresh, minValue]
  );

  return (
    <>
      <Container className="">
        {apiData &&  (
          <>
            <Container>
              <InputGroup className="mb-3 d-flex justify-content-end">
                {/*refresh button with icon*/}
                <Button
                  variant="outline-secondary"
                  className="mr-2"
                  onClick={() => {
                    setRefresh(!refresh);
                  }}
                >
                  <i className="fas fa-sync-alt"></i>
                </Button>
                <Button
                size="sm"
                variant="outline-success"
                className="btn btn-outline-success"
                onClick={() => {setShowcustomdate(true)}}
                >
                  Choose date
                </Button>
                <Button
                  size="sm"
                  variant="outline-success"
                  className="btn btn-outline-success"
                  onClick={() => {
                    setFromDate(
                      formatDate(
                        new Date(new Date().setDate(new Date().getDate() - 7))
                      )
                    );
                    setToDate(formatDate(new Date()));
                    setButtonClicked(!buttonClicked);
                  }}
                >
                  7d
                </Button>
                {/* //add clickable buttons last 30 days */}
                <Button
                  size="sm"
                  variant="outline-success"
                  className="btn btn-outline-success"
                  onClick={() => {
                    setFromDate(
                      formatDate(
                        new Date(new Date().setDate(new Date().getDate() - 30))
                      )
                    );
                    setToDate(formatDate(new Date()));
                    setButtonClicked(!buttonClicked);
                  }}
                >
                  30d
                </Button>
                {/* //add clickable buttons last 1 year */}
                <Button
                  size="sm"
                  variant="outline-success"
                  className="btn btn-outline-success"
                  onClick={() => {
                    setFromDate(
                      formatDate(
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 1)
                        )
                      )
                    );
                    setToDate(formatDate(new Date()));
                    setButtonClicked(!buttonClicked);
                  }}
                >
                  1y
                </Button>
              </InputGroup>
            </Container>
          </>
        )}
        <div className="d-flex justify-content-center">
        {apiData && apiData.length === 0 && (
          <div className="d-flex justify-content-center">
            <div className="alert alert-danger" role="alert">
              No transactions found,Please change the date range or check the
              document uploaded
            </div>
          </div>
        )}
          {apiData && apiData.length > 0 && (
            <Container ref={containerRef}>
              <svg ref={svgRef} style={{overflow:"visible"}}/>
            </Container>
          )}
        </div>
      </Container>
    </>
  );
};

export default LineGraph;
