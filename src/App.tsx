import React, { useCallback, useEffect, useState } from "react";

import {
  Button,
  Container,
  Form,
  InputGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import ReactSelect from "react-select";
import "./App.css";
import Displaybox from "./Elements/Displaybox/Displaybox";
import DisplayCategory from "./components/Treemap/DisplayCategory";
import LineGraph from "./components/Linegraph/linegraph"; 
import TreemapComponent from "./components/Treemap/TreemapComponent";
import RangeSelector from "./Elements/Slider/Slider";
import { options, years } from "./FieldNames/Homepage";

export type ReactSelectOption = {
  value: string|number;
  label: string|number;
};

export type apiData = {
  average_balance: number;
  credit_amount: number;
  debit_amount: number;
  transaction_date: Date;
  transaction_id: string;
  day_of_week: string;
};

export type avgData = {
  average_balance: number;
  transaction_date: Date;
};

export type summary = {
  max_balance: number;
  min_balance: number;
  average_balance: number;
  average_credit: number;
  average_debit: number;
  max_average_balance_date: string;
  min_average_balance_date: string;
};

function App() {
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [fromDate, setFromDate] = React.useState<Date | string>();
  const [toDate, setToDate] = React.useState<Date | string>();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [apiData, setApiData] = React.useState<apiData[]>();
  const [mvgAvg, setMvgAvg] = React.useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = React.useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [showCustomdate, setShowCustomdate] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [range, setRange] = useState<number>(0);
  const [summary, setSummary] = useState<summary>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<number>();
  
  const handleSubmit = useCallback(async () => {
    if (selectedFile !== null) {
      setShow(false);
      const formData = new FormData();
      formData.append("file", selectedFile);
      await fetch("http://localhost:5000/upload/csv", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data: apiData[]) => {
          setApiData(data);
        })
        //call summary api
        .then(async () => {
          await fetch(`http://localhost:5000/getsummary/date`)
            .then((response) => response.json())
            .then((data) => {
              setSummary(data);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMsg(true);
        });
    }
  }, [selectedFile]);

  useEffect(() => {
    handleSubmit();
  }, [selectedFile, handleSubmit, refresh]);

  const handleFileSelect = (event: any) => {
    event.preventDefault();
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    const getMovingAvg = async () => {
      await fetch(
        `http://localhost:5000/getsummary/movingaverage?start_date=${
          fromDate?.toString() || null
        }&end_date=${toDate?.toString() || null}&moving_average=${range}`
      )
        .then((response) => response.json())
        .then((data) => {
          setApiData(data);
          //console.log(data);
        });
    };
    if (apiData && mvgAvg) {
      getMovingAvg();
    }
  }, [apiData, fromDate, mvgAvg, range, toDate]);

  //fetch data on year change
  const fetchDataonChange = useCallback(async () => {
    if ((fromDate && toDate) || selectedYear) {
      setShowCustomdate(false);
      const formData = new FormData();
      if (fromDate && toDate) {
        formData.append("start_date", fromDate.toString());
        formData.append("end_date", toDate.toString());
      }
      if (selectedYear) {
        formData.append("start_date", selectedYear + "-01-01");
        formData.append("end_date", selectedYear + "-12-31");
      }
      await fetch("http://localhost:5000/getsummary/date", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setApiData(data);
        })
        .then(async () => {
          await fetch(
            `http://localhost:5000/getsummary/date?start_date=${fromDate}&end_date=${toDate}`
          )
            .then((response) => response.json())
            .then((data) => {
              setSummary(data);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMsg(true);
        });
    }
  }, [fromDate, toDate, selectedYear]);

  useEffect(() => {
    fetchDataonChange();
  }, [
    fetchDataonChange,
    fromDate,
    toDate,
    buttonClicked,
    selectedYear,
    refresh,
  ]);

  return (
    <div className="App mainPage">
      <h2 id="text" className="mt-2">
        M
        <i
          className="fa-solid fa-sack-dollar"
          style={{
            color: "lightgreen",
            fontSize: "30px",
            verticalAlign: "middle",
          }}
        ></i>
        ney Viz
      </h2>
      <hr style={{ color: "white" }}></hr>
      <Container className="d-flex justify-content">
        {/* <TidyTree data={data}></TidyTree> */}
        {/* //add react dilog box */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Upload CSV</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <InputGroup className="mb-3">
                <Form.Control
                  type="file"
                  onChange={(event) => {
                    handleFileSelect(event);
                    handleSubmit();
                  }}
                />
              </InputGroup>
            </Form>
          </Modal.Body>
        </Modal>
        <Button onClick={handleShow} variant="success">
          <i className="fa-solid fa-upload"></i>
          {"  "} Upload file
        </Button>
       {apiData &&
        <div className="px-2">
          <ReactSelect
          placeholder="Select data categorization"
            onChange={(value) => setSelectedType(value?.value || 0)}
            value={options.find((x) => x.value === selectedType)}
            options={options}
          ></ReactSelect>
        </div>}
        <Modal
          show={showCustomdate}
          onHide={() => setShowCustomdate(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Choose custom date range</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Form.Text id="basic-addon1">From</Form.Text>
              <Form.Control
                type="date"
                defaultValue="2010-12-03"
                value={fromDate?.toString()}
                onChange={(e: any) => {
                  setFromDate(e.target.value);
                  setSelectedYear("");
                }}
              />
              <Form.Text id="basic-addon1">To</Form.Text>
              <Form.Control
                type="date"
                defaultValue="2023-12-03"
                value={toDate?.toString()}
                onChange={(e: any) => {
                  setToDate(e.target.value);
                  setSelectedYear("");
                }}
              />
              <Form.Text id="basic-addon1">Select year</Form.Text>
              <div>
                <ReactSelect
                  onChange={(option) => {
                    setSelectedYear(option?.value || "");
                    setFromDate(undefined);
                    setToDate(undefined);
                  }}
                  options={years}
                  placeholder="Choose Year"
                  value={years?.find((x) => x.value === selectedYear)}
                ></ReactSelect>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
      <hr></hr>
      {errorMsg && (
        <div className="d-flex justify-content-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">
              Something went wrong! Please try later
            </h4>
          </div>
        </div>
      )}
      {selectedType === 0 && apiData && (
        <Container className="d-flex mb-4 justify-content-between">
          <div className="d-flex">
            <Displaybox
              icon="fa-coins"
              title="Avg. balance"
              text={+(summary?.average_balance.toFixed(2) || 0)}
              theme="blueShadow"
            ></Displaybox>
            <Displaybox
              icon="fa-money-bill-transfer"
              title="Avg. credit"
              text={+(summary?.average_credit.toFixed(2) || 0)}
              theme="greenShadow"
            ></Displaybox>
            <Displaybox
              icon="fa-money-bill-transfer"
              title="Avg. debit"
              text={+(summary?.average_debit.toFixed(2) || 0)}
              theme="redShadow"
            ></Displaybox>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            {!mvgAvg && (
              <Button
                variant="outline-success"
                className="btn btn-outline-success"
                onClick={() => setMvgAvg(true)}
              >
                Moving average
              </Button>
            )}
            {mvgAvg && <RangeSelector setRange={setRange}></RangeSelector>}
          </div>
        </Container>
      )}
      {selectedType === 0 && (
        <>
          {apiData && !errorMsg ? (
            <div>
              <LineGraph
                setButtonClicked={setButtonClicked}
                apiData={apiData}
                selectedYear={selectedYear}
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                buttonClicked={buttonClicked}
                setShowcustomdate={setShowCustomdate}
                setRefresh={setRefresh}
                refresh={refresh}
              ></LineGraph>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              {selectedFile && !errorMsg && (
                <>
                  <Spinner
                    animation="border"
                    variant="success"
                    title="Summarizing your data"
                  />
                </>
              )}
            </div>
          )}
        </>
      )}
      {selectedType === 1 && <>
      <TreemapComponent></TreemapComponent>
      </>}
      {selectedType === 2 && <>
      <DisplayCategory></DisplayCategory> 
      </>}
      {/* {apiData && <BarChart apiData={apiData}></BarChart>} */}
     
    </div>
  );
}

export default App;
