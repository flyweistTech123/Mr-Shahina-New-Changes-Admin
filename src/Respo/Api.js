/** @format */

import axios from "axios";
import { Store } from "react-notifications-component";
import { getDates, setDateForAppointment } from "../Store/Slices/dateSlice";

const Baseurl = process.env.React_App_Baseurl;
const duration = 3000;

const errorMessage = "Something went wrong !";

export const showMsg = (title, message, type) => {
  Store.addNotification({
    title,
    message,
    type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 2000,
      onScreen: true,
    },
  });
};

export const getBookingDetail = async (id, setResponse) => {
  try {
    const res = await axios.get(`${Baseurl}api/v1/viewserviceOrder/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
      },
    });
    const data = res.data.data;
    setResponse(data);
  } catch {}
};

export const deleteService = async (serviceId, userId, fetchCart, payload) => {
  try {
    const res = await axios.delete(
      `${Baseurl}api/admin/cart/delete/services/${serviceId}/${userId}`,
      {
        data: payload, // Correct placement for the payload
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
        },
      }
    );
    if (res.status === 200) {
      fetchCart();
    }
  } catch {
    fetchCart();
  }
};

export const uploadUser = async (payload) => {
  try {
    const res = await axios.post(
      `${Baseurl}api/v1/admin/uploadClient`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
        },
      }
    );
    Store.addNotification({
      title: "Uploaded",
      message: "",
      type: "info",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: duration,
        onScreen: true,
      },
    });
  } catch {}
};

export const unblock_slot = async (payload, fetchHandler, handleClose) => {
  try {
    const res = await axios.put(
      `${Baseurl}api/v1/admin/Slot/slotUnBlocked`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
        },
      }
    );
    if (res.status === 200) {
      await fetchHandler();
      handleClose();
      showMsg("Success !", "Unblocked", "Success");
    }
  } catch {}
};

export const getSlots = async (fromDate, toDate, page, limit, setResponse) => {
  try {
    const res = await axios.get(
      `${Baseurl}api/v1/admin/Slot/getSlotForAdmin?fromDate=${fromDate}&toDate=${toDate}&page${page}=&limit=${limit}`
    );
    const data = res.data.data;
    setResponse(data);
  } catch {}
};

export const getCart = async (userId, setResponse) => {
  try {
    const res = await axios.get(`${Baseurl}api/v1/admin/getCart/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
      },
    });
    const data = res.data.cart;
    setResponse(data);
  } catch {}
};

export const getRecentService = async (userId, setResponse) => {
  try {
    const res = await axios.get(
      `${Baseurl}api/v1/admin/getServiceOrdersByuserId/${userId}`
    );
    const data = res.data.data;
    setResponse(data);
  } catch {}
};

export const fetchServices = async (setResponse) => {
  try {
    const res = await axios.get(`${Baseurl}api/v1/Service/all/getAllServices`);
    const data = res.data.data?.reverse();
    setResponse(data);
  } catch {}
};

export const getOrders = async (setResponse, status, userId) => {
  const head = status ? `?serviceStatus=${status}` : "";
  try {
    const res = await axios.get(
      `${Baseurl}api/v1/admin/getServiceOrdersByuserId/${userId}${head}`
    );
    const data = res.data.data;
    setResponse(data);
  } catch {
    setResponse([]);
  }
};

export const getAppointment = (convertedDate) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(
        `${Baseurl}api/v1/admin/getServiceOrderswithByDateforAdmin/${convertedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
          },
        }
      );
      const data = res.data.data;
      dispatch(getDates(data));
      dispatch(setDateForAppointment(convertedDate));
    } catch {}
  };
};

// Paginated Services
export const getPaginatedServices = async (searchTerm, page, setResponse) => {
  try {
    const res = await axios.get(
      `${Baseurl}api/v1/Service/all/paginateServiceSearch?search=${searchTerm}&page=${page}`
    );
    const data = res.data.data?.docs;
    setResponse(data);
  } catch {}
};

// Get AddON Service
export const getAdOnService = async (setResponse) => {
  try {
    const res = await axios.get(
      `${Baseurl}api/v1/admin/AddOnServices/allAddOnServices`
    );
    const data = res.data.data;
    setResponse(data);
  } catch {}
};

export const deleteSuggestionOrder = async (id, suggesstionId, fetchCart) => {
  try {
    const res = await axios.put(
      `${Baseurl}api/v1/admin/deleteSuggestionfromOrder/${id}/${suggesstionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
        },
      }
    );
    if (res.status === 200) {
      fetchCart();
    }
  } catch {}
};

// Sub Admin

export const getAllSubAdmin = async (setResponse) => {
  try {
    const res = await axios.get(`${Baseurl}api/v1/admin/getAllSubAdmin`);
    const status = res.status;
    const data = res.data.data;
    if (status === 200) {
      setResponse(data);
    }
  } catch {}
};

export const editSubadmin = async (id, payload, fetchHandler, hide) => {
  try {
    const res = await axios.put(
      `${Baseurl}api/v1/admin/updateSubAdminProfile/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
        },
      }
    );
    const status = res.status;
    if (status === 200) {
      await fetchHandler();
      await hide();
      showMsg("Updated ", "", "info");
    }
  } catch {}
};

export const createSubadmin = async (payload, fetchHandler, hide) => {
  try {
    const res = await axios.post(
      `${Baseurl}api/v1/admin/addSubAdmin`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
        },
      }
    );

    const status = res.status;
    if (status === 200) {
      await fetchHandler();
      await hide();
      showMsg("Created ", "", "info");
    }
  } catch {}
};

export const send_reminder_in_cart = async (id, fetchCart) => {
  try {
    const res = await axios.put(
      `${Baseurl}api/v1/admin/sendConfirmationAppointmentWithCard/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
        },
      }
    );
    if (res.status === 200) {
      fetchCart();
    }
  } catch {}
};

// Api Modules
export const getApi = async ({
  url,
  setResponse,
  setLoading,
  additionalFunctions = [],
}) => {
  if (setLoading) {
    setLoading(true);
  }
  try {
    const res = await axios.get(`${Baseurl}${url}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
      },
    });
    setResponse(res.data);
    additionalFunctions.forEach((func) => {
      if (typeof func === "function") {
        func();
      }
    });
  } catch (e) {
    console.log(e);
    setResponse({})
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};

export const editApi = async ({
  url,
  payload,
  setLoading,
  additionalFunctions = [],
  successMsg,
  errorMsg,
}) => {
  if (setLoading) {
    setLoading(true);
  }
  try {
    const res = await axios.put(`${Baseurl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
      },
    });
    if (res) {
      if (successMsg) {
        showMsg("", successMsg, "success");
      }
      additionalFunctions.forEach((func) => {
        if (typeof func === "function") {
          func(res?.data);
        }
      });
    }
  } catch (e) {
    const msg = e?.response?.data?.message || errorMessage;
    if (errorMsg && e?.response?.data?.message === undefined) {
      showMsg("", errorMsg, "danger");
    } else {
      showMsg("", msg, "danger");
    }
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};

export const postApi = async ({
  url,
  payload,
  setLoading,
  additionalFunctions = [],
  successMsg,
  errorMsg,
}) => {
  if (setLoading) {
    setLoading(true);
  }
  try {
    const res = await axios.post(`${Baseurl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
      },
    });
    if (res) {
      if (successMsg) {
        showMsg("", successMsg, "success");
      }
      additionalFunctions.forEach((func) => {
        if (typeof func === "function") {
          func(res?.data);
        }
      });
    }
  } catch (e) {
    const msg =
      e?.response?.data?.msg || e?.response?.data?.message || errorMessage;
    if (errorMsg && e?.response?.data?.message === undefined) {
      showMsg("", errorMsg, "danger");
    } else {
      showMsg("", msg, "danger");
    }
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};

export const deleteApi = async ({
  url,
  setLoading,
  successMsg,
  additionalFunctions = [],
}) => {
  if (setLoading) {
    setLoading(true);
  }
  try {
    const res = await axios.delete(`${Baseurl}${url}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
      },
    });
    if (res) {
      if (successMsg) {
        showMsg("", successMsg, "success");
      }
      additionalFunctions.forEach((func) => {
        if (typeof func === "function") {
          func();
        }
      });
    }
  } catch (e) {
    const msg = e?.response?.data?.message || errorMessage;
    showMsg("", msg, "danger");
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};

// Module with dispatch
export const edit_module_redux = ({
  url,
  payload,
  setLoading,
  additionalFunctions = [],
  successMsg,
  errorMsg,
  dispatchFunc = [],
}) => {
  return async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }
    try {
      const res = await axios.put(`${Baseurl}${url}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
        },
      });
      if (res) {
        if (successMsg || res.data.msg) {
          showMsg("", successMsg || res.data.msg, "success");
        }
        dispatchFunc.forEach((func) => {
          if (typeof func === "function") {
            dispatch(func());
          }
        });
        additionalFunctions.forEach((func) => {
          if (typeof func === "function") {
            func();
          }
        });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || errorMessage;
      if (errorMsg && e?.response?.data?.message === undefined) {
        showMsg("", errorMsg, "danger");
      } else {
        showMsg("", msg, "danger");
      }
    } finally {
      if (setLoading) {
        setLoading(false);
      }
    }
  };
};

export const create_module_redux = ({
  url,
  payload,
  setLoading,
  additionalFunctions = [],
  successMsg,
  errorMsg,
  dispatchFunc = [],
}) => {
  return async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }
    try {
      const res = await axios.post(`${Baseurl}${url}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
        },
      });
      if (res) {
        if (successMsg) {
          showMsg("", successMsg, "success");
        }
        dispatchFunc.forEach((func) => {
          if (typeof func === "function") {
            dispatch(func());
          }
        });
        additionalFunctions.forEach((func) => {
          if (typeof func === "function") {
            func();
          }
        });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || errorMessage;
      if (errorMsg && e?.response?.data?.message === undefined) {
        showMsg("", errorMsg, "danger");
      } else {
        showMsg("", msg, "danger");
      }
    } finally {
      if (setLoading) {
        setLoading(false);
      }
    }
  };
};

export const remove_module_redux = ({
  url,
  setLoading,
  additionalFunctions = [],
  successMsg,
  errorMsg,
  dispatchFunc = [],
}) => {
  return async (dispatch) => {
    if (setLoading) {
      setLoading(true);
    }
    try {
      const res = await axios.delete(`${Baseurl}${url}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
        },
      });
      if (res) {
        if (successMsg) {
          showMsg("", successMsg, "success");
        }
        dispatchFunc.forEach((func) => {
          if (typeof func === "function") {
            dispatch(func());
          }
        });
        additionalFunctions.forEach((func) => {
          if (typeof func === "function") {
            func();
          }
        });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || errorMessage;
      if (errorMsg && e?.response?.data?.message === undefined) {
        showMsg("", errorMsg, "danger");
      } else {
        showMsg("", msg, "danger");
      }
    } finally {
      if (setLoading) {
        setLoading(false);
      }
    }
  };
};

// Verify Otp
export const post_api_with_response = async ({
  url,
  payload,
  setLoading,
  additionalFunctions = [],
  successMsg,
  errorMsg,
}) => {
  if (setLoading) {
    setLoading(true);
  }
  try {
    const res = await axios.post(`${Baseurl}${url}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("AdminToken")}`,
      },
    });
    if (res) {
      const data = res?.data;
      if (successMsg) {
        showMsg("", successMsg, "success");
      }
      additionalFunctions.forEach((func) => {
        if (typeof func === "function") {
          func(data);
        }
      });
    }
  } catch (e) {
    const msg = e?.response?.data?.message || errorMessage;
    if (errorMsg && e?.response?.data?.message === undefined) {
      showMsg("", errorMsg, "danger");
    } else {
      showMsg("", msg, "danger");
    }
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};
