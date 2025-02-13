/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Link } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import Select from "react-select";
import ReactQuill from "react-quill";
import {  ViewDescription } from "../../../Helper/Helper";
import { getApi, postApi } from "../../../Respo/Api";

const CreateProduct = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [nutritionArray, setNutritionArray] = useState([]);
  const [skinTypeArray, setSkinTypeArray] = useState([]);
  const [productTypeArr, setProductTypeArr] = useState([]);
  const [skinConditionArr, SkinConditionArr] = useState([]);
  const [brandArr, setBrandArr] = useState([]);
  const [stock, setStock] = useState(0);
  const [step, setStep] = useState("");
  const [stepDescription, setStepDescription] = useState("");
  const [howToUse, setHowToUse] = useState([]);
  const [ingredients, setIngredeints] = useState("");
  const [price, setPrice] = useState(0);
  const [benfit, setBenefit] = useState("");
  const [multipleSize, setMultipleSize] = useState("false");
  const [sizes, setSizes] = useState("");
  const [multiplePrice, setMultiplePrice] = useState(0);
  const [multipleStock, setMultipleStock] = useState(0);
  const [multipleArr, setMultipleArr] = useState([]);

  const [nutritionId, setNutritionId] = useState([]);
  const [skinTypeId, seteSkinTypeId] = useState([]);
  const [productTypeId, setProductTypeId] = useState([]);
  const [skinConditionId, setSkinConditionId] = useState([]);
  const [brandId, setBrandId] = useState([]);

  // New Field
  const [keyIngredients, setKeyIngredients] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("");
  const [acneType, setAcneType] = useState("");
  const [considerAcne, setConsiderAcne] = useState("");

  const descObject = {
    step,
    stepDescription,
  };

  const multipleObj = {
    sizes,
    multiplePrice,
    multipleStock,
  };

  const multiple_adder = () => {
    setMultipleArr((prev) => [...prev, multipleObj]);
    setSizes("");
    setMultiplePrice(0);
    setMultipleStock(0);
  };

  const multiple_remover = (index) => {
    setMultipleArr((prev) => prev.filter((_, i) => i !== index));
  };

  const use_adder = () => {
    setHowToUse((prev) => [...prev, descObject]);
    setStep("");
    setStepDescription("");
  };

  const use_remover = (index) => {
    setHowToUse((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchAll = () => {
    getApi({
      url: "api/v1/admin/Nutrition/allNutrition",
      setResponse: setNutritionArray,
    });
    getApi({
      url: "api/v1/admin/SkinType/allSkinType",
      setResponse: setSkinTypeArray,
    });
    getApi({
      url: "api/v1/admin/ProductType/allProductType",
      setResponse: setProductTypeArr,
    });
    getApi({
      url: "api/v1/admin/SkinCondition/allSkinCondition",
      setResponse: SkinConditionArr,
    });
    getApi({
      url: "api/v1/admin/Brand/allBrand",
      setResponse: setBrandArr,
    });
  };

  useEffect(() => {
    fetchAll();
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
  fd.append("name", name);
  fd.append("description", description);
  fd.append("stock", stock);
  Array.from(howToUse).forEach((i) => {
    fd.append("step[]", i.step);
    fd.append("stepDescription[]", i.stepDescription);
  });
  Array.from(multipleArr).forEach((i) => {
    fd.append("sizes[]", i.sizes);
    fd.append("multiplePrice[]", i.multiplePrice);
    fd.append("multipleStock[]", i.multipleStock);
  });
  fd.append("benfit[]", benfit);
  Array.from(nutritionId).forEach((i) => {
    fd.append("nutritionId[]", i.value);
  });
  Array.from(skinTypeId).forEach((i) => {
    fd.append("skinTypeId[]", i.value);
  });
  Array.from(productTypeId).forEach((i) => {
    fd.append("productTypeId[]", i.value);
  });
  Array.from(skinConditionId).forEach((i) => {
    fd.append("skinConditionId[]", i.value);
  });
  Array.from(brandId).forEach((i) => {
    fd.append("brandId[]", i.value);
  });
  fd.append("price", price);
  fd.append("ingredients", ingredients);
  fd.append("multipleSize", multipleSize);
  fd.append("keyIngredients[]", keyIngredients);

  fd.append("returnPolicy", returnPolicy);
  fd.append("acneType", acneType);
  fd.append("considerAcne", considerAcne);

  const createProduct = async (e) => {
    e.preventDefault();
    postApi({
      url: `api/v1/admin/Product/addProduct`,
      payload: fd,
      setLoading: setSubmitLoading,
      successMsg: "Product Created !",
      errorMsg:
        "Image size is too large. Please compress the image before uploading.",
    });
  };

  const pushAllIds = (e, arr, setData) => {
    if (e === true) {
      const allIds = arr?.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setData(allIds);
    } else {
      setData([]);
    }
  };

  return (
    <section>
      <section className="sectionCont">
        <p className="headP">Dashboard / Create New Product</p>

        <Form onSubmit={createProduct}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nutrition</Form.Label>
            <Form.Check
              type="checkbox"
              label={`All`}
              onClick={(e) =>
                pushAllIds(e.target.checked, nutritionArray, setNutritionId)
              }
            />
            <Select
              isMulti
              options={nutritionArray?.data?.map((i) => ({
                value: i._id,
                label: i.name,
              }))}
              placeholder="Select nutrition"
              value={nutritionId}
              onChange={(e) => setNutritionId(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Skin Type</Form.Label>

            <Form.Check
              type="checkbox"
              label={`All`}
              onClick={(e) =>
                pushAllIds(e.target.checked, skinTypeArray, seteSkinTypeId)
              }
            />
            <Select
              isMulti
              options={skinTypeArray?.data?.map((i) => ({
                value: i._id,
                label: i.name,
              }))}
              placeholder="Select Skin Type"
              value={skinTypeId}
              onChange={(e) => seteSkinTypeId(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Product Type</Form.Label>
            <Form.Check
              type="checkbox"
              label={`All`}
              onClick={(e) =>
                pushAllIds(e.target.checked, productTypeArr, setProductTypeId)
              }
            />
            <Select
              isMulti
              options={productTypeArr?.data?.map((i) => ({
                value: i._id,
                label: i.name,
              }))}
              placeholder="Select Product Type"
              value={productTypeId}
              onChange={(e) => setProductTypeId(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skin Condition</Form.Label>
            <Form.Check
              type="checkbox"
              label={`All`}
              onClick={(e) =>
                pushAllIds(
                  e.target.checked,
                  skinConditionArr,
                  setSkinConditionId
                )
              }
            />
            <Select
              isMulti
              options={skinConditionArr?.data?.map((i) => ({
                value: i._id,
                label: i.name,
              }))}
              placeholder="Select Condition"
              value={skinConditionId}
              onChange={(e) => setSkinConditionId(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Brands</Form.Label>
            <Form.Check
              type="checkbox"
              label={`All`}
              onClick={(e) =>
                pushAllIds(e.target.checked, brandArr, setBrandId)
              }
            />
            <Select
              isMulti
              options={brandArr?.data?.map((i) => ({
                value: i._id,
                label: i.name,
              }))}
              placeholder="Select Brand "
              value={brandId}
              onChange={(e) => setBrandId(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>How To Use</Form.Label>
            <Form.Control
              type="text"
              value={step}
              placeholder="Step"
              onChange={(e) => setStep(e.target.value)}
              className="mb-3"
            />

            <ReactQuill
              value={stepDescription}
              onChange={(value) => setStepDescription(value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "indent",
                "link",
              ]}
            />

            <Button variant="dark mt-3" onClick={() => use_adder()}>
              Add
            </Button>
          </Form.Group>

          {howToUse?.map((i, index) => (
            <ul
              className="mt-2"
              style={{
                border: "1px solid #000",
                paddingTop: "10px",
                paddingBottom: "20px",
              }}
            >
              <li style={{ listStyle: "none" }} className="mt-1">
                {i.step}
              </li>
              <li style={{ listStyle: "none" }} className="mt-1">
                <ViewDescription description={i.stepDescription} />
              </li>
              <li className="mt-3" style={{ listStyle: "none" }}>
                <Button onClick={() => use_remover(index)}>
                  Remove This One
                </Button>
              </li>
            </ul>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
          </Form.Group>

          <Form.Group className="mb-3 quill-container">
            <Form.Label>Description</Form.Label>
            <ReactQuill
              value={description}
              onChange={(value) => setDescription(value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "indent",
                "link",
              ]}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ingredients</Form.Label>
            <ReactQuill
              value={ingredients}
              onChange={(value) => setIngredeints(value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "indent",
                "link",
              ]}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Multiple Sizes</Form.Label>
            <Form.Select onChange={(e) => setMultipleSize(e.target.value)}>
              <option>Selete Your Prefrence</option>
              <option value={"true"}>Activate</option>
              <option value={"false"}> Deactivate</option>
            </Form.Select>
          </Form.Group>

              

          {multipleSize === "false" ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  step={0.01}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </Form.Group>
            </>
          ) : (
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
                  step={0.01}
                  onChange={(e) => setMultiplePrice(e.target.value)}
                  className="mb-3"
                />

                <Form.Control
                  type="number"
                  value={multipleStock}
                  placeholder="Stock"
                  min={0}
                  onChange={(e) => setMultipleStock(e.target.value)}
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
                    {i.sizes}
                  </li>
                  <li style={{ listStyle: "disc" }} className="mt-1">
                    {i.multiplePrice}
                  </li>
                  <li style={{ listStyle: "disc" }} className="mt-1">
                    {i.multipleStock}
                  </li>
                  <li className="mt-3" style={{ listStyle: "none" }}>
                    <Button onClick={() => multiple_remover(index)}>
                      Remove This One
                    </Button>
                  </li>
                </ul>
              ))}
            </>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Benefit</Form.Label>
            <ReactQuill
              value={benfit}
              onChange={(value) => setBenefit(value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "indent",
                "link",
              ]}
            />
          </Form.Group>

          {/* Key Ingredients */}
          <Form.Group className="mb-3">
            <Form.Label>Key Ingredients</Form.Label>
            <ReactQuill
              value={keyIngredients}
              onChange={(value) => setKeyIngredients(value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "indent",
                "link",
              ]}
            />
          </Form.Group>

          {/* Return Policu */}
          <Form.Group className="mb-3">
            <Form.Label>Return Policy</Form.Label>
            <ReactQuill
              value={returnPolicy}
              onChange={(value) => setReturnPolicy(value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "indent",
                "link",
              ]}
            />
          </Form.Group>

          {/* Acne Type */}
          <Form.Group className="mb-3">
            <Form.Label>Acne Type</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setAcneType(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Consider Acne</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setConsiderAcne(e.target.value)}
            />
          </Form.Group>

          <div className="w-100 d-flex justify-content-between">
            <Button variant="success" type="submit">
              {submitLoading ? (
                <Spinner animation="border" role="status" />
              ) : (
                "Submit"
              )}
            </Button>

            <Link to="/Product">
              <Button variant="dark">Back</Button>
            </Link>
          </div>
        </Form>
      </section>
    </section>
  );
};

export default HOC(CreateProduct);
