/** @format */

import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { DateInMMDDYY } from "../../../Helper/Helper";
import { getApi } from "../../../Respo/Api";
import { PhoneNumberFormatter, valueReturner } from "../../../utils/utils";
import HOC from "../../layout/HOC";
import SpinnerComp from "../Component/SpinnerComp";

const Template = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getApi({
      url: `api/v1/getIdTemplate/${id}`,
      setResponse,
      setLoading,
    });
  }, [id]);

  return loading ? (
    <SpinnerComp />
  ) : (
    <section className="sectionCont">
      {valueReturner(response?.data?.title, "Title")}
      {valueReturner(response?.data?.email, "Email Address")}
      {valueReturner(
        response?.data?.phone && PhoneNumberFormatter(response?.data?.phone),
        "Phone Number"
      )}
      {valueReturner(
        response?.data?.createdAt && DateInMMDDYY(response?.data?.createdAt),
        "Created At"
      )}
      <div
        className="template-div"
        dangerouslySetInnerHTML={{ __html: response?.data?.description }}
      />

      <Button className="mt-3" variant="dark" onClick={() => navigate(-1)}>
        Back
      </Button>
    </section>
  );
};

export default HOC(Template);
