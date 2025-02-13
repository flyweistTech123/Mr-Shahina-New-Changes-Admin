/** @format */

import React, { useCallback, useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { PhoneNumberFormatter } from "../../../utils/utils";
import {
  CallingModal,
  CancelSubscription,
  ConfirmDeletion,
  EditProfile,
  MailModal,
  VerifySubscription,
} from "../Scheduler/CalenderHelper/Modals/modal";
import { deleteApi, getApi } from "../../../Respo/Api";
import { DateInMMDDYY } from "../../../Helper/Helper";
import {
  CustomPagination,
  SectionHeading,
} from "../../../Component/HelpingComponents";
import TableLayout from "../../../Component/TableLayout";
import {
  FaPenNib,
  FaEye,
  FaPen,
  FaRegTrashAlt,
} from "react-icons/fa";

const User = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isSubscription, setisSubscription] = useState("");
  const [page, setPage] = useState(1);
  const [editDialog, setEditDialog] = useState(false);
  const [callDialog, setCallDialog] = useState(false);
  const [mailDialog, setMailDialog] = useState(false);
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [verifyModal, setVerifyModal] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchHandler = useCallback(() => {
    getApi({
      url: `api/v1/admin/getAllUserforSearch?search=${search}&isSubscription=${isSubscription}&limit=${10}&page=${page}`,
      setResponse: setData,
      setLoading,
    });
  }, [search, isSubscription, page]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const deleteHandler = () => {
    const additionalFunctions = [() => setOpen(false), fetchHandler];
    deleteApi({
      url: `api/v1/admin/deleteUser/${userId}`,
      additionalFunctions,
      successMsg: "Client Removed !",
      setLoading,
    });
  };

  const debouncedSetQuery = (term) => {
    clearTimeout(debouncedSetQuery.timeoutId);
    debouncedSetQuery.timeoutId = setTimeout(() => {
      setSearch(term);
    }, 500);
  };

  useEffect(() => {
    if (search || isSubscription) {
      setPage(1);
    }
  }, [search, isSubscription]);

  useEffect(() => {
    fetchHandler();
  }, [fetchHandler]);

  useEffect(() => {
    if (data) {
      setCurrentIndex(data.data?.limit * data.data?.page);
    }
  }, [data]);

  const openCallModal = (number) => {
    setPhone(number);
    setCallDialog(true);
  };

  const openMailModal = (mial) => {
    setMail(mial);
    setMailDialog(true);
  };

  useEffect(() => {
    if (data) {
      setCurrentIndex(data.data?.limit * (data.data?.page - 1));
    }
  }, [data]);

  const deleteOptions = (i) => {
    setUserName(`${i.firstName + " " + i.lastName}`);
    setUserId(i._id);
    setOpen(true);
  };

  const verify = (i) => {
    setUserId(i._id);
    setVerifyModal(true);
  };

  const thead = [
    "Sno.",
    "Full Name",
    "Mobile Number",
    "Email Address",
    "Plan",
    "Plan Renew",
    "Card Status",
    "Subscription",
    // "",
    "",
  ];

  const showExpiryData = (user) => {
    if (user?.isSubscription) {
      if (user?.subscriptionExpiration) {
        return DateInMMDDYY(user?.subscriptionExpiration);
      }
    }
  };

  const showPlan = (user) => {
    if (user?.isSubscription) {
      return (
        <span>
          {user?.subscriptionId?.plan}{" "}
          {user.subscriptionId?.price && `$${user?.subscriptionId?.price}`}
        </span>
      );
    }
  };

  const subscriptionAction = (user) => {
    if (user?.isSubscription) {
      if (isSubscription !== true) {
        return (
          <span className="flexCont">
            <span
              className="subscription-icon-container"
              onClick={() => verify(user)}
            >
              <FaPenNib />
            </span>
          </span>
        );
      } else {
        return (
          <div className="flexCont" style={{ justifyContent: "flex-start" }}>
            <Button
              variant="dark"
              onClick={() => {
                setUserId(user?._id);
                setIsCancel(true);
              }}
            >
              Cancel
            </Button>
            <span
              className="subscription-icon-container"
              onClick={() => verify(user)}
            >
              <FaPenNib />
            </span>
          </div>
        );
      }
    }
  };

  const tbody = data?.data?.docs?.map((i, index) => [
    `#${currentIndex + index + 1}`,
    i.firstName + " " + i.lastName,
    <span className="cursor-pointer" onClick={() => openCallModal(i.phone)}>
      {i.phone && PhoneNumberFormatter(i.phone)}
    </span>,
    <span className="cursor-pointer" onClick={() => openMailModal(i.email)}>
      {i.email}
    </span>,
    showPlan(i),
    <span>{showExpiryData(i)}</span>,
    i.cardDetailSaved ? "Yes" : "No",
    subscriptionAction(i),

    <span className="flexCont">
      <span
        className="view-icon-container"
        onClick={() => navigate(`/user-data/${i._id}`)}
      >
        <FaEye />
      </span>
      <Link to={`/edit-user/${i._id}`}>
        <span className="edit-icon">
          <FaPen />
        </span>
      </Link>
      <span className="remove-icon" onClick={() => deleteOptions(i)}>
        <FaRegTrashAlt />
      </span>
    </span>,
  ]);

  return (
    <>
      <CancelSubscription
        show={isCancel}
        handleClose={() => setIsCancel(false)}
        userId={userId}
        fetchHandler={fetchHandler}
      />
      <CallingModal
        show={callDialog}
        handleClose={() => setCallDialog(false)}
        phone={phone}
      />
      <MailModal
        show={mailDialog}
        handleClose={() => setMailDialog(false)}
        email={mail}
      />
      <ConfirmDeletion
        show={open}
        handleClose={() => setOpen(false)}
        handleDelete={deleteHandler}
        userName={userName}
        loading={loading}
      />
      <VerifySubscription
        show={verifyModal}
        handleClose={() => setVerifyModal(false)}
        userId={userId}
        fetchHandler={fetchHandler}
      />
      <EditProfile show={editDialog} onHide={() => setEditDialog(false)} />
      <section className="sectionCont">
        <p className="headP">Dashboard / Clients List </p>

        <SectionHeading
          title={`Clients List (Total : ${data?.data?.totalDocs})`}
        />

        <div className="filterBox">
          <img
            src="https://t4.ftcdn.net/jpg/01/41/97/61/360_F_141976137_kQrdYIvfn3e0RT1EWbZOmQciOKLMgCwG.jpg"
            alt=""
          />
          <input
            type="search"
            placeholder="Seach by First Name , Last Name , Email Address and Phone Number"
            onChange={(e) => debouncedSetQuery(e.target.value)}
          />
        </div>

        <div className="searchByDate w-100">
          <div className="btns-container w-100">
            <button
              className={isSubscription === "" && "active"}
              onClick={() => setisSubscription("")}
            >
              All
            </button>
            <button
              className={isSubscription === true && "active"}
              onClick={() => setisSubscription(true)}
            >
              Member Account
            </button>
            <button
              className={isSubscription === false && "active"}
              onClick={() => setisSubscription(false)}
            >
              Non-Member Account
            </button>
          </div>
        </div>

        <TableLayout thead={thead} tbody={tbody} />

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

export default HOC(User);
