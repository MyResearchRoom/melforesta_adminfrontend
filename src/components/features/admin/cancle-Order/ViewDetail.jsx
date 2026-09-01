import React, { useEffect, useState } from 'react'
import { MdKeyboardBackspace } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import TableComponent from '../../../common/TableComponent';
import capitalizeFirstLetter from '../../../common/capitalizeFirstLetter';
import formatPaymentMethod from '../../../common/fomatePaymentMethod';
import axios from 'axios';
const Base_Url = import.meta.env.VITE_BASE_URL;
function formatNumber(value) {
  const num = Number(value);
  return num % 1 === 0 ? num : num.toFixed(2);
}

export default function AdminCancelOrderViewDetail() {
    const {id} =useParams();
    const navigate=useNavigate();
    const [currentOrder, setCurrentOrder] = useState(null);

    useEffect(() => {
    const fetchProductDetails = async () => {
    if (!id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${Base_Url}/api/cancelProductOrder/getCancelledProductOrder/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setCurrentOrder(res.data.data);    
      } else {
        toast.error(res.data.message || "Failed to fetch product details");
      }
    } catch (err) {
      console.error("❌ Fetch cancel order product error:", err);
      toast.error(err.response?.data?.message || "Failed to load product details of cancel order");
    }
  };

  fetchProductDetails();
    }, [id]);
    
    const columns = [
        {
          label: "Product Name",
          field: "productName",
          headerClassName: "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
          className: "text-sm xl:text-base text-left pl-2 border-l border-[#d3cccc]",
          render: (row) => (
            <div className="flex flex-row space-x-4 items-center">
              <img 
                src={row.product.images?.[0]} 
                alt={row.product.productName} 
                className="w-20 h-16 rounded-md" 
              />
              <p>{capitalizeFirstLetter(row.product.productName)}</p>
            </div>
          ),
        },
        { 
          label: "Quantity", 
          field: "quantity", 
          headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]", 
          className: "lg:text-left md:text-center text-sm xl:text-base text-left pl-2" 
        },
        { 
          label: "Price", 
          field: "price",
          headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]", 
          className: "text-sm xl:text-base text-left pl-2", 
          render: (row) => `₹${formatNumber(row.price)}` 
        },
        { 
          label: "Discount Price", 
          field: "discountPrice", 
          headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]", 
          className: "lg:text-left md::text-center text-sm xl:text-base text-left pl-2", 
          render: (row) => `₹${formatNumber(row.discount)}` 
        },
        { 
          label: "Final Price", 
          field: "finalPrice", 
          headerClassName: "border-t border-b border-r border-[#d3cccc] text-left", 
          className: "border-[#d3cccc] border-r", 
          render: (row) => `₹${formatNumber(row.totalPrice)}` },
    ];


    const handleRefundPayment=async(id)=>{
      if (!id){
        toast.error("Order id is required");
        return;
      } 
      try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${Base_Url}/api/cancelProductOrder/refundCancelledProductOrder/${id}`,
        {status:"refunded"},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Refund initiated successfully..."); 
      } else {
        toast.error(res.data.message || "Failed to refund of cancel orders");
      }
      } catch (err) {
        console.error("❌ Fetch cancel order refund:", err);
        toast.error(err.response?.data?.message || "Failed to refund of cancel order");
      }
    }


    const ProductCard = ({ item }) => (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex gap-3">
          <img
            src={item.product.images?.[0]}
            alt={item.product.productName}
            className="w-20 h-20 rounded-lg object-cover border"
          />

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 break-words">
              {capitalizeFirstLetter(
                item.product.productName
              )}
            </h3>

            <div className="grid grid-cols-2 gap-y-3 mt-3 text-sm">
              <div>
                <p className="text-gray-500">
                  Quantity
                </p>
                <p className="font-medium">
                  {item.quantity}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Price
                </p>
                <p className="font-medium">
                  ₹{formatNumber(item.price)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Discount
                </p>
                <p className="font-medium">
                  ₹{formatNumber(item.discount)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Final Price
                </p>
                <p className="font-semibold text-green-600">
                  ₹{formatNumber(item.totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (!currentOrder) {
      return <div className="text-center text-red-500 mt-10">Product not found</div>;
    }

  return (
  <section className="px-2 pr-4 md:px-6 py-3 md:py-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

  <div className='flex flex-row justify-between items-start pb-0 md:pb-5'>
    <div
      className="flex items-center gap-2 cursor-pointer mb-6"
      onClick={() => navigate(-1)}
    >
      <MdKeyboardBackspace className="text-xl text-gray-700" />
      <h2 className="text-lg lg:text-xl font-bold text-gray-700">
        Cancel Order Details
      </h2>
    </div>

    {currentOrder.order.paymentMethod !=="cod" &&
    <div className="flex justify-end ml-auto">
      <button
        onClick={() => {
          if (currentOrder.status !== "refunded") {
            handleRefundPayment(currentOrder.id);
          }
        }}
        disabled={currentOrder.status === "refunded"}
        className={`px-5 py-2 rounded-lg font-medium text-sm lg:text-base shadow-md transition-all ${
          currentOrder.status === "refunded"
            ? "bg-gray-300 text-gray-900 cursor-not-allowed"
            : "bg-custom-gradient1 text-white hover:bg-custom-gradient1-hover"
        }`}
      >
        {currentOrder.status === "refunded"
          ? "Refund Completed"
          : "Initiate Refund"}
      </button>
    </div>
    }
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="space-y-3 bg-white/90 shadow-lg rounded-md">
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2 p-4">
          Order Summary 
        </h3>
        <div className='px-4 pb-4 md:pb-0 space-y-3 text-xs lg:text-sm'>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Order ID:</span> {currentOrder.orderId}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Reason:</span> {currentOrder.reason}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Current Status:</span>{" "}
            <span className={`px-3 py-1 rounded-md font-semibold border ${currentOrder.status==="pending"? "border-yellow-500 text-yellow-600 bg-yellow-50" : "border-green-500 text-green-500 bg-green-50"}`}>
              {capitalizeFirstLetter(currentOrder.status)}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-3 pb-4 md:pb-0 bg-white/90 shadow-lg rounded-md">
        <h3 className="text-base lg:text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 p-4">
          Customer Details
        </h3>
        <div className='px-4 space-y-3 text-xs lg:text-sm'>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Name :</span> {capitalizeFirstLetter(currentOrder.user.name)}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Mobile :</span> {currentOrder.user.mobileNumber}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Email :</span> {currentOrder.user.email}
          </p>
        </div>
      </div>

      <div className="space-y-3 bg-white/90 shadow-lg rounded-md">
        <h3 className="text-base lg:text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 p-4">
          Payment Details
        </h3>
        <div className='px-4 pb-4 space-y-3 text-xs lg:text-sm'>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Method :</span> {formatPaymentMethod(currentOrder.order.paymentMethod)}
          </p>
          <p className="text-gray-600">
            <span className="font-medium text-gray-800">Refund Amount :</span> ₹{formatNumber(currentOrder.refundAmount)}
          </p>

          <div className="mt-3 flex flex-row items-center space-x-1">
            <p className="text-gray-800 font-medium mb-1">Refund Status :</p>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 lg:h-3 lg:w-3 rounded-full ${
                currentOrder.status === "pending" ? "bg-yellow-400" : "bg-green-500"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  currentOrder.status === "pending" ? "text-yellow-600" : "text-green-600"
                }`}
              >
                {currentOrder.status === "pending"
                ? "Not Initiated"
                : "Refund Completed"}
              </span>
            </div>
          </div>
        </div>
      </div>
  </div>

  <div className="mt-6 bg-white shadow-md rounded-xl border border-gray-200 p-5">
    <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-4">
      Product Details
    </h3>


    <div className="hidden lg:block">  
      <TableComponent
        columns={columns}
        data={[currentOrder.orderItem]}
        headerBg="bg-gray-100"
      />
    </div>
    <div className="lg:hidden">
      <ProductCard
        item={currentOrder.orderItem}
      />
    </div>
  </div>
  </section>

  )
}
