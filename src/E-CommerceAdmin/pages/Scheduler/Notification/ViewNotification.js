/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../../layout/HOC";
import { useParams } from "react-router-dom";
import { getApi } from "../../../../Respo/Api";
import { ViewDescription, DateInMMDDYY } from "../../../../Helper/Helper";

const ViewNotification = () => {
  const { id } = useParams();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    getApi({
      url: `api/v1/admin/Notification/ById/${id}`,
      setResponse,
    });
  }, [id]);

  // console.log(response);

  function ValueChecker(holder, string) {
    return holder ? (
      <div className="Desc-Container">
        <p className="title"> {string} </p>
        <p className="desc"> {holder} </p>
      </div>
    ) : (
      ""
    );
  }

  return (
    <section className="sectionCont">
      {ValueChecker(response?.data?.title, "Title")}
      {response?.data?.body && (
        <div className="Desc-Container mt-1">
          <p className="title"> Body </p>

          <div className="dag">
            <ViewDescription description={response?.data?.body} />
          </div>
        </div>
      )}

      {response?.data?.receiverId?.length > 0 && (
        <div className="Desc-Container mt-3">
          <p className="title">
            Reciever's ({response?.data?.receiverId?.length}){" "}
          </p>

          <p className="desc">
            {response?.data?.receiverId?.map((i, index) => (
              <span>
                {i.firstName + " " + i.lastName}{" "}
                {response?.data?.receiverId?.length !== index + 1 && ", "}
              </span>
            ))}
          </p>
        </div>
      )}

      {response?.data?.createdAt &&
        ValueChecker(DateInMMDDYY(response?.data?.createdAt), "Created At")}
    </section>
  );
};

export default HOC(ViewNotification);
