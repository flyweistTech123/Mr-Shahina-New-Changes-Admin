/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Link, useParams } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { ConvertInMin, EditorDesciption } from "../../../Helper/Helper";
import { durationOption } from "../../../Helper/Constant";
import { editApi } from "../../../Respo/Api";

const Editservice = () => {
  const { id } = useParams();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [mPrice, setMPrice] = useState(0);
  const [type, setType] = useState("");
  const [multipleSize, setMultipleSize] = useState("");
  const [sizes, setSizes] = useState("");
  const [memberPrice, setMemberPrice] = useState("");
  const [multiplePrice, setMultiplePrice] = useState("");
  const [area, setArea] = useState("");
  const [session, setSession] = useState("");
  const [benfit, setBenefit] = useState("");
  const [images, setImages] = useState([]);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [beforeAfterImage, setBeforeAfterImage] = useState("");
  const [catArr, setCatArr] = useState([]);
  const [multipleArr, setMultipleArr] = useState([]);
  const [areaArr, setAreaArr] = useState([]);
  const [sessionArr, setSessionArr] = useState([]);
  const [benifitArr, setBenifitArr] = useState([]);
  const [totalTime, setTotalTime] = useState("");
  const [totalsizeTime, setTotalSizeTime] = useState("");
  const [data, setData] = useState({});
  const [duration1, setDuration1] = useState({});
  const [totalSizeMin, setTotalSizeMin] = useState("");
  const [totalMin, setTotalmin] = useState("");
  const [duration2, setDuration2] = useState({});
  const [savedPrice, setSavedPrice] = useState(0);

  const multipleObj = {
    sizes,
    multiplePrice,
    memberPrice,
    totalsizeTime,
    totalSizeMin,
    savedPrice,
  };

  function multiplePayloadRemover() {
    setSizes("");
    setMultiplePrice("");
    setMemberPrice("");
    setTotalSizeMin("");
    setDuration1({});
    setSavedPrice(0);
  }

  const multiple_adder = () => {
    setMultipleArr((prev) => [...prev, multipleObj]);
    multiplePayloadRemover();
  };

  const multiple_remover = (index) => {
    setMultipleArr((prev) => prev.filter((_, i) => i !== index));
  };
  // ----------------
  const area_adder = () => {
    setAreaArr((prev) => [...prev, area]);
    setArea("");
  };

  const area_remover = (index) => {
    setAreaArr((prev) => prev.filter((_, i) => i !== index));
  };
  // -------------
  const session_adder = () => {
    setSessionArr((prev) => [...prev, session]);
    setSession("");
  };

  const session_remover = (index) => {
    setSessionArr((prev) => prev.filter((_, i) => i !== index));
  };
  // ----------
  const benefit_adder = () => {
    setBenifitArr((prev) => [...prev, benfit]);
    setBenefit("");
  };

  const benefit_remover = (index) => {
    setBenifitArr((prev) => prev.filter((_, i) => i !== index));
  };
  // ----------

  const fetchNut = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/Category/allCategory`
      );
      setCatArr(data?.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchNut();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const fd = new FormData();
  Array.from(images).forEach((img) => {
    fd.append("image", img);
  });

  const appendIfPresent = (formData, key, value) => {
    if (value) {
      formData.append(key, value);
    }
  };

  appendIfPresent(fd, "name", name);
  appendIfPresent(fd, "categoryId", categoryId);
  appendIfPresent(fd, "description", description);
  appendIfPresent(fd, "beforeAfterImage", beforeAfterImage);
  appendIfPresent(fd, "type", type);
  if (type === "offer") {
    appendIfPresent(fd, "price", price);
    appendIfPresent(fd, "discountPrice", discountPrice);
    appendIfPresent(fd, "totalMin", totalMin);
    appendIfPresent(fd, "totalTime", totalTime);
  } else {
    appendIfPresent(fd, "multipleSize", multipleSize);
    if (multipleSize === true || multipleSize === "true") {
      Array.from(multipleArr).forEach((i) => {
        appendIfPresent(fd, "memberPrice", i.memberPrice);
        appendIfPresent(fd, "multiplePrice", i.multiplePrice);
        appendIfPresent(fd, "sizes", i.sizes);
        appendIfPresent(fd, "totalsizeTime", i.totalsizeTime);
        appendIfPresent(fd, "totalSizeMin", i.totalSizeMin);
        appendIfPresent(fd, "savedPrice", i.savedPrice);
      });
    } else {
      appendIfPresent(fd, "price", price);
      appendIfPresent(fd, "mPrice", mPrice);
      appendIfPresent(fd, "totalTime", totalTime);
      appendIfPresent(fd, "totalMin", totalMin);
    }
  }
  Array.from(areaArr).forEach((i) => {
    fd.append("area", i);
  });
  Array.from(sessionArr).forEach((i) => {
    fd.append("session", i);
  });
  if (benifitArr?.length > 0) {
    Array.from(benifitArr).forEach((i) => {
      fd.append("benfit[]", i);
    });
  } else {
    fd.append("benfit[]", "null");
  }

  const createProduct = async (e) => {
    e.preventDefault();
    editApi({
      url: `api/v1/Service/editService/${id}`,
      payload: fd,
      setLoading: setSubmitLoading,
      successMsg: "Service Edited",
    });
  };

  // Get Service Details
  const getDetail = async () => {
    try {
      const response = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/Service/${id}`
      );
      setData(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDetail();
  }, [id]);

  useEffect(() => {
    if (data) {
      setCategoryId(data?.categoryId?._id);
      setType(data?.type);
      setAreaArr(data?.area ? data?.area : []);
      setDescription(data?.description);
      setMultipleSize(data?.multipleSize === true ? "true" : "false");
      setName(data?.name);
      setTotalTime(data?.totalTime);
      setTotalmin(data?.totalMin);
      setSessionArr(data?.session?.length > 0 ? data?.session : []);
      setBenifitArr(data?.benfit ? data?.benfit : []);
      setPrice(data?.price);
      setMPrice(data?.mPrice);
      setDiscountPrice(data?.discountPrice);
      if (data?.sizePrice) {
        for (const item of data?.sizePrice) {
          setMultipleArr((prev) => [
            ...prev,
            {
              sizes: item?.size,
              multiplePrice: item?.price,
              memberPrice: item?.mPrice,
              totalsizeTime: item?.totalTime,
              totalSizeMin: item?.totalMin,
              savedPrice: item?.savedPrice,
            },
          ]);
        }
      }
      setDuration2({
        value: data?.totalTime,
        label: data?.totalTime,
      });
    }
  }, [data]);

  const durationHandler = (e) => {
    setDuration1(e);
    ConvertInMin(e.value, setTotalSizeTime, setTotalSizeMin);
  };

  const durationHandle2 = (e) => {
    setDuration2(e);
    ConvertInMin(e.value, setTotalTime, setTotalmin);
  };

  return (
    <section>
      <section className="sectionCont">
        <p className="headP">Dashboard / Edit Service</p>

        <Form onSubmit={createProduct}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option>Selete Your Prefrence</option>
              {catArr?.map((i, index) => (
                <option key={index} value={i._id}>
                  {" "}
                  {i?.name}{" "}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Before / After Image</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setBeforeAfterImage(e.target.files[0])}
            />
          </Form.Group>

          <EditorDesciption
            setDescription={setDescription}
            description={description}
            label={"Description"}
          />

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              <option>Selete Your Prefrence</option>
              <option value="Service"> Service </option>
              <option value="offer"> Offer </option>
            </Form.Select>
          </Form.Group>

          {type === "Service" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Multiple Sizes</Form.Label>
                <Form.Select
                  value={multipleSize}
                  onChange={(e) => setMultipleSize(e.target.value)}
                >
                  <option>Selete Your Prefrence</option>
                  <option value={"true"}>Activate</option>
                  <option value={"false"}> Deactivate</option>
                </Form.Select>
              </Form.Group>
              {multipleSize === "true" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Multiple Sizes Detail</Form.Label>
                    <Form.Control
                      type="text"
                      value={sizes}
                      placeholder="Size"
                      onChange={(e) => setSizes(e.target.value)}
                      className="mb-3"
                    />

                    <Form.Control
                      type="number"
                      min={0}
                      value={multiplePrice}
                      placeholder="Price"
                      onChange={(e) => setMultiplePrice(e.target.value)}
                      className="mb-3"
                    />

                    <Form.Control
                      type="number"
                      value={memberPrice}
                      placeholder="Member Price"
                      min={0}
                      onChange={(e) => setMemberPrice(e.target.value)}
                      className="mb-3"
                    />
                    <Form.Control
                      type="number"
                      value={savedPrice}
                      placeholder="Per Session"
                      min={0}
                      onChange={(e) => setSavedPrice(e.target.value)}
                      className="mb-3"
                    />

                    <Select
                      options={durationOption}
                      placeholder="Select Duration"
                      onChange={(e) => durationHandler(e)}
                      className="mb-3"
                      value={duration1}
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
                        {i.sizes}
                      </li>
                      <li style={{ listStyle: "disc" }} className="mt-1">
                        {i.multiplePrice}
                      </li>
                      <li style={{ listStyle: "disc" }} className="mt-1">
                        {i.memberPrice}
                      </li>
                      <li style={{ listStyle: "disc" }} className="mt-1">
                        {i.totalsizeTime}
                      </li>
                      <li style={{ listStyle: "disc" }} className="mt-1">
                        {i.savedPrice}
                      </li>
                      <li className="mt-3" style={{ listStyle: " none" }}>
                        <Button onClick={() => multiple_remover(index)}>
                          Remove This One
                        </Button>
                      </li>
                    </ul>
                  ))}
                </>
              )}

              {multipleSize === "false" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Member Price</Form.Label>
                    <Form.Control
                      type="number"
                      min={0}
                      value={mPrice}
                      onChange={(e) => setMPrice(e.target.value)}
                    />
                  </Form.Group>
                  <Select
                    options={durationOption}
                    value={duration2}
                    placeholder="Select Duration"
                    onChange={(e) => durationHandle2(e)}
                    className="mb-3"
                  />
                </>
              )}
            </>
          )}

          {type === "offer" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Discount Price </Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>

              <Select
                options={durationOption}
                value={duration2}
                placeholder="Select Duration"
                onChange={(e) => durationHandle2(e)}
                className="mb-3"
              />
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Area Detail</Form.Label>
            <Form.Control
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="mb-3"
            />
            <Button variant="dark" onClick={() => area_adder()}>
              Add
            </Button>
          </Form.Group>

          {areaArr?.map((i, index) => (
            <ul
              className="mt-2"
              style={{
                border: "1px solid #000",
                paddingTop: "10px",
                paddingBottom: "20px",
              }}
            >
              <li style={{ listStyle: "disc" }} className="mt-1">
                {i}
              </li>
              <li className="mt-3" style={{ listStyle: " none" }}>
                <Button onClick={() => area_remover(index)}>
                  Remove This One
                </Button>
              </li>
            </ul>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Session Detail</Form.Label>
            <Form.Control
              type="text"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="mb-3"
            />
            <Button variant="dark" onClick={() => session_adder()}>
              Add
            </Button>
          </Form.Group>

          {sessionArr?.map((i, index) => (
            <ul
              className="mt-2"
              style={{
                border: "1px solid #000",
                paddingTop: "10px",
                paddingBottom: "20px",
              }}
            >
              <li style={{ listStyle: "disc" }} className="mt-1">
                {i}
              </li>
              <li className="mt-3" style={{ listStyle: " none" }}>
                <Button onClick={() => session_remover(index)}>
                  Remove This One
                </Button>
              </li>
            </ul>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Benefit </Form.Label>
            <Form.Control
              type="text"
              value={benfit}
              onChange={(e) => setBenefit(e.target.value)}
              className="mb-3"
            />
            <Button variant="dark" onClick={() => benefit_adder()}>
              Add
            </Button>
          </Form.Group>

          {benifitArr?.map((i, index) => (
            <ul
              className="mt-2"
              style={{
                border: "1px solid #000",
                paddingTop: "10px",
                paddingBottom: "20px",
              }}
            >
              <li style={{ listStyle: "disc" }} className="mt-1">
                {i}
              </li>
              <li className="mt-3" style={{ listStyle: " none" }}>
                <Button onClick={() => benefit_remover(index)}>
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

            <Link to="/service">
              <Button variant="dark">Back</Button>
            </Link>
          </div>
        </Form>
      </section>
    </section>
  );
};

export default HOC(Editservice);
