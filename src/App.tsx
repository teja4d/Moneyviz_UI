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
import Displaybox from "./components/Displaybox";
import LineGraph from "./components/linegraph";
import RectangleBox from "./components/Rectangle";
import RangeSelector from "./Elements/Slider";

type ReactSelectOption = {
  value: string;
  label: string;
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
  const[mvgData,setMvgData]=React.useState<avgData[]>();
  const[mvgAvg,setMvgAvg]=React.useState<boolean>(false);
  const [buttonClicked, setButtonClicked] = React.useState<boolean>(false);
  const [show, setShow] = useState(false);
  const [showCustomdate, setShowCustomdate] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const[range,setRange]=useState<number>(0);
  const [summary, setSummary] = useState<summary>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<boolean>(false);
  const [years, setYears] = React.useState<ReactSelectOption[] | undefined>([
    { value: "", label: "All Years" },
    { value: "2015", label: "2015" },
    { value: "2016", label: "2016" },
    { value: "2017", label: "2017" },
    { value: "2018", label: "2018" },
    { value: "2019", label: "2019" },
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
  ]);
  const handleSubmit = useCallback(async () => {
    if (selectedFile !== null) {
      setShow(false);
      const formData = new FormData();
      formData.append("file", selectedFile);
      await fetch("http://127.0.0.1:4000/upload/csv", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data: apiData[]) => {
          //date format conversion

          setApiData(data);
          //if date is null in the api response,called the api again with the date range
          // setButtonClicked(true);
        })
        //call summary api
        .then(async () => {
          await fetch(`http://127.0.0.1:5000/getsummary/date`)
            .then((response) => response.json())
            .then((data) => {
              setSummary(data);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMsg(true);
        }
        );
    }
  }, [selectedFile]);

  useEffect(() => {
    handleSubmit();
    //call handle sumbit again

  }, [selectedFile, handleSubmit,refresh]);

  const handleFileSelect = (event: any) => {
    event.preventDefault();
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
   const getMovingAvg=async()=>{
      await fetch(`http://127.0.0.1:5000/getsummary/movingaverage?start_date=${fromDate?.toString()||null}&end_date=${toDate?.toString()||null}&moving_average=${range}`)
        .then((response) => response.json())
        .then((data) => {
          setApiData(data);
          //console.log(data);
        });
    };
   if(apiData && mvgAvg){
    getMovingAvg();
   }
  }, [fromDate, mvgAvg, range, toDate]);


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
       await fetch(
        "https://moneyviz.azurewebsites.net/getsummary/date",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setApiData(data);
        })
        .then(async () => {
          
          await fetch(`http://127.0.0.1:5000/getsummary/date?start_date=${fromDate}&end_date=${toDate}`)
            .then((response) => response.json())
            .then((data) => {
              setSummary(data);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMsg(true);
        }
        );
    }

  }, [fromDate, toDate, selectedYear]);

  useEffect(() => {
    fetchDataonChange();
  }, [fetchDataonChange, fromDate, toDate, buttonClicked, selectedYear,refresh]);

  return (
    <div className="App mainPage">
      <h2 id="text" className="mt-2">
        Money
        <i
          className="fa-solid fa-sack-dollar"
          style={{ color: "lightgreen" }}
        ></i>
        Viz
      </h2>
      <hr style={{ color: "white" }}></hr>
      <Container className="my-3 d-flex d-flex justify-content-between">
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
          </Modal.Body>
        </Modal>
      </Container>
      <hr></hr>
     {errorMsg &&
      <div className="d-flex justify-content-center">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Something went wrong! Please try later</h4>
            </div>
      </div>}
      {apiData && (
        <Container className="d-flex mb-4 justify-content-between">
          <div className="d-flex">
          <Displaybox
            icon="fa-coins"
            title="Avg. balance"
            text={summary?.average_balance || 0}
            theme="blueShadow"
          ></Displaybox>
          <Displaybox
            icon="fa-money-bill-transfer"
            title="Avg. credit"
            text={summary?.average_credit || 0}
            theme="greenShadow"
          ></Displaybox>
          <Displaybox
            icon="fa-money-bill-transfer"
            title="Avg. debit"
            text={summary?.average_debit || 0}
            theme="redShadow"
          ></Displaybox>
          </div>

          <div className="d-flex justify-content-center align-items-center">
            {!mvgAvg &&
            <Button
              variant="outline-success"
              className="btn btn-outline-success"
              onClick={() => setMvgAvg(true)}
            >Moving average</Button>}
            {mvgAvg && 
            <RangeSelector setRange={setRange}></RangeSelector>}
          </div>
        </Container>
      )}
      <RectangleBox></RectangleBox>
      {apiData && !errorMsg ? (

        <div>
          
        </div>
        // <LineGraph
        //   setButtonClicked={setButtonClicked}
        //   apiData={apiData}
        //   selectedYear={selectedYear}
        //   fromDate={fromDate}
        //   toDate={toDate}
        //   setFromDate={setFromDate}
        //   setToDate={setToDate}
        //   buttonClicked={buttonClicked}
        //   setShowcustomdate={setShowCustomdate}
        //   setRefresh={setRefresh}
        //   refresh={refresh}
        // ></LineGraph>
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
      {/* {apiData && <BarChart apiData={apiData}></BarChart>} */}
    </div>
  );
}

export default App;
