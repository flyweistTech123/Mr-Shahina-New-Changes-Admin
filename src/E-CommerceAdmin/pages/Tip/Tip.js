/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Modal, Form, Button } from "react-bootstrap";
import { deleteApi, editApi, getApi, postApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { DateInMMDDYY } from "../../../Helper/Helper";
import { ClipLoader } from "react-spinners";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";

const Tip = () => {
  const [data, setData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [prevData, setPrevData] = useState({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchHandler = async () => {
    getApi({
      url: "api/v1/admin/Tips/allTips",
      setResponse: setData,
      setLoading,
    });
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  function MyVerticallyCenteredModal(props) {
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false);

    const payload = {
      price,
    };

    const additionalFunctions = [props.onHide, fetchHandler];

    const postHandler = async (e) => {
      e.preventDefault();
      postApi({
        url: "api/v1/admin/Tips/addTips",
        payload,
        successMsg: "Created",
        additionalFunctions,
        setLoading,
      });
    };

    const putHandler = async (e) => {
      e.preventDefault();
      editApi({
        url: `api/v1/Tips/updateTips/${prevData?._id}`,
        payload,
        successMsg: "Updated",
        additionalFunctions,
        setLoading,
      });
    };

    useEffect(() => {
      if (prevData) {
        setPrice(prevData?.price);
      }
    }, [prevData]);

    return (
      <Modal {...props} centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {" "}
            {edit ? "Edit" : "Create New"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={edit ? putHandler : postHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Percentage</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={100}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Button
              style={{ backgroundColor: "#042b26", borderRadius: "0" }}
              type="submit"
            >
              {loading ? <ClipLoader color="#fff" /> : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  const deleteHandler = (id) => {
    deleteApi({
      url: `api/v1/Tips/deleteTips/${id}`,
      successMsg: "Removed !",
      additionalFunctions: [fetchHandler],
    });
  };

  const tipData = data?.data?.map((i, index) => [
    `#${index + 1}`,
    i?.price >= 0 ? `${i.price}%` : "",
    i?.type,
    i?.createdAt ? DateInMMDDYY(i?.createdAt) : "",
    <span className="flexCont">
      <span
        className="edit-icon"
        onClick={() => {
          setEdit(true);
          setPrevData(i);
          setModalShow(true);
        }}
      >
        <FaPen />
      </span>
      <span className="remove-icon" onClick={() => deleteHandler(i._id)}>
        <FaRegTrashAlt />
      </span>
    </span>,
  ]);

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
              Tip's ({data?.data?.length})
            </span>
            <button
              className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider"
              onClick={() => {
                setEdit(false);
                setModalShow(true);
              }}
            >
              Create New
            </button>
          </div>

          <TableLayout
            thead={["Sno", "Percentage", "Type", "Created at", ""]}
            tbody={tipData}
            loading={loading}
          />
        </section>
      </section>
    </>
  );
};

export default HOC(Tip);
