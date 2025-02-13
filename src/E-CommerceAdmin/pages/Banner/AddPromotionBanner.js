/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Link } from "react-router-dom";
import { Form, Button, FloatingLabel, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { EditorDesciption } from "../../../Helper/Helper";

const AddPromotionBanner = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [image, setImage] = useState("");
  const [appleLink, setAppleLink] = useState("");
  const [playstoreLink, setPlayStoreLink] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [off, setOff] = useState("");
  const Baseurl = process.env.React_App_Baseurl;
  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fd = new FormData();
  fd.append("image", image);
  fd.append("appleLink", appleLink);
  fd.append("playstoreLink", playstoreLink);
  fd.append("title", title);
  fd.append("desc", desc);
  fd.append("off", off);

  const createProduct = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await axios.post(
        `${Baseurl}api/v1/Banner/createPromotionBanner`,
        fd,
        Auth
      );
      toast.success(res.data.message);
      setSubmitLoading(false);
    } catch (e) {
      console.log(e);
      const msg = e.response.data.message;
      toast.error(msg);
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <section>
      <section className="sectionCont">
        <p className="headP">Dashboard / Create Partner Banner</p>

        <Form onSubmit={createProduct}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apple Link</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setAppleLink(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>PlayStore Link</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setPlayStoreLink(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Off</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setOff(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>
          <EditorDesciption
            setDescription={setDesc}
            description={desc}
            label={"Description"}
          />

          <div className="w-100 d-flex justify-content-between">
            <Button variant="success" type="submit">
              {submitLoading ? (
                <Spinner animation="border" role="status" />
              ) : (
                "Submit"
              )}
            </Button>

            <Link to="/banner">
              <Button variant="dark">Back</Button>
            </Link>
          </div>
        </Form>
      </section>
    </section>
  );
};

export default HOC(AddPromotionBanner);
