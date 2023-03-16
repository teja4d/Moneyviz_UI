import React from "react";
import "./HireachyLabel.css";
import { ReturnCategoryType, labelCategory } from "../../helperfunctions/ReturnCategory";


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
    <div className="hireachy bg-primary px-2 py-1 my-2">
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
