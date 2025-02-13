/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { EditorDesciption, ViewDescription } from "../../../Helper/Helper";
import { getApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";

const Privacy = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = () => {
    getApi({
      url: "api/v1/static/getPrivacy",
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

  function MyVerticallyCenteredModal(props) {
    const [privacy, setPrivacy] = useState("");

    const payload = { privacy };

    const postHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `${process.env.React_App_Baseurl}api/v1/static/createPrivacy`,
          payload,
          Auth
        );
        toast.success(data.message);
        props.onHide();
        fetchData();
      } catch (e) {
        console.log(e);
      }
    };

    const putHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.put(
          `${process.env.React_App_Baseurl}api/v1/static/privacy/${id}`,
          payload,
          Auth
        );
        toast.success(data.message);
        props.onHide();
        fetchData();
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
            {edit ? "Edit" : "Create New"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={edit ? putHandler : postHandler}>
            <EditorDesciption
              setDescription={setPrivacy}
              description={privacy}
              label={"Privacy Policy"}
            />

            <Button
              style={{ backgroundColor: "#19376d", borderRadius: "0" }}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  const deleteHandler = async (ide) => {
    try {
      const { data } = await axios.delete(
        `${process.env.React_App_Baseurl}api/v1/static/privacy/${ide}`,
        Auth
      );
      toast.success(data.message);
      fetchData();
    } catch (e) {
      const msg = e.response.data.message;
      toast.error(msg);
    }
  };

  const thead = ["Sno.", "Content", ""];

  const tbody = data?.data?.map((i, index) => [
    `#${index + 1}`,
    <ViewDescription description={i.privacy} />,
    <span className="flexCont">
      <span
        className="edit-icon"
        onClick={() => {
          setId(i._id);
          setEdit(true);
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
        <div className="pb-4  w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            Privacy Policy ( Total : {data?.data?.length || 0} )
          </span>
          <div className="d-flex gap-1">
            <button
              className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#0c0c0c] text-white tracking-wider"
              onClick={() => {
                setEdit(false);
                setModalShow(true);
              }}
            >
              Create New
            </button>
          </div>
        </div>

        <TableLayout thead={thead} tbody={tbody} loading={loading} />
      </section>
    </>
  );
};

export default HOC(Privacy);
