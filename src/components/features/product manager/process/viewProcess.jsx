import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import TableComponent from "../../../common/TableComponent";
import capitalizeFirstLetter from "../../../common/capitalizeFirstLetter";
import formatPaymentMethod from "../../../common/fomatePaymentMethod";
import ShipmentFormModal from "../../../common/product manager/shipformModal";
import { toast } from "react-toastify";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function ViewProcess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${Base_Url}/api/productOrder/getOrderDetails/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setOrderData(res.data.data);
        } else {
          toast.error(res.data.message || "Failed to fetch order details");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to fetch order details");
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (!orderData) return <p className="text-yellow-600">Loading...</p>;

  const productDetails = orderData.items.map((item) => ({
    productName: item.product?.productName || item.name,
    category:item.product?.category?.name || "",
    qty: item.quantity,
    price: item.price,
    discount: item.discount,
    finalPrice: item.price * item.quantity,
    image: item.product?.images?.[0] || "",
  }));

  const columns = [
    {
      label: "Product",
      field: "productName",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={row.productName} className="w-12 h-12 rounded-md border" />
          <div className="flex flex-col gap-1">
            <p className="font-medium text-xs xl:text-sm capitalize">
              {capitalizeFirstLetter(row.productName)} 
            </p>
            <p className="font-normal text-xs xl:text-sm capitalize">
             {row.category}
            </p>
          </div>
          
        </div>
      ),
    },
    { label: "Qty", 
      field: "qty",
      headerClassName: "text-left pl-2",
      className: "text-sm xl:text-base text-left pl-2",
    },
    { label: "Price", 
      field: "price", render: (r) => `₹${Math.round(r.price)}`,
      headerClassName: "text-left pl-2",
      className: "text-sm xl:text-base text-left pl-2",
    },
    { label: "Discount", 
      field: "discount", render: (r) => `₹${Math.round(r.discount)}`,
      headerClassName: "text-left pl-2",
      className: "text-sm xl:text-base text-left pl-2",
    },
    { label: "Total", 
      field: "finalPrice", render: (r) => `₹${r.finalPrice}`,
      headerClassName: "text-left pl-2",
      className: "text-sm xl:text-base text-left pl-2", 
    },
  ];
 
  const stages = ["newRequest", "processing", "shipped", "outForDelivery", "delivered"];
  const currentIndex = stages.indexOf(orderData.status);
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  const currentStage = stages.indexOf(orderData.status);

  const updateStatus = (newStatus) => {
    setOrderData((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handleStatusChange = async () => {
    if ((orderData.paymentStatus ==="pending" || orderData.paymentStatus ==="failed") && orderData.paymentMethod !== "cod" ){
      toast.error("This order cannot be processed because the payment has not been completed yet.");
      return;
    }
    if (!nextStage) return;

    try {
      if (nextStage === "shipped") {
        setIsShipmentModalOpen(true);
        return;
      }

      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${Base_Url}/api/productOrder/changeOrderStatus/${orderData.orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const newMessage = res.data.message;
        toast.success(newMessage);

        const newStatus = newMessage.split(" ").pop();
        console.log("newStatus",newStatus);
        
        updateStatus(newStatus);

        if (newStatus === "delivered") {
          setTimeout(() => navigate("/product-manager/order"), 5000);
        }
      } else {
        toast.error(res.data.message || "Failed to change order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleShipmentSubmit = async (shipmentData) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${Base_Url}/api/productOrder/submitShippingDetails/${orderData.orderId}`,
      shipmentData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.data.success) {
      updateStatus("shipped"); 
      toast.success(res.data.message || "Shipment details submitted successfully");
    } else {
      toast.error(res.data.message || "Failed to submit shipment details");
    }
  } catch (err) 
  {
    console.error(err);
    toast.error(err.response?.data?.message || "Something went wrong");
  } finally 
  {
    setIsShipmentModalOpen(false);
  }
  };

  const ProductCard = ({ item }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex gap-3">
        <img
          src={item.image}
          alt={item.productName}
          className="w-16 h-16 rounded-lg border object-cover flex-shrink-0"
        />
  
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 break-words">
            {capitalizeFirstLetter(item.productName)}
          </h3>
  
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Qty</span>
              <span>{item.qty}</span>
            </div>
  
            <div className="flex justify-between">
              <span className="text-gray-500">Price</span>
              <span>₹{Math.round(item.price)}</span>
            </div>
  
            <div className="flex justify-between">
              <span className="text-gray-500">Discount</span>
              <span>₹{Math.round(item.discount)}</span>
            </div>
  
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Total</span>
              <span>₹{item.finalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="space-y-6 px-3 md:px-5 py-4">
    <div className='flex flex-col md:flex-row justify-between items-start'>
      <div
        className="flex items-center gap-2 text-base font-medium cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <IoArrowBack className="text-lg" />
        <p>Deatils</p>
      </div>
      { orderData.status !=="cancelled" && (
        nextStage && (
          <div className="flex flex-row space-x-2 items-center text-sm xl:text-base font-medium">
            <p>Update Status : </p>
            <button 
              onClick={handleStatusChange} 
              className="border bg-custom-gradient1 hover:bg-custom-gradient1-hover text-white rounded-md px-4 py-2"
            >
              Mark as {nextStage.replace(/([A-Z])/g, " $1") .replace(/^./, (str) => str.toUpperCase())}
            </button>
          </div>
      ))}

    </div>

      <div className="bg-white shadow rounded-lg border p-2 md:p-5">
        <div className="flex justify-between items-center gap-3">
          <div>
            <p className="text-base lg:text-lg font-semibold">Order #{orderData.orderId}</p>
            <p className="text-gray-600 text-sm lg:text-base">Placed on: {new Date(orderData.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm lg:text-base font-semibold">Payment</p>
            <p className="text-sm lg:text-base text-gray-700">{formatPaymentMethod(orderData.paymentMethod)}</p>
          </div>
        </div>

        {orderData.status!=="cancelled" &&

        <div className="mt-5 overflow-x-auto">
          <div className="flex min-w-max">
          {stages.map((stage, index) => (
            <div key={stage} className="flex flex-col items-start space-x-0">
              <div className="flex items-center justify-start gap-0">
                <div
                  className={`w-4 h-4 rounded-full border-2 
                  ${index <= currentStage ? "bg-green-400 border-green-500" : "bg-gray-300 border-gray-400"}`}
                />
                {index < stages.length - 1 && (
                <div
                  className={`h-0.5 w-24 mx-0
                  ${index < currentStage ? "bg-green-400" : "bg-gray-300"}`}
                />
                )}
              </div>

              <p className={`text-xs lg:text-sm mt-2 capitalize text-start w-24
                ${index <= currentStage ? "text-green-500 font-medium" : "text-gray-600"}`}
              >
                {stage.replace(/([A-Z])/g, " $1")}
              </p>
            </div>
          ))}
          </div>
        </div>

        }


        <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-3">
          <p className="font-medium text-gray-700">
            Current Status:{" "}
            <span 
              className={`${
                orderData.status !== "cancelled" ? "text-primary" : "text-red-700"
              }`}
            >{capitalizeFirstLetter(orderData.status)} on {new Date(orderData.deliveryDate).toLocaleString()}</span>
          </p>

          <p className="text-gray-700 text-sm lg:text-base font-medium">
            Estimated Delivery: {orderData.estimatedDeliveryDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
    
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white border rounded-lg shadow p-4">
            <p className="text-base lg:text-lg font-semibold mb-3">Items in this Order</p>
            <div className="hidden lg:block">
              <TableComponent 
                columns={columns} 
                data={productDetails} 
                headerBg="bg-gray-100" 
              />
            </div>
            <div className="lg:hidden space-y-4">
              {productDetails.map((item, index) => (
                <ProductCard
                  key={index}
                  item={item}
                />
              ))}
            </div>
            
          </div>

          <div className="bg-white border rounded-lg shadow p-4 w-full lg:w-80 lg:ml-auto">
            <p className="text-sm lg:text-base font-semibold mb-3">Order Summary</p>
            <div className="space-y-2 text-xs lg:text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{Number(orderData.subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>- ₹{Number(orderData.discountAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Coupon Discount:</span>
                <span>- ₹{Number(orderData.couponAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST:</span>
                <span>+ ₹{Number(orderData.gstAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Handling Charge:</span>
                <span>+ ₹{Number(orderData.handlingCharges)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-sm lg:text-base">
                <span>Total:</span>
                <span className="text-green-700">₹{Number(orderData.totalAmount)}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-4">

          <div className="bg-white border rounded-lg shadow p-4">
            <p className="text-sm lg:text-base font-semibold mb-2">Customer Details</p>
            <p className="text-xs lg:text-sm">Name: {orderData.user.name}</p>
            <p className="text-xs lg:text-sm">Mobile: {orderData.user.mobileNumber}</p>
            <p className="text-xs lg:text-sm">Email: {orderData.user.email}</p>
          </div>

          <div className="bg-white border rounded-lg shadow p-4">
            <p className="text-sm lg:text-base font-semibold mb-2">Delivery Address</p>
            <p className="text-xs lg:text-sm">
              {orderData.address.flatNo}, {orderData.address.buildingName},{" "}
              {orderData.address.streetName}, {orderData.address.city},{" "}
              {orderData.address.state} - {orderData.address.pincode}
            </p>
          </div>

          {orderData.shipment && (
            <div className="bg-white border rounded-lg shadow p-4">
              <p className="text-sm lg:text-base font-semibold mb-2">Shipment</p>
              {orderData.shipment.deliveryType === "courier" ?
              (
                <>
                  <p className="text-xs lg:text-sm">
                    Courier company :{" "}
                    <span className="">
                      {orderData.shipment.courierCompanyName}
                    </span>
                  </p>
                  <p className="text-xs lg:text-sm">
                    Tracking:{" "}
                    <a href={orderData.shipment.trackingId} className="text-blue-600 underline">
                      {orderData.shipment.trackingId}
                    </a>
                  </p>
                </>
              ) : orderData.shipment.deliveryType === "manual"  ? (
                <>
                  <p className="text-xs lg:text-sm ">
                    Contact person name :{" "}
                    <span className="capitalize">
                      {orderData.shipment.deliveryPersonName}
                    </span>
                  </p>
                  <p className="text-xs lg:text-sm">
                    Contact person number :{" "}
                    <span className="">
                      {orderData.shipment.deliveryPersonContact}
                    </span>
                  </p>
                </>
              ) :(
                <>
                  <p className="text-xs lg:text-sm">
                    Courier company :{" "}
                    <span className="">
                      {orderData.shipment.courierCompanyName}
                    </span>
                  </p>
                  <p className="text-xs lg:text-sm">
                    Tracking:{" "}
                    <a href={orderData.shipment.trackingId} className="text-blue-600 underline">
                      {orderData.shipment.trackingId}
                    </a>
                  </p>
                </>
              )}
              
              <p className="text-xs lg:text-sm">
                Expected Delivery:{" "}
                {new Date(orderData.shipment.estimatedDeliveryDate).toLocaleDateString()}
              </p>
            </div>
          )}

          
        </div>
      </div>

      <ShipmentFormModal
        isOpen={isShipmentModalOpen}
        onClose={() => setIsShipmentModalOpen(false)}
        onSubmit={handleShipmentSubmit} 
        order={orderData}
      />
    </section>
  );
}
