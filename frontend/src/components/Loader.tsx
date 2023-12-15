import React from "react";
import { CircularProgress, Backdrop } from "@mui/material";

const Loader = () => {
  return (
    <Backdrop open={true} style={{ zIndex: 9999 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loader;
