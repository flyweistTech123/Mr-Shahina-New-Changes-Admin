/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Table, Alert } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

const CardDetails = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);


  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/user/card/getAllCard`,
        Auth
      );
      console.log(data);
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

  return (
    <>
      <section className="sectionCont">
        <p className="headP">Dashboard / Card Detail</p>

        <div className="pb-4  w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            Card Detail ( Total : {total} )
          </span>
        </div>

        <div className="overFlowCont">
          {data?.length === 0 || !data ? (
            <Alert>No data Found</Alert>
          ) : (
            <Table>
              <thead>
                <tr>
            
                </tr>
              </thead>
              <tbody>
                {data?.map((i, index) => (
                  <tr key={index}>

                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </section>
    </>
  );
};

export default HOC(CardDetails);
