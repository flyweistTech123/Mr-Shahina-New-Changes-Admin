/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Form , Modal, Button } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const [data, setData] = useState({});
  const [modalShow, setModalShow] = useState(false);

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/ContactDetails/viewContactDetails`
      );
      setData(data.data);
    } catch (e) {
      console.log(e);
    }
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
    const [image, setImage] = useState("");
    const [fb, setFb] = useState("");
    const [google, setGoogle] = useState("");
    const [instagram, setInstagram] = useState("");
    const [map, setMap] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [mapLink, setMapLink] = useState("");
    const [sundayClose, setSundayClose] = useState("");
    const [monToFriday, setMonTOFriday] = useState("");
    const [saturday, setSaturday] = useState("");
    const [ratings, setRating] = useState("");
    const [numOfReviews, setNumOfReviews] = useState("");

    const payload = new FormData();
    payload.append("image", image);
    payload.append("fb", fb);
    payload.append("google", google);
    payload.append("instagram", instagram);
    payload.append("map", map);
    payload.append("address", address);
    payload.append("phone", phone);
    payload.append("email", email);
    payload.append("name", name);
    payload.append("mapLink", mapLink);
    payload.append("sundayClose", sundayClose);
    payload.append("monToFriday", monToFriday);
    payload.append("saturday", saturday);
    payload.append("ratings", ratings);
    payload.append("numOfReviews", numOfReviews);

    const postHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `${process.env.React_App_Baseurl}api/v1/ContactDetails/addContactDetails`,
          payload,
          Auth
        );
        toast.success(data.message);
        props.onHide();
        fetchData();
      } catch (e) {
        console.log(e);
        const msg = e.response.data.message;
        toast.error(msg);
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
            Create Contact Detail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={postHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Facebook </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setFb(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image </Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Google </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setGoogle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>instagram </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setInstagram(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label> Embeded Map </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setMap(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone </Form.Label>
              <Form.Control
                type="tel"
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email </Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Map Link </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setMapLink(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sunday Close </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setSundayClose(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Monday to friday </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setMonTOFriday(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Saturday </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setSaturday(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rating </Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => setRating(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Num of Reviews </Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setNumOfReviews(e.target.value)}
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  function ValueChecker(holder, string) {
    return holder ? (
      <div className="Desc-Container">
        <p className="title"> {string} </p>
        <p className="desc"> {holder} </p>
      </div>
    ) : (
      ""
    );
  }


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
            Contact Details
          </span>
          <div className="d-flex gap-1">
            <button
              className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider"
              onClick={() => setModalShow(true)}
            >
              Create / Update
            </button>
          </div>
        </div>

        {data?.image && (
          <div className="Desc-Container mb-3">
            <p className="title"> Image </p>
            <div className="img-cont">
              <img src={data?.image} alt="" className="centerImage" />
            </div>
          </div>
        )}
        {ValueChecker(data?.fb, "Facebook")}
        {ValueChecker(data?.google, "Google")}
        {ValueChecker(data?.instagram, "instagram")}
        {ValueChecker(data?.map, "Embeded Map")}
        {ValueChecker(data?.address, "Address ")}
        {ValueChecker(data?.phone, "Phone Number ")}
        {ValueChecker(data?.email, "Email Address ")}
        {ValueChecker(data?.name, "Title ")}
        {ValueChecker(data?.sundayClose, "Sunday Close ")}
        {ValueChecker(data?.saturday, "Saturday ")}
        {ValueChecker(data?.monToFriday, "Monday to Friday ")}
        {ValueChecker(data?.ratings, "Rating")}
        {ValueChecker(data?.numOfReviews, "Num of Reviews")}
      </section>
    </>
  );
};

export default HOC(Contact);
