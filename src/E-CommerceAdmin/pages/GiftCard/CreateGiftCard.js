/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Link } from "react-router-dom";
import { Form, Button, FloatingLabel, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { EditorDesciption } from "../../../Helper/Helper";

const CreateGiftCard = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [giftCardrewards, setGiftCardReward] = useState("");
  const [price, setPrice] = useState("");
  const [priceArr, setPriceArr] = useState([]);

  const descObject = {
    giftCardrewards,
    price,
  };

  const use_adder = () => {
    setPriceArr((prev) => [...prev, descObject]);
    setGiftCardReward(0);
    setPrice(0);
  };

  const use_remover = (index) => {
    setPriceArr((prev) => prev.filter((_, i) => i !== index));
  };

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fd = new FormData();
  fd.append("name", name);
  fd.append("description", description);
  fd.append("image", image);
  Array.from(priceArr).forEach((i) => {
    fd.append("giftCardrewards", i.giftCardrewards);
    fd.append("price", i.price);
  });

  const createProduct = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await axios.post(
        `${process.env.React_App_Baseurl}api/v1/admin/GiftCards/addgiftCard`,
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
        <p className="headP">
          Dashboard / Create New Gift Card / Update Existing
        </p>

        <Form onSubmit={createProduct}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gift Card Rewards</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={giftCardrewards}
              placeholder="Reward"
              onChange={(e) => setGiftCardReward(e.target.value)}
              className="mb-3"
            />

            <Form.Control
              type="number"
              min={0}
              value={price}
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
              className="mb-3"
            />

            <Button variant="dark" onClick={() => use_adder()}>
              Add
            </Button>
          </Form.Group>

          {priceArr?.map((i, index) => (
            <ul
              className="mt-2"
              style={{
                border: "1px solid #000",
                paddingTop: "10px",
                paddingBottom: "20px",
              }}
            >
              <li style={{ listStyle: "disc" }} className="mt-1">
                Price : {i.price}
              </li>
              <li style={{ listStyle: "disc" }} className="mt-1">
                Gift Card : {i.giftCardrewards}
              </li>
              <li className="mt-3">
                <Button onClick={() => use_remover(index)}>
                  Remove This One
                </Button>
              </li>
            </ul>
          ))}

          <EditorDesciption
            setDescription={setDescription}
            description={description}
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

            <Link to="/giftCard">
              <Button variant="dark">Back</Button>
            </Link>
          </div>
        </Form>
      </section>
    </section>
  );
};

export default HOC(CreateGiftCard);
