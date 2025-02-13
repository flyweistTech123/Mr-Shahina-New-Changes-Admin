/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Table } from "react-bootstrap";
import { DateInMMDDYY } from "../../../Helper/Helper";
import {
  getServiceDate,
  PhoneNumberFormatter,
  valueReturner,
} from "../../../utils/utils";
import { editApi, getApi } from "../../../Respo/Api";
import SpinnerComp from "../Component/SpinnerComp";
import { FaEye } from "react-icons/fa";
import { ConfirmReview } from "../Scheduler/CalenderHelper/Modals/modal";

const UserData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("profile");
  const [serviceOrder, setServiceOrder] = useState({});
  const [upcomingOrder, setUpcomingOrder] = useState({});
  const [productOrder, setProductOrder] = useState({});
  const [template, setTemplate] = useState({});
  const [appointmentType, setAppointmentType] = useState("email");
  const [open, setOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    getApi({
      url: `api/v1/admin/viewUser/${id}`,
      setResponse: setUser,
      setLoading,
    });
    getApi({
      url: `api/v1/admin/getserviceOrdersDoneForProfile/${id}`,
      setResponse: setServiceOrder,
    });
    getApi({
      url: `api/v1/admin/getserviceOrdersPendingForProfile/${id}`,
      setResponse: setUpcomingOrder,
    });
    getApi({
      url: `api/v1/admin/getProductOrdersForProfile/${id}`,
      setResponse: setProductOrder,
    });
  }, [id]);

  const sendReviewMail = () => {
    editApi({
      url: `api/v1/admin/sendReviewMailByUserId/${id}`,
      payload: {},
      successMsg: "Success !",
      setLoading: setReviewLoading,
      additionalFunctions: [() => setOpen(false)],
    });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    getApi({
      url: `api/v1/getAllTemplateByUserId/${id}?type=${appointmentType}`,
      setResponse: setTemplate,
    });
  }, [id, appointmentType]);

  let Component;

  if (type === "profile") {
    const MyComponent = () => {
      return (
        <>
          {user?.data?.image && (
            <div className="img-cont">
              <img src={user?.data?.image} alt="" className="profile_image" />
            </div>
          )}
          {valueReturner(user?.data?.clientID, "Client ID")}
          {valueReturner(user?.data?.firstName, "First Name")}
          {valueReturner(user?.data?.lastName, "Last Name")}
          {valueReturner(user?.data?.fullName, "Full Name")}
          {user?.data?.isSubscription === true && (
            <div className="Desc-Container">
              <p className="title"> Credit Points </p>
              <p className="desc"> {user?.data?.creditPoint} </p>
            </div>
          )}
          {valueReturner(user?.data?.userStatus, "Status")}
          {valueReturner(user?.cardSaved ? "Yes" : "No", "Card Saved")}
          {valueReturner(
            user?.data?.sendEmailMarketingNotification ? "Yes" : "No",
            "Accepts Marketing"
          )}
          {valueReturner(
            user?.data?.sendEmailNotification ? "Yes" : "No",
            "Accepts SMS Marketing"
          )}
          {user?.data?.dob &&
            valueReturner(DateInMMDDYY(user?.data?.dob), "Date of Birth")}
          {valueReturner(user?.data?.email, "Email Address")}
          {valueReturner(user?.data?.countryCode, "Country Code")}
          {user?.data?.phone && (
            <div className="Desc-Container">
              <p className="title"> Phone Number </p>
              <p className="desc">
                {" "}
                {PhoneNumberFormatter(user?.data?.phone)}{" "}
              </p>
            </div>
          )}
          {valueReturner(user?.data?.gender, "Gender")}
          {valueReturner(user?.data?.refferalCode, "Refferal Code")}
          {valueReturner(user?.data?.referralSource, "Refferal Source")}
          {valueReturner(user?.data?.bio, "Note")}
          {user?.data?.createdAt &&
            valueReturner(DateInMMDDYY(user?.data?.createdAt), "Add On")}
          {valueReturner(
            user?.data?.isSubscription ? "Active" : "Not Active",
            "Subscription"
          )}
          {user?.data?.subscriptionPurchase &&
            valueReturner(
              DateInMMDDYY(user?.data?.subscriptionPurchase),
              "Initial Subscription Purchase"
            )}

          {user?.data?.subscriptionExpiration &&
            valueReturner(
              DateInMMDDYY(user?.data?.subscriptionExpiration),
              "Subscription Renew"
            )}

          {user?.data?.subscriptionExpirationAfterSixMonth &&
            valueReturner(
              DateInMMDDYY(user?.data?.subscriptionExpirationAfterSixMonth),
              "Initial Subscription Expire"
            )}
        </>
      );
    };
    Component = <MyComponent />;
  } else if (type === "history") {
    const MyComponent = () => {
      return (
        <div className="overFlowCont">
          <Table>
            <thead>
              <tr>
                <th>SNo.</th>
                <th>OrderId</th>
                <th>Date</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {serviceOrder?.serviceOrdersDone?.map((i, index) => (
                <tr key={`pastHistory${index}`}>
                  <td> #{index + 1} </td>
                  <td> {i.orderId} </td>
                  <td> {i.toTime && getServiceDate(i.toTime)}</td>
                  <td> ${i.total} </td>
                  <td>
                    <span className="flexCont">
                      <Link to={`/service-order/${i?._id}`}>
                        <span className="view-icon-container">
                          <FaEye />
                        </span>
                      </Link>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    };
    Component = <MyComponent />;
  } else if (type === "upcoming") {
    const MyComponent = () => {
      return (
        <div className="overFlowCont">
          <Table>
            <thead>
              <tr>
                <th>SNo.</th>
                <th>OrderId</th>
                <th>Date</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {upcomingOrder?.serviceOrdersPending?.map((i, index) => (
                <tr key={`pastHistory${index}`}>
                  <td> #{index + 1} </td>
                  <td> {i.orderId} </td>
                  <td> {i.toTime && getServiceDate(i.toTime)} </td>
                  <td> ${i.total} </td>
                  <td>
                    <span className="flexCont">
                      <Link to={`/service-order/${i?._id}`}>
                        <span className="view-icon-container">
                          <FaEye />
                        </span>
                      </Link>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    };
    Component = <MyComponent />;
  } else if (type === "product") {
    const MyComponent = () => {
      return (
        <>
          <div className="overFlowCont">
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Order Id</th>
                  <th>Total amount </th>
                  <th>Order status</th>
                  <th>Payment status</th>
                  <th>Delivery status</th>
                  <th>Created at</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productOrder?.productOrders?.map((i, index) => (
                  <tr key={`product${index}`}>
                    <td> #{index + 1} </td>
                    <td> {i.orderId} </td>
                    <td> ${i.total} </td>
                    <td>
                      {" "}
                      <Badge>{i.orderStatus}</Badge>{" "}
                    </td>
                    <td>
                      {" "}
                      <Badge>{i.paymentStatus}</Badge>{" "}
                    </td>
                    <td>
                      {" "}
                      <Badge>{i.deliveryStatus}</Badge>{" "}
                    </td>

                    <td> {i.createdAt && getServiceDate(i.createdAt)}</td>

                    <td>
                      <span className="flexCont">
                        <Link to={`/order/${i?._id}`}>
                          <span className="view-icon-container">
                            <FaEye />
                          </span>
                        </Link>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      );
    };
    Component = <MyComponent />;
  } else if (type === "Emailactivity") {
    const MyComponent = () => {
      return (
        <>
          <div className="overFlowCont">
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Email</th>
                  <th>Title</th>
                  <th>Created at</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {template?.data?.map((i, index) => (
                  <tr key={`product${index}`}>
                    <td> #{index + 1} </td>
                    <td> {i.email} </td>
                    <td> {i.title} </td>
                    <td> {i?.createdAt && DateInMMDDYY(i?.createdAt)} </td>
                    <td>
                      <span className="flexCont">
                        <Link to={`/template/${i?._id}`}>
                          <span className="view-icon-container">
                            <FaEye />
                          </span>
                        </Link>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      );
    };
    Component = <MyComponent />;
  } else if (type === "SMSactivity") {
    const MyComponent = () => {
      return (
        <>
          <div className="overFlowCont">
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Phone Number</th>
                  <th>Title</th>
                  <th>Created at</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {template?.data?.map((i, index) => (
                  <tr key={`product${index}`}>
                    <td> #{index + 1} </td>
                    <td> {i.phone && PhoneNumberFormatter(i?.phone)} </td>
                    <td> {i.title} </td>
                    <td> {i?.createdAt && DateInMMDDYY(i?.createdAt)} </td>
                    <td>
                      <span className="flexCont">
                        <Link to={`/template/${i?._id}`}>
                          <span className="view-icon-container">
                            <FaEye />
                          </span>
                        </Link>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      );
    };
    Component = <MyComponent />;
  }

  return (
    <>
      <ConfirmReview
        show={open}
        handleClose={() => setOpen(false)}
        loading={reviewLoading}
        handleSubmit={sendReviewMail}
      />
      {loading ? (
        <SpinnerComp />
      ) : (
        <section className="sectionCont">
          <p className="headP">Dashboard / {user?.data?.firstName} </p>

          <div className="view_colored_btns">
            <button type="button" onClick={() => setOpen(true)}>
              Send Review Email
            </button>

            <button
              onClick={() => setType("profile")}
              className={type === "profile" && "active"}
            >
              Personal Information
            </button>
            <button
              onClick={() => setType("upcoming")}
              className={type === "upcoming" && "active"}
            >
              Upcoming Appointment
            </button>
            <button
              onClick={() => setType("history")}
              className={type === "history" && "active"}
            >
              Appointment History
            </button>
            <button
              onClick={() => setType("product")}
              className={type === "product" && "active"}
            >
              Product Order History
            </button>
            <button
              onClick={() => {
                setAppointmentType("email");
                setType("Emailactivity");
              }}
              className={type === "Emailactivity" && "active"}
            >
              Email Activity
            </button>
            <button
              onClick={() => {
                setAppointmentType("sms");
                setType("SMSactivity");
              }}
              className={type === "SMSactivity" && "active"}
            >
              Message Activity
            </button>
          </div>

          {Component}

          <Button variant="dark" onClick={() => navigate(-1)}>
            Back
          </Button>
        </section>
      )}
    </>
  );
};

export default HOC(UserData);
