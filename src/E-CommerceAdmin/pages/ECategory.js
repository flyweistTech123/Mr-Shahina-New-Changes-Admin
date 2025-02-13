/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../layout/HOC";
import {  Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { getApi } from "../../Respo/Api";
import TableLayout from "../../Component/TableLayout";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";

const ECategory = () => {
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState([]);
  const [id, setId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = () => {
    getApi({
      url: "api/v1/admin/Category/allCategory",
      setLoading,
      setResponse: setData,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.React_App_Baseurl}api/v1/admin/Category/deleteCategory/${id}`,
        Auth
      );
      console.log(data);
      toast.success(data.message);
      fetchData();
    } catch (e) {
      console.log(e);
    }
  };

  function MyVerticallyCenteredModal(props) {
    const [image, setImage] = useState("");
    const [name, setName] = useState("");

    const fd = new FormData();
    fd.append("image", image);
    fd.append("name", name);

    const postHandler = async (e) => {
      e.preventDefault();

      try {
        const { data } = await axios.post(
          `${process.env.React_App_Baseurl}api/v1/admin/Category/addCategory`,
          fd,
          Auth
        );
        toast.success(data.message);
        fetchData();
        props.onHide();
      } catch (e) {
        console.log(e);
      }
    };

    const putHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.put(
          ` ${process.env.React_App_Baseurl}api/v1/admin/Category/updateCategory/${id}`,
          fd,
          Auth
        );
        toast.success(data.message);
        fetchData();
        props.onHide();
      } catch (e) {
        console.log(e);
      }
    };

    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {" "}
            {edit ? "Edit Category" : " Add Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={edit ? putHandler : postHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                required
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
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

  const thead = ["Sno.", "Image", "Title", ""];

  const tbody = data?.data?.map((i, index) => [
    `#${index + 1}`,
    <img src={i.image} alt="" style={{ maxWidth: "60px" }} />,
    i?.name,
    <span className="flexCont">
      <span
        className="edit-icon"
        onClick={() => {
          setEdit(true);
          setId(i._id);
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

      <section className="sectionCont">
        <div className="pb-4   w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            All Category's ( Total : {data?.data?.length || 0} )
          </span>
          <button
            onClick={() => {
              setEdit(false);
              setModalShow(true);
            }}
            className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#0c0c0c] text-white tracking-wider"
          >
            Create New
          </button>
        </div>

        <TableLayout thead={thead} tbody={tbody} loading={loading} />
      </section>
    </>
  );
};

export default HOC(ECategory);
