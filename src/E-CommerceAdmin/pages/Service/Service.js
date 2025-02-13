/** @format */

import React, { useCallback, useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Link } from "react-router-dom";
import { deleteApi, getApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { CustomPagination } from "../../../Component/HelpingComponents";
import { debouncedSetQuery } from "../../../utils/utils";
import { FaEye, FaPen, FaRegTrashAlt } from "react-icons/fa";

const Service = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(() => {
    getApi({
      url: `api/v1/Service/all/paginateServiceSearch?page=${page}&limit=10&search=${query}`,
      setResponse: setData,
      setLoading,
    });
  }, [page, query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const deleteHandler = (id) => {
    const additionalFunctions = [fetchData];
    deleteApi({
      url: `api/v1/Service/deleteService/${id}`,
      successMsg: "Service Removed !",
      additionalFunctions,
      setLoading,
    });
  };

  useEffect(() => {
    if (query) {
      setPage(1);
    }
  }, [query]);

  const serviceListingHead = ["Sno.", "Image", "Title", "Type", "Category", ""];

  const serviceListing = data?.data?.docs?.map((i, index) => [
    `#${index + 1}`,
    <div className="CarouselImages">
      <img src={i.images?.[0]?.img} alt="" />
    </div>,
    i.name,
    <span style={{ textTransform: "capitalize" }}>{i.type}</span>,
    i.categoryId?.name,
    <span className="flexCont">
      <Link to={`/edit-service/${i._id}`}>
        <span className="edit-icon">
          <FaPen />
        </span>
      </Link>
      <Link to={`/service/${i._id}`}>
        <span className="view-icon-container">
          <FaEye />
        </span>
      </Link>
      <span className="remove-icon" onClick={() => deleteHandler(i._id)}>
        <FaRegTrashAlt />
      </span>
    </span>,
  ]);

  return (
    <>
      <section className="sectionCont">
        <div className="pb-4  w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold"
            style={{ fontSize: "1.5rem" }}
          >
            All Services (Total : {data?.data?.totalDocs})
          </span>
          <div className="d-flex gap-1">
            <Link to="/create-service">
              <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider">
                Create New
              </button>
            </Link>
          </div>
        </div>

        <div className="filterBox">
          <img
            src="https://t4.ftcdn.net/jpg/01/41/97/61/360_F_141976137_kQrdYIvfn3e0RT1EWbZOmQciOKLMgCwG.jpg"
            alt=""
          />
          <input
            type="search"
            placeholder="Start typing to search for Service"
            onChange={(e) => debouncedSetQuery(e.target.value, setQuery)}
          />
        </div>

        <TableLayout
          thead={serviceListingHead}
          tbody={serviceListing}
          loading={loading}
        />

        <CustomPagination
          currentPage={page}
          setCurrentPage={setPage}
          hasNextPage={data?.data?.hasNextPage}
          hasPrevPage={data?.data?.hasPrevPage}
        />
      </section>
    </>
  );
};

export default HOC(Service);
