/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Table, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductReviews = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const Baseurl = process.env.React_App_Baseurl;
  const [reviewId, setReviewsId] = useState("");

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${Baseurl}api/v1/product/getProductReviews/${id}`,
        Auth
      );
      setData(data.reviews);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const deleteHandler = async () => {
    try {
      const { data } = await axios.put(
        `${Baseurl}api/v1/product/deleteProductReview`,
        { reviewId, productId: id },
        Auth
      );
      fetchData();
      toast.success("Removed");
    } catch {}
  };

  return (
    <>
      <section className="sectionCont">
        <div className="pb-4  w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            All Product Reviews ( Total : {data?.length} )
          </span>
        </div>

        <div className="overFlowCont">
          {data?.length === 0 || !data ? (
            <Alert>No Review Found</Alert>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Sno.</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>User</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((i, index) => (
                  <tr key={index}>
                    <td> #{index + 1} </td>
                    <td> {i.rating} </td>
                    <td> {i.comment} </td>
                    <td> {i.user?.firstName + " " + i.user?.lastName} </td>
                    <td>
                      <i
                        className="fa-sharp fa-solid fa-trash"
                        onClick={() => {
                          setReviewsId(i._id);
                          deleteHandler();
                        }}
                      ></i>
                    </td>
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

export default HOC(ProductReviews);
