/** @format */

import React from "react";
import Select from "react-select";
import { editApi } from "../Respo/Api";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaPlus, FaMinus, FaRegTrashAlt } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import { IoCaretBackOutline, IoCaretForward } from "react-icons/io5";

const FlexContainer = ({ children, className }) => {
  return <div className={`user_select_container ${className}`}>{children}</div>;
};

const Heading = ({ title, className }) => {
  return (
    <div>
      <p
        style={{
          fontSize: "25px",
          fontWeight: "700",
          margin: 0,
        }}
        className={className}
      >
        {title}
      </p>
    </div>
  );
};

const ServiceLayout = ({
  onClickHandler,
  title,
  time,
  duration,
  teamMember,
  price,
  isPaid,
}) => {
  return isPaid ? (
    <div className="service_selector" style={{ cursor: "default" }}>
      <div>
        <p className="title">{title}</p>
        <p className="faded">
          {time} ({duration}){" "}
        </p>
        <p className="faded"> {teamMember} </p>
        <p className="faded">{`$${price}`}</p>
      </div>
    </div>
  ) : (
    <div className="service_selector" onClick={onClickHandler}>
      <div>
        <p className="title">{title}</p>
        <p className="faded">
          {time} ({duration}){" "}
        </p>
        <p className="faded"> {teamMember} </p>
        <p className="faded">{`$${price}`}</p>
      </div>
    </div>
  );
};

const ProductLayout = ({
  img,
  title,
  size,
  price,
  className,
  id,
  orderId,
  isBtn,
  setLoading,
  fetchHandler,
  priceId,
  isOrdered,
  quantity,
  sizePrice,
}) => {
  let payload;

  if (priceId) {
    payload = {
      orderId,
      priceId,
    };
  } else {
    payload = {
      orderId,
    };
  }

  const additionalFunctions = [fetchHandler];

  const removeHandler = () => {
    editApi({
      url: `api/v1/admin/deleteProductFromOrder/${id}`,
      payload,
      setLoading,
      additionalFunctions,
    });
  };

  const updateProduct = ({ isIncrease }) => {
    let options;
    if (isIncrease) {
      options = {
        priceId,
        size,
        quantity: quantity + 1,
        orderId,
        ...(sizePrice && { sizePrice }),
      };
    } else {
      options = {
        priceId,
        size,
        sizePrice,
        quantity: quantity - 1,
        orderId,
        ...(sizePrice && { sizePrice }),
      };
    }

    const url = `api/v1/admin/updateProductToCart/${id}`;
    editApi({
      url,
      payload: options,
      setLoading,
      additionalFunctions,
    });
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Quantity : {quantity}
    </Tooltip>
  );

  return isOrdered ? (
    <div className={`Item ${className}`}>
      <img src={img} alt="" />
      <div className="content">
        <p className="title"> {title} </p>
        {size && <p className="price"> Size : {size} </p>}
        <p className="price">${price} </p>
      </div>
      <OverlayTrigger
        placement="auto"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
      >
        <div className="product-quantity-count"> {quantity} </div>
      </OverlayTrigger>
    </div>
  ) : (
    <div className={`Item ${className}`}>
      <img src={img} alt="" />
      <div className="content">
        <p className="title"> {title} </p>
        {size && <p className="price"> Size : {size} </p>}
        <p className="price">${price} </p>
        <div className="update-quantity">
          <span
            className="icon-container"
            onClick={() => {
              if (quantity > 1) {
                updateProduct({ isIncrease: false });
              }
            }}
          >
            <FaMinus />
          </span>
          <span className="quantity"> {quantity} </span>
          <span
            className="icon-container"
            onClick={() => updateProduct({ isIncrease: true })}
          >
            <FaPlus />
          </span>
        </div>
      </div>
      {isBtn && (
        <span className="remove-icon">
          <FaRegTrashAlt onClick={() => removeHandler()} />
        </span>
      )}
    </div>
  );
};

const ReactSelect = ({ options, setValue, value, inputValue, placeholder }) => {
  return (
    <Select
      value={value}
      options={options}
      placeholder={placeholder}
      onChange={(e) => setValue(e)}
      onInputChange={(input) => {
        if (inputValue) {
          inputValue(input);
        }
      }}
    />
  );
};

const Calculator = ({ display, handleClick, handleDelete }) => {
  return (
    <div className="calculator">
      <div className="screen">${display}</div>
      <div className="main">
        <button onClick={() => handleClick("1")}>1</button>
        <button onClick={() => handleClick("2")}>2</button>
        <button onClick={() => handleClick("3")}>3</button>
        <button onClick={() => handleClick("4")}>4</button>
        <button onClick={() => handleClick("5")}>5</button>
        <button onClick={() => handleClick("6")}>6</button>
        <button onClick={() => handleClick("7")}>7</button>
        <button onClick={() => handleClick("8")}>8</button>
        <button onClick={() => handleClick("9")}>9</button>
        <button onClick={() => handleClick(".")}>.</button>
        <button onClick={() => handleClick("0")}>0</button>
        <button onClick={handleDelete}>
          <FiDelete className="m-auto w-[30px] h-[30px]" />
        </button>
      </div>
    </div>
  );
};

const SectionHeading = ({ title, ExtraComponent }) => {
  return (
    <div className="pb-4  w-full flex justify-between items-center">
      <span
        className="tracking-widest text-slate-900 font-semibold uppercase"
        style={{ fontSize: "1.5rem" }}
      >
        {title}
      </span>
      {ExtraComponent && <ExtraComponent />}
    </div>
  );
};

const CustomPagination = ({
  currentPage,
  setCurrentPage,
  hasNextPage,
  hasPrevPage,
}) => {
  const prevHandler = () => {
    setCurrentPage(currentPage - 1);
  };

  const nextHandler = () => {
    setCurrentPage(currentPage + 1);
  };
  return (
    <div className="pagination">
      {hasPrevPage && (
        <button type="button" onClick={() => prevHandler()} className="prevBtn">
          <IoCaretBackOutline />
        </button>
      )}
      <button className="activePage">{currentPage}</button>
      {hasNextPage && (
        <button type="button" onClick={() => nextHandler()} className="nextBtn">
          <IoCaretForward />
        </button>
      )}
    </div>
  );
};

export {
  SectionHeading,
  Calculator,
  ReactSelect,
  ProductLayout,
  ServiceLayout,
  Heading,
  CustomPagination,
  FlexContainer,
};
