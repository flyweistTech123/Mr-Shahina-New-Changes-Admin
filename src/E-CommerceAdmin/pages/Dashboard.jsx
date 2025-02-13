/** @format */

import React, { useEffect, useState } from "react";
import HOC from "../layout/HOC";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaProductHunt,
  FaShoppingCart,
  FaImage,
  FaNewspaper,
} from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { IoNutrition } from "react-icons/io5";
import { MdMergeType } from "react-icons/md";
import { AiFillSkin } from "react-icons/ai";

const Dashboard = () => {
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [brands, setBrands] = useState(0);
  const [nutrition, setNutrition] = useState(0);
  const [productType, setProductType] = useState(0);
  const [skinCondition, setSkinCondition] = useState(0);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/Product/all/paginateProductSearch`
      );
      setProductCount(data.data.totalDocs);
    } catch {}
  };

  const fetchService = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/Service/all/paginateServiceSearch`
      );
      setServiceCount(data.data.totalDocs);
    } catch {}
  };

  const fetchGallary = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/Gallary/getGallary`
      );
      setGalleryCount(data.data?.length);
    } catch {}
  };

  const fetchNews = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/News/getNews`
      );
      setNewsCount(data.data?.length);
    } catch {}
  };

  const fetchBrand = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/Brand/allBrand`
      );
      setBrands(data.data?.length);
    } catch {}
  };

  const fetchNutrition = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/Nutrition/allNutrition`
      );
      setNutrition(data.data?.length);
    } catch {}
  };

  const fetchProductType = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/ProductType/allProductType`
      );
      setProductType(data.data?.length);
    } catch {}
  };

  const fetchSkinCondition = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.React_App_Baseurl}api/v1/admin/SkinCondition/allSkinCondition`
      );
      setSkinCondition(data.data?.length);
    } catch {}
  };

  useEffect(() => {
    fetchProduct();
    fetchService();
    fetchGallary();
    fetchNews();
    fetchBrand();
    fetchNutrition();
    fetchProductType();
    fetchSkinCondition();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const card = [
    {
      progress: "bg-green-400",
      title: "All Product",
      number: productCount,
      icon: <FaProductHunt className="text-[#042b26] w-[30px] h-[30px]" />,
      bg: "#042b26",
      link: "/Product",
    },
    {
      progress: "bg-green-400",
      title: "All Service",
      number: serviceCount,
      icon: <FaShoppingCart className="text-[#042b26] w-[30px] h-[30px]" />,
      bg: "#042b26",
      link: "/service",
    },
    {
      progress: "bg-green-400",
      title: "All Gallery",
      number: galleryCount,
      icon: <FaImage className="text-[#042b26] w-[30px] h-[30px]" />,
      bg: "#042b26",
      link: "/gallery",
    },
    {
      progress: "bg-green-400",
      title: "All Blogs",
      number: newsCount,
      icon: <FaNewspaper className="text-[#042b26] w-[30px] h-[30px]" />,
      bg: "#042b26",
      link: "/getblog",
    },
    {
      progress: "bg-green-400",
      title: "All Brands",
      number: brands,
      icon: <SiBrandfolder className="text-[#042b26] w-[30px] h-[30px]" />,
      bg: "#042b26",
      link: "/brand",
    },
    {
      progress: "bg-green-400",
      title: "All Nutrition",
      number: nutrition,
      icon: <IoNutrition className="text-[#042b26] w-[30px] h-[30px]" />,
      bg: "#042b26",
      link: "/nutrition",
    },
    {
      progress: "bg-green-400",
      title: "All Product Type",
      number: productType,
      icon: <MdMergeType className="text-[#042b26] w-[30px] h-[30px]" />,
      bg: "#042b26",
      link: "/Product-type",
    },
    {
      progress: "bg-green-400",
      title: "All Skin Condition",
      number: skinCondition,
      icon: <AiFillSkin className="text-[#042b26] w-[30px] h-[30px]" />,
      bg: "#042b26",
      link: "/skin-condition",
    },
  ];

  return (
    <>
      <section className="gap-y-6 gap-x-4 CardDiv_Container">
        {card.map((card, index) => {
          return (
            <div
              className="px-5 py-8  space-y-2 shadow-xl flex flex-col  rounded-md cardDiv"
              key={index}
              style={{
                backgroundColor: `${card.bg}`,
                textTransform: "uppercase",
              }}
              onClick={() => navigate(`${card.link}`)}
            >
              <div className="grid  justify-between grid-cols-4">
                <div className="flex flex-col col-span-3 space-y-1">
                  <span
                    className="tracking-widest text-gray-900"
                    style={{ color: "#fff" }}
                  >
                    {card.title}
                  </span>
                  <span
                    className="tracking-wider text-gray-700 text-xl md:text-2xl font-semibold"
                    style={{ color: "#fff" }}
                  >
                    {card.number}
                  </span>
                </div>
                <div className="flex rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-white justify-center items-center iCOn">
                  {card.icon}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default HOC(Dashboard);
