/** @format */

import React, {  useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Link } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const AddShopBanner = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [shopImage, setShopImage] = useState([]);
  const [images, setImages] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [multipleArr, setMultipleArr] = useState([]);

  const Baseurl = process.env.React_App_Baseurl;
  const multipleObj = {
    images,
    desc,
    title,
  };

  const multiple_adder = () => {
    setMultipleArr((prev) => [...prev, multipleObj]);
    setImages("");
    setTitle("");
    setDesc("");
  };

  const multiple_remover = (index) => {
    setMultipleArr((prev) => prev.filter((_, i) => i !== index));
  };

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fd = new FormData();
  Array.from(shopImage).forEach((img) => {
    fd.append("shopImage", img);
  });

  Array.from(multipleArr).forEach((i) => {
    fd.append("images", i.images);
    fd.append("title", i.title);
    fd.append("desc", i.desc);
  });

  const createProduct = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await axios.post(
        `${Baseurl}api/v1/ShopPage/addShopPage`,
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
        <p className="headP">Dashboard / Create New Shop Image</p>

        <Form onSubmit={createProduct}>
          <Form.Group className="mb-3">
            <Form.Label>Shop Image</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setShopImage(e.target.files)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Details</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImages(e.target.files[0])}
              className="mb-3"
            />

            <Form.Control
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              className="mb-3"
            />

            <Form.Control
              as="textarea"
              value={desc}
              placeholder="Description"
              row={5}
              onChange={(e) => setDesc(e.target.value)}
              className="mb-3"
            />

            <Button variant="dark" onClick={() => multiple_adder()}>
              Add
            </Button>
          </Form.Group>

          {multipleArr?.map((i, index) => (
            <ul
              className="mt-2"
              style={{
                border: "1px solid #000",
                paddingTop: "10px",
                paddingBottom: "20px",
              }}
            >
              
              <li style={{ listStyle: "disc" }} className="mt-1">
                {i.desc}
              </li>
              <li style={{ listStyle: "disc" }} className="mt-1">
                {i.title}
              </li>
              <li className="mt-3">
                <Button onClick={() => multiple_remover(index)}>
                  Remove This One
                </Button>
              </li>
            </ul>
          ))}

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

export default HOC(AddShopBanner);
