/** @format */

import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOutCircle } from "react-icons/bi";
import { showMsg } from "../../Respo/Api";
import { firebaseSignOut } from "../../utils/utils";
import { sidebarConstant } from "../../Helper/Constant";

const Sidebar = ({ hamb, setHamb }) => {
  const navigate = useNavigate();
  const detail = JSON.parse(localStorage.getItem("details"));
  const user_role = detail?.userType;
  let allowedTabs = [];

  if (user_role === "SUBADMIN") {
    if (detail?.permissions?.length > 0) {
      for (const item of detail?.permissions) {
        allowedTabs.push(
          ...sidebarConstant?.filter((i) => i.link === `/${item}`)
        );
      }
    }
  } else {
    allowedTabs = sidebarConstant;
  }

  const logOut = () => {
    localStorage.clear();
    firebaseSignOut();
    navigate("/");
    showMsg("Logged Out", "", "success");
  };

  return (
    <>
      <aside
        className="p-4 h-auto"
        style={{ backgroundColor: "#042b26", minHeight: "100vh" }}
      >
        {/* Top */}
        <div className="w-full md:hidden relative  p-2 mb-4">
          <RiCloseLine
            onClick={() => setHamb(!hamb)}
            className="text-3xl  absolute top-2 sm:hover:rotate-[228deg] transition-transform font-bold right-2 sm:hover:text-[22px] text-[rgb(241,146,46)] cursor-pointer"
          />
        </div>{" "}
        <figure className="flex  flex-col items-center">
          <span
            className="font-bold text-[#fff]"
            style={{
              fontSize: "2rem",
              textAlign: "center",
              textTransform: "uppercase",
            }}
          >
            {" "}
            ADMIN PANEL
          </span>
        </figure>
        <nav className="py-6">
          {allowedTabs?.map((nav, index) => {
            return (
              <Link
                to={nav.link}
                key={index}
                style={{ textDecoration: "none", textTransform: "uppercase" }}
              >
                <span
                  className="flex my-3 items-center cursor-pointer text-gray-900  tracking-wider p-2 rounded-sm"
                  style={{ color: "#FFF" }}
                >
                  {nav.icon} {nav.name}
                </span>
              </Link>
            );
          })}
          <span
            className="flex my-3 items-center cursor-pointer text-gray-900    tracking-wider p-2 rounded-sm"
            onClick={() => logOut()}
            style={{ color: "#FFF", textTransform: "uppercase" }}
          >
            <BiLogOutCircle className="text-xl mr-3 rounded-full " /> LogOut
          </span>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
