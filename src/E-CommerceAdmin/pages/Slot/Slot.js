/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Table, Modal, Form, Button, Alert } from "react-bootstrap";
import { getSlots, unblock_slot } from "../../../Respo/Api";
import { DateInMMDDYY } from "../../../Helper/Helper";

const Slot = () => {
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(35);

  const fetchData = () => {
    getSlots(FinalFromDate, FinalToDate, page, limit, setData);
  };

  const FinalFromDate =
    fromDate === "" || fromDate?.length < 5 ? "" : `${fromDate}T00:00:00.000Z`;
  const FinalToDate =
    toDate === null || toDate?.length < 5 ? "" : `${toDate}T23:59:59.000Z`;

  useEffect(() => {
    fetchData();
  }, [page, FinalFromDate, FinalToDate, limit]);

  useEffect(() => {
    if (FinalFromDate || FinalToDate) {
      setPage(1);
    }
  }, [FinalFromDate, FinalToDate]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  function Prev() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function Next() {
    setPage(page + 1);
  }

  function MyVerticallyCenteredModal(props) {
    const [date, setDate] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const payload = {
      date,
      from,
      to,
    };

    const postHandler = async (e) => {
      e.preventDefault();
      await unblock_slot(payload);
      fetchData();
    };

    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Unblock slot
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={postHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                required
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>From</Form.Label>
              <Form.Control
                type="time"
                required
                onChange={(e) => setFrom(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="time"
                required
                onChange={(e) => setTo(e.target.value)}
              />
            </Form.Group>

            <Button
              style={{
                backgroundColor: "#0c0c0c",
                borderRadius: "0",
                border: "1px solid #0c0c0c",
              }}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  function getFrom(timeString) {
    const time = new Date(timeString);
    const formattedStartTime = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedStartTime;
  }

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <section>
        <section className="sectionCont">
          <div className="pb-4   w-full flex justify-between items-center">
            <span
              className="tracking-widest text-slate-900 font-semibold uppercase"
              style={{ fontSize: "1.5rem" }}
            >
              All Slot's ( Total : {data?.total} )
            </span>
            <button
              onClick={() => {
                setModalShow(true);
              }}
              className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#0c0c0c] text-white tracking-wider"
            >
              Unblock slot
            </button>
          </div>

          <div className="searchByDate">
            <div>
              <label>Starting Date </label>
              <input
                type="date"
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div>
              <label>Ending Date </label>
              <input type="date" onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>

          <div className="searchByDate">
            <div>
              <label>Showing : </label>
              <select onChange={(e) => setLimit(e.target.value)}>
                <option>
                  {" "}
                  Showing {data?.docs?.length} out of {data?.total}{" "}
                </option>
                <option value={data?.total}> All </option>
                <option value={10}> 10 </option>
                <option value={20}> 20 </option>
                <option value={50}> 50 </option>
                <option value={100}> 100 </option>
              </select>
            </div>
          </div>

          {data?.docs?.length === 0 || !data ? (
            <Alert>Date Not Found</Alert>
          ) : (
            <>
              <div className="overFlowCont">
                <Table>
                  <thead>
                    <tr>
                      <td>Index</td>
                      <td>Date</td>
                      <td>From</td>
                      <td>To</td>
                      <td>Booked</td>
                      <td>Blocked</td>
                      <td>Created At</td>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.docs?.map((i, index) => (
                      <tr key={index}>
                        <td>#{index + 1} </td>
                        <td> {i.date?.slice(0, 10)} </td>
                        <td> {getFrom(i.from)} </td>
                        <td> {getFrom(i.to)} </td>
                        <td> {i.isBooked === true ? "Yes" : "No"} </td>
                        <td> {i.slotBlocked === true ? "Yes" : "No"} </td>
                        <td>    {DateInMMDDYY(i?.createdAt)} </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="pagination">
                <button onClick={() => Prev()} className="prevBtn">
                  <i className="fa-solid fa-backward"></i>
                </button>

                <button className="activePage">{page}</button>

                <button onClick={() => Next()} className="nextBtn">
                  {" "}
                  <i className="fa-sharp fa-solid fa-forward"></i>
                </button>
              </div>
            </>
          )}
        </section>
      </section>
    </>
  );
};

export default HOC(Slot);
