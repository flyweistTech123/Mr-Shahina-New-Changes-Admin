/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import { ViewDescription } from "../../../../Helper/Helper";
import HOC from "../../../layout/HOC";
import { DateInMMDDYY } from "../../../../Helper/Helper";
import { Link } from "react-router-dom";

const CalenderNotification = () => {
  const [data, setData] = useState([]);

  const fetchHandler = async () => {
    try {
      const res = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/notification/all/AdminNotification`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
          },
        }
      );
      if (res.status === 200) {
        setData(res.data.data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchHandler();
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <section className="sectionCont">
      <div className="pb-4  w-full flex justify-end items-center">
         <div className="d-flex gap-1">
          <Link to="/send-notification">
            <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#0c0c0c] text-white tracking-wider">
              Send Notification
            </button>
          </Link>
        </div>
      </div>
      <div className="calender_notification">
        {data?.map((i, index) => (
          <div className="container" key={index}>
            {i?.orderUserId?.image && (
              <img src={i?.orderUserId?.image} alt="" />
            )}
            <div className="content">
              <h6>{i.title}</h6>
              <p className="faded"> {DateInMMDDYY(i?.createdAt)} </p>
              <ViewDescription description={i.body} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HOC(CalenderNotification);
