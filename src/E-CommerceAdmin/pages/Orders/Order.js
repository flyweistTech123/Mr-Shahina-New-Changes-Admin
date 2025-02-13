/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DateInMMDDYY } from "../../../Helper/Helper";
import HOC from "../../layout/HOC";
import { editApi, getApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaEye, FaPen } from "react-icons/fa";
import { CustomPagination } from "../../../Component/HelpingComponents";
import { debouncedSetQuery } from "../../../utils/utils";

const Order = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const FinalFromDate =
    fromDate === "" || fromDate?.length < 5 ? "" : `${fromDate}T00:00:00.000Z`;
  const FinalToDate =
    toDate === null || toDate?.length < 5 ? "" : `${toDate}T23:59:59.000Z`;

  const getOrders = useCallback(() => {
    getApi({
      url: `api/v1/admin/ProductOrder?search=${search}&fromDate=${FinalFromDate}&toDate=${FinalToDate}&page=${page}&limit=${limit}`,
      setLoading,
      setResponse: setData,
    });
  }, [search, FinalFromDate, FinalToDate, page, limit]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const update_status = async (id) => {
    editApi({
      url: `api/v1/admin/updateDeliveryStatus/${id}`,
      setLoading,
      successMsg: "Success !",
      additionalFunctions: [getOrders],
    });
  };

  const thead = [
    "No.",
    "Order Id",
    "Sub Total",
    "Shipping Amount",
    "MemberShip Amount",
    "Total Amount",
    "Pick up Store",
    "Order Status",
    "Payment Status",
    "Delivery Status",
    "",
  ];

  const tbody = data?.data?.docs?.map((i) => [
    DateInMMDDYY(i?.createdAt),
    i.orderId,
    `$${i?.subTotal}`,
    `$${i?.shipping}`,
    `$${i?.memberShip}`,
    `$${i?.total}`,
    i.pickupFromStore === true ? "Yes" : "No",
    <Badge>{i.orderStatus}</Badge>,
    <Badge>{i.paymentStatus}</Badge>,
    <Badge>{i.deliveryStatus}</Badge>,
    <span className="flexCont">
      <span className="edit-icon" onClick={() => update_status(i._id)}>
        <FaPen />
      </span>

      <Link to={`/order/${i._id}`}>
        <span className="view-icon-container">
          <FaEye />
        </span>
      </Link>
    </span>,
  ]);
  return (
    <section className="sectionCont">
      <p className="headP">Dashboard / Order</p>

      <div className="pb-4  w-full flex justify-between items-center">
        <span
          className="tracking-widest text-slate-900 font-semibold uppercase"
          style={{ fontSize: "1.5rem" }}
        >
          All Order's (Total : {data?.data?.totalDocs || 0})
        </span>
      </div>
      <div className="filterBox">
        <img
          src="https://t4.ftcdn.net/jpg/01/41/97/61/360_F_141976137_kQrdYIvfn3e0RT1EWbZOmQciOKLMgCwG.jpg"
          alt=""
        />
        <input
          type="search"
          placeholder="Search by OrderId"
          onChange={(e) => debouncedSetQuery(e.target.value, setSearch)}
        />
      </div>
      <div className="searchByDate">
        <div>
          <label>Starting Date </label>
          <input type="date" onChange={(e) => setFromDate(e.target.value)} />
        </div>

        <div>
          <label>Ending Date </label>
          <input type="date" onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      <div className="searchByDate">
        <div>
          <label>Showing : </label>
          <select onChange={(e) => setLimit(e.target.value)}>
            <option>
              {" "}
              Showing {data?.data?.docs?.length} out of {data?.data?.totalDocs}{" "}
            </option>
            <option value={data?.data?.totalDocs}> All </option>
            <option value={10}> 10 </option>
            <option value={20}> 20 </option>
            <option value={50}> 50 </option>
            <option value={100}> 100 </option>
          </select>
        </div>
      </div>

      <TableLayout thead={thead} tbody={tbody} loading={loading} />
      <CustomPagination
        currentPage={page}
        setCurrentPage={setPage}
        hasNextPage={data?.data?.hasNextPage}
        hasPrevPage={data?.data?.hasPrevPage}
      />
    </section>
  );
};

export default HOC(Order);
