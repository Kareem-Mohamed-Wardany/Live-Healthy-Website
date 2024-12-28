import React from "react";

//Styles

const CircleProg = ({ phase }) => {
  const circle = "w-[7px] h-[7px] rounded-full mr-[3px] bg-white";
  const circleActive = "w-[7px] h-[7px] rounded-full mr-[3px] bg-[#f19895]";
  return (
    <div className="flex justify-center">
      {Array.from({ length: 2 }, (_, index) => index + 1).map((id) => (
        <div
          key={id}
          id={id}
          className={phase === id ? circleActive : circle}
        ></div>
      ))}
    </div>
  );
};

export default CircleProg;
