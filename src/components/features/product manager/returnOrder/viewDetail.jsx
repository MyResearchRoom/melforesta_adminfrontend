import React, { useEffect, useState } from 'react'
import { MdKeyboardBackspace } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import formatPaymentMethod from '../../../common/fomatePaymentMethod';
import capitalizeFirstLetter from '../../../common/capitalizeFirstLetter';
import TableComponent from '../../../common/TableComponent';
import ReasonModal from '../../../../model/product-manager/reasonModel';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DevicePhotosModal from '../../../../model/product-manager/DevicePhotosModal';
import AssignPickupModal from '../../../../model/product-manager/pickupAssign';
import axios from 'axios';
const Base_Url = import.meta.env.VITE_BASE_URL;
function formatNumber(value) {
  const num = Number(value);
  return num % 1 === 0 ? num : num.toFixed(2);
}

export default function ReturnOrderViewDetail() {
  const {id} =useParams();
  const [returnProduct,setRetunrProduct]=useState(null);
  const navigate=useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 

  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);

  const [modalPhotoOpen, setModalPhotoOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [selectedMedia,setSelectedMedia]=useState([]);

  const [pickupPerson, setPickupPerson] = useState(null);

 useEffect(() => {
    const fetchProductDetails = async () => {
    if (!id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${Base_Url}/api/returnProductOrder/getReturnedProductById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setRetunrProduct(res.data.data);    
        if (res.data.data.pickupPersonId) {
          fetchPickupPerson(res.data.data.pickupPersonId, token);
        }
      } else {
        toast.error(res.data.message || "Failed to fetch product details");
      }
    } catch (err) {
      console.error("❌ Fetch return order product error:", err);
      toast.error(err.response?.data?.message || "Failed to load product details of cancel order");
    }
  };

  fetchProductDetails();
  }, [id]);

  const fetchPickupPerson = async (personId, token) => {
    try {
      const res = await axios.get(`${Base_Url}/api/auth/getStaffDetails/${personId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPickupPerson(res.data.data);      
      } else {
        toast.error(res.data.message || "Failed to fetch pickup person details");
      }
    } catch (err) {
      console.error("❌ Fetch pickup person error:", err);
      toast.error(err.response?.data?.message || "Failed to load pickup person details");
    }
  };

  const columns = [
          {
            label: "Product Name",
            field: "productName",
            headerClassName: "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
            className: "text-sm xl:text-base text-left pl-2 border-l border-[#d3cccc]",
            render: (row) => (
              <div className="flex flex-row space-x-4 items-center">
                <img 
                  src={row.product.images?.[0].image} 
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

  const ProductCard = ({ item }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex gap-3">
        <img
          src={item.product.images?.[0].image} 
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

    const handleAccept = () => {
      setModalType("accepted");
      setModalOpen(true);
    };
  
    const handleReject = () => {
      setModalType("rejected");
      setModalOpen(true);
    };
  
    const handleModalSubmit = async(reason) => {
      setModalOpen(false);

      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `${Base_Url}/api/returnProductOrder/updateReturnStatus/${id}`,
          {status:modalType, returnActionReason:reason},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success(res.data.message || `Return order ${modalType}`);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to update");
      }
     
    };

    const handlePickUpStatusChange = async(status) =>{
      if(!status){
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `${Base_Url}/api/returnProductOrder/updatePickupStatus/${id}`,
          {status},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success(res.data.message || `Return order status is ${status}`);
      } catch (err) 
      {
        console.error(err);
        toast.error(err.response?.data?.message || `Failed to update status to ${status}`);
      }

    }

    const handleRefundPayment=async()=>{
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${Base_Url}/api/returnProductOrder/refundReturnedProductOrder/${id}`,
        {refundStatus:"refunded"},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Refund initiated successfully..."); 
      } else {
        toast.error(res.data.message || "Failed to refund of return orders");
      }
    } catch (err) {
      console.error("❌ Fetch refund of return order :", err);
      toast.error(err.response?.data?.message || "Failed refund of return order");
    }
    }

  if (!returnProduct) {
    return <div className="text-center text-red-500 mt-10">Loading order details</div>;
  }

  return (
  <section className="px-4 py-6 bg-gray-100 min-h-screen">

    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate(-1)}>
      <MdKeyboardBackspace className="text-xl" />
      <h2 className="font-bold text-lg md:text-xl">Return Order Details</h2>
    </div>

    <div className="mt-5 bg-white shadow-md rounded-lg p-4 border">

      <div className="flex justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Order ID: <span className="text-gray-700">{returnProduct.orderId}</span></p>
          <p className="text-sm font-medium">Return Reason: <span className="text-gray-700">{returnProduct.reason}</span></p>

          <div className='flex flex-row items-center space-x-1'>
            <p className="font-medium">Return Status :{" "}</p>
            <span
              className={`px-3 py-1 mt-1 inline-block rounded-md font-medium shadow border 
              ${returnProduct.returnStatus === "pending"
                ? "border-yellow-500 text-yellow-600 bg-yellow-50"
                : returnProduct.returnStatus === "accepted"
                ? "border-green-500 text-green-600 bg-green-50"
                : returnProduct.returnStatus === "rejected"
                ? "border-red-500 text-red-600 bg-red-50"
                : "border-gray-500 text-gray-600 bg-gray-100"
              }`}
            >
              {capitalizeFirstLetter(returnProduct.returnStatus)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 ml-auto">
          {returnProduct.returnStatus === "pending" ? (
            <>
              <button
                onClick={handleAccept}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <FaCheck /> Accept
              </button>

              <button
                onClick={handleReject}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                <FaTimes /> Reject
              </button>
            </>
          ) : returnProduct.returnStatus === "accepted" &&
            returnProduct.pickupStatus === "pending" &&
            returnProduct.pickupPersonId === null ? (
            <button
              onClick={() => setIsPickupModalOpen(true)}
              className="bg-primary hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Assign Pickup
            </button>
          ) : returnProduct.returnStatus === "accepted" &&
            returnProduct.pickupStatus === "pending" &&
            returnProduct.pickupPersonId !== null ? (
            <button
              onClick={() => handlePickUpStatusChange("pickedUp")}
              className="bg-primary px-4 py-2 text-white rounded-lg shadow"
            >
              Mark as PickedUp
            </button>
          ) : returnProduct.returnStatus === "accepted" &&
            returnProduct.pickupStatus === "pickedUp" ? (
            <button
              onClick={() => handlePickUpStatusChange("completed")}
              className="bg-primary px-4 py-2 text-white rounded-lg shadow"
            >
              Pickup Completed
            </button>
          ) : returnProduct.returnStatus === "accepted" &&
            returnProduct.refundStatus === "pending" ? (
            <button
              onClick={handleRefundPayment}
              className="bg-primary px-4 py-2 text-white rounded-lg shadow"
            >
              Initiate Refund
            </button>
          ) : (
            <div className="px-4 py-2 bg-green-100 border border-green-400 text-green-600 rounded-md font-medium">
              Order Completed
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Customer, Payment & Media Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

      {/* Customer Detail */}
      <div className="bg-white shadow border rounded-lg p-4">
        <p className="text-primary font-bold mb-3">Customer Detail</p>

        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {capitalizeFirstLetter(returnProduct.user.name)}</p>
          <p><span className="font-medium">Mobile:</span> {returnProduct.user.mobileNumber || "-"}</p>
          <p><span className="font-medium">Email:</span> {returnProduct.user.email || "-"}</p>
          <p className="break-words"><span className="font-medium">Address:</span> {`${returnProduct.order.address.buildingBlock.toUpperCase()} - ${returnProduct.order.address.flatNo}, ${returnProduct.order.address.buildingName}, ${returnProduct.order.address.landmark || ""}, ${returnProduct.order.address.streetName || ""}, ${returnProduct.order.address.city}, ${returnProduct.order.address.state}, ${returnProduct.order.address.pincode}`}</p>
        </div>
      </div>

      {/* Payment + Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white shadow border rounded-lg p-4">
          <p className="text-primary font-bold mb-3">Payment Detail</p>

          <p className="text-sm">Payment Mode: {formatPaymentMethod(returnProduct.order.paymentMethod)}</p>
          <p className="text-sm font-medium">
            Refund Status:
            <span className={`ml-2 ${returnProduct.refundStatus === "pending" ? "text-yellow-600" : "text-green-600"}`}>
              {returnProduct.refundStatus === "pending" ? "Not Initiated" : "Refund Completed"}
            </span>
          </p>
          <p className="text-sm font-medium">Refund Amount: ₹{formatNumber(returnProduct.refundAmount)}</p>
        </div>

        <div className="bg-white shadow border rounded-lg p-4 flex flex-col justify-between">
          <p className="text-primary font-bold mb-3">Uploaded Media</p>

          {returnProduct.images.length > 0 ? (
            <button
              onClick={() => {
                setModalPhotoOpen(true);
                setSelectedMedia(returnProduct.images);
              }}
              className="bg-primary hover:bg-primary-dark text-white py-2 rounded-md"
            >
              View Media
            </button>
          ) : (
            <p className="text-center text-gray-500 text-sm">No Media Available</p>
          )}
        </div>

      </div>
    </div>

    {/* Table + Pickup Section */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

      {/* Product Table */}
      <div className="md:hidden">
        <ProductCard
          item={returnProduct.orderItem}
        />
      </div>
      <div className="hidden md:block md:col-span-2 bg-white p-4 shadow border rounded-lg">
        <TableComponent columns={columns} data={[returnProduct.orderItem]} headerBg="bg-gray-50" />
      </div>

      {/* Pickup Info */}
      <div className="bg-white border shadow rounded-lg p-4">
        <p className="text-primary font-bold mb-3">Pickup Detail</p>

        {returnProduct.pickupPersonId === null ? (
          <p className="text-sm">Pickup not assigned yet.</p>
        ) : pickupPerson ? (
          <div className="space-y-1 text-sm">
            <p>Date: {new Date(returnProduct.createdAt).toLocaleDateString()} | {returnProduct.pickUpTime}</p>
            <p>Name: {capitalizeFirstLetter(pickupPerson.name)}</p>
            <p>Mobile: {pickupPerson.mobileNumber}</p>
            <p>Email: {pickupPerson.email}</p>

            <p className="font-medium">
              Pickup Status:
              <span className={`ml-2 font-semibold
                ${returnProduct.pickupStatus === "pending"
                  ? "text-yellow-600"
                  : returnProduct.pickupStatus === "pickedUp"
                  ? "text-blue-600"
                  : "text-green-600"
                }`}>
                {capitalizeFirstLetter(returnProduct.pickupStatus)}
              </span>
            </p>
          </div>
        ) : (
          <p>Loading Pickup Person...</p>
        )}
      </div>

    </div>

    {/* Modals */}
    <ReasonModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} type={modalType} />
    <DevicePhotosModal isOpen={modalPhotoOpen} onClose={() => setModalPhotoOpen(false)} device={{ issue_photos: selectedMedia }} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
    <AssignPickupModal isOpen={isPickupModalOpen} onClose={() => setIsPickupModalOpen(false)} returnId={id} />

  </section>
  );

}
