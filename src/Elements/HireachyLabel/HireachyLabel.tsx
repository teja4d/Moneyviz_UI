import React from "react";
import { labelCategory, ReturnCategoryType } from "../../helperfunctions/ReturnCategory";
import "./HireachyLabel.css";
type Props = {
  path: ReturnCategoryType[];
  onclick: (x:labelCategory) => void;
};

function HireachyLabel({ path, onclick }: Props) {
//remove duplicate labels
    const unique = path.filter((thing, index, self) =>
        index === self.findIndex((t) => t.label === thing.label)
    );
  return (
    <div className="hireachy">
      <>
        {unique.map((x) => {
          return (
            <p
              key={x.label}
              className={x.clicked ? "bold" : ""}
              onClick={() => {
                onclick(x.label);
              }}
            >
              {x.label} <i className="fa-solid fa-angles-right"></i> &nbsp;
            </p>
          );
        })}
      </>
    </div>
  );
}

export default HireachyLabel;
