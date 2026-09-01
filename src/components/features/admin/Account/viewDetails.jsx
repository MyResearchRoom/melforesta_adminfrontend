import { X } from "lucide-react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const PaymentTransactionDetails = () => {
  const location = useLocation();
  const transaction = location.state?.transaction;
  const navigate = useNavigate();

  if (!transaction) {
    return <Navigate to="/accounts" replace />;
  }

  const paymentStatusConfig = {
    success: { label: "Paid", className: "bg-green-100 text-green-700" },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    failed: { label: "Failed", className: "bg-red-100 text-red-700" },
    refunded: { label: "Refunded", className: "bg-blue-100 text-blue-700" },
  };

  const status =
    paymentStatusConfig[transaction.paymentStatus] || {
      label: transaction.paymentStatus,
      className: "bg-gray-100 text-gray-700",
    };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  return (
    <div className="bg-white rounded-xl shadow-md p-3 md:p-6 space-y-6 mr-3 md:mr-6 my-3">

      <button
        onClick={() => navigate(-1)}
        className="flex md:hidden items-center gap-1.5 text-sm text-gray-600 mb-1"
      >
        <HiArrowNarrowLeft className="text-xl" />
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4">
        <div>
          {/* Desktop-only: back arrow inline with title */}
          <div
            className="hidden md:flex flex-row items-center gap-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <HiArrowNarrowLeft className="text-xl" />
            <h1 className="text-2xl font-bold">Payment Transaction Details</h1>
          </div>

          {/* Mobile-only: just the title, no back arrow here */}
          <h1 className="md:hidden text-xl font-bold">
            Payment Transaction Details
          </h1>

          <p className="text-gray-500 mt-1">Order ID: {transaction.orderId}</p>
        </div>

        <span
          className={`mt-3 md:mt-0 px-4 py-2 rounded-full text-sm font-medium w-fit ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Payment Information */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Amount" value={`₹${Number(transaction.amount)}`} />
          <InfoItem label="Currency" value={transaction.currency} />
          <InfoItem label="Razorpay Order ID" value={transaction.razorpayOrderId} />
          <InfoItem
            label="Razorpay Payment ID"
            value={transaction.razorpayPaymentId || "-"}
          />
          <InfoItem label="Paid At" value={formatDate(transaction.paidAt)} />
          <InfoItem label="Created At" value={formatDate(transaction.createdAt)} />
        </div>
      </div>

      {/* Customer Information */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Customer Name" value={transaction.user?.name} />
          <InfoItem label="Email" value={transaction.user?.email} />
          <InfoItem label="Mobile Number" value={transaction.user?.mobileNumber} />
        </div>
      </div>

      {/* Order Information */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Order Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Order ID" value={transaction.orderId} />
          <InfoItem
            label="Order Payment Status"
            value={transaction.order?.paymentStatus || "-"}
          />
          <InfoItem
            label="Payment Method"
            value={transaction.order?.paymentMethod || "-"}
          />
        </div>
      </div>

      {/* Failure Information */}
      {transaction.paymentStatus === "failed" && transaction.failureReason && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-red-600">
            Failure Details
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="font-medium text-red-700">Reason</p>
            <p className="text-red-600 mt-1">{transaction.failureReason}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="border rounded-lg p-4 bg-gray-50">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 font-medium break-all capitalize">{value || "-"}</p>
  </div>
);

export default PaymentTransactionDetails;
