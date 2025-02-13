/** @format */

import ForgetPassword from "../E-CommerceAdmin/forms/forgetPassword";
import Login from "../E-CommerceAdmin/forms/Login";
import Dashboard from "../E-CommerceAdmin/pages/Dashboard";
import Blog from "../E-CommerceAdmin/pages/Blog/Blog";
import AboutUs from "../E-CommerceAdmin/pages/AboutUs/AboutUs";
import CreateAboutUs from "../E-CommerceAdmin/pages/AboutUs/create-about-us";
import EditAboutUs from "../E-CommerceAdmin/pages/AboutUs/edit-about-us";
import Acne from "../E-CommerceAdmin/pages/Acne/Acne";
import AcneQuery from "../E-CommerceAdmin/pages/AcneSuggestion/AcneQuery";
import AcneSuggestion from "../E-CommerceAdmin/pages/AcneSuggestion/AcneSuggestion";
import AddOnService from "../E-CommerceAdmin/pages/AddOnService/AddOnService";
import AddHomeBanner from "../E-CommerceAdmin/pages/Banner/AddHomeBanner";
import AddPartnerBanner from "../E-CommerceAdmin/pages/Banner/AddPartnerBanner";
import AddPromotionBanner from "../E-CommerceAdmin/pages/Banner/AddPromotionBanner";
import AddServiceBanner from "../E-CommerceAdmin/pages/Banner/AddServiceBanner";
import AddShopBanner from "../E-CommerceAdmin/pages/Banner/AddShopBanner";
import Banner from "../E-CommerceAdmin/pages/Banner/Banner";
import SingleBanner from "../E-CommerceAdmin/pages/Banner/SingleBanner";
import Brand from "../E-CommerceAdmin/pages/Brand";
import Chat from "../E-CommerceAdmin/pages/Chat/Chat";
import Contact from "../E-CommerceAdmin/pages/Contact/Contact";
import ECategory from "../E-CommerceAdmin/pages/ECategory";
import Faq from "../E-CommerceAdmin/pages/FAQ/Faq";
import Frequently from "../E-CommerceAdmin/pages/Frequently/Frequently";
import Gallery from "../E-CommerceAdmin/pages/Gallery/Gallery";
import CreateGiftCard from "../E-CommerceAdmin/pages/GiftCard/CreateGiftCard";
import GiftCard from "../E-CommerceAdmin/pages/GiftCard/GiftCard";
import Ingredeints from "../E-CommerceAdmin/pages/Ingredeints/Ingredeints";
import Nutrition from "../E-CommerceAdmin/pages/Nutrition";
import Order from "../E-CommerceAdmin/pages/Orders/Order";
import ServiceOrder from "../E-CommerceAdmin/pages/Orders/ServiceOrder";
import ServiceOrderId from "../E-CommerceAdmin/pages/Orders/ServiceOrderId";
import SingleOrder from "../E-CommerceAdmin/pages/Orders/SingleOrder";
import Approved from "../E-CommerceAdmin/pages/Payment/Approved";
import ApprovedManualCard from "../E-CommerceAdmin/pages/Payment/ApprovedManualCard";
import Paid from "../E-CommerceAdmin/pages/Payment/Paid";
import Privacy from "../E-CommerceAdmin/pages/PrivacyPolicy/Privacy";
import ReturnPolicy from "../E-CommerceAdmin/pages/PrivacyPolicy/ReturnPolicy";
import ShippingPrivacy from "../E-CommerceAdmin/pages/PrivacyPolicy/ShippingPrivacy";
import CreateProduct from "../E-CommerceAdmin/pages/Product/CreateProduct";
import EditProduct from "../E-CommerceAdmin/pages/Product/EditProduct";
import Product from "../E-CommerceAdmin/pages/Product/Product";
import ProductType from "../E-CommerceAdmin/pages/ProductType";
import Query from "../E-CommerceAdmin/pages/Query/Query";
import Reviews from "../E-CommerceAdmin/pages/Reviews/Reviews";
import Rewards from "../E-CommerceAdmin/pages/Rewards/Rewards";
import Another from "../E-CommerceAdmin/pages/Scheduler/Another";
import CalenderNotification from "../E-CommerceAdmin/pages/Scheduler/Notification/CalenderNotification";
import SendNotification from "../E-CommerceAdmin/pages/Scheduler/Notification/SendNotification";
import CreateService from "../E-CommerceAdmin/pages/Service/CreateService";
import Editservice from "../E-CommerceAdmin/pages/Service/Editservice";
import Service from "../E-CommerceAdmin/pages/Service/Service";
import SingleService from "../E-CommerceAdmin/pages/Service/SingleService";
import SkinCondition from "../E-CommerceAdmin/pages/SkinCondition";
import SkinType from "../E-CommerceAdmin/pages/SkinType";
import MonthlySpecial from "../E-CommerceAdmin/pages/Special/MonthlySpecial";
import Subadmin from "../E-CommerceAdmin/pages/SubAdmin/Subadmin";
import CreateSubscription from "../E-CommerceAdmin/pages/Subscription/CreateSubscription";
import EditSubscription from "../E-CommerceAdmin/pages/Subscription/EditSubscription";
import Subscription from "../E-CommerceAdmin/pages/Subscription/Subscription";
import Terms from "../E-CommerceAdmin/pages/Terms/Terms";
import Tip from "../E-CommerceAdmin/pages/Tip/Tip";
import Transaction from "../E-CommerceAdmin/pages/Transaction/Transaction";
import EditUser from "../E-CommerceAdmin/pages/User/EditUser";
import Template from "../E-CommerceAdmin/pages/User/Template";
import User from "../E-CommerceAdmin/pages/User/User";
import UserData from "../E-CommerceAdmin/pages/User/UserData";
import SingleProduct from "../E-CommerceAdmin/pages/Product/SingleProduct";
import ViewNotification from "../E-CommerceAdmin/pages/Scheduler/Notification/ViewNotification";
import MetaTags from "../E-CommerceAdmin/pages/MetaTags/MetaTags";

const routes = [
  { path: "/", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/getblog", element: <Blog /> },
  { path: "/banner", element: <Banner /> },
  { path: "/banner/:id", element: <SingleBanner /> },
  { path: "/privacy-policy", element: <Privacy /> },
  { path: "/terms", element: <Terms /> },
  { path: "/brand", element: <Brand /> },
  { path: "/nutrition", element: <Nutrition /> },
  { path: "/Product-type", element: <ProductType /> },
  { path: "/skin-condition", element: <SkinCondition /> },
  { path: "/skinType", element: <SkinType /> },
  { path: "/Category", element: <ECategory /> },
  { path: "/Product", element: <Product /> },
  { path: "/product/:id", element: <SingleProduct /> },
  { path: "/create-product", element: <CreateProduct /> },
  { path: "/edit-product/:product", element: <EditProduct /> },
  { path: "/service", element: <Service /> },
  { path: "/service/:id", element: <SingleService /> },
  { path: "/create-service", element: <CreateService /> },
  { path: "/edit-service/:id", element: <Editservice /> },
  { path: "/subscription", element: <Subscription /> },
  { path: "/create-subscription", element: <CreateSubscription /> },
  { path: "/edit-subscription/:id", element: <EditSubscription /> },
  { path: "/reviews", element: <Reviews /> },
  { path: "/about-us", element: <AboutUs /> },
  { path: "/create-about-us", element: <CreateAboutUs /> },
  { path: "/edit-about-us/:id", element: <EditAboutUs /> },
  { path: "/faq", element: <Faq /> },
  { path: "/contact", element: <Contact /> },
  { path: "/query", element: <Query /> },
  { path: "/ingredients", element: <Ingredeints /> },
  { path: "/giftCard", element: <GiftCard /> },
  { path: "/creatGift", element: <CreateGiftCard /> },
  { path: "/acne", element: <Acne /> },
  { path: "/acne-suggestion", element: <AcneSuggestion /> },
  { path: "/acne-query", element: <AcneQuery /> },
  { path: "/add-on-service", element: <AddOnService /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/create-home-banner", element: <AddHomeBanner /> },
  { path: "/create-partner-banner", element: <AddPartnerBanner /> },
  { path: "/create-shop-banner", element: <AddShopBanner /> },
  { path: "/create-service-banner", element: <AddServiceBanner /> },
  { path: "/create-promotion-banner", element: <AddPromotionBanner /> },
  { path: "/user", element: <User /> },
  { path: "/user-data/:id", element: <UserData /> },
  { path: "/Orders", element: <Order /> },
  { path: "/order/:id", element: <SingleOrder /> },
  { path: "/service-order", element: <ServiceOrder /> },
  { path: "/service-order/:id", element: <ServiceOrderId /> },
  { path: "/frequently", element: <Frequently /> },
  { path: "/transaction", element: <Transaction /> },
  { path: "/rewards", element: <Rewards /> },
  { path: "/shipping-privacy", element: <ShippingPrivacy /> },
  { path: "/return-privacy", element: <ReturnPolicy /> },
  { path: "/chat", element: <Chat /> },
  { path: "/another", element: <Another /> },
  { path: "/notification", element: <CalenderNotification /> },
  { path: "/sub-admin", element: <Subadmin /> },
  { path: "/edit-user/:id", element: <EditUser /> },
  { path: "/forget-password", element: <ForgetPassword /> },
  { path: "/template/:id", element: <Template /> },
  { path: "/tip", element: <Tip /> },
  { path: "/thanksAdmin/:orderId/:amount", element: <Approved /> },
  { path: "/thanksAdmin1/:orderId/:amount", element: <ApprovedManualCard /> },
  { path: "/send-notification", element: <SendNotification /> },
  { path: "/view-notification/:id", element: <ViewNotification /> },
  { path: "/paid", element: <Paid /> },
  { path: "/monthly-special", element: <MonthlySpecial /> },
  { path: "/meta-tags", element: <MetaTags /> },

];

export default routes;
