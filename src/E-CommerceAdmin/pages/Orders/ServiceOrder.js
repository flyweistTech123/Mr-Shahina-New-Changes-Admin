  /** @format */
  import React, { useCallback, useEffect, useState } from "react";
  import { Badge } from "react-bootstrap";
  import { Link } from "react-router-dom";
  import { DateInMMDDYY } from "../../../Helper/Helper";
  import HOC from "../../layout/HOC";
  import { getApi } from "../../../Respo/Api";
  import TableLayout from "../../../Component/TableLayout";
  import { FaEye } from "react-icons/fa";
  import { CustomPagination } from "../../../Component/HelpingComponents";
  import { debouncedSetQuery } from "../../../utils/utils";

  const ServiceOrder = () => {
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
        url: `api/v1/admin/ServiceOrders?search=${search}&fromDate=${FinalFromDate}&toDate=${FinalToDate}&page=${page}&limit=${limit}`,
        setLoading,
        setResponse: setData,
      });
    }, [search, FinalFromDate, FinalToDate, page, limit]);

    useEffect(() => {
      getOrders();
    }, [search, FinalFromDate, FinalToDate, page, limit]);

    useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, []);

    const thead = [
      "No",
      "Order Id",
      "Sub Total",
      "MemberShip Amount",
      "Total Amount",
      "Offer Discount",
      "Order Status",
      "Payment Status",
      "Service Status",
      "",
    ];

    const tbody = data?.data?.docs?.map((i) => [
      DateInMMDDYY(i?.createdAt),
      i?.orderId,
      `$${i?.subTotal}`,
      `$${i?.memberShip}`,
      `$${i?.total}`,
      `$${i?.offerDiscount}`,
      <Badge>{i.orderStatus}</Badge>,
      <Badge>{i.paymentStatus}</Badge>,
      <Badge>{i.serviceStatus}</Badge>,
      <Link to={`/service-order/${i._id}`}>
        <span className="view-icon-container">
          <FaEye />
        </span>
      </Link>,
    ]);

    return (
      <>
        <section>
          <section className="sectionCont">
            <p className="headP">Dashboard / Service Order</p>

            <div className="pb-4  w-full flex justify-between items-center">
              <span
                className="tracking-widest text-slate-900 font-semibold uppercase"
                style={{ fontSize: "1.5rem" }}
              >
                All Service Order's (Total : {data?.data?.totalDocs})
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
                <input
                  type="date"
                  onChange={(e) => setFromDate(e.target.value)}
                />
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
                    Showing {data?.data?.docs?.length} out of{" "}
                    {data?.data?.totalDocs}{" "}
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
        </section>
      </>
    );
  };

  export default HOC(ServiceOrder);
