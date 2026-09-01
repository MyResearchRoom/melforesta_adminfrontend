import React, { useEffect } from 'react'
import ProductServiceDashCard from '../../../common/admin/productservicedashcart'
import { LuBoxes, LuCircleDashed } from 'react-icons/lu'
import { FaCheckCircle, FaUndoAlt } from 'react-icons/fa'
import { CiDeliveryTruck } from 'react-icons/ci'
import { BsBoxSeam } from 'react-icons/bs'
import { MdFiberNew, MdOutlineCategory } from 'react-icons/md'
import { AiOutlineProduct } from "react-icons/ai";
import { MdMiscellaneousServices, MdOutlinePeopleAlt } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux'
import { fetchCounts } from '../../../../redux/actions/countAction'
import DashboardCard from "../../../common/Admin/dashboardcart";
import { GiCancel } from 'react-icons/gi'
import { BiCommentDetail } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

function KPIBox({ label, value }) {
  return (
    <div className="bg-white border rounded-xl shadow px-5 py-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default function Section2() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { counts, error } = useSelector(state => state.countState);

  useEffect(() => {
    dispatch(fetchCounts());
  }, [dispatch]);

  const productCards = [
    {
      label: "New Request",
      status: "newRequest",
      count: counts.totalNewRequests,
      icon: MdFiberNew,
      bgColor: "bg-[#C8FFCD]",
      borderColor: "border-green-300",
      textColor: "text-green-600",
    },
    {
      label: "Processing",
      status: "processing",
      count: counts.totalProcessing,
      icon: LuCircleDashed,
      bgColor: "bg-blue-100",
      borderColor: "border-blue-300",
      textColor: "text-blue-600",
    },
    {
      label: "Shipped",
      status: "shipped",
      count: counts.totalShipped,
      icon: BsBoxSeam,
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-600",
    },
    {
      label: "Out for delivery",
      status: "outForDelivery",
      count: counts.totalOutForDelivery,
      icon: CiDeliveryTruck,
      bgColor: "bg-violet-100",
      borderColor: "border-violet-300",
      textColor: "text-violet-600",
    },
    {
      label: "Delivered",
      status: "delivered",
      count: counts.totalDelivered,
      icon: FaCheckCircle,
      bgColor: "bg-pink-100",
      borderColor: "border-pink-300",
      textColor: "text-pink-600", 
    },
    {
      label: "Cancelled",
      status: "cancelled",
      count: counts.totalCancelled,
      icon: GiCancel,
      bgColor: "bg-teal-100",
      borderColor: "border-teal-300",
      textColor: "text-teal-600",
    },
    {
      label: "Returned",
      status: "",
      path:"/admin/return-orders",
      count: counts.totalReturned,
      icon: FaUndoAlt,
      bgColor: "bg-lime-100",
      borderColor: "border-lime-300",
      textColor: "text-lime-600",
    },
  ];

  if (error) return <p className="text-red-500">{error}</p>;

  
  return (
    <section className=''>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full px-2 md:px-6 xl:px-10">
          <DashboardCard
            icon={AiOutlineProduct}
            label="Total Products"
            count={counts.totalProducts}
            bgColor="bg-[#C8FFCD]"
            borderColor="border-green-400"
            textColor="text-green-600"
            to="/admin/product"
          />

          <DashboardCard
            icon={MdOutlineCategory}
            label="Total Categories"
            count={counts.totalCategories}
            bgColor="bg-pink-100"
            borderColor="border-pink-400"
            textColor="text-pink-600"
            to="/admin/category"
          />

          <DashboardCard
            icon={MdOutlinePeopleAlt}
            label="Total Staffs | Customers"
            count={`${counts.totalStaffs} | ${counts.totalCustomers} `}
            bgColor="bg-blue-100"
            borderColor="border-blue-400"
            textColor="text-blue-600"
            to="/admin/staff"
          />

          <DashboardCard
            icon={MdOutlinePeopleAlt}
            label="Total Pincodes"
            count={counts.totalPincodes}
            bgColor="bg-yellow-100"
            borderColor="border-yellow-400"
            textColor="text-yellow-600"
            to="/pincode"
          />  
      </div>

      <div className='pt-5'>
        <p className='text-lg xl:text-xl font-medium text-primary pl-2'>Product Process :</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 px-4 xl:px-8 py-4">
          {productCards.map((card, index) => (
            <div
              key={index}
              onClick={() =>
                card.path
                  ? navigate(card.path)
                  : navigate("/admin/process", {
                      state: { status: card.status },
                    })
              }
              className="
                cursor-pointer
                transition-all
                duration-300
                hover:shadow-2xl
                rounded-2xl
              "
            >
              <ProductServiceDashCard
                icon={card.icon}
                label={card.label}
                count={card.count}
                bgColor={card.bgColor}
                borderColor={card.borderColor}
                textColor={card.textColor}
              />
            </div>
          ))}
        </div>     
      </div>

      <div className='pt-5'>
        <p className='text-lg xl:text-xl font-medium text-primary pl-2'>Enquiry :</p>
        <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-5 gap-5 w-full px-2 md:px-6 xl:px-10 py-4">
          <ProductServiceDashCard
            icon={BiCommentDetail }
            label="Contact Enquiries"
            count={counts.totalEnquiries}
            bgColor="bg-[#C8FFCD]"
            borderColor="border-green-300"
            textColor="text-green-600"
            path="/enquiries"
          />

          <ProductServiceDashCard
            icon={LuBoxes }
            label="Bulk Orders"
            count={counts.totalBulkOrderEnquiries}
            bgColor="bg-blue-100"
            borderColor="border-blue-300"
            textColor="text-blue-600"
            path="/bulk-orders"
          />
        </div>
      </div>


    </section>
  )
}
