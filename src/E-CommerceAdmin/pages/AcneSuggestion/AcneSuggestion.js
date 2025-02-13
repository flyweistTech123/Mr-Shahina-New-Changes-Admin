/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Modal, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { DateInMMDDYY } from "../../../Helper/Helper";
import { getApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { Link } from "react-router-dom";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";

const AcneSuggestion = () => {
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = () => {
    getApi({
      url: "api/v1/AcneQuizSuggession",
      setResponse: setData,
      setLoading,
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
        `${process.env.React_App_Baseurl}api/v1/admin/AcneQuizSuggession/deleteAcneQuizSuggession/${id}`,
        Auth
      );
      toast.success(data.message);
      fetchData();
    } catch (e) {
      const msg = e.response.data.message;
      toast.error(msg);
    }
  };

  function MyVerticallyCenteredModal(props) {
    const [answer1, setAnswer1] = useState("");
    const [answer2, setAnswer2] = useState("");
    const [answer3, setAnswer3] = useState("");
    const [answer4, setAnswer4] = useState("");
    const [productId, setProductId] = useState("");
    const [result, setResult] = useState([]);
    const [products, setProducts] = useState([]);

    let payload;
    payload = {
      answer1,
      answer2,
      answer3,
      answer4,
      productId,
    };
    const getQuiz = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.React_App_Baseurl}api/v1/AcneQuiz`
        );
        setResult(data?.data);
      } catch {}
    };

    const getProduct = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.React_App_Baseurl}api/v1/Product/all/getAllProducts`
        );
        setProducts(data.data);
      } catch {}
    };

    useEffect(() => {
      if (props.show) {
        getQuiz();
        getProduct();
      }
    }, [props]);

    const postHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `${process.env.React_App_Baseurl}api/v1/AcneQuizSuggession/addAcneQuizSuggession`,
          payload,
          Auth
        );
        toast.success(data.message);
        props.onHide();
        fetchData();
      } catch (e) {
        console.log(e);
        toast.error(e?.response?.data?.message);
      }
    };

    const putHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.put(
          `${process.env.React_App_Baseurl}api/v1/AcneQuizSuggession/updateAcneQuiz/${id}`,
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
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {" "}
            {edit ? "Edit" : "Create New"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={edit ? putHandler : postHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Answer 1</Form.Label>
              <Form.Select onChange={(e) => setAnswer1(e.target.value)}>
                <option>Select Your Prefrence</option>
                <option value={result?.[0]?.option1}>
                  {" "}
                  {result?.[0]?.option1}{" "}
                </option>
                <option value={result?.[0]?.option2}>
                  {" "}
                  {result?.[0]?.option2}{" "}
                </option>
                <option value={result?.[0]?.option3}>
                  {" "}
                  {result?.[0]?.option3}{" "}
                </option>
                <option value={result?.[0]?.option4}>
                  {" "}
                  {result?.[0]?.option4}{" "}
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Answer 2</Form.Label>
              <Form.Select onChange={(e) => setAnswer2(e.target.value)}>
                <option>Select Your Prefrence</option>
                <option value={result?.[1]?.option1}>
                  {" "}
                  {result?.[1]?.option1}{" "}
                </option>
                <option value={result?.[1]?.option2}>
                  {" "}
                  {result?.[1]?.option2}{" "}
                </option>
                <option value={result?.[1]?.option3}>
                  {" "}
                  {result?.[1]?.option3}{" "}
                </option>
                <option value={result?.[1]?.option4}>
                  {" "}
                  {result?.[1]?.option4}{" "}
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Answer 3</Form.Label>
              <Form.Select onChange={(e) => setAnswer3(e.target.value)}>
                <option>Select Your Prefrence</option>
                <option value={result?.[2]?.option1}>
                  {" "}
                  {result?.[2]?.option1}{" "}
                </option>
                <option value={result?.[2]?.option2}>
                  {" "}
                  {result?.[2]?.option2}{" "}
                </option>
                <option value={result?.[2]?.option3}>
                  {" "}
                  {result?.[2]?.option3}{" "}
                </option>
                <option value={result?.[2]?.option4}>
                  {" "}
                  {result?.[2]?.option4}{" "}
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Answer 4</Form.Label>
              <Form.Select onChange={(e) => setAnswer4(e.target.value)}>
                <option>Select Your Prefrence</option>
                <option value={result?.[3]?.option1}>
                  {" "}
                  {result?.[3]?.option1}{" "}
                </option>
                <option value={result?.[3]?.option2}>
                  {" "}
                  {result?.[3]?.option2}{" "}
                </option>
                <option value={result?.[3]?.option3}>
                  {" "}
                  {result?.[3]?.option3}{" "}
                </option>
                <option value={result?.[3]?.option4}>
                  {" "}
                  {result?.[3]?.option4}{" "}
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Select
                options={products?.map((i) => ({
                  value: i._id,
                  label: i.name,
                }))}
                placeholder="Select Product"
                onChange={(e) => setProductId(e.value)}
              />
            </Form.Group>

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

  const thead = [
    "Sno.",
    "Answer 1",
    "Answer 2",
    "Answer 3",
    "Answer 4",
    "Product",
    "Created at",
    "",
  ];

  const tbody = data?.data?.map((i, index) => [
    `#${index + 1}`,
    i.answer1,
    i.answer2,
    i.answer3,
    i.answer4,
    <Link to={`/product/${i?.productId}`}>View</Link>,
    DateInMMDDYY(i?.createdAt),
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
            Acne Quiz Suggestion
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

export default HOC(AcneSuggestion);
