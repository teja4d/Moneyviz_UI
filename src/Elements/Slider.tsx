import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import ReactSelect from "react-select";
import "./Slider.css";
type ReactSelectOptions = {
  value: string;
  label: string;
};

type SliderProps={
    setRange: (range: number) => void;
}

function RangeSelector({setRange}:SliderProps) {
  const [sliderValue, setSliderValue] = React.useState<number>(0);
  const [reactSelectValue, setReactSelectValue] =
    React.useState<ReactSelectOptions|null>({value:"Days",label:"Days"});
  const [maxRange, setMaxRange] = React.useState<string>();
  const [ReactSelectOptions, setReactSelectOptions] = React.useState<
    ReactSelectOptions[]
  >([
    { value: "Months", label: "Months" },
    { value: "Years", label: "Years" },
    { value: "Days", label: "Days" },
  ]);

  useEffect(() => {
    if (reactSelectValue?.value === "Months") {
      setMaxRange("24");
    } else if (reactSelectValue?.value === "Years") {
      setMaxRange("10");
    } else if (reactSelectValue?.value === "Days") {
      setMaxRange("120");
    }
  }, [reactSelectValue]);

  useEffect(() => {
    setRange(sliderValue);
    }, [setRange, sliderValue]);


  return (
    <>
      <Form>
        <ReactSelect
         value={reactSelectValue}
          options={ReactSelectOptions}
          onChange={(e) => setReactSelectValue(e)}
        ></ReactSelect>
        <hr></hr>
          <input
            type="range"
            min="1"
            max={maxRange}
            className="slider"
            id="myRange"
            style={{ width: "260px" }}
            onChange={(e) => {
              if (reactSelectValue?.value === "Months") {
                setSliderValue(parseInt(e.target.value) * 30);
              } else if (reactSelectValue?.value === "Years") {
                setSliderValue(parseInt(e.target.value) * 365);
              } else if (reactSelectValue?.value === "Days") {
                setSliderValue(parseInt(e.target.value));
              }
            }}
          />
          {/*Show the value of the slider in tooltip*/}
          <span className="tooltiptext" id="myTooltip">
            {sliderValue}
          </span>
      </Form>
    </>
  );
}

export default RangeSelector;
