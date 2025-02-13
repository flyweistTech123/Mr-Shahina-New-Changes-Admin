/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { toast } from "react-toastify";
import axios from "axios";
import { getApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaRegTrashAlt } from "react-icons/fa";

const Query = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = () => {
    getApi({
      url: "api/v1/help/all",
      setLoading,
      setResponse: setData,
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

  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.React_App_Baseurl}api/v1/help/${id}`,
        Auth
      );
      toast.success(data.message);
      fetchData();
    } catch (e) {
      const msg = e.response.data.message;
      toast.error(msg);
    }
  };

  const thead = ["Sno.", "Name", "Email Address", "Mobile Number", "Query", ""];

  const tbody = data?.data?.map((i, index) => [
    `#${index + 1}`,
    i.name,
    i.email,
    i.mobile,
    i.query,
    <span className="remove-icon" onClick={() => deleteHandler(i._id)}>
      <FaRegTrashAlt />
    </span>,
  ]);
  return (
    <>
      <section className="sectionCont">
        <p className="headP">Dashboard / All Query</p>

        <div className="pb-4  w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            All Query's ( Total : {data?.data?.length || 0} )
          </span>
        </div>

        <TableLayout thead={thead} tbody={tbody} loading={loading} />
      </section>
    </>
  );
};

export default HOC(Query);
