/** @format */

import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import HOC from "../../layout/HOC";
import { Link } from "react-router-dom";
import { ViewDescription } from "../../../Helper/Helper";
import { DateInMMDDYY } from "../../../Helper/Helper";
import { deleteApi, getApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";

const Subscription = () => {
  const [subCat, setSubcat] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSubCategory = () => {
    getApi({
      url: "api/v1/subscription",
      setLoading,
      setResponse: setSubcat,
    });
  };
  useEffect(() => {
    getSubCategory();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const deleteHandler = (id) => {
    const additionalFunctions = [getSubCategory];
    deleteApi({
      url: `api/v1/subscription/${id}`,
      setLoading,
      successMsg: "Removed !",
      additionalFunctions,
    });
  };

  const thead = [
    "Sno.",
    "Plan",
    "Price",
    "Month",
    "Discount",
    "Detail",
    "Term",
    "Created At",
    "",
  ];

  const tbody = subCat?.data?.map((ele, i) => [
    `#${i + 1}`,
    ele?.plan,
    ele?.price,
    ele?.month,
    ele?.discount,
    <ViewDescription description={ele?.details} />,
    <a href={ele?.term} rel="noreferrer" target="_blank">
      {" "}
      <Button>View</Button>
    </a>,
    DateInMMDDYY(ele?.createdAt),
    <span className="flexCont">
      <Link to={`/edit-subscription/${ele?._id}`}>
        <span className="edit-icon">
          <FaPen />
        </span>
      </Link>{" "}
      <span className="remove-icon" onClick={() => deleteHandler(ele._id)}>
        <FaRegTrashAlt />
      </span>
    </span>,
  ]);

  return (
    <>
      <section className="sectionCont">
        <p className="headP">Dashboard / Subscription</p>
        <div className="pb-4   w-full flex justify-between items-center">
          <span
            className=" text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            All Subscription's ({subCat?.data?.length || 0})
          </span>
          <Link to="/create-subscription">
            <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#0c0c0c] text-white tracking-wider">
              Create New
            </button>
          </Link>
        </div>

        <TableLayout thead={thead} tbody={tbody} loading={loading} />
      </section>
    </>
  );
};

export default HOC(Subscription);
