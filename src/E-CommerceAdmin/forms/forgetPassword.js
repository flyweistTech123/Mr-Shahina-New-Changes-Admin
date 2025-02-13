/** @format */

import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../../Images/logo.png";
import { postApi, post_api_with_response } from "../../Respo/Api";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = { email };
    const additionalFunctions = [() => setStep(step + 1)];
    postApi({
      url: "api/v1/admin/forgetPassword",
      payload,
      setLoading,
      additionalFunctions,
      successMsg : "Otp sent to your email"
    });
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const payload = { email, otp };
    const additionalFunctions = [
      (data) => setUserId(data?.data?.userId),
      () => setStep(step + 1),
    ];
    post_api_with_response({
      url: "api/v1/admin/forgotVerifyotp",
      payload,
      setLoading,
      additionalFunctions,
     
    });
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    const payload = {
      newPassword,
      confirmPassword,
    };
    const additionalFunctions = [() => navigate("/")];
    postApi({
      url: `api/v1/admin/changePassword/${userId}`,
      payload,
      setLoading,
      successMsg: "Password updated successfully !",
      additionalFunctions,
    });
  };

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
        <form className="shadow-2xl w-96 mx-3 sm:mx-0 sm:w-4/5 md:w-4/6 lg:w-4/5 xl:w-1/2 flex flex-col items-center bg-white p-5 md:py-10 full_withd">
          <img src={logo} alt="" className="logo" />
          {step === 1 && (
            <section className="py-2 input_sec">
              <div className="shadow-2xl sm:w-96 border border-[rgb(241,146,46)] space-x-4 flex items-center w-64  p-2 rounded-md full_input">
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="outline-none px-0.5  bg-transparent tracking-wider w-full"
                />
              </div>

              <button
                type="submit"
                className="EcommerceAdminLogin"
                onClick={submitHandler}
              >
                {loading ? (
                  <Spinner animation="border" role="status" />
                ) : (
                  "Reset"
                )}
              </button>
            </section>
          )}

          {step === 2 && (
            <section className="py-2 input_sec">
              <div className="shadow-2xl sm:w-96 border border-[rgb(241,146,46)] space-x-4 flex items-center w-64  p-2 rounded-md full_input">
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="outline-none px-0.5  bg-transparent tracking-wider w-full"
                />
              </div>
              <div className="shadow-2xl sm:w-96 border border-[rgb(241,146,46)] space-x-4 flex items-center w-64  p-2 rounded-md full_input mt-3">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  required
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  value={otp}
                  minLength={0}
                  className="outline-none px-0.5  bg-transparent tracking-wider w-full"
                />
              </div>

              <button
                type="submit"
                className="EcommerceAdminLogin"
                onClick={verifyOtp}
              >
                {loading ? (
                  <Spinner animation="border" role="status" />
                ) : (
                  "Confirm"
                )}
              </button>
            </section>
          )}
          {step === 3 && (
            <section className="py-2 input_sec">
              <div className="shadow-2xl sm:w-96 border border-[rgb(241,146,46)] space-x-4 flex items-center w-64  p-2 rounded-md full_input">
                <input
                  type="password"
                  placeholder="new password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="outline-none px-0.5  bg-transparent tracking-wider w-full"
                />
              </div>
              <div className="shadow-2xl sm:w-96 border border-[rgb(241,146,46)] space-x-4 flex items-center w-64  p-2 rounded-md full_input mt-3">
                <input
                  type="password"
                  placeholder="confirm password"
                  required
                  minLength={6}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="outline-none px-0.5  bg-transparent tracking-wider w-full"
                />
              </div>

              <button
                type="submit"
                className="EcommerceAdminLogin"
                onClick={resetPassword}
              >
                {loading ? (
                  <Spinner animation="border" role="status" />
                ) : (
                  "Confirm"
                )}
              </button>
            </section>
          )}
        </form>
      </div>
    </>
  );
};

export default ForgetPassword;
