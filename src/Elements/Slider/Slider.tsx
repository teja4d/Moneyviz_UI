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
  const [sliderValue, setSliderValue] = React.useState<number>(50);
  const [reactSelectValue, setReactSelectValue] =
    React.useState<ReactSelectOptions|null>({value:"Days",label:"Days"});
  const [maxRange, setMaxRange] = React.useState<string>();
  const [ReactSelectOptions, setReactSelectOptions] = React.useState<
    ReactSelectOptions[]
  >([
    { value: "Months", label: "Months" },
    { value: "Days", label: "Days" },
  ]);

  useEffect(() => {
    if (reactSelectValue?.value === "Months") {
      setMaxRange("24");
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
            min="2"
            max={maxRange}
            className="slider"
            id="myRange"
            style={{ width: "260px" }}
            onChange={(e) => {
              if (reactSelectValue?.value === "Months") {
                setSliderValue(parseInt(e.target.value) * 30);
              }else if (reactSelectValue?.value === "Days") {
                setSliderValue(120-parseInt(e.target.value));
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
