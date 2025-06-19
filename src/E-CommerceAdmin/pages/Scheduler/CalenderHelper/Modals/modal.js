/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Offcanvas, Form, Button } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { Call, Mail, SendSms } from "../../../../../Helper/Helper";
import {
  copyText,
  PhoneNumberFormatter,
  formatInHour,
  inMonthFomat,
  TimeFormatter,
  roundToTwo,
} from "../../../../../utils/utils";
import Select from "react-select";
import {
  create_module_redux,
  deleteApi,
  deleteService,
  editApi,
  edit_module_redux,
  fetchServices,
  getAdOnService,
  getApi,
  getAppointment,
  getPaginatedServices,
  getRecentService,
  postApi,
  remove_module_redux,
  uploadUser,
} from "../../../../../Respo/Api";
import {
  closeModal,
  openModal,
  selectModalById,
} from "../../../../../Store/Slices/modalSlices";
import { showMsg } from "../../../../../Respo/Api";
import SpinnerComp from "../../../Component/SpinnerComp";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { ClipLoader } from "react-spinners";
import { durationOption } from "../../../../../Helper/Constant";
import { todayDate } from "../../../../../Store/Slices/dateSlice";
import FullScreenLoader from "../../../../../Component/FullScreenLoader";
import {
  Calculator,
  Heading,
} from "../../../../../Component/HelpingComponents";
import { IoSearch } from "react-icons/io5";
import {
  FaPlus,
  FaRegTrashAlt,
  FaPen,
  FaComment,
  FaLock,
  FaUnlock,
  FaCreditCard,
  FaMoneyBill,
  FaGift,
  FaSlash,
  FaFilePowerpoint,
  FaDollarSign,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export const EditNotes = ({
  show,
  setShow,
  setEdit,
  createNote,
  setNotes,
  notes,
}) => {
  function selector() {
    setEdit(true);
    createNote(false);
    setShow(false);
    setNotes(notes);
  }

  function selector2() {
    createNote(true);
    setEdit(false);
    setShow(false);
    setNotes("");
  }
  return (
    <Modal
      title="Copy to Clipboard"
      show={show}
      onHide={() => setShow(false)}
      className="text_Modal"
      style={{ top: "70%" }}
    >
      <div className="phone_dialoag">
        <button onClick={() => selector2()}>Create New </button>
        <button onClick={() => selector()}>Edit appointment notes</button>
      </div>
      <div className="close_btn" onClick={() => setShow(false)}>
        <p>Close</p>
      </div>
    </Modal>
  );
};

export const ProfileDetail = ({ show, handleClose, data }) => {
  const [open, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const { modalData } = useSelector(selectModalById("profileDetail"));
  const closeModalById = (modalId) => {
    dispatch(closeModal({ modalId }));
  };
  const selectedAppointmentDate = useSelector(todayDate);

  const closeThisOne = (modalId) => {
    closeModalById(modalId);
  };

  const id = modalData?.id;

  function openProfile() {
    handleShow("userDetailCanvas", []);
    handleClose();
  }

  const openModalById = (modalId, data) => {
    dispatch(openModal({ modalId, showModal: true, modalData: data }));
  };
  const handleShow = (modalId, data) => {
    openModalById(modalId, data);
  };

  return (
    <>
      <EditProfile
        show={open}
        handleClose={() => setOpenModal(false)}
        data={data}
      />
      <Modal
        title="Copy to Clipboard"
        show={show}
        onHide={handleClose}
        className="text_Modal"
        style={{ top: "70%" }}
      >
        <div className="phone_dialoag">
          <button onClick={() => openProfile()}>View Profile</button>
          <button
            onClick={() => {
              setOpenModal(true);
              handleClose();
            }}
          >
            Edit Profile
          </button>
        </div>
        <div className="close_btn" onClick={handleClose}>
          <p>Close</p>
        </div>
      </Modal>
    </>
  );
};

export const RescheduleCanvas = ({
  show,
  handleClose,
  setIsReschedule,
  orderId,
}) => {
  const dispatch = useDispatch();
  const { modalData } = useSelector(selectModalById("rescheduleCanvas"));
  const selectedAppointmentDate = useSelector(todayDate);

  const start = new Date(modalData?.start);
  const year = start?.toLocaleDateString("en-US", {
    year: "numeric",
  });
  const monthFormated = parseInt(start?.getMonth()) + 1;
  const dayFormated = start?.getDate();
  const monthStr = monthFormated < 10 ? `0${monthFormated}` : monthFormated;
  const dayStr = dayFormated < 10 ? `0${dayFormated}` : dayFormated;
  const formatedDate = `${year}-${monthStr}-${dayStr}`;
  const startingTime2 = start?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const [mailSend, setMailSend] = useState("yes");
  const [loading, setLoading] = useState(false);
  const [chargesOnRescheduleBooking, setChargesOnRescheduleBooking] =
    useState(true);

  const updateCharged = chargesOnRescheduleBooking ? "yes" : "no";

  const putHandler = (e) => {
    e.preventDefault();
    const payload = {
      time: startingTime2,
      mailSend,
      chargesOnRescheduleBooking: updateCharged,
    };

    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [handleClose, () => setIsReschedule(false)];
    dispatch(
      edit_module_redux({
        url: `api/v1/admin/reSechduleOrder/${orderId}/${formatedDate}`,
        payload,
        successMsg: "Rescheduled",
        dispatchFunc,
        setLoading,
        additionalFunctions,
      })
    );
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      style={{ width: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontWeight: "700" }}>
          Reschedule appointment
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading && <FullScreenLoader />}
        <div className="booked_appointment_modal cancel_appointment">
          <form onSubmit={putHandler}>
            <div className="checkbox">
              <input
                type="checkbox"
                checked={mailSend === "yes"}
                onChange={(e) => setMailSend(e.target.checked ? "yes" : "")}
                style={{ accentColor: "#2D34B7", cursor: "pointer" }}
              />
              <div>
                <p>Notify about reschedule</p>
                <span>
                  Send a message to user informing their appointment was
                  reschedule
                </span>
              </div>
            </div>

            <div className="checkbox">
              <input
                type="checkbox"
                checked={chargesOnRescheduleBooking}
                onChange={(e) =>
                  setChargesOnRescheduleBooking(e.target.checked)
                }
                style={{ accentColor: "#2D34B7", cursor: "pointer" }}
              />
              <div>
                <p>Do you want to charge a reschedule fees?</p>
              </div>
            </div>

            <button type="submit">Reschedule Appointment</button>
          </form>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export const ServiceCanvas = ({
  show,
  handleClose,
  serviceHandler,
  userDetail,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 786);
  const [searchTerm, setSearchTerm] = useState("");
  const [service, setServices] = useState([]);
  const [recent, setRecent] = useState([]);
  const [adOnServices, setAdOnServices] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [limitedServices, setLimitedService] = useState({});

  const fetchRecent = useCallback(() => {
    const id = userDetail?._id;
    getRecentService(id, setRecent);
  }, [userDetail]);

  useEffect(() => {
    if (show) {
      fetchRecent();
    }
  }, [show, fetchRecent]);

  useEffect(() => {
    if (show) {
      getAdOnService(setAdOnServices);
    }
  }, [show]);

  // Fetching Service
  const fetchService = () => {
    fetchServices(setServices);
  };

  const fetchLimitedServices = () => {
    getApi({
      url: `api/v1/Service/all/getAllOfferServices`,
      setResponse: setLimitedService,
    });
  };

  useEffect(() => {
    if (show) {
      fetchService();
      fetchLimitedServices();
    }
  }, [show]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 786);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const selectHandler = async (type, i, priceId) => {
    await serviceHandler(type, i, priceId);
    setSelectedSizes({});
    handleClose();
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    variableWidth: true,
  };

  const filteredService = searchTerm
    ? service?.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : service;

  const handleSizeChange = (selectedOption, productId) => {
    const parsedValue = JSON.parse(selectedOption.value);
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: parsedValue,
    }));
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="Appointment_Canvas">
        <div className="MW-Layout">
          <div className="heading">
            <p>Select Service</p>
          </div>
          <div className="search_input">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="search"
              placeholder="search by service name"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {recent?.length > 0 && (
            <div className="recently_booked">
              <p className="heading">
                Recently booked by{" "}
                {userDetail?.firstName + " " + userDetail?.lastName}{" "}
              </p>
              <Slider {...settings}>
                {recent?.reverse()?.map((i, index) =>
                  i?.services?.map((item) => (
                    <div
                      className="service"
                      key={`PastService${index}`}
                      onClick={() => {
                        if (!item.priceId) {
                          selectHandler("service", item?.serviceId);
                        } else {
                          selectHandler(
                            "service",
                            item?.serviceId,
                            item?.priceId
                          );
                        }
                      }}
                      style={{ marginLeft: "20px !important" }}
                    >
                      <p className="title"> {item?.serviceId?.name} </p>
                      <p className="faded">
                        {" "}
                        {i?.toTime && inMonthFomat(i.toTime)} ({item?.totalTime}
                        )
                      </p>
                      {!i.priceId && <p className="price"> ${item.price} </p>}
                      {i.priceId && <p className="price"> {item.size} </p>}
                      {i.priceId && <p className="price"> {item.sizePrice} </p>}
                    </div>
                  ))
                )}
              </Slider>
            </div>
          )}

          {filteredService?.length > 0 && (
            <>
              <Heading
                title={"Regular services"}
                className={"NormalHeading mt-3"}
              />

              <div className="service_selector_container">
                {filteredService?.map((i, index) => (
                  <div
                    className={`service_selector `}
                    key={`service${index}`}
                    onClick={() => {
                      if (!i.multipleSize) {
                        selectHandler("service", i);
                      }
                    }}
                  >
                    <div
                      className={`${i.sizePrice === true ? "full-react" : ""} `}
                    >
                      <p className="title"> {i.name} </p>
                      <p className="faded"> {i.totalTime} </p>
                      {i.multipleSize === true && (
                        <>
                          <Select
                            options={i.sizePrice?.map((i) => ({
                              value: `${JSON.stringify(i)}`,
                              label: `${i.size}`,
                            }))}
                            onChange={(selectedOption) =>
                              handleSizeChange(selectedOption, i._id)
                            }
                            placeholder="Select Size"
                            className="mb-3"
                          />
                          {selectedSizes[i?._id]?.price && (
                            <button
                              onClick={() => {
                                const selectedSizeId =
                                  selectedSizes[i?._id]?._id;
                                selectHandler("service", i, selectedSizeId);
                              }}
                            >
                              Add selected service
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    {i.multipleSize === false && (
                      <p className="price"> ${i.price} </p>
                    )}
                    {i.multipleSize === true && selectedSizes[i._id] && (
                      <p className="price"> ${selectedSizes[i._id]?.price} </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Limited Offer Services */}
          {limitedServices?.data?.length > 0 && (
            <>
              <div className="heading mt-3">
                <p>Limited Offer services</p>
              </div>
              <div className="service_selector_container">
                {limitedServices?.data?.map((i, index) => (
                  <div
                    className={`service_selector `}
                    key={`service${index}`}
                    onClick={() => {
                      if (!i.multipleSize) {
                        selectHandler("service", i);
                      }
                    }}
                  >
                    <div
                      className={`${i.sizePrice === true ? "full-react" : ""} `}
                    >
                      <p className="title"> {i.name} </p>
                      <p className="faded"> {i.totalTime} </p>
                      {i.multipleSize === true && (
                        <>
                          <Select
                            options={i.sizePrice?.map((i) => ({
                              value: `${JSON.stringify(i)}`,
                              label: `${i.size}`,
                            }))}
                            onChange={(selectedOption) =>
                              handleSizeChange(selectedOption, i._id)
                            }
                            placeholder="Select Size"
                            className="mb-3"
                          />
                          {selectedSizes[i?._id]?.price && (
                            <button
                              onClick={() => {
                                const selectedSizeId =
                                  selectedSizes[i?._id]?._id;
                                selectHandler("service", i, selectedSizeId);
                              }}
                            >
                              Add selected service
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    {i.multipleSize === false && (
                      <p className="price">
                        {" "}
                        ${i.discountPrice ? i.discountPrice : i.price}{" "}
                      </p>
                    )}
                    {i.multipleSize === true && selectedSizes[i._id] && (
                      <p className="price"> ${selectedSizes[i._id]?.price} </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Ad On Service */}
          {adOnServices?.length > 0 && (
            <>
              <div className="heading mt-3">
                <p>Ad-On services</p>
              </div>
              <div className="service_selector_container">
                {adOnServices?.map((i, index) => (
                  <div
                    className="service_selector"
                    key={`service${index}`}
                    onClick={() => selectHandler("adOnService", i)}
                  >
                    <div>
                      <p className="title"> {i.name} </p>
                      <p className="faded"> {i.totalTime} </p>
                    </div>
                    <p className="price"> ${i.price} </p>
                  </div>
                ))}
              </div>{" "}
            </>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export const DetailDialog = ({
  show,
  handleClose,
  selector,
  type,
  activate,
}) => {
  const dispatch = useDispatch();

  const { modalData } = useSelector(selectModalById("appointmentDetails"));

  function useShow(id) {
    const { showModal } = useSelector(selectModalById(id));
    return showModal;
  }

  const openModalById = (modalId) => {
    dispatch(openModal({ modalId, showModal: true }));
  };

  const closeModalById = (modalId) => {
    dispatch(closeModal({ modalId }));
  };

  const handleShow = (modalId) => {
    openModalById(modalId);
  };

  const closeThisOne = (modalId) => {
    closeModalById(modalId);
  };

  function NotesSelector() {
    type("Notes");
    handleClose();
  }
  function PaymentSelector() {
    type("Payments");
    handleClose();
  }

  function openNotification() {
    showMsg(
      "",
      "Upcoming appointments can't be set to no-show , use cancel action instead",
      "danger"
    );
    handleClose();
  }

  const noShow = modalData?.isShow;
  return (
    <>
      <CancelCanvas
        show={useShow("cancelCanvas")}
        handleClose={() => closeThisOne("cancelCanvas")}
      />
      <NoShowCanvas
        show={useShow("noShowCanvas")}
        handleClose={() => closeThisOne("noShowCanvas")}
      />

      <Modal
        title="Copy to Clipboard"
        show={show}
        onHide={handleClose}
        className="text_Modal"
        style={{ top: "55%" }}
      >
        <div className="phone_dialoag">
          <button onClick={NotesSelector}>Edit appointment notes</button>
          <button onClick={() => selector()}> Reschedule </button>
          <p onClick={PaymentSelector}> Ask client to confirm </p>
          {noShow === false &&
            (activate ? (
              <p
                style={{ color: "red" }}
                onClick={() => {
                  closeThisOne("detailDialog");
                  handleShow("noShowCanvas");
                }}
              >
                {" "}
                No-show{" "}
              </p>
            ) : (
              <p style={{ color: "red" }} onClick={() => openNotification()}>
                {" "}
                No-show{" "}
              </p>
            ))}

          <p
            style={{ color: "red" }}
            onClick={() => {
              closeThisOne("detailDialog");
              handleShow("cancelCanvas");
            }}
          >
            {" "}
            Cancel{" "}
          </p>
        </div>
        <div className="close_btn" onClick={handleClose}>
          <p>Close</p>
        </div>
      </Modal>
    </>
  );
};

export const UserCanvas = ({ show, handleClose, handleClose1, userHandler }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(25);
  const [data, setData] = useState({});
  const [clientDialog, setClientDialog] = useState(false);
  const [page, setPage] = useState(1);


  const controllerRef = useRef(null);

  const fetchHandler = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    getApi({
      url: `api/v1/admin/getAllUserforSearch?search=${search}&limit=${limit}&page=${page}`,
      setResponse: setData,
      setLoading,
      options: { signal: controller.signal },
    });
  }, [search, limit, page]);


 useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (show) {
      setPage(1);
      fetchHandler();
    }
  }, 400); // delay in ms

  return () => clearTimeout(delayDebounce);
}, [search, limit, show, fetchHandler]);


  const hasMore = data?.data?.totalDocs > data?.data?.docs?.length;

  const targteHandler = () => {
    const target = document.getElementById("file");
    target.click();
  };

  const uploader = (file) => {
    const fd = new FormData();
    fd.append("excelFile", file);
    uploadUser(fd);
  };

  // ---
  const customDebounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const loadMore = customDebounce(() => {
    if (limit === data?.data?.totalDocs || limit < data?.data?.totalDocs) {
      setLimit(limit + 25);
    }
  }, 500);

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMore,
    onLoadMore: loadMore,
    disabled: loading,
  });

  const close = () => {
    handleClose()
    handleClose1()
  }

  return (
    <>
      <CreateClient
        show={clientDialog}
        handleClose={() => setClientDialog(false)}
        fetchHandler={fetchHandler}
      />
      <Offcanvas
        show={show}
        onHide={close}
        placement="bottom"
        style={{ width: "100%", height: "100%" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="Appointment_Canvas">
          <div className="heading">
            <p>Select Client</p>
          </div>
          <div className="search_input">
            <IoSearch />
            <input
              type="search"
              placeholder="search Client"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="excel_upload">
            <button onClick={() => targteHandler()}>Upload</button>
            <input
              onChange={(e) => uploader(e.target.files[0])}
              style={{ display: "none" }}
              id="file"
              type="file"
            />
          </div>

          <div className="walk-in">
            <div className="user_select" onClick={() => setClientDialog(true)}>
              <div className="plus-icon-div">
                <FaPlus />
              </div>
              <div className="content">
                <p className="heading">Add New Client </p>
              </div>
            </div>
          </div>

          <div>
            <div className="user_select_container">
              {data?.data?.docs?.map((i, index) => (
                <div
                  className="user_select"
                  key={index}
                  onClick={() => userHandler(i)}
                >
                  <div className="img"> {i.firstName?.slice(0, 1)} </div>
                  <div className="content">
                    <p className="heading">
                      {" "}
                      {i.firstName + " " + i.lastName}{" "}
                    </p>
                    <p className="faded">
                      {" "}
                      {i.phone && PhoneNumberFormatter(i?.phone)}{" "}
                    </p>
                    <p className="faded"> {i.email} </p>
                  </div>
                </div>
              ))}
            </div>
            {loading && <SpinnerComp />}
            <div ref={sentryRef}></div>
          </div>

          {/* --- */}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export const EditService = ({
  show,
  setShow,
  userId,
  fetchCart,
  date,
  time,
  type,
  priceId,
}) => {
  const [service, setService] = useState([]);
  const [id, setId] = useState("");
  const [time1, setTime] = useState("");
  const [adOnServices, setAdOnServices] = useState([]);
  const [price, setPrice] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [totalMin, setTotalMin] = useState("");
  const [newServiceId, setNewServiceId] = useState("");
  const [teamMember, setTeamMember] = useState("Shahina Hoja");
  const [previouSizeId, setPreviousSizeId] = useState("");
  const [newSizeId, setNewSizeId] = useState("");
  const [size, setSize] = useState("");
  const [memberprice, setMembershipPrice] = useState("");
  const [previousSizeName, setPreviousSizeName] = useState("");
  const [servicename, setServiceName] = useState("");
  const [sizeArr, setSizeArr] = useState([]);
  const [discount, setDiscount] = useState(0);

  async function fetchHandler() {
    fetchServices(setService);
  }

  useEffect(() => {
    if (show) {
      fetchHandler();
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      getAdOnService(setAdOnServices);
    }
  }, [show]);

  async function deleteHandler() {
    let payload;
    if (previouSizeId && previousSizeName) {
      payload = {
        priceId: previouSizeId,
      };
    }
    await deleteService(id, userId, fetchCart, payload);
    setShow(false);
  }

  let payload;

  if (previouSizeId && newSizeId && size) {
    payload = {
      date,
      newServiceId,
      price,
      quantity: 1,
      totalMin,
      totalTime,
      userId,
      teamMember,
      time: time1,
      priceId: previouSizeId,
      newPriceId: newSizeId,
      size,
      memberprice,
      discount,
    };
  } else {
    payload = {
      date,
      newServiceId,
      price,
      quantity: 1,
      totalMin,
      totalTime,
      userId,
      teamMember,
      time: time1,
      memberprice,
      discount,
    };
  }

  const addInCart = async (e) => {
    e.preventDefault();
    const additionalFunctions = [fetchCart, () => setShow(false)];
    postApi({
      url: `api/v1/admin/editServiceInCart/${id}`,
      payload,
      additionalFunctions,
    });
  };

  useEffect(() => {
    if (show) {
      if (type === "Regular") {
        setId(priceId?.serviceId?._id);
        setNewServiceId(priceId?.serviceId?._id);
        setPrice(priceId?.price);
        setMembershipPrice(priceId?.memberprice);
        setServiceName(priceId?.serviceId?.name);
        setTotalTime(priceId?.totalTime);
        if (priceId?.priceId) {
          setPreviousSizeName(priceId?.size);
          setPreviousSizeId(priceId?.priceId);
          setNewSizeId(priceId?.priceId);
          setSize(priceId?.size);
          setSizeArr(priceId?.serviceId?.sizePrice);
        } else {
          setPreviousSizeName("");
        }
        setDiscount(priceId?.discount);
      } else {
        setId(priceId?.addOnservicesId?._id);
        setNewServiceId(priceId?.addOnservicesId?._id);
        setPrice(priceId?.price);
        setTotalTime(priceId?.totalTime);
      }
    }
  }, [show, priceId]);

  const flexContainer = {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItem: "center",
  };

  const halfWidth = {
    width: "50%",
  };

  useEffect(() => {
    if (time) {
      setTime(time);
    }
  }, [time]);

  async function deleteAnother() {
    const additionalFunctions = [fetchCart, () => setShow(false)];
    deleteApi({
      url: `api/admin/cart/delete/AddOnservices/${id}/${userId}`,
      additionalFunctions,
    });
  }

  const addAdOn = async (e) => {
    e.preventDefault();
    const additionalFunctions = [fetchCart, () => setShow(false)];
    postApi({
      url: `api/v1/admin/editAddOnservicesInCart/${id}`,
      payload,
      additionalFunctions,
    });
  };

  useEffect(() => {
    if (totalTime) {
      const hoursAndMinutesMatch = totalTime.match(
        /(\d+)\s*hr(?:\s*(\d*)\s*min)?/
      );
      const onlyHoursMatch = totalTime.match(/(\d+)\s*hr/);
      const onlyMinutesMatch = totalTime.match(/(\d+)\s*min/);
      if (hoursAndMinutesMatch || onlyMinutesMatch || onlyHoursMatch) {
        TimeFormatter({
          value: totalTime,
          setTime: setTotalTime,
          setMin: setTotalMin,
        });
      }
    }
  }, [totalTime]);

  const handleChanges = (e) => {
    const data = JSON.parse(e.target.value);
    setNewServiceId(data._id);
    setTotalTime(data?.totalTime);
    if (data.multipleSize === true) {
      setSizeArr(data.sizePrice);
      setNewSizeId("");
      setSize("");
    } else {
      setSizeArr([]);
      setNewSizeId("");
      setSize("");
    }
  };

  const handle_change = (e) => {
    const data = JSON.parse(e.target.value);
    setNewServiceId(data._id);
    setPrice(data.price);
    setTotalTime(data?.totalTime);
  };

  const durationHandler = (e) => {
    setTotalTime(e.value);
  };

  const teamOption = [
    {
      value: "Shahina Hoja",
      label: "Shahina Hoja",
    },
    {
      value: "Noor R.",
      label: "Noor R.",
    },
  ];

  const sizeHandler = (i) => {
    const data = JSON.parse(i);
    setNewSizeId(data._id);
    if (!previouSizeId) {
      setPreviousSizeId(data._id);
    }
    setSize(data.size);
    setMembershipPrice(data.mPrice);
    setPrice(data.price);
  };

  function showTime(i) {
    if (i.multipleSize === false) {
      return `( ${i.totalTime} )`;
    }
  }

  return (
    <Offcanvas
      show={show}
      onHide={() => setShow(false)}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontWeight: "900" }}>
          Edit service
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="booked_appointment_modal">
        <form>
          <div>
            <p>Previous Selected Service</p>
            <input type="text" disabled defaultValue={servicename} />
          </div>
          {previousSizeName && (
            <div>
              <p>Previous Selected Size</p>
              <input type="text" disabled defaultValue={previousSizeName} />
            </div>
          )}
        </form>
        {type === "Regular" ? (
          <form>
            <div>
              <p>Service</p>
              <select onChange={handleChanges}>
                <option>Select Service</option>
                {service?.map((i, index) => (
                  <option key={`Servic${index}`} value={JSON.stringify(i)}>
                    {" "}
                    {i.name} {showTime(i)}
                  </option>
                ))}
              </select>
            </div>

            <div style={flexContainer}>
              <div style={halfWidth}>
                <p>Start time</p>
                <input
                  type="time"
                  onChange={(e) => setTime(e.target.value)}
                  value={time1}
                />
              </div>
              <div style={halfWidth} className="select_Div">
                <p>Duration</p>

                <Select
                  options={durationOption}
                  placeholder="Select Duration"
                  onChange={(e) => durationHandler(e)}
                />
              </div>
            </div>

            <div style={flexContainer}>
              <div style={halfWidth}>
                <p>Price</p>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={0}
                  placeholder="150"
                />
              </div>
              <div style={halfWidth} className="select_Div">
                <p>Team member</p>
                <Select
                  options={teamOption}
                  placeholder="Select Team Member"
                  onChange={(e) => setTeamMember(e.value)}
                />
              </div>
            </div>

            <div style={flexContainer}>
              {sizeArr?.length > 0 && (
                <div style={halfWidth} className="select_Div">
                  <p>Select Package</p>
                  <Select
                    options={sizeArr?.map((i) => ({
                      value: JSON.stringify(i),
                      label: i.size,
                    }))}
                    onChange={(e) => sizeHandler(e.value)}
                    placeholder="Select Package"
                  />
                </div>
              )}

              {priceId?.serviceId?.type === "offer" ? (
                <div style={halfWidth}>
                  <p>Discount Price</p>
                  <input
                    type="number"
                    min={0}
                    onChange={(e) => setDiscount(e.target.value)}
                    value={discount}
                  />
                </div>
              ) : (
                <div style={halfWidth}>
                  <p>Membership Price</p>
                  <input
                    type="number"
                    min={0}
                    onChange={(e) => setMembershipPrice(e.target.value)}
                    value={memberprice}
                  />
                </div>
              )}
            </div>

            <div className="btn_container">
              <span className="icon-action" onClick={() => deleteHandler()}>
                <FaRegTrashAlt className="text-[#BF3131]" />
              </span>

              <button onClick={addInCart}>Apply</button>
            </div>
          </form>
        ) : (
          <form>
            <div>
              <p>Service</p>
              <select onChange={handle_change}>
                <option>Select Service</option>
                {adOnServices?.map((i, index) => (
                  <option key={`Servic${index}`} value={JSON.stringify(i)}>
                    {" "}
                    {i.name} ( {i.totalTime} )
                  </option>
                ))}
              </select>
            </div>
            <div style={flexContainer}>
              <div style={halfWidth}>
                <p>Start time</p>
                <input
                  type="time"
                  onChange={(e) => setTime(e.target.value)}
                  value={time1}
                />
              </div>
              <div style={halfWidth} className="select_Div">
                <p>Duration</p>
                <Select
                  options={durationOption}
                  placeholder="Select Duration"
                  onChange={(e) => durationHandler(e)}
                />
              </div>
            </div>

            <div style={flexContainer}>
              <div style={halfWidth}>
                <p>Price</p>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={0}
                  placeholder="150"
                />
              </div>
              <div style={halfWidth} className="select_Div">
                <p>Team member</p>
                <Select
                  options={teamOption}
                  placeholder="Select Team Member"
                  onChange={(e) => setTeamMember(e.value)}
                />
              </div>
            </div>

            <div className="mt-4"></div>
            <div className="btn_container">
              <span className="icon-action" onClick={() => deleteAnother()}>
                <FaRegTrashAlt className="text-[#BF3131]" />
              </span>

              <button onClick={addAdOn}>Apply</button>
            </div>
          </form>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export const CancelCanvas = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const [cancelReason, setCancelReason] = useState("");
  const [mailSend, setMailSend] = useState(true);
  const [chargedOnCancelBooking, setChargedOnCancelBooking] = useState(true);
  const [hour, setHour] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectedAppointmentDate = useSelector(todayDate);

  const { modalData } = useSelector(selectModalById("appointmentDetails"));

  const closeModalById = (modalId) => {
    dispatch(closeModal({ modalId }));
  };
  const closeThisOne = (modalId) => {
    closeModalById(modalId);
  };

  const id = modalData?.id;

  const updateMail = mailSend ? "yes" : "no";
  const updateCharged = chargedOnCancelBooking ? "yes" : "no";

  async function cancelThis(e) {
    e.preventDefault();
    const payload = {
      cancelReason,
      mailSend: updateMail,
      chargedOnCancelBooking: updateCharged,
    };

    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [
      handleClose,
      () => closeThisOne("detailDialog"),
      () => closeThisOne("appointmentDetails"),
    ];
    dispatch(
      edit_module_redux({
        url: `api/v1/cancelBooking/${id}`,
        payload,
        successMsg: "Cancelled Appointment",
        dispatchFunc,
        setLoading,
        additionalFunctions,
      })
    );
  }

  const date = modalData?.start;

  useEffect(() => {
    if (date && show) {
      formatInHour({ date, setMonth, setDay, setHour });
    }
  }, [show, date]);

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontWeight: "700" }}>
          Cancel appointment
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="booked_appointment_modal cancel_appointment">
          {loading && <FullScreenLoader />}
          <p className="tagLine">
            This appointment was boooked by {modalData?.fullName} at {hour} ,{" "}
            {day} {month}
          </p>
          <form onSubmit={cancelThis}>
            <div>
              <p>Cancellation reason</p>
              <select onChange={(e) => setCancelReason(e.target.value)}>
                <option></option>
                <option value={"No reason provided"}>No reason provided</option>
                <option value={"Duplicate appointment"}>
                  Duplicate appointment
                </option>
                <option value={"Appointment made by mistake"}>
                  Appointment made by mistake
                </option>
                <option value={"Client not available"}>
                  Client not available
                </option>
              </select>
            </div>

            <div className="checkbox">
              <input
                type="checkbox"
                checked={mailSend}
                onChange={(e) => setMailSend(e.target.checked)}
                style={{ accentColor: "#2D34B7", cursor: "pointer" }}
              />
              <div>
                <p>Send {modalData?.fullName} a cancellation notification</p>
                <span>
                  Send a message informing {modalData?.fullName} their
                  appointment has been updated
                </span>
              </div>
            </div>
            <div className="checkbox">
              <input
                type="checkbox"
                checked={chargedOnCancelBooking}
                onChange={(e) => setChargedOnCancelBooking(e.target.checked)}
                style={{ accentColor: "#2D34B7", cursor: "pointer" }}
              />
              <div>
                <p>Do you want to charge a cancel fees?</p>
              </div>
            </div>

            <button type="submit">Cancel appointment</button>
          </form>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export const UserDialog = ({ show, setShow, data, fetchBooking }) => {
  const [profile, setProfile] = useState(false);
  const dispatch = useDispatch();
  const selectedAppointmentDate = useSelector(todayDate);
  function closeProfile() {
    setProfile(false);
  }

  function BlockHandler() {
    const id = data?.user?._id;
    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [fetchBooking, () => setShow(false)];
    dispatch(
      edit_module_redux({
        url: `api/v1/admin/activeBlockUser/${id}`,
        payload: {},
        dispatchFunc,
        additionalFunctions,
      })
    );
  }

  const closeModalById = (modalId) => {
    dispatch(closeModal({ modalId }));
  };

  const closeThisOne = (modalId) => {
    closeModalById(modalId);
  };
  const closeHandler = () => setShow(false);
  const deleteHandler = async () => {
    const id = data?.user?._id;
    // await dispatch(deleteUser(id, closeHandler()));
    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [
      closeHandler,
      () => closeThisOne("userDetailCanvas"),
      () => closeThisOne("appointmentDetails"),
    ];
    dispatch(
      remove_module_redux({
        url: `api/v1/admin/deleteUser/${id}`,
        successMsg: "Removed",
        dispatchFunc,
        additionalFunctions,
      })
    );
  };

  return (
    <>
      <EditProfile show={profile} handleClose={closeProfile} data={data} />
      <Modal
        show={show}
        onHide={() => setShow(false)}
        className="text_Modal"
        style={{ top: "60%" }}
      >
        <div className="phone_dialoag user_dialog">
          <button
            onClick={() => {
              setShow(false);
              setProfile(true);
            }}
          >
            Edit details
            <FaPen />
          </button>
          <button onClick={() => Call(data?.user?.phone)}>
            Call mobile number
            <FaPen />
          </button>
          <button onClick={() => SendSms(data?.user?.phone)}>
            Send text message
            <span className="comment-icon">
              <FaComment />
            </span>
          </button>
          {data?.user?.userStatus === "Block" ? (
            <button onClick={BlockHandler}>
              Un-Block client
              <FaUnlock />
            </button>
          ) : (
            <button onClick={BlockHandler}>
              Block client
              <FaLock />
            </button>
          )}

          <button style={{ color: "rgb(176, 34, 12)" }} onClick={deleteHandler}>
            Delete client
            <FaRegTrashAlt />
          </button>
        </div>
        <div className="close_btn" onClick={() => setShow(false)}>
          <p>Close</p>
        </div>
      </Modal>
    </>
  );
};

export const EditProfile = ({ show, handleClose, data }) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [showOnAllBooking, setShowOnAllBooking] = useState(true);
  const [sendEmailNotification, setSendEmailNotification] = useState(true);
  const [sendTextNotification, sentTextNotification] = useState(true);
  const [sendEmailMarketingNotification, setSendEmailMarketingNotification] =
    useState(true);
  const [sendTextMarketingNotification, setSendTextMarketingNotification] =
    useState(true);
  const [preferredLAnguage, setPreferedLanguage] = useState("");
  const [id, setId] = useState("");
  const selectedAppointmentDate = useSelector(todayDate);
  const [loading, setLoading] = useState(false);
  const title = data?.user?.firstName + " " + data?.user?.lastName;

  useEffect(() => {
    if (data) {
      setFirstName(data?.user?.firstName);
      setLastName(data?.user?.lastName);
      setEmail(data?.user?.email);
      setPhone(data?.user?.phone);
      setGender(data?.user?.gender);
      setDob(data?.user?.dob);
      setId(data?.user?._id);
      setBio(data?.user?.bio);
      setSendEmailNotification(data?.user?.sendEmailNotification);
      setShowOnAllBooking(data?.user?.showOnAllBooking);
      sentTextNotification(data?.user?.sendTextNotification);
      setSendEmailMarketingNotification(
        data?.user?.sendEmailMarketingNotification
      );
      setSendTextMarketingNotification(
        data?.user?.sendTextMarketingNotification
      );
      setPreferedLanguage(data?.user?.preferredLAnguage);
    }
  }, [data]);

  const payload = {
    firstName,
    lastName,
    fullName: title,
    email,
    phone,
    gender,
    dob,
    bio,
    showOnAllBooking,
    sendEmailNotification,
    sendTextNotification,
    sendEmailMarketingNotification,
    sendTextMarketingNotification,
    preferredLAnguage,
  };

  const closeModalById = (modalId) => {
    dispatch(closeModal({ modalId }));
  };
  const closeThisOne = (modalId) => {
    closeModalById(modalId);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [
      handleClose,
      () => closeThisOne("userDetailCanvas"),
      () => closeThisOne("appointmentDetails"),
    ];
    dispatch(
      edit_module_redux({
        url: `api/v1/admin/updateClientProfile/${id}`,
        payload,
        successMsg: "Updated Successfully",
        dispatchFunc,
        additionalFunctions,
        setLoading,
      })
    );
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading && <FullScreenLoader />}
        <div className="MW-Layout">
          <div className="heading">
            <p
              className="text-slate-900 font-semibold"
              style={{ fontSize: "1.5rem" }}
            >
              Edit client
            </p>
          </div>
          <div className="Appointment_Canvas" style={{ paddingTop: 0 }}>
            <div
              className="user_select_container"
              style={{ backgroundColor: "#F2F1F6", borderRadius: "10px" }}
            >
              <div className="user_select" style={{ border: "none" }}>
                <div className="img"> {title?.slice(0, 1)} </div>
                <div className="content">
                  <p className="heading">{title}</p>
                  <p className="faded"> {data?.user?.email} </p>
                  <p className="faded">
                    +{PhoneNumberFormatter(data?.user?.phone)}{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="booked_appointment_modal edit-profile-canvas">
            <form onSubmit={submitHandler}>
              <div>
                <p>First name</p>
                <input
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </div>
              <div>
                <p>Last name</p>
                <input
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                />
              </div>

              <div className="mb-3">
                <PhoneInput value={phone} country={"us"} onChange={setPhone} />
              </div>

              <div>
                <p>Email address</p>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              <div>
                <p>Gender</p>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option></option>
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                </select>
              </div>

              <div>
                <p>Date of birth</p>
                <input type="date" onChange={(e) => setDob(e.target.value)} />
              </div>
              <div className="h-4 width-full bg-[#F2F1F6]"></div>
              <div>
                <h4 style={{ fontWeight: "bold", margin: 0 }}>
                  Important client info
                </h4>
                <span
                  style={{ fontWeight: "bold", margin: 0, fontSize: "12px" }}
                >
                  Important client info will only be visible to you and team
                  members
                </span>
                <p className="mt-3">Client info</p>
                <textarea
                  rows={5}
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                />
                <div className="check-Box">
                  <div className="main">
                    <Form.Check
                      type="checkbox"
                      value={showOnAllBooking}
                      checked={showOnAllBooking}
                      onChange={(e) => setShowOnAllBooking(e.target.checked)}
                      style={{ width: "20px" }}
                    />
                    <p>Display on all bookings</p>
                  </div>
                </div>
              </div>
              <div className="h-4 width-full bg-[#F2F1F6]"></div>
              <div>
                <h4 style={{ fontWeight: "bold", margin: 0 }}>Notifications</h4>
                <span
                  style={{ fontWeight: "bold", margin: 0, fontSize: "12px" }}
                >
                  Choose how you'd like to keep this client up to date about
                  thier appointments and sales , like vouchers and membership
                </span>
                <p className="mt-3">Client notifications</p>
                <div className="check-Box">
                  <div className="main">
                    <Form.Check
                      type="switch"
                      value={sendEmailNotification}
                      checked={sendEmailNotification}
                      onChange={(e) =>
                        setSendEmailNotification(e.target.checked)
                      }
                    />
                    <p>Send email notifications</p>
                  </div>
                  <div className="main">
                    <Form.Check
                      type="switch"
                      value={sendTextNotification}
                      checked={sendTextNotification}
                      onChange={(e) => sentTextNotification(e.target.checked)}
                    />
                    <p>Send text notifications</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mt-3">Marketing notifications</p>
                <div className="check-Box">
                  <div className="main">
                    <Form.Check
                      type="switch"
                      value={sendEmailMarketingNotification}
                      onChange={(e) =>
                        setSendEmailMarketingNotification(e.target.checked)
                      }
                      checked={sendEmailMarketingNotification}
                    />
                    <p>Client accepts email marketing notification</p>
                  </div>
                  <div className="main">
                    <Form.Check
                      type="switch"
                      value={sendTextMarketingNotification}
                      onChange={(e) =>
                        setSendTextMarketingNotification(e.target.checked)
                      }
                      checked={sendTextMarketingNotification}
                    />
                    <p>Client accepts text message marketing notification</p>
                  </div>
                </div>
              </div>

              <div>
                <p>Preferred Language</p>
                <select
                  onChange={(e) => setPreferedLanguage(e.target.value)}
                  value={preferredLAnguage}
                >
                  <option></option>
                  <option value={"English"}>English</option>
                </select>
              </div>

              <button type="submit"> Save</button>
            </form>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export const EditBookedService = ({
  show,
  setShow,
  fetchCart,
  date,
  time,
  type,
  priceId,
  setPriceId,
  orderId,
}) => {
  const [service, setService] = useState([]);
  const [id, setId] = useState("");
  const [time1, setTime] = useState("");
  const [adOnServices, setAdOnServices] = useState([]);
  const [price, setPrice] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [totalMin, setTotalMin] = useState("");
  const [newServiceId, setNewServiceId] = useState("");
  const [teamMember, setTeamMember] = useState({
    value: "Shahina Hoja",
    label: "Shahina Hoja",
  });
  const [previouSizeId, setPreviousSizeId] = useState("");
  const [newSizeId, setNewSizeId] = useState("");
  const [size, setSize] = useState("");
  const [memberprice, setMembershipPrice] = useState("");
  const [previousSizeName, setPreviousSizeName] = useState("");
  const [sizeArr, setSizeArr] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const selectedAppointmentDate = useSelector(todayDate);
  const dispatch = useDispatch();

  async function fetchHandler() {
    fetchServices(setService);
  }

  useEffect(() => {
    if (show) {
      fetchHandler();
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      getAdOnService(setAdOnServices);
    }
  }, [show]);

  async function deleteHandler() {
    let payload;
    if (previouSizeId && previousSizeName) {
      payload = {
        serviceId: id,
        priceId: previouSizeId,
      };
    } else {
      payload = {
        serviceId: id,
      };
    }
    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [fetchCart, () => setShow(false)];
    dispatch(
      edit_module_redux({
        url: `api/v1/deleteServicefromOrders/${orderId}`,
        payload,
        dispatchFunc,
        additionalFunctions,
        successMsg: "Service deleted from the cart",
      })
    );
  }

  let payload;

  if (previouSizeId && newSizeId && size) {
    payload = {
      date,
      newServiceId,
      price,
      quantity: 1,
      serviceId: priceId?.serviceId?._id,
      teamMember: teamMember?.value,
      time: time1,
      totalMin,
      totalTime,
      priceId: previouSizeId,
      newPriceId: setNewSizeId,
      size,
      memberprice,
    };
  } else {
    payload = {
      date,
      newServiceId,
      price,
      quantity: 1,
      serviceId: priceId?.serviceId?._id,
      teamMember: teamMember?.value,
      time: time1,
      totalMin,
      totalTime,
      memberprice,
    };
  }

  const addInCart = async (e) => {
    e.preventDefault();
    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [
      fetchCart,
      () => setShow(false),
      () => setPriceId(""),
    ];
    dispatch(
      edit_module_redux({
        url: `api/v1/editServiceIOrders/${orderId}`,
        payload,
        dispatchFunc,
        additionalFunctions,
      })
    );
  };

  useEffect(() => {
    if (show) {
      if (type === "Regular" && priceId) {
        setId(priceId?.serviceId?._id);
        setNewServiceId(priceId?.serviceId?._id);
        setPrice(priceId?.price);
        setMembershipPrice(priceId?.memberprice);
        setTotalTime(priceId?.totalTime);
        setServiceName(priceId?.serviceId?.name);
        setTeamMember({
          value: priceId?.teamMember,
          label: priceId?.teamMember,
        });
        if (priceId?.priceId) {
          setPreviousSizeName(priceId?.size);
          setPreviousSizeId(priceId?.priceId);
          setNewSizeId(priceId?.priceId);
          setSize(priceId?.size);
          setSizeArr(priceId?.serviceId?.sizePrice);
        } else {
          setPreviousSizeName("");
          setPreviousSizeName("");
          setPreviousSizeId("");
          setNewSizeId("");
          setSize("");
          setSizeArr("");
        }
      } else {
        setId(priceId?.addOnservicesId?._id);
        setNewServiceId(priceId?.addOnservicesId?._id);
        setPrice(priceId?.price);
        setTotalTime(priceId?.totalTime);
        setServiceName(priceId?.addOnservicesId?.name);
        setTeamMember({
          value: priceId?.teamMember,
          label: priceId?.teamMember,
        });
        setPreviousSizeName("");
        setPreviousSizeName("");
        setPreviousSizeId("");
        setNewSizeId("");
        setSize("");
        setSizeArr("");
      }
    }
  }, [show, priceId, type]);

  const flexContainer = {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItem: "center",
  };

  const halfWidth = {
    width: "50%",
  };

  useEffect(() => {
    if (time) {
      setTime(time);
    }
  }, [time]);

  async function deleteAnother() {
    const payload = {
      addOnservicesId: id,
    };
    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [fetchCart, () => setShow(false)];
    dispatch(
      edit_module_redux({
        url: `api/v1/deleteAddOnServicefromOrders/${orderId}`,
        payload,
        dispatchFunc,
        additionalFunctions,
        successMsg: "Service deleted from the cart",
      })
    );
  }

  const addAdOn = async (e) => {
    e.preventDefault();
    const payload = {
      date,
      newAddOnservicesId: newServiceId,
      price,
      quantity: 1,
      addOnservicesId: id,
      teamMember: teamMember?.value,
      time,
      totalMin,
      totalTime,
      memberprice,
    };
    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [fetchCart, () => setShow(false)];
    dispatch(
      edit_module_redux({
        url: `api/v1/editAddOnservicesInOrders/${orderId}`,
        payload,
        dispatchFunc,
        additionalFunctions,
      })
    );
  };

  useEffect(() => {
    if (totalTime) {
      const hoursAndMinutesMatch = totalTime.match(
        /(\d+)\s*hr(?:\s*(\d*)\s*min)?/
      );
      const onlyHoursMatch = totalTime.match(/(\d+)\s*hr/);
      const onlyMinutesMatch = totalTime.match(/(\d+)\s*min/);
      if (hoursAndMinutesMatch || onlyMinutesMatch || onlyHoursMatch) {
        TimeFormatter({
          value: totalTime,
          setTime: setTotalTime,
          setMin: setTotalMin,
        });
      }
    }
  }, [totalTime]);

  const handleChanges = (e) => {
    const data = JSON.parse(e.target.value);
    setNewServiceId(data._id);
    setTotalTime(data?.totalTime);
    if (data.multipleSize === true) {
      setSizeArr(data.sizePrice);
      setNewSizeId("");
      setSize("");
    } else {
      setSizeArr([]);
      setNewSizeId("");
      setSize("");
    }
  };

  const handle_change = (e) => {
    const data = JSON.parse(e.target.value);
    setNewServiceId(data._id);
    setPrice(data.price);
    setTotalTime(data?.totalTime);
  };

  const durationHandler = (e) => {
    setTotalTime(e.value);
  };

  const teamOption = [
    {
      value: "Shahina Hoja",
      label: "Shahina Hoja",
    },
    {
      value: "Noor R.",
      label: "Noor R.",
    },
  ];

  const sizeHandler = (i) => {
    const data = JSON.parse(i);
    setNewSizeId(data._id);
    if (!previouSizeId) {
      setPreviousSizeId(data._id);
    }
    setSize(data.size);
    setMembershipPrice(data.mPrice);
    setPrice(data.price);
  };

  function showTime(i) {
    if (i.multipleSize === false) {
      return `( ${i.totalTime} )`;
    }
  }

  return (
    <Offcanvas
      show={show}
      onHide={() => setShow(false)}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontWeight: "900" }}>
          Edit service
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="booked_appointment_modal">
        <form>
          <div>
            <p>Previous Selected Service</p>
            <input type="text" disabled defaultValue={serviceName} />
          </div>
          {previousSizeName && (
            <div>
              <p>Previous Selected Size</p>
              <input type="text" disabled defaultValue={previousSizeName} />
            </div>
          )}
        </form>
        {type === "Regular" ? (
          <form>
            <div>
              <p>Service</p>
              <select onChange={handleChanges}>
                <option>Select Service</option>
                {service?.map((i, index) => (
                  <option key={`Servic${index}`} value={JSON.stringify(i)}>
                    {" "}
                    {i.name} {showTime(i)}
                  </option>
                ))}
              </select>
            </div>

            <div style={flexContainer}>
              <div style={halfWidth}>
                <p>Start time</p>
                <input
                  type="time"
                  onChange={(e) => setTime(e.target.value)}
                  value={time1}
                />
              </div>
              <div style={halfWidth} className="select_Div">
                <p>Duration</p>
                <Select
                  options={durationOption}
                  placeholder="Select Duration"
                  onChange={(e) => durationHandler(e)}
                />
              </div>
            </div>

            <div style={flexContainer}>
              <div style={halfWidth}>
                <p>Price</p>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={0}
                  placeholder="150"
                />
              </div>
              <div style={halfWidth} className="select_Div">
                <p>Team member</p>
                <Select
                  options={teamOption}
                  placeholder="Select Team Member"
                  onChange={setTeamMember}
                  value={teamMember}
                />
              </div>
            </div>

            <div style={flexContainer}>
              {sizeArr?.length > 0 && (
                <div style={halfWidth} className="select_Div">
                  <p>Select Package</p>
                  <Select
                    options={sizeArr?.map((i) => ({
                      value: JSON.stringify(i),
                      label: i.size,
                    }))}
                    onChange={(e) => sizeHandler(e.value)}
                    placeholder="Select Package"
                  />
                </div>
              )}

              <div style={halfWidth}>
                <p>Membership Price</p>
                <input
                  type="number"
                  min={0}
                  onChange={(e) => setMembershipPrice(e.target.value)}
                  value={memberprice}
                />
              </div>
            </div>

            <div className="btn_container">
              <span className="icon-action" onClick={() => deleteHandler()}>
                <FaRegTrashAlt className="text-[#BF3131]" />
              </span>

              <button onClick={addInCart}>Apply</button>
            </div>
          </form>
        ) : (
          <form>
            <div>
              <p>Service</p>
              <select onChange={handle_change}>
                <option>Select Service</option>
                {adOnServices?.map((i, index) => (
                  <option key={`Servic${index}`} value={JSON.stringify(i)}>
                    {" "}
                    {i.name} ( {i.totalTime} )
                  </option>
                ))}
              </select>
            </div>
            <div style={flexContainer}>
              <div style={halfWidth}>
                <p>Start time</p>
                <input
                  type="time"
                  onChange={(e) => setTime(e.target.value)}
                  value={time1}
                />
              </div>
              <div style={halfWidth} className="select_Div">
                <p>Duration</p>
                <Select
                  options={durationOption}
                  placeholder="Select Duration"
                  onChange={(e) => durationHandler(e)}
                />
              </div>
            </div>

            <div style={flexContainer}>
              <div style={halfWidth}>
                <p>Price</p>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={0}
                  placeholder="150"
                />
              </div>
              <div style={halfWidth} className="select_Div">
                <p>Team member</p>
                <Select
                  options={teamOption}
                  placeholder="Select Team Member"
                  onChange={(e) => setTeamMember(e.value)}
                />
              </div>
            </div>
            <div className="mt-4"></div>
            <div className="btn_container">
              <span className="icon-action" onClick={() => deleteAnother()}>
                <FaRegTrashAlt className="text-[#BF3131]" />
              </span>
              <button onClick={addAdOn}>Apply</button>
            </div>
          </form>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export const AddServiceModal = ({ show, handleClose, serviceHandler }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 786);
  const [searchTerm, setSearchTerm] = useState("");
  const [service, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [adOnServices, setAdOnServices] = useState([]);

  useEffect(() => {
    if (show) {
      getAdOnService(setAdOnServices);
    }
  }, [show]);

  // Fetching Service
  const fetchService = useCallback(() => {
    getPaginatedServices(searchTerm, page, setServices);
  }, [searchTerm, page]);

  useEffect(() => {
    if (show) {
      fetchService();
    }
  }, [fetchService, show]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 786);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const selectHandler = async (type, i) => {
    await serviceHandler(type, i);
    handleClose();
  };

  function Next() {
    setPage(page + 1);
  }

  function Prev() {
    setPage(page - 1);
  }

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="Appointment_Canvas">
        <div className="heading">
          <p>Select Service</p>
        </div>
        <div className="search_input">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="search"
            placeholder="search by service name"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Regular Services */}
        {service?.length > 0 && (
          <>
            <div className="heading mt-3">
              <p>Regular services</p>
            </div>
            <div className="service_selector_container">
              {service?.map((i, index) => (
                <div
                  className="service_selector"
                  key={`service${index}`}
                  onClick={() => selectHandler("service", i)}
                >
                  <div>
                    <p className="title"> {i.name} </p>
                    <p className="faded"> {i.totalTime} </p>
                  </div>
                  <p className="price"> ${i.price} </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Ad On Service */}
        {adOnServices?.length > 0 && (
          <>
            <div className="heading mt-3">
              <p>Ad-On services</p>
            </div>
            <div className="service_selector_container">
              {adOnServices?.map((i, index) => (
                <div
                  className="service_selector"
                  key={`service${index}`}
                  onClick={() => selectHandler("adOnService", i)}
                >
                  <div>
                    <p className="title"> {i.name} </p>
                    <p className="faded"> {i.totalTime} </p>
                  </div>
                  <p className="price"> ${i.price} </p>
                </div>
              ))}
            </div>{" "}
          </>
        )}

        <div className="last_button">
          {page > 1 && service?.length === 0 ? (
            ""
          ) : (
            <div className="btn_container justify-center">
              <button className="save" type="button" onClick={Next}>
                View More
              </button>
            </div>
          )}

          {page > 1 && service?.length === 0 && (
            <div className="btn_container justify-center">
              <button className="save" type="button" onClick={Prev}>
                View Less
              </button>
            </div>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export const NoShowCanvas = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const selectedAppointmentDate = useSelector(todayDate);
  const { modalData } = useSelector(selectModalById("appointmentDetails"));
  const [mailSend, setMailSend] = useState(true);
  const [chargedOnNoshow, setChargedOnNoShow] = useState(true);
  const [hour, setHour] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const date = modalData?.start;

  const id = modalData?.id;
  const closeThisOne = (modalId) => {
    closeModalById(modalId);
  };

  const closeModalById = (modalId) => {
    dispatch(closeModal({ modalId }));
  };

  const updateMail = mailSend ? "yes" : "no";
  const updateCharged = chargedOnNoshow ? "yes" : "no";

  const payload = {
    mailSend: updateMail,
    chargedOnNoshow: updateCharged,
  };

  const updateNoShow = async (e) => {
    e.preventDefault();
    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [
      handleClose,
      () => closeThisOne("cancelCanvas"),
      () => closeThisOne("detailDialog"),
      () => closeThisOne("appointmentDetails"),
    ];
    dispatch(
      edit_module_redux({
        url: `api/v1/admin/noShowUpdate/${id}`,
        payload,
        successMsg: "No show update Successfully",
        dispatchFunc,
        additionalFunctions,
        setLoading,
      })
    );
  };

  useEffect(() => {
    if (date && show) {
      formatInHour({ date, setMonth, setDay, setHour });
    }
  }, [show, date]);

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontWeight: "700" }}>
          Did Not Show
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="booked_appointment_modal cancel_appointment ">
          {loading && <FullScreenLoader />}
          <p className="tagLine">
            This appointment was boooked by {modalData?.fullName} at {hour} ,{" "}
            {day} {month}
          </p>
          <form onSubmit={updateNoShow}>
            <div className="checkbox">
              <input
                type="checkbox"
                checked={mailSend}
                onChange={(e) => setMailSend(e.target.checked)}
                style={{ accentColor: "#2D34B7", cursor: "pointer" }}
              />
              <div>
                <p>Notify {modalData?.fullName} about No-Show</p>
                <span>
                  Send a message informing {modalData?.fullName} their
                  appointment has been updated
                </span>
              </div>
            </div>
            <div className="checkbox">
              <input
                type="checkbox"
                checked={chargedOnNoshow}
                onChange={(e) => setChargedOnNoShow(e.target.checked)}
                style={{ accentColor: "#2D34B7", cursor: "pointer" }}
              />
              <div>
                <p>Do you want to charge a No-Show fees?</p>
              </div>
            </div>
            <div className="button-on-end">
              <button type="submit">Set as No-Show</button>
            </div>
          </form>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export const CallingModal = ({ show, handleClose, phone }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      style={{ top: "65%" }}
      className="text_Modal"
    >
      <div className="phone_dialoag">
        <p onClick={() => Call(phone)}>Call phone</p>
        <p onClick={() => SendSms(phone)}>Send message</p>
        <p onClick={() => copyText({ textToCopy: phone, setCopied })}>
          {copied ? "Copied !" : "Copy Phone"}
        </p>
      </div>
      <div className="close_btn" onClick={handleClose}>
        <p> Close</p>
      </div>
    </Modal>
  );
};

export const MailModal = ({ show, handleClose, email }) => {
  const [copied, setCopied] = useState(false);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      style={{ top: "65%" }}
      className="text_Modal"
    >
      <div className="phone_dialoag">
        <p onClick={() => Mail(email)}>Send Email</p>
        <p onClick={() => copyText({ textToCopy: email, setCopied })}>
          {copied ? "Copied !" : "Copy Email Address"}
        </p>
      </div>
      <div className="close_btn" onClick={handleClose}>
        <p>Close</p>
      </div>
    </Modal>
  );
};

// Create Client
export const CreateClient = ({ show, handleClose, fetchHandler }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);

  const payload = {
    firstName,
    lastName,
    email,
    phone,
    gender,
    dob,
  };
  const additionalFunctions = [fetchHandler, handleClose];

  const postHandler = (e) => {
    e.preventDefault();
    postApi({
      url: "api/v1/admin/clientRegistration",
      payload,
      setLoading,
      additionalFunctions,
      successMsg: "Client created successfully !",
    });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Create New</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={postHandler}>
          <Form.Group className="mb-3">
            <Form.Label className="required-field">First Name</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="required-field">Last Name</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="required-field">Email Address</Form.Label>
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <div className="mb-3">
            <PhoneInput
              country={"us"}
              onChange={setPhone}
              inputProps={{
                required: true,
              }}
            />
          </div>
          <Form.Group className="mb-3">
            <Form.Label className="required-field">Gender</Form.Label>
            <Form.Select required onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Your Prefrence</option>
              <option value={"Male"}> Male </option>
              <option value={"Female"}> Female </option>
              <option value={"Other"}> Other </option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>DOB</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setDob(e.target.value)}
            />
          </Form.Group>

          <Button
            style={{ backgroundColor: "#19376d", borderRadius: "0" }}
            type="submit"
          >
            {loading ? <ClipLoader color="#fff" /> : "Submit"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// confirm deletion
export const ConfirmDeletion = ({
  show,
  handleClose,
  userName,
  handleDelete,
  loading,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="delete_confirmation">
        {loading && <FullScreenLoader />}
        <div className="close_btn">
          <i className="fa-solid fa-xmark" onClick={() => handleClose()}></i>
        </div>
        <div className="content">
          <i className="fa-solid fa-trash-can"></i> <h5>Are you sure?</h5>
          <p>
            You want to delete this user <span>" {userName} "</span>
          </p>
        </div>

        <div className="btn_container">
          <button className="cancel" onClick={() => handleClose()}>
            No, Cancel
          </button>
          <button className="delete" onClick={() => handleDelete()}>
            Yes, Delete
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

// verify subscription
export const VerifySubscription = ({
  show,
  handleClose,
  userId,
  fetchHandler,
}) => {
  const [subscriptions, setSubscriptions] = useState({});
  const [SubscriptionId, setSubscriptionId] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      getApi({
        url: "api/v1/subscription",
        setResponse: setSubscriptions,
      });
    }
  }, [show]);

  const payload = {
    userId,
    SubscriptionId,
    date,
  };

  const additionalFunctions = [handleClose, fetchHandler];

  const submitHandler = (e) => {
    e.preventDefault();
    postApi({
      url: "api/v1/verifySubscriptionFromAdmin",
      payload,
      successMsg: "Success !",
      additionalFunctions,
      setLoading,
    });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Renewal Date{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Subscrption</Form.Label>
            <Form.Select
              required
              onChange={(e) => setSubscriptionId(e.target.value)}
            >
              <option value=""> Select subscription </option>
              {subscriptions?.data?.map((i, index) => (
                <option key={`${i.plan}${index}`} value={i._id}>
                  {" "}
                  {i.plan} {`$${i.price}`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button
            style={{ backgroundColor: "#19376d", borderRadius: "0" }}
            type="submit"
          >
            {loading ? <ClipLoader color="#fff" /> : "Submit"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export const NoShowPolicy = ({ show, handleClose, userName, time }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      style={{ top: "65%" }}
      className="text_Modal"
    >
      <div className="phone_dialoag">
        <p>Confirmed with card</p>
        <p className="text-start" style={{ fontSize: "14px" }}>
          {userName} agreed to your confirmation policy on {time}
          <br />
          <br />
          You may charge them <strong>50% fee</strong> for late cancellations
          within <strong>48 hours</strong> of the appointment time , or{" "}
          <strong>100% fee</strong> for not showing up.
        </p>
      </div>
      <div className="close_btn" onClick={handleClose}>
        <p>Close</p>
      </div>
    </Modal>
  );
};

// Cancel Subscription
export const CancelSubscription = ({
  show,
  handleClose,
  userId,
  fetchHandler,
}) => {
  const [reason, setReason] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const payload = {
    reason,
    type,
  };
  const additionalFunctions = [fetchHandler, handleClose];

  const postHandler = (e) => {
    e.preventDefault();
    postApi({
      url: `api/v1/cancelMemberShipByAdmin/${userId}`,
      payload,
      setLoading,
      additionalFunctions,
      successMsg: "Success",
    });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Create New</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={postHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              type="text"
              required
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select onChange={(e) => setType(e.target.value)}>
              <option value="">Select Your Prefrence</option>
              <option value="Overpriced">Overpriced</option>
              <option value="Other Reason">Other Reason</option>
            </Form.Select>
          </Form.Group>

          <Button
            style={{ backgroundColor: "#19376d", borderRadius: "0" }}
            type="submit"
          >
            {loading ? <ClipLoader color="#fff" /> : "Submit"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// Checkout Canvase

export const CheckoutCanvas = ({ show, handleClose, data, fetchCart }) => {
  const [tips, setTips] = useState({});
  const [tipAmount, setTipAmount] = useState(0);
  const [isPaymentCanvas, setIsPaymentCanvas] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      getApi({
        url: `api/v1/admin/getTipsByOrderId/${data?._id}`,
        setResponse: setTips,
        setLoading,
      });
    }
  }, [show]);

  const handleSubmit = (amount) => {
    editApi({
      url: `api/v1/admin/addTip/${data?._id}`,
      payload: {
        tip: amount,
      },
      additionalFunctions: [fetchCart],
    });
  };

  const selectTipHandler = (amount) => {
    setTipAmount(amount);
    handleSubmit(amount);
  };

  // -----
  function useShow(id) {
    const { showModal } = useSelector(selectModalById(id));
    return showModal;
  }

  const openModalById = (modalId, data) => {
    dispatch(openModal({ modalId, showModal: true, modalData: data }));
  };
  const handleShow = (modalId, data) => {
    const realData = {
      id: data?.user?._id,
    };
    openModalById(modalId, realData);
  };

  const closeThisOne = (modalId) => {
    closeModalById(modalId);
  };

  const closeModalById = (modalId) => {
    dispatch(closeModal({ modalId }));
  };

  return (
    <>
      <PaymentMethodCanvas
        show={isPaymentCanvas}
        handleClose={() => setIsPaymentCanvas(false)}
        data={data}
        fetchCart={fetchCart}
      />
      <AddCustomeTip
        show={useShow("customTip")}
        handleClose={() => closeThisOne("customTip")}
        setTipAmount={setTipAmount}
        tipAmount={tipAmount}
        handleSubmit={handleSubmit}
      />
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{ width: "100%", height: "100%" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title />
        </Offcanvas.Header>
        <Offcanvas.Body>
          {loading && <FullScreenLoader />}
          <div className="Appointment_Canvas Booked_Detail ">
            <div className="MW-Layout">
              <div className="select_container">
                <div className="tip-canvas">
                  <div className="tip-amount">
                    <p style={{ fontSize: "1.7rem" }}>Select tip</p>
                  </div>

                  <div className="tip-amount">
                    <p>To pay</p>
                    <p> ${data?.mergeTotal} </p>
                  </div>
                  <div className="tag-line">
                    Select an amount for Shahina Hoja
                  </div>

                  <div className="tip-container">
                    <div
                      className={`main ${tipAmount === 0 ? "active" : ""}`}
                      onClick={() => selectTipHandler(0)}
                    >
                      <p className="title"> No Tip </p>
                    </div>
                    {tips?.data?.map(
                      (i, index) =>
                        i?.tip !== 0 && (
                          <div
                            className={`main ${tipAmount === i.tip ? "active" : ""
                              }`}
                            key={index}
                            onClick={() => selectTipHandler(i.tip)}
                          >
                            <p className="title"> {i.perCentage}% </p>
                            {i.tip && <p className="faded">${i.tip} </p>}
                          </div>
                        )
                    )}
                    <div
                      className="main"
                      onClick={() => handleShow("customTip")}
                    >
                      <span className="plus-icon">
                        <FaPlus />
                      </span>
                      <p className="title">Custom tip </p>
                    </div>
                  </div>
                </div>

                <div className="last_button">
                  <div className="elipse_container">
                    <button
                      type="button"
                      style={{ height: "40px" }}
                      onClick={() => setIsPaymentCanvas(true)}
                    >
                      Continue to payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

//add custom tip modal
export const AddCustomeTip = ({
  show,
  handleClose,
  setTipAmount,
  tipAmount,
  handleSubmit,
}) => {
  const [display, setDisplay] = useState("");

  const handleClick = (value) => {
    setDisplay(display + value);
  };

  const handleDelete = () => {
    setDisplay(display.slice(0, -1));
  };
  useEffect(() => {
    if (tipAmount) {
      setDisplay(tipAmount?.toString());
    }
  }, [tipAmount]);

  const saveTip = () => {
    setTipAmount(parseFloat(display));
    handleSubmit(parseFloat(display));
    handleClose();
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Body>
        <div className="MW-Layout">
          <div className="redeem-user-gift-card">
            <div className="above">
              <div className="heading">
                <p>Add a tip</p>
                <span className="icon-action" onClick={() => handleClose()}>
                  <IoClose />
                </span>
              </div>
              <Calculator
                display={display}
                handleClick={handleClick}
                handleDelete={handleDelete}
              />
            </div>

            <div className="below">
              <div className="calculator-btn">
                <p> ${display} </p>
                <button type="button" onClick={saveTip}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

// Add product In cart
export const AddProductModal = ({ show, handleClose, addProduct }) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState({});
  const [selectedSize, setSelectedSizes] = useState({});

  // Add Product In Order
  const submitHandler = async (size, product) => {
    await addProduct(size, product);
    setSelectedSizes({});
    handleClose();
  };

  const handleSizeChange = (selectedOption, productId) => {
    const parsedValue = JSON.parse(selectedOption.value);
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [productId]: parsedValue,
    }));
  };

  const fetchHandler = useCallback(() => {
    getApi({
      url: `api/v1/Product/all/getAllProducts`,
      setResponse: setData,
    });
  }, []);

  useEffect(() => {
    if (show) {
      fetchHandler();
    } else {
      setData({});
    }
  }, [show, fetchHandler]);

  const priceCheker = (i) => {
    if (i?.multipleSize === true) {
      return (
        <>
          <Select
            options={i.sizePrice?.map((i) => ({
              value: `${JSON.stringify(i)}`,
              label: `${i.size} $${i.price}`,
            }))}
            placeholder="Select Size"
            className="mb-3"
            onChange={(selectedOption) =>
              handleSizeChange(selectedOption, i._id)
            }
          />
          {selectedSize[i?._id]?._id && (
            <button
              onClick={() => {
                const selectedSizeId = selectedSize[i?._id];
                submitHandler(selectedSizeId, i);
              }}
            >
              Add to Cart
            </button>
          )}
        </>
      );
    } else {
      return (
        <>
          <p className="price">
            ${i.price} {i.status === "STOCK" ? "- In stock" : "- out of stock"}{" "}
          </p>
          <button
            onClick={() => {
              const selectedSizeId = selectedSize[i?._id];
              submitHandler(selectedSizeId, i);
            }}
          >
            Add to Cart
          </button>
        </>
      );
    }
  };

  const filterProducts =
    data?.data?.length > 0
      ? data?.data?.filter((i) =>
        i?.name?.toLowerCase().includes(search?.toLowerCase())
      )
      : [];

  useEffect(() => {
    if (show) {
      setSearch("");
    }
  }, [show]);

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="Appointment_Canvas">
        <section className="MW-Layout">
          <div className="heading">
            <p>Select Product</p>
          </div>
          <div className="search_input">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="search"
              placeholder="search Product"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="select-product-container">
            {filterProducts?.map((i, index) => (
              <div className="Item" key={`product${index}`}>
                <img src={i?.productImages?.[0]?.image} alt="" />
                <div className="content">
                  <p className="title"> {i.name} </p>
                  {priceCheker(i)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

// select payment canvas
export const PaymentMethodCanvas = ({ show, handleClose, data, fetchCart }) => {
  const [type, setType] = useState("default");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [splitPaymentAmount, setSplitPaymentAmount] = useState(0);
  const [openSplitMod, setOpenSplitMod] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState({});
  const [isGiftCard, setIsGiftCard] = useState(false);
  const [isPoint, setIsPoint] = useState(false);
  const [isBtnActive, setIsBtnActive] = useState(true);
  const dispatch = useDispatch();

  const orderId = data?.orderId;
  let payload = {};
  if (type === "default") {
    payload = {
      paymentMethod: "online",
    };
  } else if (type === "GiftCard") {
    payload = {
      paymentMethod,
    };
  } else if (type === "cash") {
    payload = {
      paymentMethod,
    };
  } else if (type === "card") {
    payload = {
      paymentMethod,
    };
  } else if (type === "SplitPayment") {
    payload = {
      paymentMethod,
      splitPayment: "Yes",
      splitPaymentAmount,
    };
  }

  // customer checout
  const checkoutHandler = () => {
    const navigationHandler = () => {
      window.location.href = "/paid";
    };
    dispatch(
      create_module_redux({
        url: `api/v1/admin/chargeCustomer/${orderId}`,
        payload,
        additionalFunctions: [navigationHandler],
        setLoading,
      })
    );
  };

  const navigationHandler = (res) => {
    window.location.href = res?.session?.url;
  };

  const checkoutManualCard = () => {
    const additionalFunctions = [(res) => navigationHandler(res)];
    postApi({
      url: `api/v1/admin/manualChargeThroughCard/${data?._id}`,
      setLoading,
      additionalFunctions,
    });
  };

  const checkoutDefault = () => {
    const navigationHandler = () => {
      window.location.href = "/paid";
    };
    postApi({
      url: `api/v1/admin/paymentSettle/${data?._id}`,
      setLoading,
      additionalFunctions: [navigationHandler],
    });
  };

  const selectOptions = (paymentMode, value) => {
    setPaymentMethod(paymentMode);
    setType(value);
    setIsBtnActive(true);
    if (value === "GiftCard") {
      setIsGiftCard(true);
      setIsBtnActive(false);
    } else if (value === "SplitPayment") {
      setOpenSplitMod(true);
      setIsBtnActive(false);
    } else if (value === "creditPoint") {
      setIsPoint(true);
      setIsBtnActive(false);
    }
  };

  const items = [
    {
      type: "card",
      paymentMethod: "online",
      title: "Manual card entry",
      icon: <FaCreditCard className="text-[#84B27A] w-[24px] h-[24px]" />,
    },
    {
      type: "cash",
      paymentMethod: "Cash",
      title: "Cash",
      icon: <FaMoneyBill className="text-[#84B27A] w-[24px] h-[24px]" />,
    },
    {
      type: "GiftCard",
      paymentMethod: "online",
      title: "Gift Card",
      icon: <FaGift className="text-[#84B27A] w-[24px] h-[24px]" />,
    },
    {
      type: "SplitPayment",
      paymentMethod: "online",
      title: "Split Payment",
      icon: <FaSlash className="text-[#84B27A] w-[24px] h-[24px]" />,
    },
    {
      type: "creditPoint",
      paymentMethod: "online",
      title: "Credit Points",
      icon: <FaFilePowerpoint className="text-[#84B27A] w-[24px] h-[24px]" />,
    },
  ];

  useEffect(() => {
    getApi({
      url: `api/v1/admin/getUserPaymentMethod/${data?.user?._id}`,
      setResponse: setCards,
    });
  }, [data]);

  function valueReturn({
    text,
    amount,
    amountClassName,
    divClassName,
    isNegative,
  }) {
    if (amount > 0) {
      return (
        <div className={divClassName}>
          <p className={amountClassName}> {text} </p>
          <p className={amountClassName}>
            {" "}
            {isNegative === true && "-"} ${amount}{" "}
          </p>
        </div>
      );
    }
  }

  let checkoutBtn;

  if (data?.mergeTotal === 0) {
    checkoutBtn = (
      <button
        type="button"
        style={{ height: "40px" }}
        onClick={checkoutDefault}
      >
        Pay now
      </button>
    );
  } else if (type === "card") {
    checkoutBtn = (
      <button
        type="button"
        style={{ height: "40px" }}
        onClick={checkoutManualCard}
      >
        Pay now
      </button>
    );
  } else {
    checkoutBtn = (
      <button
        type="button"
        style={{ height: "40px" }}
        onClick={checkoutHandler}
      >
        Pay now
      </button>
    );
  }

  const CouponCard = () => {
    if (data?.coupon?.per === "Service") {
      return (
        <div className={"price-cont"}>
          <p className={"faded"}> {data?.coupon?.title} </p>
          <p className={"faded"}>{data?.coupon?.addOnservicesId?.name}</p>
        </div>
      );
    } else {
      return valueReturn({
        text: `Your Coupon Savings (${data?.coupon?.type})`,
        amount: `${data?.couponDiscount}`,
        amountClassName: "faded",
        divClassName: "price-cont",
        isNegative: true,
      });
    }
  };

  return (
    <>
      <SplitPayment
        show={openSplitMod}
        handleClose={() => setOpenSplitMod(false)}
        data={data}
        fetchCart={fetchCart}
      />
      <CreditDeductionMethod
        show={isPoint}
        handleClose={() => setIsPoint(false)}
        data={data}
        fetchCart={fetchCart}
      />
      <UserGiftCard
        show={isGiftCard}
        handleClose={() => setIsGiftCard(false)}
        data={data}
        fetchCart={fetchCart}
      />
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{ width: "100%", height: "100%" }}
      >
        <Offcanvas.Body>
          {loading && <FullScreenLoader />}
          <div className="Appointment_Canvas Booked_Detail">
            <div className="select_container">
              <div className="tip-canvas">
                <div className="tip-amount">
                  <p style={{ fontSize: "1.7rem" }}>Select payment</p>

                  <span className="icon-action" onClick={() => handleClose()}>
                    <IoClose />
                  </span>
                </div>

                {data?.mergeTotal === 0 ? (
                  ""
                ) : (
                  <React.Fragment>
                    <div className="tip-amount mt-3">
                      <p style={{ fontSize: "16px" }}>
                        {" "}
                        {data?.user?.firstName}'s payment methods
                      </p>
                    </div>

                    <div className="tip-container">
                      <div
                        className={`main ${type === "default" ? "active" : ""}`}
                        onClick={() => selectOptions("online", "default")}
                      >
                        <FaCreditCard className="text-[#807abb] w-[24px] h-[24px]" />
                        <p className="title">
                          {" "}
                          {cards?.cardSaved?.[0]?.card?.brand}{" "}
                          {cards?.cardSaved?.[0]?.card?.last4}{" "}
                        </p>
                        <p className="faded">
                          Expires {cards?.cardSaved?.[0]?.card?.exp_month}/
                          {cards?.cardSaved?.[0]?.card?.exp_year}{" "}
                        </p>
                      </div>
                    </div>

                    <div className="tip-amount mt-3">
                      <p>Payment methods</p>
                    </div>

                    <div className="tip-container">
                      {items.map((i, index) => (
                        <div
                          key={`paymentMethod${index}`}
                          className={`main ${type === i.type ? "active" : ""}`}
                          onClick={() => selectOptions(i.paymentMethod, i.type)}
                        >
                          {i.icon}

                          {i.desc && <p className="title"> {i.desc} </p>}
                          <p className="faded"> {i.title} </p>
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                )}
              </div>

              <div className="last_button p-0 pt-3">
                {valueReturn({
                  text: "Service amount",
                  amount: data?.subTotal,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Product amount",
                  amount: data?.productSubTotal,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Sales tax",
                  amount: data?.salesTax,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Shipping & handling ",
                  amount: data?.shipping,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Tip",
                  amount: data?.tip,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Service savings",
                  amount: data?.memberShip,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                {valueReturn({
                  text: "Offer Discount",
                  amount: data?.offerDiscount,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                {valueReturn({
                  text: "Product savings",
                  amount: data?.productMemberShip,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                {valueReturn({
                  text: "Credit",
                  amount: data?.memberCredit,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}

                <CouponCard />
                {valueReturn({
                  text: "Cash",
                  amount: data?.cash,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}

                <div className={"price-cont mb-3"}>
                  <p className={"total"}>Order total </p>
                  <p className={"total"}> ${data?.mergeTotal} </p>
                </div>
                {!isBtnActive ? (
                  <button className="default-btn">Pay now</button>
                ) : (
                  <div className="elipse_container">{checkoutBtn}</div>
                )}
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

// redeem gift card convas
export const UserGiftCard = ({ show, handleClose, data, fetchCart }) => {
  const [coupons, setCoupons] = useState({ cart: [] });
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (show) {
      getApi({
        url: `api/v1/admin/getAllcoupanByUserId/${data?.user?._id}?code=${query}`,
        setResponse: setCoupons,
        setLoading,
      });
    }
  }, [show, data, query]);

  const payload = {
    couponCode,
  };

  const submitHandler = () => {
    const additionalFunctions = [handleClose, fetchCart];
    postApi({
      url: `api/v1/admin/applyCoupanOnOrder/${data?._id}`,
      payload,
      successMsg: "Success",
      additionalFunctions,
      setLoading,
    });
  };

  const giftCards = coupons?.cart?.filter(
    (i) => i?.isExpired === false && i?.used === false
  );

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="bottom"
        style={{ width: "100%", height: "100%" }}
      >
        <Offcanvas.Body>
          {loading && <FullScreenLoader />}
          <div className="MW-Layout">
            <div className="redeem-user-gift-card">
              <div className="above">
                <div className="heading">
                  <p>Redeem gift card</p>
                  <span className="icon-action" onClick={() => handleClose()}>
                    <IoClose />
                  </span>
                </div>

                <div className="search">
                  <p>Find gift card</p>
                  <div className="main">
                    <IoSearch />
                    <input
                      type={"search"}
                      placeholder="Enter gift card code"
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="coupons">
                  {giftCards?.map((i, index) => (
                    <div
                      className={`item ${i?.code === couponCode ? "active" : ""
                        }`}
                      onClick={() => setCouponCode(i?.code)}
                      key={`coupons${index}`}
                    >
                      <p className="title">
                        {" "}
                        {i?.code}{" "}
                        {i.discount > 0 ? (
                          <span>${i.discount}</span>
                        ) : (
                          <span> ({i?.title}) </span>
                        )}{" "}
                      </p>

                      <p className="description"> {i?.description} </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="below">
                <div className="btn-container">
                  <button onClick={() => handleClose()}>Cancel</button>
                  <button className="filled" onClick={() => submitHandler()}>
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

// Split Payment
export const SplitPayment = ({ show, handleClose, data, fetchCart }) => {
  const [isGiftCard, setIsGiftCard] = useState(false);
  const [isCash, setIsCash] = useState(false);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const remainingAmount = data?.amountToPaid - amount;

  const payload = {
    splitPaymentAmount: amount,
  };

  const navigationHandler = (url) => {
    window.location.href = url;
  };

  // add coupon code in order
  const submitHandler = () => {
    const additionalFunctions = [
      handleClose,
      (res) => navigationHandler(res?.session?.url),
    ];
    postApi({
      url: `api/v1/admin/splitPaymentIntent/${data?._id}`,
      payload,
      additionalFunctions,
      setLoading,
    });
  };

  const smallFont = {
    fontSize: "16px",
    fontWeight: "bold",
  };

  const item = [
    {
      icon: <FaMoneyBill className="text-[#84B27A] w-[24px] h-[24px]" />,
      title: "Cash",
      clickHandler: () => setIsCash(true),
    },
    {
      icon: <FaGift className="text-[#84B27A] w-[24px] h-[24px]" />,
      title: "Gift Card",
      clickHandler: () => setIsGiftCard(true),
    },
  ];

  function valueReturn({
    text,
    amount,
    amountClassName,
    divClassName,
    isNegative,
  }) {
    if (amount > 0) {
      return (
        <div className={divClassName}>
          <p className={amountClassName}> {text} </p>
          <p className={amountClassName}>
            {" "}
            {isNegative === true && "-"} ${amount}{" "}
          </p>
        </div>
      );
    }
  }

  const CouponCard = () => {
    if (data?.coupon?.per === "Service") {
      return (
        <div className={"price-cont"}>
          <p className={"faded"}> {data?.coupon?.title} </p>
          <p className={"faded"}>{data?.coupon?.addOnservicesId?.name}</p>
        </div>
      );
    } else {
      return valueReturn({
        text: `Your Coupon Savings (${data?.coupon?.type})`,
        amount: `${data?.couponDiscount}`,
        amountClassName: "faded",
        divClassName: "price-cont",
        isNegative: true,
      });
    }
  };

  return (
    <>
      <UserGiftCard
        show={isGiftCard}
        handleClose={() => setIsGiftCard(false)}
        data={data}
        fetchCart={fetchCart}
      />
      <AddCashMethod
        show={isCash}
        handleClose={() => setIsCash(false)}
        data={data}
        fetchCart={fetchCart}
      />
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="bottom"
        style={{ width: "100%", height: "100%" }}
      >
        <Offcanvas.Body>
          {loading && <FullScreenLoader />}
          <div className="MW-Layout">
            <div className="redeem-user-gift-card">
              <div className="above">
                <div className="heading">
                  <p>Split Payment</p>

                  <span className="icon-action" onClick={() => handleClose()}>
                    <IoClose />
                  </span>
                </div>

                <div className="heading">
                  <p style={smallFont}>Amount to pay </p>
                  <p style={smallFont}>${roundToTwo(data?.amountToPaid)} </p>
                </div>

                <div className="search">
                  <p>Amount to pay on card</p>
                  <div className="main">
                    <FaDollarSign />
                    <input
                      type="number"
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      min={0}
                      max={data?.amountToPaid}
                    />
                  </div>
                  <p style={{ color: "#726f75" }}>
                    ${roundToTwo(remainingAmount)} left to be paid
                  </p>
                </div>

                <div className="tip-canvas">
                  <div className="tip-amount mt-3">
                    <p>Payment methods</p>
                  </div>
                  <div className="tip-container">
                    {item.map((i, index) => (
                      <div
                        className="main"
                        key={`paymentMethods${index}`}
                        onClick={i.clickHandler}
                      >
                        {i.icon}
                        <p className="faded"> {i.title} </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="below">
                <div className="price-cont border-line"></div>
                {valueReturn({
                  text: "Service amount",
                  amount: data?.subTotal,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Product amount",
                  amount: data?.productSubTotal,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Sales tax",
                  amount: data?.salesTax,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Shipping & handling ",
                  amount: data?.shipping,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}{" "}
                {valueReturn({
                  text: "Tip",
                  amount: data?.tip,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Service savings",
                  amount: data?.memberShip,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                {valueReturn({
                  text: "Offer Discount",
                  amount: data?.offerDiscount,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                {valueReturn({
                  text: "Product savings",
                  amount: data?.productMemberShip,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                {valueReturn({
                  text: "Credit",
                  amount: data?.memberCredit,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                <CouponCard />
                {valueReturn({
                  text: "Cash",
                  amount: data?.cash,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                {valueReturn({
                  text: "Order Total",
                  amount: data?.mergeTotal,
                  amountClassName: "total",
                  divClassName: "price-cont mb-3",
                })}
                <div className="btn-container">
                  <button onClick={() => handleClose()}>Cancel</button>
                  <button className="filled" onClick={() => submitHandler()}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

// add cash payment
export const AddCashMethod = ({ show, handleClose, data, fetchCart }) => {
  const [display, setDisplay] = useState("");
  const [cashCollectedBy, setCashCollectedBy] = useState("Shahina Hoja");
  const [loading, setLoading] = useState(false);

  const handleClick = (value) => {
    setDisplay(display + value);
  };

  const handleDelete = () => {
    setDisplay(display.slice(0, -1));
  };

  const payload = {
    cash: parseFloat(display),
    cashCollectedBy,
  };

  const submitHandler = () => {
    const additionalFunctions = [handleClose, fetchCart];
    postApi({
      url: `api/v1/admin/chargeCustomerThroughCash/${data?._id}`,
      payload,
      setLoading,
      additionalFunctions,
    });
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Body>
        {loading && <FullScreenLoader />}
        <div className="MW-Layout">
          <div className="redeem-user-gift-card">
            <div className="above">
              <div className="heading">
                <p>Add cash amount</p>

                <span className="icon-action" onClick={() => handleClose()}>
                  <IoClose />
                </span>
              </div>
              <Calculator
                display={display}
                handleClick={handleClick}
                handleDelete={handleDelete}
              />
            </div>

            <div className="below">
              <div className="cash-by">
                Cash received by -
                <select
                  value={cashCollectedBy}
                  onChange={(e) => setCashCollectedBy(e.target.value)}
                >
                  <option value=""></option>
                  <option value="Shahina Hoja">Shahina Hoja</option>
                  <option value="Noor R.">Noor R.</option>
                </select>
              </div>
              <div className="calculator-btn">
                <p> ${display} </p>
                <button type="button" onClick={() => submitHandler()}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

//manual credit point deduction
export const CreditDeductionMethod = ({
  show,
  handleClose,
  data,
  fetchCart,
}) => {
  const [display, setDisplay] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = (value) => {
    setDisplay(display + value);
  };

  const handleDelete = () => {
    setDisplay(display.slice(0, -1));
  };

  const payload = {
    memberCredit: parseFloat(display),
  };

  const submitHandler = () => {
    const additionalFunctions = [handleClose, fetchCart];
    postApi({
      url: `api/v1/admin/addMemberCreditToOrder/${data?._id}`,
      payload,
      setLoading,
      additionalFunctions,
    });
  };

  const smallFont = {
    fontSize: "16px",
    fontWeight: "bold",
  };
  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="bottom"
      style={{ width: "100%", height: "100%" }}
    >
      <Offcanvas.Body>
        {loading && <FullScreenLoader />}
        <div className="MW-Layout">
          <div className="redeem-user-gift-card">
            <div className="above">
              <div className="heading">
                <p>Add credit points</p>
                <span className="icon-action" onClick={() => handleClose()}>
                  <IoClose />
                </span>
              </div>

              <div className="heading">
                <p style={smallFont}></p>
                <p style={smallFont}>
                  {" "}
                  Available Credit points : {data?.user?.creditPoint}{" "}
                </p>
              </div>

              <Calculator
                display={display}
                handleClick={handleClick}
                handleDelete={handleDelete}
              />
            </div>

            <div className="below">
              <div className="calculator-btn">
                <p> ${display} </p>
                <button type="button" onClick={() => submitHandler()}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

// Defaul Modal Wrapper
export const DefaultDialog = ({ show, onHide, size, Title, children }) => {
  return (
    <Modal show={show} onHide={onHide} size={size} centered>
      <Modal.Header closeButton>
        <Modal.Title>{Title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

// review mail confirmation
export const ConfirmReview = ({ show, handleClose, loading, handleSubmit }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="delete_confirmation">
        {loading && <FullScreenLoader />}
        <div className="close_btn">
          <i className="fa-solid fa-xmark" onClick={() => handleClose()}></i>
        </div>
        <div className="content">
          <h5>Are you sure? </h5>
        </div>

        <div className="btn_container">
          <button className="cancel" onClick={() => handleClose()}>
            No, Cancel
          </button>
          <button className="delete" onClick={() => handleSubmit()}>
            {loading ? <ClipLoader color="#fff" /> : "Yes"}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

// Send Notification
export const NotificationConfirmation = ({
  show,
  handleClose,
  handleDelete,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="delete_confirmation">
        <div className="close_btn">
          <i className="fa-solid fa-xmark" onClick={() => handleClose()}></i>
        </div>
        <div className="content">
          <h5 style={{ textAlign: "center" }}>
            Are you sure you want to send this notification?
          </h5>
        </div>

        <div className="btn_container">
          <button className="cancel" onClick={() => handleClose()}>
            No, Cancel
          </button>
          <button
            className="delete"
            onClick={() => {
              handleDelete();
              handleClose();
            }}
          >
            Yes
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

// Template Modal
export const TemplatePreviewModalXl = ({ show, handleClose, title, body }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="xl"
    >
      <Modal.Header closeButton>Email Preview</Modal.Header>
      <Modal.Body>
        {/* <h6> {title} </h6> */}
        {title && (
          <h6
            dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, "<br />") }}
          // className="mt-5"
          ></h6>
        )}
        {body && (
          <p
            dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, "<br />") }}
          // className="mt-5"
          ></p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export const TemplatePreviewModalSM = ({ show, handleClose, title, body }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>SMS Preview</Modal.Header>
      <Modal.Body>
        {title && (
          <h6
            dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, "<br />") }}
          // className=""
          ></h6>
        )}
        {body && (
          <p
            dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, "<br />") }}
          // className="mt-5"
          ></p>
        )}
      </Modal.Body>
    </Modal>
  );
};
