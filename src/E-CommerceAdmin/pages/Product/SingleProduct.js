/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { DateInMMDDYY, ViewDescription } from "../../../Helper/Helper";
import HOC from "../../layout/HOC";

const SingleProduct = () => {
  const { id } = useParams();
  const [data, setData] = useState({});

  const getOrder = async () => {
    try {
      const response = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/Product/${id}`
      );
      setData(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

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
      <section className="sectionCont">
        {data?.productImages && (
          <div className="Desc-Container">
            <p className="title"> Product Images </p>
            <div className="img-cont" style={{ flexWrap: "wrap" }}>
              {data?.productImages?.map((i) => (
                <img
                  src={i.image}
                  alt=""
                  className="centerImage"
                  key={`image ${i._id}`}
                />
              ))}
            </div>
          </div>
        )}
        {ValueChecker(data?.name, "Product Name")}
        {data?.description && (
          <div className="Desc-Container mt-1">
            <p className="title"> Description </p>
            <div className="dag">
              <ViewDescription description={data?.description} />
            </div>
          </div>
        )}
        {data?.ingredients && (
          <div className="Desc-Container mt-1">
            <p className="title"> Ingredeints </p>
            <div className="dag">
              <ViewDescription description={data?.ingredients} />
            </div>
          </div>
        )}
        {data?.ingredients && (
          <div className="Desc-Container mt-1">
            <p className="title"> Return Policy </p>
            <div className="dag">
              <ViewDescription description={data?.returnPolicy} />
            </div>
          </div>
        )}
        {ValueChecker(data?.numOfReviews, "Number of Reviews")}
        {ValueChecker(data?.brandId?.name, "Brand ")}
        {ValueChecker(data?.nutritionId?.name, "Nutrition ")}
        {ValueChecker(data?.skinTypeId?.name, "Skin Type")}
        {ValueChecker(data?.productTypeId?.name, "Product Tyoe")}
        {ValueChecker(data?.skinConditionId?.name, "Skin Condition")}
        {ValueChecker(data?.numOfReviews, "Number of Reviews")}
        {ValueChecker(data?.acneType, "Acne Type")}
        {ValueChecker(data?.considerAcne, "Consider Acne")}

        <div className="Desc-Container">
          <p className="title"> Multiple Size </p>
          <p className="desc">
            {data?.multipleSize === true ? "Activated" : "Not Activated"}
          </p>
        </div>

        {data?.multipleSize === true ? (
          data?.sizePrice?.length > 0 && (
            <div className="Desc-Container">
              <p className="title"> Sizes </p>
              {data?.sizePrice?.map((i, index) => (
                <>
                  <p className="desc" key={`price ${index}`}>
                    {" "}
                    Price : {i?.price}{" "}
                  </p>
                  <p className="desc" key={`size ${index}`}>
                    {" "}
                    Size : {i?.size}{" "}
                  </p>
                  <p className="desc" key={`stock ${index}`}>
                    {" "}
                    stock : {i?.stock}{" "}
                  </p>
                </>
              ))}
            </div>
          )
        ) : (
          <>
            {ValueChecker(data?.price, "Price")}
            {ValueChecker(data?.stock, "In Stock")}
          </>
        )}

        {data?.keyIngredients?.length > 0 && (
          <div className="Desc-Container">
            <p className="title"> Key Ingredeints </p>
            {data?.keyIngredients?.map((i, index) => (
              <p className="desc" key={`keyIngredients ${index}`}>
                <ViewDescription description={i} />
              </p>
            ))}
          </div>
        )}

        {data?.benfit?.length > 0 && (
          <div className="Desc-Container">
            <p className="title"> Benefits </p>
            {data?.benfit?.map((i, index) => (
              <p className="desc" key={`benefit ${index}`}>
                <ViewDescription description={i} />
              </p>
            ))}
          </div>
        )}

        {data?.howTouse?.length > 0 && (
          <div className="Desc-Container">
            <p className="title"> How to use </p>
            {data?.howTouse?.map((i, index) => (
              <>
                <p className="desc" key={`step ${index}`}>
                  {i?.step}{" "}
                </p>
                <p className="desc" key={`use ${index}`}>
                  <ViewDescription description={i.description} />
                </p>
              </>
            ))}
          </div>
        )}
        {data?.createdAt &&
          ValueChecker(DateInMMDDYY(data?.createdAt), "Created At")}

        <Link to="/Product">
          <Button variant="dark">Back</Button>
        </Link>
      </section>
    </>
  );
};

export default HOC(SingleProduct);
