/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Link } from "react-router-dom";
import { ViewDescription } from "../../../Helper/Helper";
import { deleteApi, getApi } from "../../../Respo/Api";
import { FaRegTrashAlt } from "react-icons/fa";
import TableLayout from "../../../Component/TableLayout";

const GiftCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    getApi({
      url: "api/v1/admin/GiftCards/allgiftCard",
      setResponse: setData,
      setLoading,
    });
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

  const deleteHandler = (id) => {
    deleteApi({
      url: `api/v1/GiftCards/deletegiftCard/${id}`,
      successMsg: "Removed !",
      additionalFunctions: [fetchData],
    });
  };

  const thead = ["Image", "Title", "Description", ""];

  const tbody = [
    [
      <div className="CarouselImages">
        <img src={data?.data?.[0]?.image} alt="" />
      </div>,
      data?.name,
      <ViewDescription description={data?.data?.[0]?.description} />,
      <span className="flexCont">
        <span
          className="remove-icon"
          onClick={() => deleteHandler(data?.data?.[0]?._id)}
        >
          <FaRegTrashAlt />
        </span>
      </span>,
    ],
  ];

  return (
    <>
      <section className="sectionCont">
        <div className="pb-4  w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            Gift Card
          </span>
          <div className="d-flex gap-1">
            <Link to="/creatGift">
              <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider">
                Create New / Update Existing
              </button>
            </Link>
          </div>
        </div>

        <TableLayout thead={thead} tbody={tbody} loading={loading} />
        <div className="overFlowCont">
          <div className="Desc-Container">
            <p className="title"> Gift Card Rewards </p>
            {data?.data?.[0]?.priceArray?.map((i, index) => (
              <div className="Desc-Container" key={index}>
                <p className="desc"> Gift Card : {i.giftCardrewards} </p>
                <p className="desc"> Price : {i.price} </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HOC(GiftCard);
