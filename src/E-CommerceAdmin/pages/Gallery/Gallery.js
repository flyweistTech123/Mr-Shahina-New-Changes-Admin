/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Modal, Form, Button } from "react-bootstrap";
import { deleteApi, editApi, getApi, postApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";

const Gallery = () => {
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [id, setId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchHandler = () => {
    getApi({
      url: `api/v1/Gallary/getGallary`,
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
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");

    const fd = new FormData();
    fd.append("description", description);
    fd.append("image", image);

    const postHandler = async (e) => {
      e.preventDefault();
      postApi({
        url: "api/v1/Gallary/addGallary",
        payload: fd,
        additionalFunctions: [props.onHide, fetchHandler],
        successMsg: "Created !",
      });
    };

    const putHandler = async (e) => {
      e.preventDefault();
      editApi({
        url: `api/v1/Gallary/updateGallary/${id}`,
        payload: fd,
        additionalFunctions: [props.onHide, fetchHandler],
        successMsg: "Updated !",
      });
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
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                required
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button
              style={{ backgroundColor: "#042b26", borderRadius: "0" }}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  const handleDelete = async (ide) => {
    const additionalFunctions = [fetchHandler];
    deleteApi({
      url: `api/v1/Gallary/${ide}`,
      successMsg: "Removed !",
      setLoading,
      additionalFunctions,
    });
  };

  const galleryListingHead = ["No.", "Image", "Title", ""];
  const galleryListing = data?.data?.map((i, index) => [
    `#${index + 1}`,
    <img src={i.image} alt="" style={{ maxWidth: "60px" }} />,
    i.description,
    <span className="flexCont">
      <span className="remove-icon" onClick={() => handleDelete(i._id)}>
        <FaRegTrashAlt />
      </span>
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
              All Gallery ({data?.data?.length})
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
            thead={galleryListingHead}
            tbody={galleryListing}
            loading={loading}
          />
        </section>
      </section>
    </>
  );
};

export default HOC(Gallery);
