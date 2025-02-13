/** @format */
import { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectModalById } from "../../../../Store/Slices/modalSlices";
import { editApi } from "../../../../Respo/Api";
import FullScreenLoader from "../../../../Component/FullScreenLoader";

const BlockedCanvas = ({ show, handleClose, fetchHandler, closeAlert }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamMember, setTeamMember] = useState("Shahina Hoja");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const type = "Edit";

  const { modalData } = useSelector(selectModalById("blockedCanvas"));

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
  const endingTime2 = end?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const value =
    Day?.slice(0, 3) + " , " + date + " " + month?.slice(0, 3) + " " + year;
  const monthFormated = parseInt(start?.getMonth()) + 1;
  const dayFormated = start?.getDate();
  const monthStr = monthFormated < 10 ? `0${monthFormated}` : monthFormated;
  const dayStr = dayFormated < 10 ? `0${dayFormated}` : dayFormated;
  const formatedDate = `${year}-${monthStr}-${dayStr}`;

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
    date: formatedDate,
    to,
    from,
  };

  const submiHandler = (e) => {
    e.preventDefault();
    const addFunc = [fetchHandler, handleClose, closeAlert];
    editApi({
      url: `api/v1/admin/Slot/createSlotActivity`,
      payload,
      additionalFunctions: addFunc,
      setLoading,
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

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      style={{ width: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontWeight: "900" }}>
          Add Blocked time
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="booked_appointment_modal">
        {loading && <FullScreenLoader />}
        <form onSubmit={submiHandler}>
          <div>
            <p>Title</p>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. lunch meeting (optional)"
            />
          </div>
          <div>
            <p>Date</p>
            <input value={value} />
          </div>
          <div>
            <p>Starting Time</p>
            <input
              value={from}
              type="time"
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div>
            <p>Ending Time</p>
            <input
              value={to}
              type="time"
              onChange={(e) => setTo(e.target.value)}
            />
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
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description or note (optional)"
            />
          </div>

          <button type="submit"> Save</button>
        </form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default BlockedCanvas;
