/** @format */
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullScreenLoader from "../../../Component/FullScreenLoader";
import { postApi } from "../../../Respo/Api";

const Approved = () => {
  const { orderId, amount } = useParams();
  const updatedAmount = amount?.split("=")?.[1];
  const navigate = useNavigate();
  const payload = {
    paymentMethod: "online",
    splitPayment: "Yes",
    splitPaymentAmount: updatedAmount,
  };

  const additionalFunctions = [() => navigate("/paid")];

  useEffect(() => {
    postApi({
      url: `api/v1/admin/chargeCustomer/${orderId}`,
      payload,
      additionalFunctions,
    });
  }, [orderId, navigate]);

  return (
    <div className="MainPage">
      <FullScreenLoader />
      <p>Approving payment !</p>
    </div>
  );
};

export default Approved;
