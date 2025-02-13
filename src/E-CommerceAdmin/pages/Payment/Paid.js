/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";

const Paid = () => {
  const navigate = useNavigate();
  return (
    <div className="MainPage">
      <p style={{ fontSize: "2rem" }}> Payment Successful </p>
      <button onClick={() => navigate("/another")}>Appointments</button>
    </div>
  );
};

export default Paid;
