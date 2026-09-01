import { RiDashboardFill } from "react-icons/ri";
import {ADMIN,PRODUCT_MANAGER} from "../constants/role";
import { LuBoxes, LuLogOut } from "react-icons/lu";
import AdminDashboard from "../pages/admin/dashboard";
import ProductManagerDashboard from "../pages/product-manager/dashboard";
import LoginPage from "../components/layouts/login";
import Staff from "../pages/admin/staff";
import Category from "../pages/admin/category";
import Product from "../pages/admin/product";
import ProductManagerCategory from "../pages/product-manager/category";
import ProductManagerProduct from "../pages/product-manager/product";
import ProductManagerOrder from "../pages/product-manager/order";
import ProductManagerCancellledOrders from "../pages/product-manager/cancelledOrders";
import ProductManageReturnOrders from "../pages/product-manager/returnOrders";
import StockPage from "../pages/admin/stock";
import { CiBoxList } from "react-icons/ci";
import AdminEnquiry from "../pages/admin/enquiry";
import { HiOutlineClipboardList } from "react-icons/hi";
import { MdOutlineCategory, MdPinDrop } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { BiCommentDetail, BiLoaderCircle } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";
import { FaTicketAlt, FaUndoAlt } from "react-icons/fa";
import AdminProcess from "../pages/admin/process";
import AdminCancelOrders from "../pages/admin/cancelOrders";
import AdminRetuneOrders from "../pages/admin/retuneOrders";
import PincodePage from "../pages/admin/pincode";
import AdminBulkOrders from "../pages/admin/bulkOrders";
import Account from "../pages/admin/account";
import CouponsPage from "../pages/admin/coupons";

const routesdata = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <RiDashboardFill size={20} />,
    element: <AdminDashboard />,
    children: [],
    role: ADMIN,
  },
  {
    title: "Staff",
    path: "/admin/staff",
    icon: <HiOutlineClipboardList size={20} />,
    element: <Staff />,
    children: [],
    role: ADMIN,
  },
  {
    title: "Category",
    path: "/admin/category",
    icon: <MdOutlineCategory size={20} />,
    element: <Category />,
    children: [],
    role: ADMIN,
  },
  {
    title: "Dashboard",
    path: "/product-manager/dashboard",
    icon: <RiDashboardFill size={20} />,
    element: <ProductManagerDashboard />,
    children: [],
    role: PRODUCT_MANAGER,
  },
  {
    title: "Category",
    path: "/product-manager/category",
    icon: <MdOutlineCategory size={20} />,
    element: <ProductManagerCategory />,
    children: [],
    role: PRODUCT_MANAGER,
  },
  
  {
    title: "Stock",
    path: "/stock",
    icon: <CiBoxList size={20} />,
    element: <StockPage />,
    children: [],
    role: [PRODUCT_MANAGER,ADMIN]
  },
   {
    title: "Pincode",
    path: "/pincode",
    icon: <MdPinDrop  size={20} />,
    element: <PincodePage />,
    children: [],
    role: [PRODUCT_MANAGER,ADMIN]
  },
  {
    title: "Product",
    path: "/admin/product",
    icon: <AiOutlineProduct size={20} />,
    element: <Product />,
    children: [],
    role: ADMIN,
  },
  {
    title: "Process",
    path: "/admin/process",
    icon: <BiLoaderCircle size={20} />,
    element: <AdminProcess />,
    children: [],
    role: ADMIN,
  },
  {
    title: "Cancel Orders",
    path: "/admin/cancel-orders",
    icon: <GiCancel size={20} />,
    element: <AdminCancelOrders />,
    children: [],
    role: ADMIN,
  },
  {
    title: "Return Orders",
    path: "/admin/return-orders",
    icon: <FaUndoAlt size={20} />,
    element: <AdminRetuneOrders />,
    children: [],
    role: ADMIN,
  },
  {
    title: "Coupons",
    path: "/coupons",
    icon: <FaTicketAlt size={20} />,
    element: <CouponsPage />,
    children: [],
    role: [ADMIN, PRODUCT_MANAGER],
  },
  {
    title: "Product",
    path: "/product-manager/product",
    icon: <RiDashboardFill size={20} />,
    element: <AiOutlineProduct/>,
    children: [],
    role: PRODUCT_MANAGER,
  },
  {
    title: "Order Process",
    path: "/product-manager/order",
    icon: <BiLoaderCircle size={20} />,
    element: <ProductManagerOrder/>,
    children: [],
    role: PRODUCT_MANAGER,
  },
  {
    title: "Cancelled Orders",
    path: "/product-manager/cancelled-order",
    icon: <GiCancel size={20} />,
    element: <ProductManagerCancellledOrders/>,
    children: [],
    role: PRODUCT_MANAGER,
  },
  {
    title: "Return Orders",
    path: "/product-manager/return-order",
    icon: <FaUndoAlt size={20} />,
    element: <ProductManageReturnOrders/>,
    children: [],
    role: PRODUCT_MANAGER,
  },
  {
    title: "Account",
    path: "/accounts",
    icon: <LuBoxes  entDetail size={20} />,
    element: <Account />,
    children: [],
    role: [ADMIN,PRODUCT_MANAGER]
  },
  {
    title: "Bulk - Orders",
    path: "/bulk-orders",
    icon: <LuBoxes  entDetail size={20} />,
    element: <AdminBulkOrders />,
    children: [],
    role: [ADMIN,PRODUCT_MANAGER]
  },
  {
    title: "Enquiry",
    path: "/enquiries",
    icon: <BiCommentDetail size={20} />,
    element: <AdminEnquiry />,
    children: [],
    role: [ADMIN]
  },
  {
    title: "Log Out",
    path: "/login",
    icon: <LuLogOut  size={20} />,
    element:<LoginPage/>,
    children: [],
  },
  
];

export default routesdata;
