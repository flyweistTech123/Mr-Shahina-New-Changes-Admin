/** @format */

import React, { useEffect, useState } from "react";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { AiOutlineMail } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Images/logo.png";
import axios from "axios";
import { Alert } from "react-bootstrap";
import { showMsg } from "../../Respo/Api";
import { ClipLoader } from "react-spinners";
import { SignInFirebase } from "../../utils/utils";

const Login = () => {
  const [pass, setPass] = useState(false);
  const [inputpass, setInputpass] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const payload = {
    email,
    password,
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.React_App_Baseurl}api/v1/admin/login`,
        payload
      );
      const userDetail = JSON.stringify(data?.data);
      localStorage.setItem("details", userDetail);
      localStorage.setItem("AdminToken", data.accessToken);
      SignInFirebase({
        payload,
      });
      showMsg("Welcome back", "", "success");
      navigate("/dashboard");
      setLoading(false);
    } catch (err) {
      console.log("Admin Login err => ", err);
      setLoading(false);
      setError(true);
    }
  };

  const AdminToken = localStorage.getItem("AdminToken");

  useEffect(() => {
    if (AdminToken) {
      navigate("/dashboard");
    }
  }, [AdminToken]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);
  return (
    <>
      <div
        className="w-full h-screen flex flex-col justify-center items-center "
        style={{ background: "#042b26" }}
      >
        <form
          className="shadow-2xl w-96 mx-3 sm:mx-0 sm:w-4/5 md:w-4/6 lg:w-4/5 xl:w-1/2 flex flex-col items-center bg-white p-5 md:py-10 full_withd"
          onSubmit={submitHandler}
        >
          <img src={logo} alt="" className="logo" />
          <section className="py-2 input_sec">
            {error ? (
              <div className="dangerBox">
                <Alert variant="danger">Check Your Credentials</Alert>
                <i class="fa-solid fa-x" onClick={() => setError(false)}></i>
              </div>
            ) : (
              ""
            )}

            <div className="shadow-2xl sm:w-96 border border-[rgb(241,146,46)] space-x-4 flex items-center w-64  p-2 rounded-md full_input">
              <input
                type="email"
                placeholder="admin@gmail.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none px-0.5  bg-transparent tracking-wider w-full"
              />
              <AiOutlineMail className="text-xl " />
            </div>
            <div className="shadow-2xl sm:w-96 border border-[rgb(241,146,46)] space-x-4 flex items-center w-64  p-2 rounded-md mt-3 full_input">
              <input
                type={inputpass ? "text" : "password"}
                placeholder="password"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="outline-none px-0.5  bg-transparent tracking-wider w-full  "
              />

              <span
                onClick={() => {
                  setPass(!pass);
                  setInputpass(!inputpass);
                }}
                className="text-xl cursor-pointer hover:scale-90 "
              >
                {pass ? <VscEyeClosed /> : <VscEye />}
              </span>
            </div>

            <button type="submit" className="EcommerceAdminLogin">
              {loading ? <ClipLoader color="#fff" /> : "Log In"}
            </button>
            <br />
            <Link to="/forget-password">
              <button type="button" className="forgetPassowrd">
                Forgot Password?
              </button>
            </Link>
          </section>
        </form>
      </div>
    </>
  );
};

export default Login;
