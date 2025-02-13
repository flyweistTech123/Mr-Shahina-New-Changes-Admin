/** @format */

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullScreenLoader from "../../../Component/FullScreenLoader";
import { postApi } from "../../../Respo/Api";

const ApprovedManualCard = () => {
  const { orderId, amount } = useParams();
  const navigate = useNavigate();
  const additionalFunctions = [() => navigate("/paid")];
  const updatedAmount = amount?.split("=")?.[1];

  useEffect(() => {
    postApi({
      url: `api/v1/admin/manualChargeThroughCardSuccess/${orderId}`,
      payload: {
        cardAmount: updatedAmount,
      },
      additionalFunctions,
    });
  }, [orderId, navigate, updatedAmount]);

  return (
    <div className="MainPage">
      <FullScreenLoader />
      <p>Approving payment !</p>
    </div>
  );
};

export default ApprovedManualCard;
