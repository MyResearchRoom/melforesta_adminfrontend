import DashboardCard from "../../../common/Admin/dashboardcart";
import { AiOutlineProduct } from "react-icons/ai";
import {BiSolidOffer } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaCheckCircle, FaUndoAlt } from "react-icons/fa";
import { LuCircleDashed } from "react-icons/lu";
import { MdFiberNew, MdOutlineCategory, MdSell } from "react-icons/md";
import ProductServiceDashCard from '../../../common/Admin/productservicedashcart'
import { useDispatch, useSelector } from "react-redux";
import { fetchCounts } from "../../../../redux/actions/countAction";
import { useEffect } from "react";
import { GiCancel } from "react-icons/gi";
import { Path } from "@react-pdf/renderer";
import { useNavigate } from "react-router-dom";
export default function Section2()
{
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
        
        count: counts.totalCancelledProcess,
        icon: GiCancel,
        bgColor: "bg-teal-100",
        borderColor: "border-teal-300",
        textColor: "text-teal-600",
      },
      {
        label: "Returned",
        status: "",
        path:"/product-manager/return-order",
        count: counts.totalReturned,
        icon: FaUndoAlt,
        bgColor: "bg-lime-100",
        borderColor: "border-lime-300",
        textColor: "text-lime-600",
      },
    ];

  if (error) return <p className="text-red-500">{error}</p>;

    return(
      <section className="py-10 px-5 space-y-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full px-2 md:px-6 xl:px-10">

          <DashboardCard
            icon={AiOutlineProduct}
            label="All Products"
            count={counts.totalProducts}
            bgColor="bg-[#C8FFCD]"
            borderColor="border-green-200"
            textColor="text-green-600"
            to="/product-manager/product"
          />
          <DashboardCard
            icon={MdOutlineCategory }
            label="Categories"
            count={counts.totalCategories}
            bgColor="bg-blue-100"
            borderColor="border-blue-200"
            textColor="text-blue-600"
            to="/product-manager/category"
          />
          <DashboardCard
            icon={GiCancel }
            label="Cancel orders"
            count={counts.totalCancelled}
            bgColor="bg-[#C8FFCD]"
            borderColor="border-green-300"
            textColor="text-green-600"
            to="/product-manager/cancelled-order"
          />
          <DashboardCard
            icon={FaUndoAlt}
            label="Return orders"
            count={counts.totalReturned}
            bgColor="bg-blue-100"
            borderColor="border-blue-300"
            textColor="text-blue-600"
            to="/product-manager/return-order"
          />
        </div>

        <div className='rounded-md pt-2'>
            <p className="text-lg xl:text-xl font-medium text-primary">Products Process :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-5 gap-5 w-full px-2 md:px-4 xl:px-5 py-4">
              {productCards.map((card, index) => (
                          <div
                            key={index}
                            // onClick={() =>
                            //   navigate("/product-manager/order", {
                            //     state: { status: card.status },
                            //   })
                            // }

                            onClick={() =>
                              card.path
                                ? navigate(card.path)
                                : navigate("/product-manager/order", {
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
            {/* <div className="flex flex-row space-x-5 w-full px-6 py-4">
                
            </div> */}
            
        </div>

      </section>
    );
}