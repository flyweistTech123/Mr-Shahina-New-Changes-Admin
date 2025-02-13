/** @format */

import React, { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import FullScreenLoader from "../../../../Component/FullScreenLoader";
import { ReactSelect } from "../../../../Component/HelpingComponents";
import { getApi, postApi } from "../../../../Respo/Api";
import HOC from "../../../layout/HOC";
import TableLayout from "../../../../Component/TableLayout";
import {
  DateInMMDDYY,
  EditorDesciption,
  ViewDescription,
} from "../../../../Helper/Helper";
import {
  NotificationConfirmation,
  TemplatePreviewModalSM,
  TemplatePreviewModalXl,
} from "../CalenderHelper/Modals/modal";
import Select from "react-select";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SendNotification = () => {
  const [notification, setNotifications] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchHandler = () => {
    getApi({
      url: "api/v1/admin/notification/allNotification",
      setResponse: setNotifications,
    });
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  const resendHandler = (id) => {
    postApi({
      url: `api/v1/admin/notification/sendAgain/${id}`,
      setLoading,
      additionalFunctions: [fetchHandler],
    });
  };

  const tbody = notification?.data
    ?.slice()
    ?.reverse()
    ?.map((i, index) => [
      `#${index + 1}`,
      // i.title,
      <ViewDescription description={i?.title} />,
      // <span
      //   dangerouslySetInnerHTML={{ __html: i?.body.replace(/\n/g, "<br />") }}
      // ></span>,
      <ViewDescription description={i?.body} />,
      i?.date && DateInMMDDYY(i.date),
      <button
        className="resentBtn"
        type="button"
        onClick={() => resendHandler(i?.Id)}
      >
        Resend
      </button>,
      <span className="flexCont">
        <span
          className="view-icon-container"
          onClick={() => navigate(`/view-notification/${i?._id}`)}
        >
          <FaEye />
        </span>
      </span>,
    ]);

  const thead = ["Sno", "Title", "Body", "Date", "Resend", ""];

  //   Send Notification
  function MyVerticallyCenteredModal(props) {
    const [open, setOpen] = useState(false);
    const [total, setTotal] = useState("ALL");
    const [userId, setUserId] = useState({});
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [users, setUsers] = useState({});
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [userIds, setUserIds] = useState([]);
    const [through, setThrough] = useState([]);
    const [openTemplate, setOpenTemplate] = useState(false);
    const [viewSms, setViewSms] = useState(false);
    const sendTo = "USER";

    const getSendThroughValue = (selectedOptions) => {
      const values = selectedOptions.map((option) => option.value).sort();
      const combinations = {
        "Email,Push,Sms": "All",
        "Email,Push": "EmailPush",
        "Email,Sms": "EmailSMS",
        "Push,Sms": "PushSMS",
        Email: "Email",
        Push: "Push",
        Sms: "Sms",
      };
      return combinations[values.join(",")] || "";
    };

    const sendThroughValue = getSendThroughValue(through);

    let payload;
    if (total === "ALL") {
      payload = {
        sendTo,
        total,
        sendThrough: sendThroughValue,
        title,
        body,
        date,
      };
    } else if (total === "SINGLE") {
      payload = {
        sendTo,
        total,
        sendThrough: sendThroughValue,
        title,
        body,
        date,
        _id: userId?.value,
      };
    } else if (total === "SELECT") {
      payload = {
        sendTo,
        total,
        sendThrough: sendThroughValue,
        title,
        body,
        date,
        userIds: userIds?.map((i) => i?.value),
      };
    } else if (total === "last6MonthVisit") {
      payload = {
        sendTo,
        total,
        sendThrough: sendThroughValue,
        title,
        body,
        date,
      };
    } else if (total === "last12MonthVisit") {
      payload = {
        sendTo,
        total,
        sendThrough: sendThroughValue,
        title,
        body,
        date,
      };
    }

    const submitHandler = () => {
      const additionalFunctions = [() => props.onHide(), fetchHandler];
      postApi({
        url: "api/v1/admin/notification/sendNotification",
        payload,
        successMsg: "Sent !",
        setLoading,
        additionalFunctions,
      });
    };

    useEffect(() => {
      if (props.show) {
        getApi({
          url: `api/v1/admin/getAllUserforSearch?search=${query}`,
          setResponse: setUsers,
        });
      }
    }, [query, props]);

    const userOptions = users?.data?.docs?.map((i) => ({
      value: i._id,
      label: `${i.firstName} ${i.lastName}`,
    }));


    const sendThroughOptions2 = [
      {
        value: "Email",
        label: "Email",
      },
      {
        value: "Push",
        label: "Push",
      },
      {
        value: "Sms",
        label: "Sms",
      },
    ];

    const openConfirmation = () => {
      setOpen(true); // Open NotificationConfirmation
    };

    return (
      <>
        <TemplatePreviewModalXl
          show={openTemplate}
          handleClose={() => setOpenTemplate(false)}
          title={title}
          body={body}
        />
        <TemplatePreviewModalSM
          show={viewSms}
          handleClose={() => setViewSms(false)}
          title={title}
          body={body}
        />
        <NotificationConfirmation
          show={open}
          handleClose={() => setOpen(false)}
          handleDelete={submitHandler}
        />
        <Modal {...props} centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Send Notification
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading && <FullScreenLoader />}
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Send To</Form.Label>
                <Form.Select
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                >
                  <option value={""}> Select your prefrence</option>
                  <option value="ALL">All</option>
                  <option value="SINGLE">Single User</option>
                  <option value="SELECT">Multiple User</option>
                  <option value="last6MonthVisit">
                    Visited in the last 6 months
                  </option>
                  <option value="last12MonthVisit">
                    Visited in the last 12 months
                  </option>
                </Form.Select>
              </Form.Group>

              {total === "SINGLE" && (
                <Form.Group className="mb-3">
                  <Form.Label>Select User</Form.Label>
                  <ReactSelect
                    options={userOptions}
                    inputValue={setQuery}
                    setValue={setUserId}
                  />
                </Form.Group>
              )}

              {total === "SELECT" && (
                <Select
                  isMulti
                  options={userOptions}
                  placeholder="Select Users"
                  className="mb-3"
                  onChange={(e) => setUserIds(e)}
                  value={userIds}
                  onInputChange={(input) => {
                    setQuery(input);
                  }}
                />
              )}

              <Form.Group className="mb-3">
                <Form.Label>Send Through</Form.Label>
                <Select
                  isMulti
                  options={sendThroughOptions2}
                  placeholder="Select Options"
                  className="mb-3"
                  onChange={(e) => setThrough(e)}
                  value={through}
                />
              </Form.Group>

              {/* <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                />
              </Form.Group> */}
              <EditorDesciption
                setDescription={setTitle}
                description={title}
                label={"Title"}
              />

              <EditorDesciption
                setDescription={setBody}
                description={body}
                label={"Body"}
              />

              {/* <Form.Group className="mb-3">
                <Form.Label>Body</Form.Label>
                <FloatingLabel>
                  <Form.Control
                    as="textarea"
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    style={{ minHeight: "200px" }}
                  />
                </FloatingLabel>
              </Form.Group> */}

              {/* <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                />
              </Form.Group> */}

              <Button
                type="button"
                onClick={() => openConfirmation()}
                variant="dark"
              >
                Submit
              </Button>
              <Button
                type="button"
                onClick={() => setOpenTemplate(true)}
                variant="dark"
                className="ml-4"
              >
                Email Preview
              </Button>
              <Button
                type="button"
                onClick={() => setViewSms(true)}
                variant="dark"
                className="ml-4"
              >
                SMS Preview
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      {loading && <FullScreenLoader />}

      <section className="sectionCont">
        <div className="pb-4   w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold"
            style={{ fontSize: "1.5rem" }}
          >
            Send Notification
          </span>
          <button
            className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider"
            onClick={() => {
              setModalShow(true);
            }}
          >
            Send
          </button>
        </div>
        <TableLayout tbody={tbody} thead={thead} />
      </section>
    </>
  );
};

export default HOC(SendNotification);
