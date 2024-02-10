import React from "react";
import { GridLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex self-center justify-center mt-10 sm:mt-80">
      <GridLoader color="#ac7e60" size={20} />
    </div>
  );
};

export default Loader;
