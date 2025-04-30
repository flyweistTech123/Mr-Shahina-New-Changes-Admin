/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Badge, Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { deleteApi, getApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaRegTrashAlt } from "react-icons/fa";

const returnFullName = (item) => {
  if (item?.fullName) {
    return item.fullName;
  }

  const firstName = item?.firstName || "";
  const lastName = item?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "-";
};

const Rewards = () => {
  const [data, setData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const Baseurl = process.env.React_App_Baseurl;
  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [searchQuery, setSearchQuery] = useState("");


  const fetchData = async () => {
    getApi({
      url: "api/v1/admin/getAllcoupan",
      setLoading,
      setResponse: setData,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create / Edit Modal
  function MyVerticallyCenteredModal(props) {
    const [user, setUser] = useState("");
    const [title, setTitle] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [price, setPrice] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [activationDate, setActivationDate] = useState("");
    const [per, setPer] = useState("");
    const [completeVisit, setCompleteVisit] = useState("");
    const [image, setImage] = useState("");
    const [users, setUsers] = useState([]);

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${Baseurl}api/v1/admin/getAllUser`);
        setUsers(data?.data?.reverse());
      } catch { }
    };

    useEffect(() => {
      if (props.show) {
        fetchUser();
      }
    }, [props]);

    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, []);

    const fd = new FormData();
    fd.append("user", user);
    fd.append("title", title);
    fd.append("email", email);
    fd.append("description", description);
    fd.append("discount", discount);
    fd.append("price", price);
    fd.append("expirationDate", expirationDate);
    fd.append("activationDate", activationDate);
    fd.append("per", per);
    fd.append("completeVisit", completeVisit);
    fd.append("image", image);

    const postHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `${Baseurl}api/v1/admin/addCoupan`,
          fd,
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
        size="lg"
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
              <Form.Label>User</Form.Label>
              <Form.Select onChange={(e) => setUser(e.target.value)}>
                <option>Select Your Prefrence</option>
                {users?.map((i, index) => (
                  <option key={index} value={i._id}>
                    {" "}
                    {i.firstName + " " + i.lastName}{" "}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>{" "}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>{" "}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>{" "}
            <Form.Group className="mb-3">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                min={0}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min={0}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Activation Date</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setActivationDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Per</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setPer(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CompleteVisit</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setCompleteVisit(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
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

  const deleteHandler = async (id) => {
    deleteApi({
      url: `api/v1/admin/Coupan/${id}`,
      successMsg: "Removed",
      additionalFunctions: [fetchData],
      setLoading
    });
  };

  const thead = [
    "Sno.",
    "Title",
    "Code",
    "Price",
    // "Discount",
    "Email",
    "Used",
    "Provider",
    // "Order Status",
    // "Payment Status",
    "",
  ];

  const filteredData = data?.cart
    ?.filter((item) => {
      const email = item?.email || item?.user?.email || "";
      const code = item?.code || "";
      const query = searchQuery?.toLowerCase();
      return email?.toLowerCase()?.includes(query) || code.toLowerCase()?.includes(query);
    })
    ?.reverse()
    ?.map((i, index) => [
      `#${index + 1}`,
      i?.title,
      i?.code,
      i?.price ? `$${i?.price}` : "",
      // i?.discount ? `$${i?.discount}` : "",
      i?.email ? i?.email : i?.user?.email,
      i?.used === true ? "Yes" : "No",
      returnFullName(i?.senderUser),
      <span className="remove-icon" onClick={() => deleteHandler(i._id)}>
        <FaRegTrashAlt />
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
            All Purchased Gift Card's ( Total : {data?.cart?.length || 0} )
          </span>
          {/* <button
            className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider"
            onClick={() => setModalShow(true)}
          >
            Create
          </button> */}
        </div>
        <div className="filterBox">
          <img
            src="https://t4.ftcdn.net/jpg/01/41/97/61/360_F_141976137_kQrdYIvfn3e0RT1EWbZOmQciOKLMgCwG.jpg"
            alt=""
          />
          <input
            type="search"
            placeholder="Start typing to search for gift cards"
            onChange={(e) => setSearchQuery(e.target.value)}
          />

        </div>

        <TableLayout thead={thead} tbody={filteredData} loading={loading} />
      </section>
    </>
  );
};

export default HOC(Rewards);
