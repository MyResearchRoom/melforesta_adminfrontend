// import React, { useState, useEffect } from "react";
// import capitalizeFirstLetter from "../../components/common/capitalizeFirstLetter";
// import { Logo } from "../../assets/common";
// import { X } from "lucide-react";
// import { pdf } from "@react-pdf/renderer";
// import InvoicePDF from "../../model/admin/invoicePdf";
// import axios from "axios";

// const Base_Url = import.meta.env.VITE_BASE_URL;

// function formatNumber(value) {
//   return Math.round(Number(value || 0)).toLocaleString();
// }

// function buildAddress(address = {}) {
//   return [
//     address.flatNo ? `Flat No. ${address.flatNo}` : "",
//     address.buildingName || "",
//     address.streetName || "",
//     address.city || "",
//     address.state && address.pincode
//       ? `${address.state} - ${address.pincode}`
//       : address.state || address.pincode || "",
//   ]
//     .filter(Boolean)
//     .join(", ");
// }

// export default function InvoiceModel({ order, onClose }) {
//   const [orderData, setOrderData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [fetchError, setFetchError] = useState(null);
//   const [isDownloading, setIsDownloading] = useState(false);

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       if (!order?.orderId) return;

//       try {
//         setIsLoading(true);
//         setFetchError(null);
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${Base_Url}/api/productOrder/getOrderDetails/${order.orderId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (res.data.success) {
//           setOrderData(res.data.data);
//         } else {
//           setFetchError(res.data.message || "Failed to fetch order details");
//         }
//       } catch (err) {
//         console.error(err);
//         setFetchError(
//           err.response?.data?.message || "Failed to fetch order details"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchOrderDetails();
//   }, [order?.orderId]);

//   if (!order) return null;

//   const address = orderData ? buildAddress(orderData.address) : "";

//   const handleDownloadInvoice = async () => {
//     if (!orderData) return;
//     try {
//       setIsDownloading(true);
//       const invoiceBlob = await pdf(<InvoicePDF orderData={orderData} />).toBlob();
//       const invoiceUrl = URL.createObjectURL(invoiceBlob);
//       const downloadLink = document.createElement("a");
//       downloadLink.href = invoiceUrl;
//       downloadLink.download = `Invoice-${orderData.orderId}.pdf`;
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       downloadLink.remove();
//       URL.revokeObjectURL(invoiceUrl);
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-1 right-2 w-8 h-8 z-50 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition group"
//         >
//           <X size={18} className="text-gray-600 group-hover:text-red-600" />
//         </button>

//         {/* HEADER */}
//         <div className="relative overflow-hidden bg-[#FFFDF8] p-6 md:p-8 text-[#8E5D4A]">
//           <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
//             <div>
//               <p className="uppercase tracking-[4px] text-xs md:text-sm text-[#8E5D4A] font-medium">
//                 Melforesta Invoice
//               </p>
//               <h1 className="text-3xl md:text-4xl font-bold mt-2">Payment Summary</h1>
//               <p className="text-sm md:text-base mt-3 text-[#8E5D4A]">
//                 Natural Honey • Pure Wellness • Trusted Delivery
//               </p>
//             </div>
//             <div className="flex flex-col items-start md:items-end">
//               <div className="bg-white rounded-full p-3 shadow-xl">
//                 <img src={Logo} alt="logo" className="w-24 h-24 object-contain" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* BODY */}
//         <div className="p-5 bg-[#fffdf8]">

//           {/* LOADING STATE */}
//           {isLoading && (
//             <div className="flex flex-col items-center justify-center py-20 gap-3">
//               <div className="w-10 h-10 border-4 border-[#d98a11] border-t-transparent rounded-full animate-spin" />
//               <p className="text-[#8b4b00] font-medium">Loading order details...</p>
//             </div>
//           )}

//           {/* ERROR STATE */}
//           {!isLoading && fetchError && (
//             <div className="flex flex-col items-center justify-center py-20 gap-3">
//               <p className="text-red-600 font-medium">{fetchError}</p>
//               <button
//                 onClick={onClose}
//                 className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
//               >
//                 Close
//               </button>
//             </div>
//           )}

//           {/* CONTENT — only shown when data is ready */}
//           {!isLoading && !fetchError && orderData && (
//             <>
//               {/* TOP INFO */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                 {/* CUSTOMER DETAILS */}
//                 <div className="bg-white border border-[#f0dfbb] rounded-2xl p-5 shadow-sm">
//                   <h2 className="text-lg font-semibold text-[#8b4b00] mb-4">Customer Details</h2>
//                   <div className="space-y-2 text-sm text-gray-700">
//                     <p>
//                       <span className="font-semibold text-gray-900">Name:</span>{" "}
//                       {capitalizeFirstLetter(orderData.user?.name)}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-gray-900">Email:</span>{" "}
//                       {orderData.user?.email}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-gray-900">Mobile:</span>{" "}
//                       {orderData.user?.mobileNumber}
//                     </p>
//                     <div className="leading-6">
//                       <span className="font-semibold text-gray-900">Address:</span>{" "}
//                       <span>{address || "—"}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ORDER DETAILS */}
//                 <div className="bg-white border border-[#f0dfbb] rounded-2xl p-5 shadow-sm">
//                   <h2 className="text-lg font-semibold text-[#8b4b00] mb-4">Order Information</h2>
//                   <div className="space-y-2 text-sm text-gray-700">
//                     <p className="font-semibold text-base">
//                       <span className="font-semibold text-gray-900">Order ID:</span>{" "}
//                       #{orderData.orderId}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-gray-900">Order Date:</span>{" "}
//                       {new Date(orderData.createdAt).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-gray-900">Payment Method:</span>{" "}
//                       {orderData.paymentMethod?.toUpperCase()}
//                     </p>
//                     <p>
//                       <span className="font-semibold text-gray-900">Total Items:</span>{" "}
//                       {orderData.items?.length}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* PRODUCT TABLE */}
//               <div className="mt-8 bg-white border border-[#f0dfbb] rounded-2xl overflow-hidden shadow-sm">
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[600px]">
//                     <thead className="bg-[#fff4dd]">
//                       <tr>
//                         <th className="text-left px-5 py-4 text-sm font-semibold text-[#7d4400]">Product</th>
//                         <th className="text-center px-5 py-4 text-sm font-semibold text-[#7d4400]">Qty</th>
//                         <th className="text-center px-5 py-4 text-sm font-semibold text-[#7d4400]">Variant</th>
//                         <th className="text-center px-5 py-4 text-sm font-semibold text-[#7d4400]">Price</th>
//                         <th className="text-center px-5 py-4 text-sm font-semibold text-[#7d4400]">Discount</th>
//                         <th className="text-center px-5 py-4 text-sm font-semibold text-[#7d4400]">GST</th>
//                         <th className="text-right px-5 py-4 text-sm font-semibold text-[#7d4400]">Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {orderData.items?.map((item, index) => (
//                         <tr key={index} className="border-t border-[#f4ead7]">
//                           <td className="px-5 py-5">
//                             <p className="font-semibold text-gray-800">
//                               {capitalizeFirstLetter(item.product?.productName)}
//                             </p>
//                           </td>
//                           <td className="text-center px-5 py-5 text-sm">{item.quantity}</td>
//                           <td className="text-center px-5 py-5 text-sm">{item.variant?.weight ?? "—"}</td>
//                           <td className="text-center px-5 py-5 text-sm">₹{formatNumber(item.price)}</td>
//                           <td className="text-center px-5 py-5 text-sm text-green-700 font-medium">
//                             ₹{formatNumber(item.discount)}
//                           </td>
//                           <td className="text-center px-5 py-5 text-sm text-green-700 font-medium">
//                             {item?.product?.gstPercent ?? 0}%
//                           </td>
//                           <td className="text-right px-5 py-5 text-sm font-semibold text-[#8b4b00]">
//                             ₹{formatNumber(item.totalPrice)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* TOTAL SUMMARY */}
//               <div className="mt-8 flex justify-end">
//                 <div className="w-full md:w-[420px] bg-white border border-[#f0dfbb] rounded-2xl p-6 shadow-sm">
//                   <h2 className="text-lg font-semibold text-[#8b4b00] mb-5">Billing Summary</h2>
//                   <div className="space-y-4 text-sm">
//                     <div className="flex justify-between text-gray-700">
//                       <span>Subtotal</span>
//                       <span>₹{formatNumber(orderData.subTotal)}</span>
//                     </div>
//                     <div className="flex justify-between text-gray-700">
//                       <span>GST</span>
//                       <span>₹{formatNumber(orderData.gstAmount)}</span>
//                     </div>
//                     <div className="flex justify-between text-gray-700">
//                       <span>Handling Charges</span>
//                       <span>₹{formatNumber(orderData.handlingCharges)}</span>
//                     </div>
//                     <div className="flex justify-between text-green-700">
//                       <span>Discount</span>
//                       <span>- ₹{formatNumber(orderData.discountAmount)}</span>
//                     </div>
//                     <div className="border-t pt-4 flex justify-between text-lg font-bold text-[#8b4b00]">
//                       <span>Total Paid</span>
//                       <span>₹{formatNumber(orderData.totalAmount)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* FOOTER */}
//               <div className="mt-10 border-t border-[#f1dfc0] pt-6 flex flex-col md:flex-row justify-between gap-5 items-center">
//                 <div>
//                   <p className="text-[#8b4b00] font-semibold">
//                     Thank you for shopping with Melforesta 🍯
//                   </p>
//                   <p className="text-sm text-gray-500 mt-1">
//                     From Hives to Home — Natural Honey Delivered.
//                   </p>
//                 </div>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleDownloadInvoice}
//                     disabled={isDownloading}
//                     className="px-5 py-2.5 rounded-xl bg-[#d98a11] text-white font-medium hover:bg-[#b96f00] disabled:cursor-not-allowed disabled:opacity-70 transition"
//                   >
//                     {isDownloading ? "Downloading..." : "Download Invoice"}
//                   </button>
//                   <button
//                     onClick={onClose}
//                     className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import capitalizeFirstLetter from "../../components/common/capitalizeFirstLetter";
import { Logo } from "../../assets/common";
import { X } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "../../model/admin/invoicePdf";
import axios from "axios";

const Base_Url = import.meta.env.VITE_BASE_URL;

function formatNumber(value) {
  return Math.round(Number(value || 0)).toLocaleString();
}

function buildAddress(address = {}) {
  return [
    address.flatNo ? `Flat No. ${address.flatNo}` : "",
    address.buildingName || "",
    address.streetName || "",
    address.city || "",
    address.state && address.pincode
      ? `${address.state} - ${address.pincode}`
      : address.state || address.pincode || "",
  ]
    .filter(Boolean)
    .join(", ");
}

export default function InvoiceModel({ order, onClose }) {
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order?.orderId) return;

      try {
        setIsLoading(true);
        setFetchError(null);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${Base_Url}/api/productOrder/getOrderDetails/${order.orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setOrderData(res.data.data);
        } else {
          setFetchError(res.data.message || "Failed to fetch order details");
        }
      } catch (err) {
        console.error(err);
        setFetchError(
          err.response?.data?.message || "Failed to fetch order details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order?.orderId]);

  if (!order) return null;

  const address = orderData ? buildAddress(orderData.address) : "";

  const handleDownloadInvoice = async () => {
    if (!orderData) return;
    try {
      setIsDownloading(true);
      const invoiceBlob = await pdf(<InvoicePDF orderData={orderData} />).toBlob();
      const invoiceUrl = URL.createObjectURL(invoiceBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = invoiceUrl;
      downloadLink.download = `Invoice-${orderData.orderId}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(invoiceUrl);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintInvoice = async () => {
    if (!orderData) return;

    try {
      const invoiceBlob = await pdf(
        <InvoicePDF orderData={orderData} />
      ).toBlob();

      const invoiceUrl = URL.createObjectURL(invoiceBlob);

      const printWindow = window.open(invoiceUrl);

      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();

          setTimeout(() => {
            URL.revokeObjectURL(invoiceUrl);
          }, 1000);
        };
      }
    } catch (error) {
      console.error("Print Error:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-2 w-8 h-8 z-50 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition group"
        >
          <X size={18} className="text-gray-600 group-hover:text-red-600" />
        </button>

        {/* HEADER */}
        <div className="relative overflow-hidden bg-[#FFFDF8] p-6 md:p-8 text-[#8E5D4A]">
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="uppercase tracking-[4px] text-xs md:text-sm text-[#8E5D4A] font-medium">
                Melforesta Invoice
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mt-2">Payment Summary</h1>
              <p className="text-sm md:text-base mt-3 text-[#8E5D4A]">
                Natural Honey • Pure Wellness • Trusted Delivery
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div className="bg-white rounded-full p-3 shadow-xl">
                <img src={Logo} alt="logo" className="w-24 h-24 object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5 bg-[#fffdf8]">

          {/* LOADING STATE */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-[#d98a11] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#8b4b00] font-medium">Loading order details...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {!isLoading && fetchError && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-red-600 font-medium">{fetchError}</p>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          )}

          {/* CONTENT — only shown when data is ready */}
          {!isLoading && !fetchError && orderData && (
            <>
              {/* TOP INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* CUSTOMER DETAILS */}
                <div className="bg-white border border-[#f0dfbb] rounded-2xl p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#8b4b00] mb-4">Customer Details</h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-900">Name:</span>{" "}
                      {capitalizeFirstLetter(orderData.user?.name)}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Email:</span>{" "}
                      {orderData.user?.email}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Mobile:</span>{" "}
                      {orderData.user?.mobileNumber}
                    </p>
                    <div className="leading-6">
                      <span className="font-semibold text-gray-900">Address:</span>{" "}
                      <span>{address || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* ORDER DETAILS */}
                <div className="bg-white border border-[#f0dfbb] rounded-2xl p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#8b4b00] mb-4">Order Information</h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="font-semibold text-base">
                      <span className="font-semibold text-gray-900">Order ID:</span>{" "}
                      #{orderData.orderId}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Order Date:</span>{" "}
                      {new Date(orderData.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Payment Method:</span>{" "}
                      {orderData.paymentMethod?.toUpperCase()}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Total Items:</span>{" "}
                      {orderData.items?.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* PRODUCT TABLE */}
              <div className="mt-8 bg-white border border-[#f0dfbb] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-[#fff4dd]">
                      <tr>
                        <th className="text-left px-5 py-4 text-sm font-semibold text-[#7d4400]">Product</th>
                        <th className="text-center px-5 py-4 text-sm font-semibold text-[#7d4400]">Qty</th>
                        <th className="text-center px-5 py-4 text-sm font-semibold text-[#7d4400]">Variant</th>
                        <th className="text-center px-5 py-4 text-sm font-semibold text-[#7d4400]">Price</th>
                        <th className="text-center px-5 py-4 text-sm font-semibold text-[#7d4400]">Discount</th>
                        <th className="text-center px-5 py-4 text-sm font-semibold text-[#7d4400]">GST</th>
                        <th className="text-right px-5 py-4 text-sm font-semibold text-[#7d4400]">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.items?.map((item, index) => (
                        <tr key={index} className="border-t border-[#f4ead7]">
                          <td className="px-5 py-5">
                            <p className="font-semibold text-gray-800">
                              {capitalizeFirstLetter(item.product?.productName)}
                            </p>
                          </td>
                          <td className="text-center px-5 py-5 text-sm">{item.quantity}</td>
                          <td className="text-center px-5 py-5 text-sm">{item.variant?.weight ?? "—"}</td>
                          <td className="text-center px-5 py-5 text-sm">₹{formatNumber(item.price)}</td>
                          <td className="text-center px-5 py-5 text-sm text-green-700 font-medium">
                            ₹{formatNumber(item.discount)}
                          </td>
                          <td className="text-center px-5 py-5 text-sm text-green-700 font-medium">
                            {Number(item?.product?.gstPercent )?? 0}%
                          </td>
                          <td className="text-right px-5 py-5 text-sm font-semibold text-[#8b4b00]">
                            ₹{formatNumber(item.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TOTAL SUMMARY */}
              <div className="mt-8 flex justify-end">
                <div className="w-full md:w-[420px] bg-white border border-[#f0dfbb] rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#8b4b00] mb-5">Billing Summary</h2>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>₹{formatNumber(orderData.subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>GST</span>
                      <span>₹{formatNumber(orderData.gstAmount)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Handling Charges</span>
                      <span>₹{formatNumber(orderData.handlingCharges)}</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Discount</span>
                      <span>- ₹{formatNumber(orderData.discountAmount)}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between text-lg font-bold text-[#8b4b00]">
                      <span>Total Paid</span>
                      <span>₹{formatNumber(orderData.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-10 border-t border-[#f1dfc0] pt-6 flex flex-col md:flex-row justify-between gap-5 md:items-center">
                <div>
                  <p className="text-[#8b4b00] font-semibold">
                    Thank you for shopping with Melforesta 🍯
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    From Hives to Home — Natural Honey Delivered.
                  </p>
                </div>

                <div className="flex gap-3 flex-col md:flex-row justify-end">
                  <button
                    onClick={handleDownloadInvoice}
                    disabled={isDownloading}
                    className="px-4 py-2 text-sm rounded-xl bg-[#d98a11] text-white font-medium hover:bg-[#b96f00] disabled:cursor-not-allowed disabled:opacity-70 transition"
                  >
                    {isDownloading ? "Downloading..." : "Download Invoice"}
                  </button>

                  <button
                    onClick={handlePrintInvoice}
                    className="px-4 py-2 text-sm rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
                  >
                    Print Invoice
                  </button>

                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}