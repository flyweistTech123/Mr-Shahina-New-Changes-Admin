/** @format */
import { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { getCorrectTime } from "../../../../Helper/Helper";
import { PhoneNumberFormatter } from "../../../../utils/utils";
import { getOrders } from "../../../../Respo/Api";
import { CallingModal, MailModal, UserDialog } from "./Modals/modal";
import { FaArrowLeft, FaEllipsisV, FaCreditCard } from "react-icons/fa";

const UserDetailCanvas = ({
  show,
  handleClose,
  setIsBooked,
  Details,
  fetchBooking,
}) => {
  const [status, setStatus] = useState("all");
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCall, setOpenCall] = useState(false);
  const [mailDialog, setMailDialog] = useState(false);

  const fullName = Details?.user?.firstName + " " + Details?.user?.lastName;

  useEffect(() => {
    if (show === true) {
      if (status === "all") {
        getOrders(setData, "", Details?.user?._id);
      } else {
        getOrders(setData, status, Details?.user?._id);
      }
    }
  }, [status, show]);

  function TextReturn() {
    if (status === "Pending") {
      return <span className="faded_span">Upcoming</span>;
    } else if (status === "all") {
      return <span className="faded_span">All</span>;
    } else if (status === "Done") {
      return <span className="faded_span">Past</span>;
    }
  }

  const timeAdapter = (date, type) => {
    const Dates = getCorrectTime(date);
    const month = Dates?.toLocaleDateString("en-US", {
      month: "long",
    });
    const year = Dates?.toLocaleDateString("en-US", {
      year: "numeric",
    });
    const day = Dates?.toLocaleDateString("en-US", {
      day: "numeric",
    });
    const formattedTime = Dates.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dayOfWeek = Dates?.toLocaleDateString("en-US", {
      weekday: "long",
    });
    if (type === "full") {
      return `${dayOfWeek?.slice(
        0,
        3
      )}, ${day} ${month} ${year} at ${formattedTime}`;
    } else {
      return (
        <>
          <p className="day"> {day} </p>
          <p className="mth"> {month?.slice(0, 3)} </p>
        </>
      );
    }
  };

  return (
    <>
      <UserDialog
        show={open}
        fetchBooking={fetchBooking}
        setShow={setOpen}
        data={Details}
      />
      <CallingModal
        show={openCall}
        handleClose={() => setOpenCall(false)}
        phone={Details?.user?.phone}
      />
      <MailModal
        show={mailDialog}
        handleClose={() => setMailDialog(false)}
        email={Details?.user?.emai}
      />
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{ width: "100%" }}
      >
        <Offcanvas.Body style={{ padding: 0, backgroundColor: "#dedddc" }}>
          <div className="user_detail_canvas">
            <div className="white_backgroud" style={{ marginTop: "0" }}>
              <FaArrowLeft onClick={handleClose} className="cursor-pointer" />
              <div className="user_detail">
                <div className="img"> {fullName?.slice(0, 1)} </div>
                <div className="content">
                  <p className="heading">{fullName} </p>
                  <p
                    className="faded"
                    onClick={() => {
                      setOpenCall(true);
                    }}
                  >
                    {Details?.user?.phone &&
                      PhoneNumberFormatter(Details?.user?.phone)}{" "}
                  </p>

                  <p
                    className="faded"
                    onClick={() => {
                      setMailDialog(true);
                    }}
                  >
                    {Details?.user?.email}
                  </p>
                </div>
              </div>
              <div className="tags">
                <span>New Client</span>
              </div>

              <div className="btns_upper">
                <span className="icon-action" onClick={() => setOpen(true)}>
                  <FaEllipsisV />
                </span>
                <button
                  onClick={() => {
                    setIsBooked(true);
                    handleClose();
                  }}
                >
                  Book now
                </button>
              </div>
            </div>

            <div className="activity_dialog">
              <div className="heading">
                <h5>Activity</h5>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option></option>
                  <option value={"Pending"}>Upcoming Activity</option>
                  <option value={"Done"}>Past Activity</option>
                  <option value={"all"}>All Activity</option>
                </select>
              </div>
              {TextReturn()}
            </div>

            {data?.map((i, index) => (
              <div className="white_backgroud" key={`Services${index}`}>
                <div className="appointment_details">
                  <div className="dates_stuff">
                    <div className="date">{timeAdapter(i.toTime)}</div>
                    <div className="content_stuff">
                      <p className="head">Appointment</p>
                      <p className="faded">
                        {i?.toTime && timeAdapter(i?.toTime, "full")}
                      </p>
                      <span>Booked</span>
                    </div>
                  </div>

                  {i.services?.map((item) => (
                    <div className="service_details">
                      <div>
                        <p className="title"> {item?.serviceId?.name} </p>
                        <p className="faded"> {item?.serviceId?.totalTime} </p>
                      </div>
                      <p className="price"> ${item?.price}</p>
                    </div>
                  ))}

                  <div className="notes">
                    {i?.suggesstion?.length > 0 && (
                      <>
                        <p className="heading">Appointment note</p>
                        {i.suggesstion?.map((i, index) => (
                          <p className="faded" key={`Suggestion${index}`}>
                            {" "}
                            {i?.suggesstion}{" "}
                          </p>
                        ))}
                      </>
                    )}

                    <button>
                      <FaCreditCard />
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default UserDetailCanvas;
