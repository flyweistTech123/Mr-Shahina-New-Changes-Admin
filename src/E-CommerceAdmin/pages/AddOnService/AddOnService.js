/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Modal, Form, Button } from "react-bootstrap";
import {
  EditorDesciption,
  TableImage,
  ViewDescription,
} from "../../../Helper/Helper";
import { DateInMMDDYY } from "../../../Helper/Helper";
import { postApi, editApi, deleteApi, getApi } from "../../../Respo/Api";
import { ClipLoader } from "react-spinners";
import { SectionHeading } from "../../../Component/HelpingComponents";
import TableLayout from "../../../Component/TableLayout";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";

const AddOnService = () => {
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [prevData, setPrevData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const fetchData = async () => {
    getApi({
      url: "api/v1/admin/AddOnServices/allAddOnServices",
      setResponse: setData,
      setLoading,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteHandler = (id) => {
    deleteApi({
      url: `api/v1/admin/AddOnServices/deleteAddOnServices/${id}`,
      successMsg: "Removed !",
      additionalFunctions: [fetchData],
      setLoading,
    });
  };

  function MyVerticallyCenteredModal(props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [totalTime, setTotalTime] = useState("");
    const [image, setImage] = useState(null);

    const payload = new FormData();
    payload.append("name", name);
    payload.append("price", price);
    payload.append("description", description);
    if (image) {
      payload.append("image", image);
    }
    payload.append("totalTime", totalTime);

    const postHandler = (e) => {
      e.preventDefault();
      postApi({
        url: `api/v1/admin/AddOnServices/addAddOnServices`,
        payload,
        successMsg: "Success !",
        setLoading,
        additionalFunctions: [() => props.onHide(), fetchData],
      });
    };

    const putHandler = (e) => {
      e.preventDefault();
      editApi({
        url: `api/v1/admin/AddOnServices/updateAddOnServices/${id}`,
        payload,
        setLoading,
        successMsg: "Success !",
        additionalFunctions: [() => props.onHide(), fetchData],
      });
    };

    useEffect(() => {
      if (props?.show && edit) {
        setName(prevData?.name);
        setPrice(prevData?.price);
        setDescription(prevData?.description);
        setTotalTime(prevData?.totalTime);
      }
    }, [props, edit]);

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
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min={0}
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Time</Form.Label>
              <Form.Control
                type="text"
                placeholder="1hr 30min"
                onChange={(e) => setTotalTime(e.target.value)}
                value={totalTime}
                required
              />
            </Form.Group>

            <EditorDesciption
              setDescription={setDescription}
              description={description}
              label={"Description"}
            />

            <Button
              style={{ backgroundColor: "#19376d", borderRadius: "0" }}
              type="submit"
            >
              {loading ? <ClipLoader color="#fff" /> : "Submit"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  const ExtraComponent = () => {
    return (
      <button
        className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#0c0c0c] text-white tracking-wider"
        onClick={() => {
          setEdit(false);
          setModalShow(true);
        }}
      >
        Create New
      </button>
    );
  };

  const thead = [
    "Sno.",
    "Image",
    "Title",
    "Total Min.",
    "Price",
    "Description",
    "Created at",
    "",
  ];

  const tbody = data?.data?.map((i, index) => [
    `#${index + 1}`,
    TableImage(i?.image),
    i?.name,
    i?.totalTime,
    i?.price,
    <ViewDescription description={i.description} />,
    DateInMMDDYY(i?.createdAt),
    <span className="flexCont">
      <span
        className="edit-icon"
        onClick={() => {
          setId(i._id);
          setPrevData(i);
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
        <SectionHeading
          title={`Add on Service (${data?.data?.length})`}
          ExtraComponent={ExtraComponent}
        />

        <TableLayout thead={thead} tbody={tbody} loading={loading} />
      </section>
    </>
  );
};

export default HOC(AddOnService);
