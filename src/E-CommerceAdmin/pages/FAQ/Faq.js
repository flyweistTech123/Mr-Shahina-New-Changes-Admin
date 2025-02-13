/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { EditorDesciption, ViewDescription } from "../../../Helper/Helper";
import { getApi, showMsg } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";

const Faq = () => {
  const [total, setTotal] = useState(0);
  const [id, setId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const MembershipFaq = () => {
    getApi({
      url: "api/v1/static/faq/AllMembershipFaqs",
      setResponse: setFaq,
      setLoading,
    });
  };

  useEffect(() => {
    MembershipFaq();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  function MyVerticallyCenteredModal(props) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const payload = { question, answer, type: "Membership" };

    const postHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `${process.env.React_App_Baseurl}api/v1/static/faq/createFaq`,
          payload,
          Auth
        );
        props.onHide();
        MembershipFaq();
        showMsg("", data?.message, "success");
      } catch (e) {
        console.log(e);
      }
    };

    const putHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.put(
          `${process.env.React_App_Baseurl}api/v1/static/faq/${id}`,
          payload,
          Auth
        );

        props.onHide();
        MembershipFaq();
        showMsg("", data?.message, "success");
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
              setDescription={setQuestion}
              description={question}
              label={"Question"}
            />
            <EditorDesciption
              setDescription={setAnswer}
              description={answer}
              label={"Answer"}
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
        `${process.env.React_App_Baseurl}api/v1/static/faq/${ide}`,
        Auth
      );
      MembershipFaq();
      showMsg("", data?.message, "success");
    } catch (e) {
      const msg = e.response.data.message;
      toast.error(msg);
    }
  };

  const thead = ["Sno.", "Question", "Answer", ""];
  const tbody = faq?.data?.map((i, index) => [
    `#${index + 1}`,
    <ViewDescription description={i.question} />,
    <ViewDescription description={i.answer} />,
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
            All Membership FAQ's ( Total : {faq?.data?.length || 0} )
          </span>
          <div className="d-flex gap-1">
            <button
              className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#0c0c0c] text-white tracking-wider"
              onClick={() => setModalShow(true)}
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

export default HOC(Faq);
