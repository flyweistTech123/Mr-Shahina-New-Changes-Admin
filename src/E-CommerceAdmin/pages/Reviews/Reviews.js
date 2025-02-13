/** @format */

import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import HOC from "../../layout/HOC";
import {
  DateInMMDDYY,
  EditorDesciption,
  ViewDescription,
} from "../../../Helper/Helper";
import { deleteApi, editApi, getApi, postApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { DefaultDialog } from "../Scheduler/CalenderHelper/Modals/modal";
import { Rate } from "antd";

const Rating = ({ rating }) => {
  const arr = new Array(rating).fill(undefined);
  return (
    <span className="rating-stars">
      {arr.map((_) => (
        <FaStar color="#EB8317" />
      ))}
    </span>
  );
};

const Reviews = () => {
  const [modalShow, setModalShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(1);

  const fetchHandler = () => {
    getApi({
      url: "api/v1/clientReview/ForAdmin",
      setLoading,
      setResponse: setData,
    });
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  const deleteHandler = async (id) => {
    deleteApi({
      url: `api/v1/clientReview/${id}`,
      setLoading,
      successMsg: "Removed !",
      additionalFunctions: [fetchHandler],
    });
  };

  const payload = { userName, description, title, rating };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const postHandler = async (e) => {
    e.preventDefault();
    postApi({
      url: "api/v1/clientReview/addclientReview",
      payload,
      additionalFunctions: [() => setModalShow(false), fetchHandler],
      successMsg: "Created !",
    });
  };

  const putHandler = async (e) => {
    e.preventDefault();
    editApi({
      url: `api/v1/clientReview/put/${selectedItem?._id}`,
      payload,
      additionalFunctions: [() => setModalShow(false), fetchHandler],
      successMsg: "Updated !",
    });
  };

  const thead = [
    "Sno.",
    "User Name",
    "Title",
    "Description",
    "Rating",
    "Created at",
    "",
  ];

  const tbody = data?.data
    ?.slice()
    ?.reverse()
    ?.map((ele, index) => [
      `#${index + 1}`,
      ele?.userName,
      ele?.title,
      <span
        onClick={() => {
          setSelectedItem(ele);
          setOpen(true);
        }}
        style={{
          marginLeft: "10px",
          color: "blue",
          cursor: "pointer",
        }}
      >
        View
      </span>,
      <Rating rating={ele?.rating} />,
      ele?.createdAt && DateInMMDDYY(ele?.createdAt),
      <span className="flexCont">
        <span
          className="edit-icon"
          onClick={() => {
            setEdit(true);
            setSelectedItem(ele);
            setModalShow(true);
          }}
        >
          <FaPen />
        </span>

        <span className="remove-icon" onClick={() => deleteHandler(ele._id)}>
          <FaRegTrashAlt />
        </span>
      </span>,
    ]);

  const resetHandler = () => {
    setRating(1);
    setUserName("");
    setDescription("");
    setTitle("");
  };

  useEffect(() => {
    if (edit && modalShow) {
      setRating(selectedItem?.rating || 0);
      setUserName(selectedItem?.userName);
      setDescription(selectedItem?.description);
      setTitle(selectedItem?.title);
    } else {
      resetHandler();
    }
  }, [edit, modalShow]);

  return (
    <>
      <DefaultDialog
        show={open}
        onHide={() => setOpen(false)}
        Title={"Description"}
      >
        <ViewDescription description={selectedItem?.description} />
      </DefaultDialog>

      <DefaultDialog
        show={modalShow}
        onHide={() => setModalShow(false)}
        Title={edit ? "Update" : "Create"}
        size={"lg"}
      >
        <Form onSubmit={edit ? putHandler : postHandler}>
          <Form.Group className="mb-3">
            <Rate onChange={handleRatingChange} value={rating} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>

          <EditorDesciption
            setDescription={setDescription}
            description={description}
            label={"Description"}
          />
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="dark">
            Submit
          </Button>
        </Form>
      </DefaultDialog>

      <section className="sectionCont">
        <div className="pb-4   w-full flex justify-between items-center">
          <span
            className=" text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            All Review's
          </span>
          <button
            className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider"
            onClick={() => {
              setEdit(false);
              setModalShow(true);
            }}
          >
            Create
          </button>
        </div>

        <TableLayout thead={thead} tbody={tbody} loading={loading} />
      </section>
    </>
  );
};

export default HOC(Reviews);
