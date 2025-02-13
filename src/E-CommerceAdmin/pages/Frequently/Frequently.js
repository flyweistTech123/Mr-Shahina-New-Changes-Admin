/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { DateInMMDDYY } from "../../../Helper/Helper";
import { getApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaRegTrashAlt } from "react-icons/fa";

const Frequently = () => {
  const [data, setData] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("AdminToken");
  const Auth = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchHandler = () => {
    getApi({
      url: "api/v1/FrequentlyBuyProduct",
      setResponse: setData,
      setLoading,
    });
  };

  useEffect(() => {
    fetchHandler();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const handleDelete = async (ide) => {
    const url = `${process.env.React_App_Baseurl}api/v1/admin/FrequentlyBuyProduct/deleteFrequentlyBuyProduct/${ide}`;
    try {
      const { data } = await axios.delete(url, Auth);
      toast.success(data.message);
      fetchHandler();
    } catch (e) {
      console.log(e);
    }
  };

  function MyVerticallyCenteredModal(props) {
    const [products, setProducts] = useState([]);
    const [arr, setArr] = useState([]);

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.React_App_Baseurl}api/v1/Product/all/getAllProducts`
        );
        const data = res?.data?.data;
        setArr(data);
      } catch {}
    };

    useEffect(() => {
      if (props.show) {
        fetchProducts();
      }
    }, [props]);

    const ids = products?.map((i) => i.value);
    const payload = {
      products: ids,
    };

    const postHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `${process.env.React_App_Baseurl}api/v1/FrequentlyBuyProduct/addFrequentlyBuyProduct`,
          payload,
          Auth
        );
        toast.success(data.message);
        props.onHide();
        fetchHandler();
      } catch (e) {
        console.log(e);
      }
    };

    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create New
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={postHandler}>
            <Form.Group className="mb-3">
              <Select
                isMulti
                options={arr?.map((i) => ({
                  value: i._id,
                  label: i.name,
                }))}
                placeholder="Select products"
                value={products}
                onChange={(e) => setProducts(e)}
              />
            </Form.Group>

            <Button
              style={{ backgroundColor: "#19376d", borderRadius: "0" }}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  const thead = ["No.", "Product", "Created at", ""];

  const tbody = data?.data?.map((i, index) => [
    `#${index + 1}`,
    i.products?.map((item) => (
      <ul style={{ listStyle: "disc" }} key={item?._id}>
        <li> {item?.name} </li>
      </ul>
    )),
    DateInMMDDYY(i?.createdAt),
    <span className="remove-icon" onClick={() => handleDelete(i._id)}>
      <FaRegTrashAlt />
    </span>,
  ]);

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <section className="sectionCont">
        <div className="pb-4   w-full flex justify-between items-center">
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            Bundled Products ({data?.data?.length})
          </span>
          <div className="d-flex gap-2 flex-wrap">
            <button
              className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider"
              onClick={() => setModalShow(true)}
            >
              Create New
            </button>
          </div>
        </div>

        <TableLayout thead={thead} tbody={tbody} loading={loading} />
      </section>
    </>
  );
};

export default HOC(Frequently);
