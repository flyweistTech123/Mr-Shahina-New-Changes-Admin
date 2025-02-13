/** @format */
import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Link, useParams } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { EditorDesciption, ViewDescription } from "../../../Helper/Helper";
import { editApi } from "../../../Respo/Api";

const EditProduct = () => {
  const { product } = useParams();
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
  const [benfit, setBenefit] = useState([]);
  const [multipleSize, setMultipleSize] = useState("false");
  const [sizes, setSizes] = useState("");
  const [multiplePrice, setMultiplePrice] = useState(0);
  const [multipleStock, setMultipleStock] = useState(0);
  const [multipleArr, setMultipleArr] = useState([]);
  // New Field
  const [keyIngredients, setKeyIngredients] = useState([]);
  const [returnPolicy, setReturnPolicy] = useState("");
  const [acneType, setAcneType] = useState("");
  const [considerAcne, setConsiderAcne] = useState("");
  const [nutritionId, setNutritionId] = useState("");
  const [skinTypeId, seteSkinTypeId] = useState("");
  const [productTypeId, setProductTypeId] = useState("");
  const [skinConditionId, setSkinConditionId] = useState("");
  const [brandId, setBrandId] = useState("");

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

  const fetchNut = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/Nutrition/allNutrition`
      );
      setNutritionArray(data?.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const fetchSkinType = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/SkinType/allSkinType`
      );
      setSkinTypeArray(data?.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const fetchProductType = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/ProductType/allProductType`
      );
      setProductTypeArr(data?.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const fetchSkinCondition = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/SkinCondition/allSkinCondition`
      );
      SkinConditionArr(data?.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  const fetchBrand = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/Brand/allBrand`
      );
      setBrandArr(data?.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    fetchNut();
    fetchSkinType();
    fetchProductType();
    fetchSkinCondition();
    fetchBrand();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  //  ---
  const [data, setData] = useState({});
  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/Product/${product}`
      );
      setData(response.data.data);
    } catch {}
  };

  useEffect(() => {
    fetchDetails();
  }, [product]);

  useEffect(() => {
    if (data) {
      setName(data?.name);
      setDescription(data?.description);
      setMultipleSize(data?.multipleSize);
      setIngredeints(data?.ingredients);
      setReturnPolicy(data?.returnPolicy);
      setAcneType(data?.acneType);
      setConsiderAcne(data?.considerAcne);
      setNutritionId(data?.nutritionId);
      seteSkinTypeId(data?.skinTypeId);
      setProductTypeId(data?.productTypeId);
      setSkinConditionId(data?.skinConditionId);
      setBrandId(data?.brandId?._id);
      setBenefit(data?.benfit?.length > 0 ? data?.benfit?.[0] : "");
      setMultipleSize(data?.multipleSize === true ? "true" : "false");
      if (data?.howTouse?.length > 0) {
        setHowToUse(() =>
          data?.howTouse?.map((i) => ({
            step: i.step,
            stepDescription: i.description,
          }))
        );
      }
      if (data?.multipleSize === true || data?.multipleSize === "true") {
        if (data?.sizePrice?.length > 0) {
          for (const item of data?.sizePrice) {
            setMultipleArr((prev) => [
              ...prev,
              {
                sizes: item.size,
                multiplePrice: item.price,
                multipleStock: item.stock,
              },
            ]);
          }
        }
      } else {
        setPrice(data?.price);
        setStock(data?.stock);
      }

      setKeyIngredients(
        data?.keyIngredients?.length > 0 ? data?.keyIngredients?.[0] : ""
      );
    }
  }, [data]);

  const fd = new FormData();
  Array.from(images).forEach((img) => {
    fd.append("image", img);
  });
  if (nutritionId) {
    fd.append("nutritionId", nutritionId);
  }
  if (skinTypeId) {
    fd.append("skinTypeId", skinTypeId);
  }
  if (productTypeId) {
    fd.append("productTypeId", productTypeId);
  }
  if (brandId) {
    fd.append("brandId", brandId);
  }
  if (skinConditionId) {
    fd.append("skinConditionId", skinConditionId);
  }
  fd.append("name", name);
  fd.append("description", description);
  fd.append("multipleSize", multipleSize);
  if (howToUse?.length > 0) {
    Array.from(howToUse).forEach((i) => {
      fd.append("step[]", i.step);
      fd.append("stepDescription[]", i.stepDescription);
    });
  }
  if (multipleSize === "true" || multipleSize === true) {
    Array.from(multipleArr).forEach((i, index) => {
      fd.append(`sizes[${index}]`, i.sizes);
      fd.append(`multiplePrice[${index}]`, i.multiplePrice);
      fd.append(`multipleStock[${index}]`, i.multipleStock);
    });
  } else {
    fd.append("price", price);
    fd.append("stock", stock);
  }
  if (benfit) {
    fd.append("benfit", benfit);
  }
  if (ingredients) {
    fd.append("ingredients", ingredients);
  }
  if (keyIngredients) {
    fd.append("keyIngredients", keyIngredients);
  }
  if (returnPolicy) {
    fd.append("returnPolicy", returnPolicy);
  }
  if (acneType) {
    fd.append("acneType", acneType);
  }
  if (considerAcne) {
    fd.append("considerAcne", considerAcne);
  }

  const createProduct = async (e) => {
    e.preventDefault();
    editApi({
      url: `api/v1/Product/editProduct/${product}`,
      payload: fd,
      setLoading: setSubmitLoading,
      successMsg: "Product updated !",
    });
  };

  return (
    <section>
      <section className="sectionCont">
        <p className="headP">Dashboard / Edit Products</p>

        <Form onSubmit={createProduct}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nutrition</Form.Label>
            <Form.Select
              value={nutritionId}
              onChange={(e) => setNutritionId(e.target.value)}
            >
              <option>Selete Your Prefrence</option>
              {nutritionArray?.map((i, index) => (
                <option key={index} value={i._id}>
                  {" "}
                  {i?.name}{" "}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Skin Type</Form.Label>
            <Form.Select
              value={skinTypeId}
              onChange={(e) => seteSkinTypeId(e.target.value)}
            >
              <option>Select Your Prefrence</option>
              {skinTypeArray?.map((i, index) => (
                <option key={index} value={i._id}>
                  {" "}
                  {i.name}{" "}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Product Type</Form.Label>
            <Form.Select
              value={productTypeId}
              onChange={(e) => setProductTypeId(e.target.value)}
            >
              <option>Select Your Prefrence</option>
              {productTypeArr?.map((i, index) => (
                <option key={index} value={i._id}>
                  {" "}
                  {i.name}{" "}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skin Condition</Form.Label>
            <Form.Select
              value={skinConditionId}
              onChange={(e) => setSkinConditionId(e.target.value)}
            >
              <option>Select Your Prefrence</option>
              {skinConditionArr?.map((i, index) => (
                <option key={index} value={i._id}>
                  {" "}
                  {i.name}{" "}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Brands</Form.Label>
            <Form.Select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
            >
              <option>Select Your Prefrence</option>
              {brandArr?.map((i, index) => (
                <option key={index} value={i._id}>
                  {" "}
                  {i.name}{" "}
                </option>
              ))}
            </Form.Select>
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

            <EditorDesciption
              setDescription={setStepDescription}
              label={"Step Description"}
              description={stepDescription}
            />

            <Button variant="dark" onClick={() => use_adder()}>
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
              <li className="mt-3 " style={{ listStyle: "none" }}>
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

          <EditorDesciption
            setDescription={setDescription}
            label={"Description"}
            description={description}
          />

          <EditorDesciption
            setDescription={setIngredeints}
            label={"Ingredient"}
            description={ingredients}
          />

          <Form.Group className="mb-3">
            <Form.Label>Multiple Sizes</Form.Label>
            <Form.Select
              value={multipleSize}
              onChange={(e) => setMultipleSize(e.target.value)}
            >
              <option value="">Selete Your Prefrence</option>
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
                  value={price}
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

          <EditorDesciption
            setDescription={setBenefit}
            label={"Benefit"}
            description={benfit}
          />

          {/* Key Ingredients */}
          <EditorDesciption
            setDescription={setKeyIngredients}
            label={"Key Ingredient"}
            description={keyIngredients}
          />

          {/* Return Policu */}
          <EditorDesciption
            setDescription={setReturnPolicy}
            label={"Return Policy"}
            description={returnPolicy}
          />

          {/* Acne Type */}
          <Form.Group className="mb-3">
            <Form.Label>Acne Type</Form.Label>
            <Form.Control
              type="text"
              value={acneType}
              onChange={(e) => setAcneType(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Consider Acne</Form.Label>
            <Form.Control
              type="text"
              value={considerAcne}
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

export default HOC(EditProduct);
