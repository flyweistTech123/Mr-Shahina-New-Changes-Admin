/** @format */

import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { editApi, getApi } from "../../../Respo/Api";
import HOC from "../../layout/HOC";

const EditUser = () => {
  const { id } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [showOnAllBooking, setShowOnAllBooking] = useState(true);
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [sendTextNotification, sentTextNotification] = useState(true);
  const [sendEmailMarketingNotification, setSendEmailMarketingNotification] =
    useState(true);
  const [sendTextMarketingNotification, setSendTextMarketingNotification] =
    useState(true);
  const [preferredLAnguage, setPreferedLanguage] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");

  const fetchHandler = () => {
    getApi({
      url: `api/v1/admin/viewUser/${id}`,
      setResponse: setData,
    });
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  useEffect(() => {
    if (data) {
      setFirstName(data?.data?.firstName);
      setLastName(data?.data?.lastName);
      setTitle(data?.data?.firstName + " " + data?.data?.lastName);
      setEmail(data?.data?.email);
      setPhone(data?.data?.phone);
      setGender(data?.data?.gender);
      setDob(data?.data?.dob);
      setBio(data?.data?.bio);
      setSendEmailNotification(data?.data?.sendEmailNotification);
      setShowOnAllBooking(data?.data?.showOnAllBooking);
      sentTextNotification(data?.data?.sendTextNotification);
      setSendEmailMarketingNotification(
        data?.data?.sendEmailMarketingNotification
      );
      setSendTextMarketingNotification(
        data?.data?.sendTextMarketingNotification
      );
      setPreferedLanguage(data?.data?.preferredLAnguage);
    }
  }, [data]);

  const payload = {
    firstName,
    lastName,
    fullName: title,
    email,
    phone,
    gender,
    dob,
    bio,
    showOnAllBooking,
    sendEmailNotification,
    sendTextNotification,
    sendEmailMarketingNotification,
    sendTextMarketingNotification,
    preferredLAnguage,
  };

  const additionalFunctions = [fetchHandler];

  const submitHandler = async (e) => {
    e.preventDefault();
    editApi({
      url: `api/v1/admin/updateClientProfile/${id}`,
      payload,
      setLoading,
      additionalFunctions,
    });
  };

  return (
    <>
      <section className="sectionCont">
        <p className="headP">Dashboard / {title} </p>
        <div className="booked_appointment_modal edit-profile-canvas">
          <form onSubmit={submitHandler}>
            <div>
              <p>First name</p>
              <input
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </div>
            <div>
              <p>Last name</p>
              <input
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>

            <div className="mb-3">
              <PhoneInput value={phone} country={"us"} onChange={setPhone} />
            </div>

            <div>
              <p>Email address</p>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div>
              <p>Gender</p>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option></option>
                <option value={"Male"}>Male</option>
                <option value={"Female"}>Female</option>
              </select>
            </div>

            <div>
              <p>Date of birth</p>
              <input type="date" onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="h-4 width-full bg-[#F2F1F6]"></div>
            <div>
              <h4 style={{ fontWeight: "bold", margin: 0 }}>
                Important client info
              </h4>
              <span style={{ fontWeight: "bold", margin: 0, fontSize: "12px" }}>
                Important client info will only be visible to you and team
                members
              </span>
              <p className="mt-3">Client info</p>
              <textarea
                rows={5}
                onChange={(e) => setBio(e.target.value)}
                value={bio}
              />
              <div className="check-Box">
                <div className="main">
                  <Form.Check
                    type="checkbox"
                    value={showOnAllBooking}
                    checked={showOnAllBooking}
                    onChange={(e) => setShowOnAllBooking(e.target.checked)}
                    style={{ width: "20px" }}
                  />
                  <p>Display on all bookings</p>
                </div>
              </div>
            </div>
            <div className="h-4 width-full bg-[#F2F1F6]"></div>
            <div>
              <h4 style={{ fontWeight: "bold", margin: 0 }}>Notifications</h4>
              <span style={{ fontWeight: "bold", margin: 0, fontSize: "12px" }}>
                Choose how you'd like to keep this client up to date about thier
                appointments and sales , like vouchers and membership
              </span>
              <p className="mt-3">Client notifications</p>
              <div className="check-Box">
                <div className="main">
                  <Form.Check
                    type="switch"
                    value={sendEmailNotification}
                    checked={sendEmailNotification}
                    onChange={(e) => setSendEmailNotification(e.target.checked)}
                  />
                  <p>Send email notifications</p>
                </div>
                <div className="main">
                  <Form.Check
                    type="switch"
                    value={sendTextNotification}
                    checked={sendTextNotification}
                    onChange={(e) => sentTextNotification(e.target.checked)}
                  />
                  <p>Send text notifications</p>
                </div>
              </div>
            </div>

            <div>
              <p className="mt-3">Marketing notifications</p>
              <div className="check-Box">
                <div className="main">
                  <Form.Check
                    type="switch"
                    value={sendEmailMarketingNotification}
                    onChange={(e) =>
                      setSendEmailMarketingNotification(e.target.checked)
                    }
                    checked={sendEmailMarketingNotification}
                  />
                  <p>Client accepts email marketing notification</p>
                </div>
                <div className="main">
                  <Form.Check
                    type="switch"
                    value={sendTextMarketingNotification}
                    onChange={(e) =>
                      setSendTextMarketingNotification(e.target.checked)
                    }
                    checked={sendTextMarketingNotification}
                  />
                  <p>Client accepts text message marketing notification</p>
                </div>
              </div>
            </div>

            <div>
              <p>Preferred Language</p>
              <select
                onChange={(e) => setPreferedLanguage(e.target.value)}
                value={preferredLAnguage}
              >
                <option></option>
                <option value={"English"}>English</option>
              </select>
            </div>

            <button type="submit">
              {loading ? <ClipLoader color="#fff" /> : "Submit"}{" "}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default HOC(EditUser);
