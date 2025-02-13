/** @format */

import React, { useCallback, useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { deleteApi, editApi, getApi, postApi } from "../../../Respo/Api";
import TableLayout from "../../../Component/TableLayout";
import { FaPen, FaRegTrashAlt } from "react-icons/fa";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { WebPages } from "../../../Helper/Constant";
import {
  CustomPagination,
  ReactSelect,
} from "../../../Component/HelpingComponents";
import FullScreenLoader from "../../../Component/FullScreenLoader";

const MetaTags = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHandler = useCallback(() => {
    const queryParams = new URLSearchParams({
      limit: 10,
      page,
    });

    const url = `api/v1/MetaTag/getMetaTag?${queryParams?.toString()}`;
    getApi({
      url,
      setResponse,
      setLoading,
    });
  }, [page]);

  useEffect(() => {
    fetchHandler();
  }, [fetchHandler]);

  const removeHandler = (id) => {
    deleteApi({
      url: `api/v1/MetaTag/${id}`,
      additionalFunctions: [fetchHandler],
      setLoading,
      successMsg: "Removed !",
    });
  };

  const returnPageLabel = (value) => {
    const result = WebPages.filter((i) => i.value === value);
    return result?.[0]?.label;
  };

  const tableHead = ["Sno.", "Title", "Description", "Connected page", ""];

  const tableBody = response?.data?.docs?.map((item, index) => [
    `# ${index + 1}`,
    item?.title,
    item?.description,
    <span>
      {(item?.page && returnPageLabel(item.page)) ||
        (item?.serviceId && `Service / ${item?.serviceId?.name}`) ||
        (item?.productId && `Product / ${item?.productId?.name}`) ||
        (item?.newsId && `Blog / ${item?.newsId?.title}`)}
    </span>,
    <span className="flexCont">
      <span className="remove-icon" onClick={() => removeHandler(item?._id)}>
        <FaRegTrashAlt />
      </span>
      <span
        className="edit-icon"
        onClick={() => {
          setIsEdit(true);
          setSelectedItem(item);
          setIsOpen(true);
        }}
      >
        <FaPen />
      </span>
    </span>,
  ]);

  function MyVerticallyCenteredModal(props) {
    const [page, setPage] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [productId, setProductId] = useState({});
    const [serviceId, setServiceId] = useState({});
    const [typeOfPage, setTypeOfPage] = useState("");
    const [products, setProducts] = useState(null);
    const [services, setServices] = useState(null);
    const [limitedServices, setLimitedService] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [allNews, setAllNews] = useState(null);
    const [newsId, setNewsId] = useState({});

    const fetchNews = () => {
      getApi({
        url: "api/v1/News/getNews",
        setResponse: setAllNews,
      });
    };

    const fetchProducts = () => {
      getApi({
        url: `api/v1/Product/all/getAllProducts`,
        setResponse: setProducts,
      });
    };

    const fetchServices = () => {
      getApi({
        url: `api/v1/Service/all/getAllServices`,
        setResponse: setServices,
      });
      getApi({
        url: `api/v1/Service/all/getAllOfferServices`,
        setResponse: setLimitedService,
      });
    };

    useEffect(() => {
      if (props.show) {
        fetchProducts();
        fetchServices();
        fetchNews();
      }
    }, [props]);

    useEffect(() => {
      if (props.isEdit && props.selectedItem) {
        const item = props.selectedItem;
        setTitle(item?.title);
        setDescription(item?.description);
        setPage(item?.page);

        if (item.productId) {
          setProductId({
            value: item?.productId?._id,
            label: item?.productId?.name,
          });
        }
        if (item.serviceId) {
          setServiceId({
            value: item?.serviceId?._id,
            label: item?.serviceId?.name,
          });
        }
        if (item.newsId) {
          setNewsId({
            value: item?.newsId?._id,
            label: item?.newsId?.name,
          });
        }

        if (item?.page) {
          setTypeOfPage("normal");
        } else if (item?.serviceId) {
          setTypeOfPage("service");
        } else if (item?.productId) {
          setTypeOfPage("product");
        } else {
          setTypeOfPage("news");
        }
      }
    }, [props]);

    const newsOptions = allNews?.data?.map((item) => ({
      value: item?._id,
      label: item?.title,
    }));

    const productOptions = products?.data?.map((item) => ({
      value: item?._id,
      label: item?.name,
    }));

    const regularServiceOption =
      services?.data?.length > 0
        ? services?.data?.map((item) => ({
            value: item?._id,
            label: item?.name,
          }))
        : [];

    const limitedServiceOption =
      limitedServices?.data?.length > 0
        ? limitedServices?.data?.map((item) => ({
            value: item?._id,
            label: item?.name,
          }))
        : [];

    const combinedServices = [...regularServiceOption, ...limitedServiceOption];

    const payload = {
      page,
      description,
      title,
      productId: productId?.value,
      serviceId: serviceId?.value,
      newsId: newsId?.value,
    };

    const addNew = (e) => {
      e.preventDefault();

      if (props.isEdit) {
        editApi({
          url: `api/v1/MetaTag/updateMetaTag/${props.selectedItem?._id}`,
          payload,
          setLoading: setSubmitLoading,
          successMsg: "Updated !",
          additionalFunctions: [() => props.onHide(), props.fetchHandler],
        });
        return;
      }
      postApi({
        url: "api/v1/MetaTag/addMetaTag",
        payload,
        setLoading: setSubmitLoading,
        successMsg: "Created !",
        additionalFunctions: [() => props.onHide(), props.fetchHandler],
      });
    };

    return (
      <>
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
            {submitLoading && <FullScreenLoader />}
            <Form onSubmit={addNew}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <FloatingLabel label="Description">
                  <Form.Control
                    as="textarea"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                  />
                </FloatingLabel>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type of page</Form.Label>
                <Form.Select
                  required
                  value={typeOfPage}
                  onChange={(e) => setTypeOfPage(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="normal">Home Page</option>
                  <option value="product">Product Detail Page</option>
                  <option value="service">Service Detail Page</option>
                  <option value="news">Blogs</option>
                </Form.Select>
              </Form.Group>

              {typeOfPage === "normal" && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Desirable Page</Form.Label>
                  <Form.Select
                    required
                    value={page}
                    onChange={(e) => setPage(e.target.value)}
                  >
                    <option value="">Select</option>
                    {WebPages.map((item) => (
                      <option value={item.value} key={item}>
                        {" "}
                        {item.label}{" "}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              {typeOfPage === "product" && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Desirable Product</Form.Label>
                  <ReactSelect
                    options={productOptions || []}
                    value={productId}
                    setValue={setProductId}
                  />
                </Form.Group>
              )}

              {typeOfPage === "service" && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Desirable Service</Form.Label>
                  <ReactSelect
                    options={combinedServices}
                    value={serviceId}
                    setValue={setServiceId}
                  />
                </Form.Group>
              )}

              {typeOfPage === "news" && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Desirable Blog</Form.Label>
                  <ReactSelect
                    options={newsOptions}
                    value={newsId}
                    setValue={setNewsId}
                  />
                </Form.Group>
              )}

              <Button
                style={{ backgroundColor: "#042b26", borderRadius: "0" }}
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  return (
    <section className="sectionCont">
      <MyVerticallyCenteredModal
        show={isOpen}
        fetchHandler={fetchHandler}
        onHide={() => setIsOpen(false)}
        isEdit={isEdit}
        selectedItem={selectedItem}
      />
      <div
        className="pb-4   w-full flex justify-between items-center"
        style={{
          position: "sticky",
          top: 0,
          paddingTop: "1.5rem",
          backgroundColor: "#fff",
        }}
      >
        <span
          className="tracking-widest text-slate-900 font-semibold"
          style={{ fontSize: "1.5rem" }}
        >
          Meta Tags
        </span>
        <button
          className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#042b26] text-white tracking-wider"
          onClick={() => setIsOpen(true)}
        >
          Create New
        </button>
      </div>

      <TableLayout thead={tableHead} tbody={tableBody} loading={loading} />
      <CustomPagination
        currentPage={page}
        setCurrentPage={setPage}
        hasNextPage={response?.data?.hasNextPage}
        hasPrevPage={response?.data?.hasPrevPage}
      />
    </section>
  );
};

export default HOC(MetaTags);
