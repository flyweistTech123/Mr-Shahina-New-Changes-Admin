/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Link } from "react-router-dom";
import { deleteApi, getApi } from "../../../Respo/Api";
import { CustomPagination } from "../../../Component/HelpingComponents";
import TableLayout from "../../../Component/TableLayout";
import { debouncedSetQuery } from "../../../utils/utils";
import { FaEye, FaPen, FaRegTrashAlt } from "react-icons/fa";

const Product = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    getApi({
      url: `api/v1/Product/all/paginateProductSearch?page=${page}&limit=10&search=${query}`,
      setResponse: setData,
      setLoading,
    });
  };

  useEffect(() => {
    fetchData();
  }, [page, query]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const deleteHandler = async (id) => {
    const additionalFunctions = [fetchData];
    deleteApi({
      url: `api/v1/Product/deleteProduct/${id}`,
      successMsg: "Product removed !",
      additionalFunctions,
    });
  };

  const productListing = data?.data?.docs?.map((i, index) => [
    `#${index + 1}`,
    <div className="CarouselImages">
      <img src={i.productImages?.[0]?.image} alt="" />
    </div>,
    i.name,
    <span className="flexCont">
      <Link to={`/edit-product/${i._id}`}>
        <span className="edit-icon">
          <FaPen />
        </span>
      </Link>

      <Link to={`/product/${i._id}`}>
        <span className="view-icon-container">
          <FaEye />
        </span>
      </Link>

      <span className="remove-icon" onClick={() => deleteHandler(i._id)}>
        <FaRegTrashAlt />
      </span>
    </span>,
  ]);

  const productListingHead = ["Sno.", "Image", "Title", ""];

  return (
    <>
      <section className="sectionCont">
        <div className="pb-4  w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            All Product's ( Total : {data?.data?.totalDocs} )
          </span>
          <div className="d-flex gap-1">
            <Link to="/create-product">
              <button className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider">
                Create Product
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
            placeholder="Start typing to search for products"
            onChange={(e) => debouncedSetQuery(e.target.value, setQuery)}
          />
        </div>

        <TableLayout
          thead={productListingHead}
          tbody={productListing}
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

export default HOC(Product);
