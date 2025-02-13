/** @format */

import React, { useCallback, useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { deleteApi, getApi, postApi } from "../../../Respo/Api";
import { Link } from "react-router-dom";
import { inMonthFomat } from "../../../utils/utils";
import TableLayout from "../../../Component/TableLayout";
import { DefaultDialog } from "../Scheduler/CalenderHelper/Modals/modal";
import { Button, Form } from "react-bootstrap";
import { ReactSelect } from "../../../Component/HelpingComponents";
import { ClipLoader } from "react-spinners";

const MonthlySpecial = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountedPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allServices, setAllServices] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchService = () => {
    getApi({
      url: `api/v1/Service/all/getAllServices/NotMultipleSize`,
      setResponse: setAllServices,
    });
  };

  const fetchHandler = () => {
    getApi({
      url: "api/v1/admin/MonthlySpecial/allMonthlySpecial",
      setLoading,
      setResponse: setData,
    });
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  useEffect(() => {
    fetchService();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    const payload = {
      serviceId: serviceId?.value,
      price,
      discountPrice,
    };
    postApi({
      url: "api/v1/admin/MonthlySpecial/addMonthlySpecial",
      payload,
      successMsg: "Success !",
      setLoading: setSubmitLoading,
      additionalFunctions: [() => setOpen(false), fetchHandler],
    });
  };

  const removeHandler = () => {
    deleteApi({
      url: "api/v1/MonthlySpecial/deleteMonthlySpecial",
      setLoading,
      successMsg: "Removed !",
      additionalFunctions: [fetchHandler],
    });
  };

  const thead = ["Original price", "Discounted price", "Service", "Created at"];

  const tbody = [
    data?.data && [
      <span>${data?.data?.price}</span>,
      <span>${data?.data?.discountPrice}</span>,
      <Link to={`/service/${data?.data?.serviceId?._id}`}>View</Link>,
      data?.data?.createdAt && inMonthFomat(data?.data?.createdAt),
    ],
  ];

  const options = allServices?.data?.map((i) => ({
    value: i?._id,
    label: i?.name,
    price: i?.price,
  }));

  const selectServiceHandler = (e) => {
    setServiceId(e);
    setPrice(e?.price);
  };

  return (
    <>
      <section className="sectionCont">
        <div className="pb-4   w-full flex justify-between items-center">
          <span
            className=" text-slate-900 font-semibold"
            style={{ fontSize: "1.5rem" }}
          >
            Monthly Special
          </span>
          <div className="flex gap-2 items-center">
            <button
              className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider"
              onClick={() => setOpen(true)}
            >
              Create / Update
            </button>
            <button
              className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#800000] text-white tracking-wider"
              style={{ border: "1px solid #800000" }}
              onClick={() => removeHandler()}
            >
              Remove
            </button>
          </div>
        </div>
        <TableLayout thead={thead} tbody={tbody} loading={loading} />
      </section>
      <DefaultDialog
        show={open}
        onHide={() => setOpen(false)}
        Title={"Monthly Special"}
      >
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Select Service</Form.Label>
            <ReactSelect
              options={options}
              value={serviceId}
              setValue={selectServiceHandler}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Discounted Price</Form.Label>
            <Form.Control
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="dark">
            {submitLoading ? <ClipLoader color="#fff" /> : "Submit"}
          </Button>
        </Form>
      </DefaultDialog>
    </>
  );
};

export default HOC(MonthlySpecial);
