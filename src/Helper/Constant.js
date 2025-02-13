/** @format */
import {
  FaCalendar,
  FaUser,
  FaProductHunt,
  FaShoppingCart,
  FaImage,
  FaNewspaper,
  FaQuestionCircle,
  FaReadme,
  FaQuoteLeft,
  FaGift,
  FaRegCheckSquare,
  FaBorderAll,
  FaShippingFast,
} from "react-icons/fa";
import { SiBrandfolder, SiAdonisjs } from "react-icons/si";
import {
  IoNutrition,
  IoNotificationsSharp,
  IoChatboxEllipses,
} from "react-icons/io5";
import { AiFillSkin ,AiFillFunnelPlot  } from "react-icons/ai";
import {
  MdCategory,
  MdOutlinePayment,
  MdBatteryUnknown,
  MdPaid,
  MdRateReview,
  MdQueryStats,
  MdQuiz,
  MdPolicy,
  MdDashboardCustomize,
  MdMergeType,
  // MdFolderSpecial
} from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { IoMdContact, IoIosCash, IoMdReturnLeft } from "react-icons/io";
import { RiStackshareFill, RiAdminFill } from "react-icons/ri";

const durationOption = [
  {
    value: "5min",
    label: "5min",
  },
  {
    value: "10min",
    label: "10min",
  },
  {
    value: "15min",
    label: "15min",
  },
  {
    value: "20min",
    label: "20min",
  },
  {
    value: "25min",
    label: "25min",
  },
  {
    value: "30min",
    label: "30min",
  },
  {
    value: "35min",
    label: "35min",
  },
  {
    value: "40min",
    label: "40min",
  },
  {
    value: "45min",
    label: "45min",
  },
  {
    value: "50min",
    label: "50min",
  },
  {
    value: "55min",
    label: "55min",
  },
  {
    value: "1hr",
    label: "1hr",
  },

  {
    value: "1hr 5min",
    label: "1hr 5min",
  },
  {
    value: "1hr 10min",
    label: "1hr 10min",
  },
  {
    value: "1hr 15min",
    label: "1hr 15min",
  },
  {
    value: "1hr 20min",
    label: "1hr 20min",
  },
  {
    value: "1hr 25min",
    label: "1hr 25min",
  },
  {
    value: "1hr 30min",
    label: "1hr 30min",
  },
  {
    value: "1hr 35min",
    label: "1hr 35min",
  },
  {
    value: "1hr 40min",
    label: "1hr 40min",
  },
  {
    value: "1hr 45min",
    label: "1hr 45min",
  },
  {
    value: "1hr 50min",
    label: "1hr 50min",
  },
  {
    value: "1hr 55min",
    label: "1hr 55min",
  },
  {
    value: "2hr",
    label: "2hr",
  },
  {
    value: "2hr 5min",
    label: "2hr 5min",
  },
  {
    value: "2hr 10min",
    label: "2hr 10min",
  },
  {
    value: "2hr 15min",
    label: "2hr 15min",
  },
  {
    value: "2hr 20min",
    label: "2hr 20min",
  },
  {
    value: "2hr 25min",
    label: "2hr 25min",
  },
  {
    value: "2hr 30min",
    label: "2hr 30min",
  },
  {
    value: "2hr 35min",
    label: "2hr 35min",
  },
  {
    value: "2hr 40min",
    label: "2hr 40min",
  },
  {
    value: "2hr 45min",
    label: "2hr 45min",
  },
  {
    value: "2hr 50min",
    label: "2hr 50min",
  },
  {
    value: "2hr 55min",
    label: "2hr 55min",
  },
  {
    value: "3hr",
    label: "3hr",
  },
];

const appointmentArr = ["Info", "Notes", "Payments", "Forms"];

const sidebarConstant = [
  {
    icon: <MdDashboardCustomize className="text-xl mr-3" />,
    link: "/dashboard ",
    name: "Dashboard",
  },
  {
    icon: <FaCalendar className="text-xl mr-3" />,
    link: "/another",
    name: "Appointments ",
  },
  {
    icon: <FaUser className="text-xl mr-3" />,
    link: "/user",
    name: "Clients List",
  },
 
  {
    icon: <FaProductHunt className="text-xl mr-3" />,
    link: "/Product",
    name: "Products",
  },
  {
    icon: <FaShoppingCart className="text-xl mr-3" />,
    link: "/service",
    name: "Service",
  },
  // {
  //   icon: <MdFolderSpecial  className="text-xl mr-3" />,
  //   link: "/monthly-special",
  //   name: "Monthly Special",
  // },
  {
    icon: <FaImage className="text-xl mr-3" />,
    link: "/gallery",
    name: "Gallery",
  },
  {
    icon: <FaNewspaper className="text-xl mr-3" />,
    link: "/getblog",
    name: "Blogs",
  },
  {
    icon: <MdPolicy className="text-xl mr-3" />,
    link: "/privacy-policy",
    name: "Privacy Policy",
  },
  {
    icon: <FaQuestionCircle className="text-xl mr-3" />,
    link: "/terms",
    name: "Terms",
  },
  {
    icon: <SiBrandfolder className="text-xl mr-3" />,
    link: "/brand",
    name: "Brand",
  },
  {
    icon: <IoNutrition className="text-xl mr-3" />,
    link: "/nutrition",
    name: "Nutrition",
  },
  {
    icon: <MdMergeType className="text-xl mr-3" />,
    link: "/Product-type",
    name: "Product Type",
  },
  {
    icon: <AiFillSkin className="text-xl mr-3" />,
    link: "/skin-condition",
    name: "Skin Condition",
  },
  {
    icon: <MdCategory className="text-xl mr-3" />,
    link: "/skinType",
    name: "Skin Type",
  },
  {
    icon: <BiCategory className="text-xl mr-3" />,
    link: "/Category",
    name: "Category",
  },

  {
    icon: <MdPaid className="text-xl mr-3" />,
    link: "/subscription",
    name: "Subscription",
  },

  {
    icon: <MdRateReview className="text-xl mr-3" />,
    link: "/reviews",
    name: "Review",
  },
  {
    icon: <FaReadme className="text-xl mr-3" />,
    link: "/about-us",
    name: "About Us",
  },
  {
    icon: <FaQuoteLeft className="text-xl mr-3" />,
    link: "/faq",
    name: "FAQ",
  },
  {
    icon: <IoMdContact className="text-xl mr-3" />,
    link: "/contact",
    name: "Contact Details",
  },
  {
    icon: <MdQueryStats className="text-xl mr-3" />,
    link: "/query",
    name: "Query",
  },
  {
    icon: <FaRegCheckSquare className="text-xl mr-3" />,
    link: "/ingredients",
    name: "Ingredients",
  },
  {
    icon: <FaGift className="text-xl mr-3" />,
    link: "/giftCard",
    name: "Gift Card",
  },
  {
    icon: <MdQuiz className="text-xl mr-3" />,
    link: "/acne",
    name: "Acne Quiz",
  },
  {
    icon: <MdBatteryUnknown className="text-xl mr-3" />,
    link: "/acne-suggestion",
    name: "Acne Suggestion",
  },
  {
    icon: <MdQueryStats className="text-xl mr-3" />,
    link: "/acne-query",
    name: "Acne Query",
  },
  {
    icon: <SiAdonisjs className="text-xl mr-3" />,
    link: "/add-on-service",
    name: "Add On Service",
  },
  {
    icon: <FaImage className="text-xl mr-3" />,
    link: "/banner",
    name: "Banner",
  },
  {
    icon: <FaBorderAll className="text-xl mr-3" />,
    link: "/Orders",
    name: "Product Orders ",
  },
  {
    icon: <FaBorderAll className="text-xl mr-3" />,
    link: "/service-order",
    name: "Service Orders ",
  },

  {
    icon: <RiStackshareFill className="text-xl mr-3" />,
    link: "/frequently",
    name: "Bundeled Product",
  },
  {
    icon: <MdOutlinePayment className="text-xl mr-3" />,
    link: "/transaction",
    name: "Transaction",
  },
  {
    icon: <FaGift className="text-xl mr-3" />,
    link: "/rewards",
    name: "Gift Card Purchase",
  },
  {
    icon: <FaShippingFast className="text-xl mr-3" />,
    link: "/shipping-privacy",
    name: "Shipping Privacy Policy",
  },
  {
    icon: <IoMdReturnLeft className="text-xl mr-3" />,
    link: "/return-privacy",
    name: "Return Privacy Policy",
  },
  {
    icon: <IoChatboxEllipses className="text-xl mr-3" />,
    link: "/chat",
    name: "Chat",
  },
  {
    icon: <IoNotificationsSharp className="text-xl mr-3" />,
    link: "/notification",
    name: "Notification",
  },
  {
    icon: <RiAdminFill className="text-xl mr-3" />,
    link: "/sub-admin",
    name: "Sub Admin",
  },
  {
    icon: <IoIosCash className="text-xl mr-3" />,
    link: "/tip",
    name: "Tip ",
  },
  {
    icon: <AiFillFunnelPlot  className="text-xl mr-3" />,
    link: "/meta-tags",
    name: "Meta Tags",
  },
];

const WebPages = [
  { value: "home", label: "Home" },
  { value: "Login", label: "Login" },
  { value: "Contact", label: "Contact" },
  { value: "About Us", label: "About Us" },
  { value: "Membership", label: "Membership" },
  { value: "Shop", label: "Shop" },
  { value: "Services", label: "Services" },
  { value: "Gallery", label: "Gallery" },
  { value: "Payment Plans", label: "Payment Plans" },
  { value: "Gift Cards", label: "Gift Cards" },
  { value: "Acne Quiz", label: "Acne Quiz" },
  { value: "Check Ingredients", label: "Check Ingredients" },
  { value: "Appointment", label: "Appointment" },
  { value: "Individual Appointment", label: "Individual Appointment" },
  { value: "Schedule Appointment", label: "Schedule Appointment" },
  { value: "Confirm Appointment", label: "Confirm Appointment" },
  { value: "Privacy Policy", label: "Privacy Policy" },
  { value: "Shipping Policy", label: "Shipping Policy" },
  { value: "Return Policy", label: "Return Policy" },
  { value: "Terms", label: "Terms" },
  { value: "FAQ", label: "FAQ" },
  { value: "Signup", label: "Signup" },
  { value: "User Cart", label: "User Cart" },
  { value: "User Profile", label: "User Profile" },
  { value: "All News", label: "All News" },
  { value: "Returning Member", label: "Returning Member" },
  { value: "Limited Deals", label: "Limited Deals" },
  { value: "Give Rating", label: "Give Rating" },
];

export { durationOption, appointmentArr, sidebarConstant, WebPages };
