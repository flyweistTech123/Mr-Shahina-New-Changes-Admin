/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DateInMMDDYY } from "../../../Helper/Helper";
import HOC from "../../layout/HOC";

const ServiceOrderId = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const token = localStorage.getItem("AdminToken");

  const getOrder = async () => {
    try {
      const response = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/viewserviceOrder/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  function ValueChecker(holder, string) {
    return holder ? (
      <div className="Desc-Container">
        <p className="title"> {string} </p>
        <p className="desc"> {holder} </p>
      </div>
    ) : (
      ""
    );
  }

  const Coupon = () => {
    if (data?.coupon?.type === "Birthday") {
      return (
        <div className="Desc-Container">
          <p className="title"> Coupon Reward ({data?.coupon?.title}) </p>
          <p className="desc">{data?.coupon?.addOnservicesId?.name}</p>
        </div>
      );
    } else {
      return (
        <div className="Desc-Container">
          <p className="title"> Coupon Saving ({data?.coupon?.type})</p>
          <p className="desc"> ${data?.coupon?.discount}</p>
        </div>
      );
    }
  };

  return (
    <>
      <section className="sectionCont">
        <p className="headP">Dashboard / {data?.orderId}</p>

        {ValueChecker(data?.orderId, "Order Id")}
        {ValueChecker(data?.time, "Time")}
        {ValueChecker(data?.total, "Total Amount")}
        {ValueChecker(data?.subTotal, "Sub Total Amount")}
        {ValueChecker(data?.memberShip, "Membership Amount")}
        {ValueChecker(data?.offerDiscount, "Offer Discount")}
        {ValueChecker(data?.grandTotal, "Grand Total Amount")}
        {ValueChecker(data?.user?.firstName, "User First Name")}
        {ValueChecker(data?.user?.lastName, "User Last Name")}
        {ValueChecker(data?.user?.phone, "User Contact Detail")}
        {ValueChecker(data?.user?.email, "User Email Address")}

        {data?.serviceAddresss?.appartment && (
          <div className="Desc-Container">
            <p className="title"> Service Address </p>
            <p className="desc">{data?.serviceAddresss?.appartment} </p>
          </div>
        )}

        {data?.services?.map((i, index) => (
          <div className="Desc-Container" key={index}>
            <p className="title"> Service Details </p>
            <p className="desc">Title : {i.serviceId?.name}</p>
            <p className="desc"> Quantity : {i?.quantity}</p>
            <p className="desc"> MRP : {i?.serviceId?.price}</p>
            <p className="desc">
              {" "}
              Discount Price : {i?.serviceId?.discountPrice}
            </p>
            <p className="desc">
              {" "}
              Discount Status :{" "}
              {i?.serviceId?.discountActive === true ? "Active" : "Not Active"}
            </p>
          </div>
        ))}
        {data?.AddOnservicesSchema?.map((i, index) => (
          <div className="Desc-Container" key={index}>
            <p className="title"> Ad On Service Details </p>
            <p className="desc">Title : {i.addOnservicesId?.name}</p>
            <p className="desc"> Quantity : {i?.quantity}</p>
            <p className="desc"> MRP : {i?.addOnservicesId?.price}</p>
            <p className="desc"> Time : {i?.addOnservicesId?.time}</p>
          </div>
        ))}

        <Coupon />

        {ValueChecker(data?.orderStatus, "Order Status")}
        {ValueChecker(data?.paymentStatus, "Payment Status")}
        {ValueChecker(data?.serviceStatus, "Service Status")}
        {ValueChecker(DateInMMDDYY(data?.date), "Appointment date")}
      </section>
    </>
  );
};

export default HOC(ServiceOrderId);
