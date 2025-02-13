/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Form, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DateInMMDDYY } from "../../../Helper/Helper";
import { deleteApi, getApi, postApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaEye, FaRegTrashAlt } from "react-icons/fa";

const Banner = () => {
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const fetchHandler = () => {
    getApi({
      url: "api/v1/Banner/getAllBanner",
      setResponse: setData,
      setLoading,
    });
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  const handleDelete = (ide) => {
    deleteApi({
      url: `api/v1/Banner/${ide}`,
      successMsg: "Removed !",
      additionalFunctions: [fetchHandler],
    });
  };

  function MyVerticallyCenteredModal(props) {
    const [image, setImage] = useState("");
    const [bannerName, setBannerName] = useState("");
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const fd = new FormData();
    fd.append("image", image);
    fd.append("bannerName", bannerName);
    fd.append("type", type);
    fd.append("title", title);
    fd.append("desc", desc);

    const postHandler = (e) => {
      e.preventDefault();
      postApi({
        url: "api/v1/Banner/addBanner",
        payload: fd,
        successMsg: "Created !",
        additionalFunctions: [props.onHide, fetchHandler],
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
            Create New
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={postHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Banner Title</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setBannerName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label> Title</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select onChange={(e) => setType(e.target.value)}>
                <option>Select Your Prefrence</option>
                <option value="offer"> Offer </option>
                <option value="product"> Product </option>
                <option value="finance"> Finance </option>
                <option value="Membership"> Membership </option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                onChange={(e) => setDesc(e.target.value)}
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

  const thead = ["Sno.", "Title", "Type", "Created At", ""];
  const tbody = data?.data?.map((i, index) => [
    `#${index + 1}`,
    i.title,
    i.type,
    DateInMMDDYY(i?.createdAt),
    <span className="flexCont">
      <Link to={`/banner/${i._id}`}>
        <span className="view-icon-container">
          <FaEye />
        </span>
      </Link>
      <span className="remove-icon" onClick={() => handleDelete(i._id)}>
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
              All Banners ({data?.data?.length || 0})
            </span>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/create-home-banner">
                <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider">
                  HomePage Banner
                </button>
              </Link>
              <Link to="/create-partner-banner">
                <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider">
                  Partner Banner
                </button>
              </Link>
              <Link to="/create-shop-banner">
                <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider">
                  Shop Banner
                </button>
              </Link>
              <Link to="/create-service-banner">
                <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider">
                  Service Banner
                </button>
              </Link>
              <Link to="/create-promotion-banner">
                <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider">
                  Promotion Banner
                </button>
              </Link>

              <button
                className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider"
                onClick={() => setModalShow(true)}
              >
                Create Banner
              </button>
            </div>
          </div>

          <TableLayout thead={thead} tbody={tbody} loading={loading} />
        </section>
      </section>
    </>
  );
};

export default HOC(Banner);
