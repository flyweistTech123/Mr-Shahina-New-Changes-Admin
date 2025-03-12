/** @format */
import React, { useEffect, useState } from "react";
import { Form, Offcanvas } from "react-bootstrap";
import Slider from "react-slick";
import UserDetailCanvas from "./UserDetailCanvas";
import img from "../../../../Images/credit-card.png";
import {
  AddProductModal,
  CallingModal,
  CheckoutCanvas,
  DetailDialog,
  EditBookedService,
  EditNotes,
  MailModal,
  NoShowPolicy,
  ProfileDetail,
  ServiceCanvas,
} from "./Modals/modal";
import img1 from "../../../../Images/list.png";
import {
  editApi,
  edit_module_redux,
  getApi,
  getAppointment,
  postApi,
} from "../../../../Respo/Api";
import PdfViewer from "./Pdf/PdfViewer";
import {
  closeModal,
  openModal,
  selectModalById,
} from "../../../../Store/Slices/modalSlices";
import {
  EditorDesciption,
  getCorrectTime,
  ViewDescription,
} from "../../../../Helper/Helper";
import { useDispatch, useSelector } from "react-redux";
import { PhoneNumberFormatter } from "../../../../utils/utils";
import { appointmentArr } from "../../../../Helper/Constant";
import { ClipLoader } from "react-spinners";
import { todayDate } from "../../../../Store/Slices/dateSlice";
import FullScreenLoader from "../../../../Component/FullScreenLoader";
import {
  FlexContainer,
  Heading,
  ProductLayout,
  ServiceLayout,
} from "../../../../Component/HelpingComponents";
import { IoClose } from "react-icons/io5";
import { FaEllipsisV, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";

const AppointmentDetails = ({
  show,
  handleClose,
  setIsReschedule,
  isReschedule,
  setIsBooked,
  orderId,
}) => {
  const [type, setType] = useState("Info");
  const [edit, setEdit] = useState(false);
  const [open_notes_modal, set_open_notes_modal] = useState(false);
  const [detail, setDetail] = useState({});
  const [notes, setNotes] = useState("");
  const [notesId, setNotesId] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [createNote, setCreatNote] = useState(false);
  const [edit_service, setEditService] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [openService, setOpenService] = useState(false);
  const [priceId, setPriceId] = useState("");
  const [inFuture, setInFuture] = useState(false);
  const [callDialog, setCallDialog] = useState(false);
  const [mailDialog, setMailDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedAppointmentDate = useSelector(todayDate);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [isProduct, setIsProduct] = useState(false);
  const [noteSug, setNoteSug] = useState("");
  const [cards, setCards] = useState([]);

  const dispatch = useDispatch();

  function closeService() {
    setOpenService(false);
  }

  const { modalData } = useSelector(selectModalById("appointmentDetails"));

  const id = modalData?.id;

  function notesHandler(e) {
    e.preventDefault();
    const payload = {
      suggestion: notes,
    };
    const id = detail?.data?._id;
    editApi({
      url: `api/v1/admin/addSuggestionToServiceOrder/${id}`,
      payload,
      successMsg: "Saved",
      additionalFunctions: [fetchBooking, () => setNotes("")],
      setLoading,
    });
  }

  function editNotes(e) {
    e.preventDefault();
    const payload = {
      suggestion: notes,
    };
    editApi({
      url: `api/v1/admin/editSuggestionfromOrder/${id}/${notesId}`,
      payload,
      successMsg: "Saved",
      additionalFunctions: [fetchBooking, () => setNotes("")],
      setLoading,
    });
  }

  const fetchBooking = () => {
    getApi({
      url: `api/v1/viewserviceOrder/${id}`,
      setResponse: setDetail,
      setLoading,
    });
  };
  useEffect(() => {
    if (detail?.data?.user?._id) {
      getApi({
        url: `api/v1/admin/getUserPaymentMethod/${detail?.data?.user?._id}`,
        setResponse: setCards,
        setLoading,
      });
    }
  }, [detail?.data?.user?._id]);



  function deleteSuggestion(suggesstionId) {
    const id = detail?.data?._id;
    const additionalFunctions = [fetchBooking];
    editApi({
      url: `api/v1/admin/deleteSuggestionfromOrder/${id}/${suggesstionId}`,
      payload: {},
      additionalFunctions,
      setLoading,
    });
  }

  const reminderHandler = () => {
    const id = detail?.data?._id;
    editApi({
      url: `api/v1/admin/sendReminder/${id}`,
      payload: {},
      successMsg: "Confirmation sent",
      setLoading: setReminderLoading,
    });
  };

  const pickUpHandler = () => {
    const additionalFunctions = [fetchBooking];
    editApi({
      url: `api/v1/admin/updatePickupFromStore/${detail?.data?._id}`,
      payload: {},
      additionalFunctions,
    });
  };

  useEffect(() => {
    if (show && detail?.data) {
      const detailToTime = detail?.data?.toTime
        ? new Date(detail?.data?.toTime)
        : null;
      if (detailToTime) {
        const today = new Date();
        const isSameDate =
          today.getDate() === detailToTime.getDate() &&
          today.getMonth() === detailToTime.getMonth() &&
          today.getFullYear() === detailToTime.getFullYear();
        if (isSameDate) {
          setInFuture(true);
        } else if (detailToTime > today) {
          setInFuture(false);
        } else if (detailToTime < today) {
          setInFuture(true);
        }
      } else {
        console.log("detail.toTime is not defined or null.");
      }
    }
  }, [show, detail?.data]);

  useEffect(() => {
    if (show === true) {
      fetchBooking();
    }
  }, [show]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
  };

  // Servic Date
  const start = new Date(modalData?.start);
  const month = start?.toLocaleDateString("en-US", {
    month: "long",
  });
  const year = start?.toLocaleDateString("en-US", {
    year: "numeric",
  });
  const day = start?.toLocaleDateString("en-US", {
    day: "numeric",
  });
  const formattedTime = start.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = day + " " + month?.slice(0, 3) + " " + year;

  const sendEmail = async () => {
    const serviceToPdfPathMap = {
      "painless prp hair loss treatment":
        "PRPHAIRLOSSTREATMENTPREPOSTCAREGUIDE.pdf",
      "pro clinical peel": "ProClinicalPeelForm.pdf",
      "dermamelan peel": "DermamelanPeelPre.pdf",
      "perfect derma peel": "ThePerfectDermaPeel.pdf",
      "acne peel": "Acne Peel.pdf",
      "aquagold microneedling": "AQUAGOLD.pdf",
      "lycine/proline iv": "IV THERAPY.pdf",
      "enlighten md peel": "Enlighten Peel.pdf",
      "enlighten peel": "Enlighten Peel.pdf",
      "glutathione iv": "IV THERAPY.pdf",
      "prp microneedling": "PRPMicroneedlingPre&PostCare.pdf",
      microneedling: "PRPMicroneedlingPre&PostCare.pdf",
      "cosmelan md peel": "PreandPostCosmelanDepigmentationInstructions.pdf",
      "dmk enzyme therapy": "PreparingforDMKEnzymeTherapy.pdf",
      "tca peel": "TCAPeelPre.pdf",
      hydrafacial: "HydraFacialPre.pdf",
      "laser hair removal": "LaserhairremovalPrepCare.pdf",
      "rf body tightening": "RFSkinTighteningPre.pdf",
      "rf face contouring":
        "Face and Body Contouring,Cellulite Reduction Treatment Care.pdf",
      "rf body contouring":
        "Face and Body Contouring,Cellulite Reduction Treatment Care.pdf",
      "cellulite treatment":
        "Face and Body Contouring,Cellulite Reduction Treatment Care.pdf",
      "melasma (hormonal pigment) treatment": [
        "PreandPostCosmelanDepigmentationInstructions.pdf",
        "DermamelanPeelPre.pdf",
      ],
      "jetpeel facial": "JetPeelPreandPost.pdf",
      "laser skin resurfacing": "ErbiumYag2940nmLaserSkinResurfacingPRE.pdf",
      revepeel: "Enlighten Peel.pdf",
      "red carpet facial": ["JetPeelPreandPost.pdf", "RFSkinTighteningPre.pdf"],
      "ipl pigment treatment": "PreandPostTreatmentInstructionsforIPL.pdf",
      FaceandBodyContouringCelluliteReductionTreatmentCare:
        "FaceandBodyContouringCelluliteReductionTreatmentCare.pdf",
      acne: "PreandPostTreatmentInstructionsforIPL.pdf",
      skin: "PreandPostTreatmentInstructionsforIPL.pdf",
      "ipl vascular (rosacea) treatment":
        "PreandPostTreatmentInstructionsforIPL.pdf",
      "rf skin tightening": "PiXel8.pdf",
      "rfskin tightening": "PiXel8.pdf",
      "rf microneedling": "PiXel8.pdf",
      "ipl acne treatment": "PreandPostTreatmentInstructionsforIPL.pdf",
      "ipl skin rejuvanation": "PreandPostTreatmentInstructionsforIPL.pdf",
      "neoskin rejuvenation":
        "Skin Rejuvenation (NeoSkin) Pre and Post Treatment Care.pdf",
      "acne scar revision by aerolase":
        "Scar Revision Pre and Post Treatment Care.pdf",
      "scar revision by aerolase":
        "Scar Revision Pre and Post Treatment Care.pdf",
      "rosacea treatment by aerolase":
        "Rosacea Pre and Post Treatment Care.pdf",
      "neoclear by aerolase":
        "Acne Removal Pre and Post Treatment Care (NeoClear).pdf",
      "pigment reduction by aerolase":
        "Pigmented Lesion Pre and Post Treatment Care.pdf",
      biorepeel: "BioRePeel",
      "salmon sperm dna facial": "Salmon Sperm DNA Facial",
      "premium rejuvenated myer’s special":
        "Premium Rejuvenated Myer’s Special",
      "iv hydration now": "IV Hydration Now",
      "super immunity boost": "Super Immunity Boost",
      "laser body slimming": "Pre and post care for Emerald Laser Body Slimming.pdf",
      "exo-xom hair loss": "Exosomes pre and post care form.pdf",
    };

    if (detail?.data?.services) {
      const newAttachments = [];
      for (const service of detail?.data?.services) {
        const serviceName = service?.serviceId?.name;
        const trimmedServiceName = serviceName.trim().toLowerCase();
        const pdfFileName = serviceToPdfPathMap[trimmedServiceName];
        if (pdfFileName) {
          if (Array.isArray(pdfFileName)) {
            pdfFileName.forEach((i) => {
              newAttachments.push({
                filename: i,
              });
            });
          } else {
            newAttachments.push({
              filename: trimmedServiceName,
            });
          }
        }
      }
      setAttachments((prevAttachments) => [
        ...prevAttachments,
        ...newAttachments,
      ]);
    }
  };

  useEffect(() => {
    if (show && detail?.data?.services) {
      setAttachments([]);
      sendEmail();
    }
  }, [show, detail?.data]);

  function isAvailable(statement, code) {
    if (statement) {
      return code;
    }
  }

  let adjustedStartTime = getCorrectTime(detail?.data?.toTime);
  adjustedStartTime.setHours(adjustedStartTime.getHours());
  const modifiedYear = start.getFullYear();
  const modifiedMonth = (start.getMonth() + 1).toString().padStart(2, "0");
  const modifiedDay = start.getDate().toString().padStart(2, "0");

  function OpenEdit(type, priceId) {
    setServiceType(type);
    setPriceId(priceId);
    setEditService(true);
  }

  function SavedCardDate() {
    const cardDate = detail?.data?.cardDetailSavedDate;
    const originalDate = getCorrectTime(cardDate);
    const month = originalDate?.toLocaleDateString("en-US", {
      month: "long",
    });
    const day = originalDate?.toLocaleDateString("en-US", {
      day: "numeric",
    });
    const year = originalDate?.toLocaleDateString("en-US", {
      year: "numeric",
    });
    const formattedTime = originalDate.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });


    return (
      <span>
        {" "}
        {day + " " + month + ", " + year + " at "}{" "}
        <span style={{ textTransform: "lowercase" }}>{formattedTime}</span>{" "}
      </span>
    );
  }

  function SavedCardDateCard(timestamp) {
    if (!timestamp) return "Invalid Date";

    // Convert timestamp to milliseconds (if needed)
    const date = new Date(timestamp * 1000);

    const month = date.toLocaleDateString("en-US", { month: "long" });
    const day = date.toLocaleDateString("en-US", { day: "numeric" });
    const year = date.toLocaleDateString("en-US", { year: "numeric" });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });

    return ` ${day} ${month}, ${year} at ${formattedTime}`;
  }
  const sendReviewEmail = () => {
    editApi({
      url: `api/v1/admin/sendReviewMail/${detail?.data?._id}`,
      setLoading,
      successMsg: "Success !",
    });
  };

  const renderBirthdayReward = (adjustedStartTime) => {
    const formattedStartTime = adjustedStartTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const adjustedEndTimeAddon = new Date(
      adjustedStartTime.getTime() +
      detail?.data?.coupon?.addOnservicesId?.totalMin * 60000
    );

    const formattedEndTimeAddon = adjustedEndTimeAddon.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );

    adjustedStartTime.setHours(adjustedEndTimeAddon.getHours());
    adjustedStartTime.setMinutes(adjustedEndTimeAddon.getMinutes());
    return (
      <ServiceLayout
        title={detail?.data?.coupon?.addOnservicesId?.name}
        time={`${formattedStartTime} - ${formattedEndTimeAddon}`}
        duration={detail?.data?.coupon?.addOnservicesId?.totalTime}
        price={0}
      />
    );
  };

  let slider;
  if (type === "Info") {
    const SlidingComponent = () => {
      return (
        <>
          {detail?.data?.user === null ? (
            <div className="add_another" style={{ cursor: "default" }}>
              <p>User no longer exist !</p>
            </div>
          ) : (
            <>
              <div
                className="d-flex justify-end m-0 font-bold"
                style={{ fontSize: "12px" }}
              >
                Booked by {detail?.data?.orderCreateBy} through
                <span className="ml-1">{detail?.data?.orderCreateThrough}</span>
              </div>
              {detail?.data?.cashCollectedBy && (
                <div
                  className="d-flex justify-end m-0 font-bold"
                  style={{ fontSize: "12px" }}
                >
                  Cash collected by {detail?.data?.cashCollectedBy}
                </div>
              )}

              <div className="user_select_container">
                <div
                  className="user_select"
                  style={{ justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", gap: "20px" }}>
                    {" "}
                    {isAvailable(
                      detail?.data?.user?.firstName,
                      <div className="img">
                        {" "}
                        {detail?.data?.user?.firstName?.slice(0, 1)}{" "}
                        {/* {detail?.data?.user?.cardDetailSaved === true && (
                          <BsFillCreditCard2FrontFill className="fa-credit-card" />
                        )} */}
                        {
                          (detail?.data?.orderCreateThrough === "Admin" || detail?.data?.user?.orderCreateThrough === "Sub-Admin")
                            ? (detail?.data?.cardDetailSaved && (
                              <BsFillCreditCard2FrontFill className="fa-credit-card" />
                            ))
                            : ((detail?.data?.cardDetailSaved) ? (
                              <BsFillCreditCard2FrontFill className="fa-credit-card" />

                            ) :
                              ""
                            )
                        }
                      </div>
                    )}
                    <div className="content">
                      {isAvailable(
                        detail?.data?.user?.firstName ||
                        detail?.data?.user?.lastName,
                        <p className="heading">
                          {" "}
                          {detail?.data?.user?.firstName +
                            " " +
                            detail?.data?.user?.lastName}{" "}
                        </p>
                      )}

                      {isAvailable(
                        detail?.data?.user?.phone,
                        <p
                          className="faded"
                          onClick={() => setCallDialog(true)}
                        >
                          {PhoneNumberFormatter(detail?.data?.user?.phone)}
                        </p>
                      )}

                      {isAvailable(
                        detail?.data?.user?.email,
                        <p
                          className="faded"
                          onClick={() => setMailDialog(true)}
                        >
                          {detail?.data?.user?.email}{" "}
                        </p>
                      )}

                      {detail?.data?.noShow === true && (
                        <span
                          className="tags"
                          style={{
                            backgroundColor: "rgb(176, 34, 12)",
                            color: "#fff",
                            marginRight: "10px",
                          }}
                        >
                          No-Show
                        </span>
                      )}

                      {detail?.data?.user?.noShow > 0 && (
                        <span
                          className="tags"
                          style={{
                            backgroundColor: "#D82346",
                            color: "#fff",
                            marginRight: "10px",
                            border: "1px solid #D82346",
                          }}
                        >
                          {detail?.data?.user?.noShow} no-show
                        </span>
                      )}

                      <span className="tags">
                        {" "}
                        {detail?.data?.cardDetailSaved === false
                          ? "pending"
                          : "confirmed"}{" "}
                      </span>

                      {detail?.data?.user?.userStatus === "Block" && (
                        <span
                          className="tags ml-1"
                          style={{ background: "#576063", color: "#fff" }}
                        >
                          Blocked
                        </span>
                      )}
                    </div>
                  </div>

                  <FaEllipsisV
                    onClick={() => handleShow("profileDetail", detail?.data)}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <div className="date_container">
                <p> {date} </p>
              </div>

              {detail?.data?.services?.length > 0 && (
                <>
                  <Heading title={"Regular Service"} />
                  <FlexContainer>
                    {detail?.data?.services?.map((i, index) => {
                      const formattedStartTime =
                        adjustedStartTime.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        });

                      const adjustedEndTime = new Date(
                        adjustedStartTime.getTime() + i?.totalMin * 60000
                      );

                      const formattedEndTime =
                        adjustedEndTime.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        });

                      adjustedStartTime.setHours(adjustedEndTime.getHours());
                      adjustedStartTime.setMinutes(
                        adjustedEndTime.getMinutes()
                      );

                      return (
                        <ServiceLayout
                          onClickHandler={() => OpenEdit("Regular", i)}
                          title={i.size ? i.size : i?.serviceId?.name}
                          time={`${formattedStartTime} - ${formattedEndTime}`}
                          duration={i?.totalTime}
                          price={i?.price}
                          key={`regularService${index}`}
                          isPaid={
                            detail?.data?.paymentStatus === "paid"
                              ? true
                              : false
                          }
                        />
                      );
                    })}
                  </FlexContainer>
                </>
              )}

              {detail?.data?.AddOnservicesSchema?.length > 0 && (
                <>
                  <Heading title={"Ad-On Service"} />
                  <FlexContainer>
                    {detail?.data?.AddOnservicesSchema?.map((i, index) => {
                      const formattedStartTime =
                        adjustedStartTime.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        });

                      const adjustedEndTimeAddon = new Date(
                        adjustedStartTime.getTime() + i?.totalMin * 60000
                      );

                      const formattedEndTimeAddon =
                        adjustedEndTimeAddon.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        });

                      adjustedStartTime.setHours(
                        adjustedEndTimeAddon.getHours()
                      );
                      adjustedStartTime.setMinutes(
                        adjustedEndTimeAddon.getMinutes()
                      );

                      return (
                        <ServiceLayout
                          key={`addOnservicesId${index}`}
                          onClickHandler={() => OpenEdit("AdOn", i)}
                          title={i.addOnservicesId?.name}
                          time={`${formattedStartTime} - ${formattedEndTimeAddon}`}
                          duration={i?.totalTime}
                          price={i?.price}
                          isPaid={
                            detail?.data?.paymentStatus === "paid"
                              ? true
                              : false
                          }
                        />
                      );
                    })}
                  </FlexContainer>
                </>
              )}

              {detail?.data?.coupon?.per === "Service" && (
                <>
                  <Heading title={detail?.data?.coupon?.title} />
                  <FlexContainer>
                    {renderBirthdayReward(adjustedStartTime)}
                  </FlexContainer>
                </>
              )}

              {detail?.data?.paymentStatus === "paid" && (
                <FlexContainer className={"select-product-container"}>
                  {detail?.data?.productOrderId?.products?.map(
                    (item, index) => (
                      <ProductLayout
                        key={`Orderedproducts${index}`}
                        title={item?.productId?.name}
                        size={item?.size}
                        img={item?.productId?.productImages?.[0]?.image}
                        price={item?.subTotal}
                        quantity={item?.quantity}
                        isOrdered={true}
                      />
                    )
                  )}
                </FlexContainer>
              )}

              {detail?.data?.products?.length > 0 && (
                <FlexContainer className={"select-product-container"}>
                  {detail?.data?.products?.map((item, index) => (
                    <ProductLayout
                      key={`product${index}`}
                      title={item?.productId?.name}
                      size={item?.size}
                      img={item?.productId?.productImages?.[0]?.image}
                      price={item?.subTotal}
                      id={item?.productId?._id}
                      orderId={detail?.data?._id}
                      isBtn={true}
                      setLoading={setLoading}
                      fetchHandler={fetchBooking}
                      priceId={item?.priceId}
                      data={item}
                      isOrdered={false}
                      quantity={item?.quantity}
                      sizePrice={item?.sizePrice}
                    />
                  ))}
                </FlexContainer>
              )}

              {detail?.data?.products?.length > 0 && (
                <div className="pick-up-store">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Pickup from store"
                    checked={detail?.data?.pickupFromStore}
                    onChange={pickUpHandler}
                  />
                </div>
              )}

              {detail?.data?.paymentStatus !== "paid" && (
                <React.Fragment>
                  <div
                    className="add_another"
                    onClick={() => setOpenService(true)}
                  >
                    <p>Add another service</p>
                    <button className="icon-div" type="buton">
                      <FaPlus />
                    </button>
                  </div>

                  <div
                    className="add_another"
                    onClick={() => setIsProduct(true)}
                  >
                    <p>Add product to cart</p>
                    <button className="icon-div" type="buton">
                      <FaPlus />
                    </button>
                  </div>
                </React.Fragment>
              )}

              {detail?.data?.cardDetailSaved === true && (
                <>
                  <p
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      marginTop: "20px",
                    }}
                  >
                    Payment policy
                  </p>
                  <div
                    className="appointment_confirmed mt-3 cursor-pointer"
                    onClick={() => setShowPolicy(true)}
                  >
                    <p className="title">Appointment Confirmed</p>
                    <p className="cmt">
                      Confirmed by{" "}
                      {detail?.data?.user?.firstName +
                        " " +
                        detail?.data?.user?.lastName +
                        " "}
                      on {SavedCardDate()}
                    </p>
                  </div>{" "}
                </>
              )}

              <button
                className="send-review-email"
                onClick={() => sendReviewEmail()}
              >
                Send Review Email
              </button>
            </>
          )}
        </>
      );
    };
    slider = <SlidingComponent />;
  } else if (type === "Notes") {
    slider = (
      <>
        <div className="info_tab">
          {detail?.data?.user?.showOnAllBooking === true && (
            <div className="define_notes p-0">
              <ViewDescription description={detail?.data?.user?.bio} />
            </div>
          )}
          {detail?.data?.suggesstion?.map((i, index) => (
            <div className="define_notes p-0" key={`notes${index}`}>
              <ViewDescription description={i.suggesstion} />
              <span className="d-flex gap-4">
                <span
                  className="icon-action"
                  onClick={() => deleteSuggestion(i._id)}
                >
                  <FaRegTrashAlt className="text-[#BF3131]" />
                </span>

                <span
                  className="icon-action"
                  onClick={() => {
                    setNotesId(i._id);
                    set_open_notes_modal(true);
                    setNoteSug(i.suggesstion);
                  }}
                >
                  <FaEllipsisV />
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="define_notes">
          {(detail?.data?.suggesstion?.length === 0 || createNote === true) && (
            <form onSubmit={notesHandler} className="w-100">
              <EditorDesciption setDescription={setNotes} description={notes} />
              <button type="submit">Create</button>
            </form>
          )}
          {edit === true && detail?.data?.suggesstion?.length !== 0 && (
            <form onSubmit={editNotes} className="w-100">
              <EditorDesciption setDescription={setNotes} description={notes} />
              <button type="submit">Update</button>
            </form>
          )}{" "}
        </div>
      </>
    );
  } else if (type === "Payments") {
    // const SlidingComponent = () => {
    //   return detail?.data?.cardDetailSaved ? (
    //     <div className="card_saved">
    //       <div className="img_container">
    //         <img
    //           src={
    //             "https://img.freepik.com/free-photo/blue-credit-card-front-back-isolated_125540-651.jpg?w=1380&t=st=1706947333~exp=1706947933~hmac=49d00cd694ee8debee849bbf346270274214894c2fa3070a9bc68d57343fb980"
    //           }
    //           alt=""
    //         />
    //         <div>
    //           <p className="title">Confirmed with card</p>
    //           <p className="faded"> {SavedCardDate()} </p>
    //         </div>
    //       </div>

    //       <div className="main">
    //         <p className="title">Cancellation policy</p>
    //         <p className="desc">
    //           {" "}
    //           {isAvailable(
    //             detail?.data?.user?.firstName || detail?.data?.user?.lastName,
    //             detail?.data?.user?.firstName +
    //             " " +
    //             detail?.data?.user?.lastName
    //           )}{" "}
    //           agreed to your confirmation policy on {SavedCardDate()}
    //         </p>
    //         <p className="desc mt-3">
    //           You may charge them <strong>50% fee</strong> for late
    //           cancellations within <strong>48 hours</strong> of the appointment
    //           time , or <strong>100% fee</strong> for not showing up.{" "}
    //         </p>
    //       </div>
    //     </div>
    //   ) : detail?.data?.sendConfirmationAppointmentWithCard === false ? (
    //     <div className="awaited_payment">
    //       <img src={img} alt="" />
    //       <p className="head">Confirmation not requested</p>
    //       <p className="faded">
    //         {isAvailable(
    //           detail?.data?.user?.firstName || detail?.data?.user?.lastName,
    //           detail?.data?.user?.firstName + " " + detail?.data?.user?.lastName
    //         )}{" "}
    //         was not requested to confirm with card when the appointment was
    //         created.
    //       </p>

    //       <button onClick={reminderHandler}>
    //         {reminderLoading ? <ClipLoader /> : "Ask client to confirm"}
    //       </button>
    //     </div>
    //   ) : (
    //     <div className="awaited_payment">
    //       <img src={img} alt="" />
    //       <p className="head">Awaiting confirmation</p>

    //       <p className="faded">
    //         {isAvailable(
    //           detail?.data?.user?.firstName || detail?.data?.user?.lastName,
    //           detail?.data?.user?.firstName + " " + detail?.data?.user?.lastName
    //         )}{" "}
    //         recieved a notification to confirm this appointment with a card
    //       </p>
    //       <button onClick={reminderHandler}>
    //         {reminderLoading ? <ClipLoader /> : "Send reminder"}
    //       </button>
    //     </div>
    //   );
    // };
    const SlidingComponent = () => {


      if (detail?.data?.orderCreateThrough === 'Admin' || detail?.data?.orderCreateThrough === 'Sub-Admin') {
        if (detail?.data?.cardDetailSaved) {
          return (
            <div className="card_saved">
              <div className="img_container">
                <img
                  src="https://img.freepik.com/free-photo/blue-credit-card-front-back-isolated_125540-651.jpg?w=1380&t=st=1706947333~exp=1706947933~hmac=49d00cd694ee8debee849bbf346270274214894c2fa3070a9bc68d57343fb980"
                  alt=""
                />
                <div>
                  <p className="title">Confirmed with card</p>
                  <p className="faded">{SavedCardDate(detail?.data?.cardDetailSavedDate)}</p>
                </div>
              </div>

              <div className="main">
                <p className="title">Cancellation policy</p>
                <p className="desc">
                  {isAvailable(
                    detail?.data?.user?.firstName || detail?.data?.user?.lastName,
                    detail?.data?.user?.firstName + " " + detail?.data?.user?.lastName
                  )}{" "}
                  agreed to your confirmation policy on {SavedCardDate(detail?.data?.cardDetailSavedDate)}.
                </p>
                <p className="desc mt-3">
                  You may charge them <strong>50% fee</strong> for late cancellations within <strong>48 hours</strong> of the appointment time, or <strong>100% fee</strong> for not showing up.
                </p>
              </div>
            </div>
          );
        }
        else if (detail?.data?.sendConfirmationAppointmentWithCard) {
          return (
            <div className="awaited_payment">
              <img src={img} alt="" />
              <p className="head">Awaiting confirmation</p>
              <p className="faded">
                {isAvailable(
                  detail?.data?.user?.firstName || detail?.data?.user?.lastName,
                  detail?.data?.user?.firstName + " " + detail?.data?.user?.lastName
                )}{" "}
                received a notification to confirm this appointment with a card.
              </p>
              <button onClick={reminderHandler}>
                {reminderLoading ? <ClipLoader /> : "Send reminder"}
              </button>
            </div>
          );
        }
        else {
          return (
            <div className="awaited_payment">
              <img src={img} alt="" />
              <p className="head">Confirmation not requested</p>
              <p className="faded">
                {isAvailable(
                  detail?.data?.user?.firstName || detail?.data?.user?.lastName,
                  detail?.data?.user?.firstName + " " + detail?.data?.user?.lastName
                )}{" "}
                was not requested to confirm with card when the appointment was created.
              </p>
              <button onClick={reminderHandler}>
                {reminderLoading ? <ClipLoader /> : "Ask client to confirm"}
              </button>
            </div>
          );
        }
      }

      else if (detail?.data?.cardDetailSaved) {
        return (
          <div className="card_saved">
            <div className="img_container">
              <img
                src="https://img.freepik.com/free-photo/blue-credit-card-front-back-isolated_125540-651.jpg?w=1380&t=st=1706947333~exp=1706947933~hmac=49d00cd694ee8debee849bbf346270274214894c2fa3070a9bc68d57343fb980"
                alt=""
              />
              <div>
                <p className="title">Confirmed with card</p>
                <p className="faded">{SavedCardDate(detail?.data?.cardDetailSavedDate)}</p>
              </div>
            </div>

            <div className="main">
              <p className="title">Cancellation policy</p>
              <p className="desc">
                {isAvailable(
                  detail?.data?.user?.firstName || detail?.data?.user?.lastName,
                  detail?.data?.user?.firstName + " " + detail?.data?.user?.lastName
                )}{" "}
                agreed to your confirmation policy on {SavedCardDate(detail?.data?.cardDetailSavedDate)}.
              </p>
              <p className="desc mt-3">
                You may charge them <strong>50% fee</strong> for late cancellations within <strong>48 hours</strong> of the appointment time, or <strong>100% fee</strong> for not showing up.
              </p>
            </div>
          </div>
        );
      }

      else if (cards?.cardSaved?.length > 0) {
        return (
          <div className="card_saved">
            <div className="img_container">
              <img
                src="https://img.freepik.com/free-photo/blue-credit-card-front-back-isolated_125540-651.jpg?w=1380&t=st=1706947333~exp=1706947933~hmac=49d00cd694ee8debee849bbf346270274214894c2fa3070a9bc68d57343fb980"
                alt=""
              />
              <div>
                <p className="title">Confirmed with card</p>
                <p className="faded">{SavedCardDateCard(cards?.cardSaved?.[0]?.created)}</p>
              </div>
            </div>

            <div className="main">
              <p className="title">Cancellation policy</p>
              <p className="desc">
                {isAvailable(
                  detail?.data?.user?.firstName || detail?.data?.user?.lastName,
                  detail?.data?.user?.firstName + " " + detail?.data?.user?.lastName
                )}{" "}
                agreed to your confirmation policy on {SavedCardDateCard(cards?.cardSaved?.[0]?.created)}.
              </p>
              <p className="desc mt-3">
                You may charge them <strong>50% fee</strong> for late cancellations within <strong>48 hours</strong> of the appointment time, or <strong>100% fee</strong> for not showing up.
              </p>
            </div>
          </div>
        );
      }

      else {
        return (
          <div className="awaited_payment">
            <img src={img} alt="" />
            <p className="head">Confirmation not requested</p>
            <p className="faded">
              {isAvailable(
                detail?.data?.user?.firstName || detail?.data?.user?.lastName,
                detail?.data?.user?.firstName + " " + detail?.data?.user?.lastName
              )}{" "}
              was not requested to confirm with card when the appointment was created.
            </p>
            <button onClick={reminderHandler}>
              {reminderLoading ? <ClipLoader /> : "Ask client to confirm"}
            </button>
          </div>
        );
      }
    };

    slider = <SlidingComponent />;
  } else if (type === "Forms") {
    const SlidingComponent = () => {
      return (
        <div className="awaited_payment mt-3">
          {attachments?.length > 0 ? (
            <PdfViewer data={attachments} />
          ) : (
            <>
              <img src={img1} alt="" />
              <p className="head mt-2">No forms</p>
              <p className="faded mt-0">
                Forms will appear here once appointment has been saved
              </p>
            </>
          )}
        </div>
      );
    };
    slider = <SlidingComponent />;
  }

  const selector = () => {
    orderId(id);
    setIsReschedule(!isReschedule);
    closeThisOne("detailDialog");
    handleClose();
  };

  useEffect(() => {
    if (show) {
      setType("Info");
    }
  }, [show]);

  const ContainerStyle = modalData?.isShow
    ? { backgroundColor: "rgb(176, 34, 12)" }
    : {};

  const Title = modalData?.isShow === true ? "No-Show" : "Booked";

  // Modal
  function useShow(id) {
    const { showModal } = useSelector(selectModalById(id));
    return showModal;
  }

  const openModalById = (modalId, data) => {
    dispatch(openModal({ modalId, showModal: true, modalData: data }));
  };

  const closeModalById = (modalId) => {
    dispatch(closeModal({ modalId }));
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

  const serviceHandler = async (type, i, priceId) => {
    const date = `${modifiedYear}-${modifiedMonth}-${modifiedDay}`;
    if (type === "service") {
      let payload;
      if (i.multipleSize === true) {
        payload = {
          quantity: 1,
          serviceId: i._id,
          date,
          time: formattedTime,
          priceId,
        };
      } else {
        payload = {
          quantity: 1,
          serviceId: i._id,
          date,
          time: formattedTime,
        };
      }
      const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
      const additionalFunctions = [fetchBooking];
      dispatch(
        edit_module_redux({
          url: `api/v1/addServiceIOrders/${detail?.data._id}`,
          payload,
          dispatchFunc,
          additionalFunctions,
        })
      );
    } else {
      const payload = {
        quantity: 1,
        addOnservicesId: i._id,
        date,
        time: formattedTime,
      };
      const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
      const additionalFunctions = [fetchBooking];
      dispatch(
        edit_module_redux({
          url: `api/v1/addOnservicesInOrders/${detail?.data._id}`,
          payload,
          dispatchFunc,
          additionalFunctions,
        })
      );
    }
  };

  const addProductInOrder = (size, product) => {
    const productId = product?._id;
    const priceId = size?._id;
    const priceSize = size?.size;
    const sizePrice = size?.price;
    const quantity = 1;
    const orderId = detail?.data?._id;
    let payload;

    if (product?.multipleSize) {
      payload = {
        priceId,
        size: priceSize,
        sizePrice,
        quantity,
        orderId,
      };
    } else {
      payload = {
        quantity,
        orderId,
      };
    }
    const dispatchFunc = [() => getAppointment(selectedAppointmentDate)];
    const additionalFunctions = [fetchBooking];
    postApi({
      url: `api/v1/admin/addProductToCart/${productId}`,
      payload,
      additionalFunctions,
      dispatchFunc,
      setLoading,
    });
  };

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
            {isNegative === true && "-"}${amount}{" "}
          </p>
        </div>
      );
    }
  }

  const CouponCard = () => {
    if (detail?.data?.coupon?.per === "Service") {
      return (
        <div className={"price-cont"}>
          <p className={"faded"}> {detail?.data?.coupon?.title} </p>
          <p className={"faded"}>
            {detail?.data?.coupon?.addOnservicesId?.name}
          </p>
        </div>
      );
    } else {
      return valueReturn({
        text: `Your Coupon Savings (${detail?.data?.coupon?.type})`,
        amount: `${detail?.data?.couponDiscount}`,
        amountClassName: "faded",
        divClassName: "price-cont",
        isNegative: true,
      });
    }
  };

  return (
    <>
      <NoShowPolicy
        show={showPolicy}
        handleClose={() => setShowPolicy(false)}
        time={SavedCardDate()}
        userName={
          detail?.data?.user?.firstName + " " + detail?.data?.user?.lastName
        }
      />
      <CallingModal
        show={callDialog}
        handleClose={() => setCallDialog(false)}
        phone={detail?.data?.user?.phone}
      />
      <MailModal
        show={mailDialog}
        handleClose={() => setMailDialog(false)}
        email={detail?.data?.user?.email}
      />
      {/* Edit Service which are already booked  */}
      <EditBookedService
        show={edit_service}
        setShow={setEditService}
        orderId={detail?.data?._id}
        fetchCart={fetchBooking}
        type={serviceType}
        priceId={priceId}
        setPriceId={setPriceId}
        time={formattedTime}
        date={`${modifiedYear}-${modifiedMonth}-${modifiedDay}`}
      />

      {/* Add New Service */}
      <ServiceCanvas
        show={openService}
        handleClose={closeService}
        serviceHandler={serviceHandler}
        userDetail={detail?.data?.user}
      />

      {/* To open options in checkout ellipse */}
      <DetailDialog
        show={useShow("detailDialog")}
        handleClose={() => closeThisOne("detailDialog")}
        selector={selector}
        type={setType}
        activate={inFuture}
      />

      <UserDetailCanvas
        setIsBooked={setIsBooked}
        Details={detail?.data}
        show={useShow("userDetailCanvas")}
        handleClose={() => closeThisOne("userDetailCanvas")}
        fetchBooking={fetchBooking}
      />

      <EditNotes
        show={open_notes_modal}
        setShow={set_open_notes_modal}
        setEdit={setEdit}
        createNote={setCreatNote}
        setNotes={setNotes}
        notes={noteSug}
      />
      <ProfileDetail
        data={detail?.data}
        show={useShow("profileDetail")}
        handleClose={() => closeThisOne("profileDetail")}
      />
      <CheckoutCanvas
        show={useShow("checkoutCanvas")}
        handleClose={() => closeThisOne("checkoutCanvas")}
        data={detail?.data}
        fetchCart={fetchBooking}
      />
      <AddProductModal
        show={isProduct}
        handleClose={() => setIsProduct(false)}
        addProduct={addProductInOrder}
      />

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        style={{ width: "100%" }}
      >
        <Offcanvas.Body style={{ padding: "0" }}>
          {loading && <FullScreenLoader />}
          <div className="appointment_detail_header" style={ContainerStyle}>
            <div className="upper">
              <IoClose
                onClick={() => handleClose()}
                style={{ width: "20px", height: "20px" }}
                className="cursor-pointer"
              />
            </div>
            <p> {Title} </p>
          </div>

          <div className="Appointment_Canvas Booked_Detail">
            <div className="select_container">
              <div>
                <div className="selector">
                  <Slider {...settings}>
                    {appointmentArr.map((i, index) => (
                      <div>
                        <p
                          onClick={() => setType(i)}
                          className={i === type ? "active" : ""}
                          key={`AppointmentInfo${index}`}
                        >
                          {" "}
                          {i}{" "}
                        </p>
                      </div>
                    ))}
                  </Slider>
                </div>
                {slider}
              </div>

              <div className="last_button mt-3">
                {valueReturn({
                  text: "Service amount",
                  amount: detail?.data?.subTotal,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Product amount",
                  amount: detail?.data?.productSubTotal,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Sales tax",
                  amount: detail?.data?.salesTax,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}

                {valueReturn({
                  text: "Shipping & handling ",
                  amount: detail?.data?.shipping,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Tip",
                  amount: detail?.data?.tip,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                })}
                {valueReturn({
                  text: "Service savings",
                  amount: detail?.data?.memberShip,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                {valueReturn({
                  text: "Offer Discount",
                  amount: detail?.data?.offerDiscount,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}

                {valueReturn({
                  text: "Product savings",
                  amount: `${detail?.data?.productMemberShip}`,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                {valueReturn({
                  text: "Credit",
                  amount: `${detail?.data?.memberCredit}`,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}
                <CouponCard />
                {valueReturn({
                  text: "Cash",
                  amount: `${detail?.data?.cash}`,
                  amountClassName: "faded",
                  divClassName: "price-cont",
                  isNegative: true,
                })}

                <div className={"price-cont mb-3"}>
                  <p className={"total"}>Order total</p>
                  <p className={"total"}>
                    ${detail?.data?.mergeTotal} ({detail?.data?.timeInMin}){" "}
                  </p>
                </div>

                {detail?.data?.paymentStatus === "paid" ? (
                  <div className="elipse_container">
                    <button style={{ padding: "10px", cursor: "auto" }}>
                      Already Paid
                    </button>
                  </div>
                ) : (
                  <div className="elipse_container">
                    <span
                      onClick={() => handleShow("detailDialog")}
                      className="icon-action"
                    >
                      <FaEllipsisV />
                    </span>
                    <button
                      type="button"
                      onClick={() => handleShow("checkoutCanvas")}
                    >
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AppointmentDetails;
