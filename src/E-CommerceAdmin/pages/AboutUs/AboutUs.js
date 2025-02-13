/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Button } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ViewDescription } from "../../../Helper/Helper";

const AboutUs = () => {
  const [data, setData] = useState([]);

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/static/getAboutUs`
      );
      setData(data.data?.[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.React_App_Baseurl}api/v1/static/aboutUs/${id} `,
        Auth
      );
      toast.success(data.message);
      fetchData();
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
      <p className="headP">Dashboard / About Us</p>

      <div
        className="pb-4  w-full flex justify-between items-center"
        style={{ width: "98%", marginLeft: "2%" }}
      >
        <div></div>
        <div className="d-flex gap-1">
          <Link to="/create-about-us">
            <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#0c0c0c] text-white tracking-wider">
              Create About-Us
            </button>
          </Link>
          <Link to={`/create-about-us`}>
            <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#0c0c0c] text-white tracking-wider">
              Edit About-Us
            </button>
          </Link>
          <Button
            variant="danger"
            className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#0c0c0c] text-white tracking-wider"
            style={{ borderRadius: 0 }}
            onClick={() => deleteHandler(data?._id)}
          >
            Delete
          </Button>
        </div>
      </div>

      <section className="sectionCont">
        <div className="img-cont mb-3">
          <img src={data?.image} alt="" className="centerImage" />
        </div>
        {ValueChecker(data?.title, "Title")}
        <div className="Desc-Container">
          <p className="title"> Description </p>
          {data?.description?.map((i, index) => (
            <p className="desc" key={index}>
              <ViewDescription description={i} />
            </p>
          ))}
        </div>
        {ValueChecker(data?.designation, "Designation")}
      </section>
    </>
  );
};

export default HOC(AboutUs);
