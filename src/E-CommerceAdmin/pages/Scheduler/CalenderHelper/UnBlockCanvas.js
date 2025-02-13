/** @format */

import { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux";
import FullScreenLoader from "../../../../Component/FullScreenLoader";
import { durationOption } from "../../../../Helper/Constant";
import { editApi, getApi } from "../../../../Respo/Api";
import { selectModalById } from "../../../../Store/Slices/modalSlices";
import { FaRegTrashAlt } from "react-icons/fa";

const UnBlockCanvas = ({ show, handleClose, fetchHandler, closeAlert }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamMember, setTeamMember] = useState("Shahina Hoja");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [duration, setDuration] = useState("");
  const type = "Edit";

  const { modalData } = useSelector(selectModalById("unblockedCanvas"));

  const start = new Date(modalData?.start);
  const Day = start?.toLocaleDateString("en-US", {
    weekday: "long",
  });
  const month = start?.toLocaleDateString("en-US", {
    month: "long",
  });
  const year = start?.toLocaleDateString("en-US", {
    year: "numeric",
  });
  const date = start?.toLocaleDateString("en-US", {
    day: "numeric",
  });

  const end = new Date(modalData?.end);
  const value =
    Day?.slice(0, 3) + " , " + date + " " + month?.slice(0, 3) + " " + year;
  const endingTime2 = end?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const startingTime2 = start?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const payload = {
    title,
    description,
    teamMember,
    type,
    date: selectedDate,
    to,
    from,
  };

  const submiHandler = (e) => {
    e.preventDefault();
    const additionalFunctions = [fetchHandler, handleClose, closeAlert];
    editApi({
      url: `api/v1/admin/Slot/slotActivityEdit/${modalData?.id}`,
      payload,
      additionalFunctions,
      setLoading,
    });
  };

  useEffect(() => {
    if (modalData) {
      getApi({
        url: `api/v1/admin/Slot/getSlotActivityById/${modalData?.id}`,
        setResponse: setData,
      });
    }
  }, [modalData]);

  useEffect(() => {
    if (data) {
      const item = data?.data;
      setTitle(item?.title);
      setTeamMember(item?.teamMember);
      setDescription(item?.description);
      setSelectedDate(item?.date?.slice(0, 10));
    }
  }, [data]);

  const handleDelete = () => {
    const additionalFunctions = [fetchHandler, handleClose, closeAlert];
    editApi({
      url: `api/v1/admin/Slot/slotActivityDelete/${modalData?.id}`,
      setLoading,
      additionalFunctions,
    });
  };

  useEffect(() => {
    if (startingTime2) {
      setFrom(startingTime2);
    }
  }, [startingTime2]);

  useEffect(() => {
    if (endingTime2) {
      setTo(endingTime2);
    }
  }, [endingTime2]);

  //-----
  const parseDuration = (duration) => {
    const parts = duration.split(" ");
    let totalMinutes = 0;

    parts.forEach((part) => {
      if (part.includes("hr")) {
        totalMinutes += parseInt(part.replace("hr", "")) * 60;
      } else if (part.includes("min")) {
        totalMinutes += parseInt(part.replace("min", ""));
      }
    });

    return totalMinutes;
  };

  const calculateEndTime = () => {
    if (from && duration) {
      const [hours, minutes] = from.split(":");
      const startDateTime = new Date();
      startDateTime.setHours(parseInt(hours));
      startDateTime.setMinutes(parseInt(minutes));

      const totalMinutesToAdd = parseDuration(duration);
      startDateTime.setMinutes(startDateTime.getMinutes() + totalMinutesToAdd);

      const newEndTime = startDateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setTo(newEndTime);
    }
  };

  useEffect(() => {
    calculateEndTime();
  }, [from, duration]);
  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      style={{ width: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontWeight: "900" }}>
          Edit Blocked time
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="booked_appointment_modal">
        {loading && <FullScreenLoader />}
        <form onSubmit={submiHandler}>
          <div>
            <p>Title</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. lunch meeting (optional)"
            />
          </div>

          <div>
            <p>Date</p>
            <input
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate}
            />
          </div>
          <div>
            <p>Starting Time</p>
            <input
              value={from}
              type="time"
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          {/* <div>
            <p>Ending Time</p>
            <input
              value={to}
              type="time"
              onChange={(e) => setTo(e.target.value)}
            />
          </div> */}
          <div>
            <p>Duration</p>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value=""> Select </option>
              {durationOption?.map((i) => (
                <option value={i.value} key={i.value}>
                  {" "}
                  {i.label}{" "}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p>Team member</p>
            <select
              value={teamMember}
              onChange={(e) => setTeamMember(e.target.value)}
            >
              <option value=""> Select </option>
              <option value="Noor R."> Noor R. </option>
              <option value="Shahina Hoja"> Shahina Hoja </option>
            </select>
          </div>

          <div>
            <p>Description</p>
            <textarea
              rows={5}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description or note (optional)"
            />
          </div>

          <div className="btn-div">
            <div className="icon-div" 
                onClick={() => handleDelete()}>
              <FaRegTrashAlt
                className="trash-icon"
              />
            </div>

            <button type="submit">Save</button>
          </div>
        </form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default UnBlockCanvas;
