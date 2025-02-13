/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Table, Alert } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { Link } from "react-router-dom";
import SpinnerComp from "../Component/SpinnerComp";
import { DateInMMDDYY } from "../../../Helper/Helper";

const AcneQuery = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/getAcneQuizSuggessionQuery`
      );
      setData(data.data?.reverse());
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setData([]);
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
        <div className="pb-4  w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            Acne Quiz Queries
          </span>
        </div>

        {loading ? (
          <SpinnerComp />
        ) : (
          <>
            <div className="overFlowCont">
              {data?.length === 0 || !data ? (
                <Alert>No Product Found</Alert>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <th>Sno.</th>
                      <th>Answer 1</th>
                      <th>Answer 2</th>
                      <th>Answer 3</th>
                      <th>Answer 4</th>
                      <th>Product</th>
                      <th>Email</th>
                      <th>Created At </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((i, index) => (
                      <tr key={index}>
                        <td> #{index + 1} </td>
                        <td> {i.answer1} </td>
                        <td> {i.answer2} </td>
                        <td> {i.answer3} </td>
                        <td> {i.answer4} </td>
                        <td>
                          {i.productId && (
                            <Link to={`/product/${i.productId}`}>View</Link>
                          )}
                        </td>
                        <td> {i.email} </td>
                        <td>{DateInMMDDYY(i?.createdAt)} </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default HOC(AcneQuery);
