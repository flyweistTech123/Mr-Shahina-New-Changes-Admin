/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { DateInMMDDYY } from "../../../Helper/Helper";
import { getApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { Link } from "react-router-dom";
import { Badge } from "react-bootstrap";

const statusChecker = (status) => {
  if (status === "Paid") {
    return <Badge bg="success"> Paid </Badge>;
  } else if (status === "pending") {
    return <Badge bg="primary">Pending</Badge>;
  } else {
    <Badge bg="danger"> {status} </Badge>;
  }
};

const Transaction = () => {
  const [transaction, setTransactions] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getApi({
      url: "api/v1/admin/getAllTransaction",
      setResponse: setTransactions,
      setLoading,
    });
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const typeChecker = (i) => {
    if (i?.type === "Subscription") {
      return i?.subscriptionId?.plan;
    } else {
      return <Link to={`/service-order/${i?.serviceOrderId}`}>View</Link>;
    }
  };

  const tbody = transaction?.data?.map((i, index) => [
    `#${index + 1}`,
    statusChecker(i?.Status),
    `$${i?.amount}`,
    i?.date && DateInMMDDYY(i.date),
    i?.type,
    <Link to={`/user-data/${i?.user?._id}`}> {i?.user?.fullName}</Link>,
    i?.paymentMode,
    typeChecker(i),
  ]);

  const thead = [
    "Sno",
    "Status",
    "Amount",
    "Date",
    "Type",
    "User",
    "Payment method",
    "",
  ];

  return (
    <>
      <section className="sectionCont">
        <p className="headP">Dashboard / All Transactions</p>

        <div className="pb-4  w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            All Transaction's ( Total : {transaction?.data?.length} )
          </span>
        </div>
        <TableLayout tbody={tbody} loading={loading} thead={thead} />
      </section>
    </>
  );
};

export default HOC(Transaction);
