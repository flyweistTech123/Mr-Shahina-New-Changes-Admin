/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import HOC from "../../layout/HOC";
import { DateInMMDDYY } from "../../../Helper/Helper";


const SingleBanner = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const Baseurl = process.env.React_App_Baseurl;
  const getOrder = async () => {
    try {
      const response = await axios.get(`${Baseurl}api/v1/Banner/${id}`);
      setData(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    getOrder();
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
      <section>
        <p className="headP">Dashboard / Banner Details</p>
        <section className="sectionCont">
          <Form>
            {data?.shopImage?.length > 0 && (
              <div className="Desc-Container mb-3">
                <p className="title"> Shop Images </p>
                <div className="img-cont">
                  {data?.shopImage?.map((i, index) => (
                    <img
                      src={i}
                      alt=""
                      className="centerImage"
                      key={`image ${index}`}
                    />
                  ))}
                </div>
              </div>
            )}
            {data?.serviceImage?.length > 0 && (
              <div className="Desc-Container mb-3">
                <p className="title">Service Image </p>
                <div className="img-cont">
                  {data?.serviceImage?.map((i, index) => (
                    <img
                      src={i}
                      alt=""
                      className="centerImage"
                      key={`image ${index}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {data?.bannerImage && (
              <div className="Desc-Container mb-3">
                <p className="title"> Banner Image</p>
                <div className="img-cont">
                  <img src={data?.bannerImage} alt="" className="centerImage" />
                </div>
              </div>
            )}

            {data?.partnerImage?.length > 0 && (
              <div className="Desc-Container mb-3">
                <p className="title"> Partner Image</p>
                <div className="img-cont">
                  {data?.partnerImage?.map((i, index) => (
                    <img src={i} alt="" key={index} className="centerImage" />
                  ))}
                </div>
              </div>
            )}

            {data?.shopDetails?.map((i, index) => (
              <div className="Desc-Container mb-3">
                <p className="title"> Title : {i.title} </p>
                <p className="desc"> Description : {i.desc} </p>
                <div className="img-cont">
                  <img
                    src={i.image}
                    alt=""
                    className="centerImage"
                    key={`Desc-con ${index}`}
                  />
                </div>
              </div>
            ))}

            {ValueChecker(data?.type, "Type")}
            {ValueChecker(data?.title, "Title")}
            {ValueChecker(data?.desc, "Description")}
            {ValueChecker(data?.bannerName, "Banner Title")}
            {ValueChecker(data?.off, "Off")}
            {ValueChecker(data?.appleLink, "Apple Link")}
            {ValueChecker(data?.playstoreLink, "Play Store Link")}

            {data?.description?.length > 0 && (
              <div className="Desc-Container mb-3">
                <p className="title"> Description </p>
                {data?.description?.map((i, index) => (
                  <p className="desc" key={index}>
                    {" "}
                    {i}{" "}
                  </p>
                ))}
              </div>
            )}

            {ValueChecker(DateInMMDDYY(data?.createdAt), "Created At")} 

            <Link to="/banner">
              <Button variant="dark">Back</Button>
            </Link>
          </Form>
        </section>
      </section>
    </>
  );
};

export default HOC(SingleBanner);
