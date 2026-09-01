import { useState, useMemo, useEffect, useRef } from "react";
import { BsEye } from "react-icons/bs";
import { AiOutlinePrinter } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import TableComponent from "../../../common/TableComponent";
import capitalizeFirstLetter from "../../../common/capitalizeFirstLetter";
import formatPaymentMethod from "../../../common/fomatePaymentMethod";
import { useDispatch, useSelector } from "react-redux";
import { fetchProcessedProducts } from "../../../../redux/actions/orderProductProcessaction";
import CustomFilter from "../../../common/filterOption";
import LabelModel from "../../../../model/admin/labelModel";
import InvoiceModel from "../../../../model/admin/invoiceModel";

const statusOptions = [
  { label: "New Request", value: "newRequest" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Out for delivery", value: "outForDelivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const sortOptions = [
  { label: "Oldest First", value: "Oldest" },
];

// ── Print Dropdown ──────────────────────────────────────────────────────────
function PrintDropdown({ order, onLabel, onInvoice }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
        title="Print"
      >
        <AiOutlinePrinter className="text-lg xl:text-xl" />
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => { onLabel(order); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Label
          </button>
          <button
            onClick={() => { onInvoice(order); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Invoice
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function Section2() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [statusFilter, setStatusFilter] = useState(location.state?.status || "All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Modal state
  const [labelOrder, setLabelOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchProcessedProducts(currentPage, rowsPerPage, statusFilter));
  }, [dispatch, currentPage, rowsPerPage, statusFilter]);

  const { processedproducts = [], totalRecords, totalPages, error } = useSelector(
    (state) => state.processProductState
  );

  const columns = [
    {
      label: "Order Id",
      field: "orderId",
      headerClassName: "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2 border-l border-[#d3cccc]",
    },
    {
      label: "Customer name",
      field: "user",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
      render: (order) => order.user?.name ? capitalizeFirstLetter(order.user.name) : "",
    },
    {
      label: "Purchase Date",
      field: "createdAt",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
      render: (order) => {
        const date = new Date(order.createdAt);
        return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      },
    },
    {
      label: "Payment method",
      field: "paymentMethod",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm text-left xl:text-base text-left pl-2",
      render: (item) => <>{formatPaymentMethod(item.paymentMethod)}</>,
    },
    {
      label: "Amount",
      field: "totalAmount",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
      render: (order) => <p>₹ {Math.round(order.totalAmount)}</p>,
    },

    {
      label: "Payment Status",
      field: "status",
      headerClassName:
        "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
      render: (order) => {
        const status = order.paymentStatus?.toLowerCase();

        const statusStyles = {
          paid:
            "bg-green-100 text-green-700 border border-green-200",
          pending:
            "bg-yellow-100 text-yellow-700 border border-yellow-200",
          failed:
            "bg-red-100 text-red-700 border border-red-200",
          refunded:
            "bg-blue-100 text-blue-700 border border-blue-200",
        };

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              statusStyles[status] ||
              "bg-gray-100 text-gray-700 border border-gray-200"
            }`}
          >
            {status || "N/A"}
          </span>
        );
      },
    },
    {
      label: "Order Status",
      field: "status",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
      render: (order) =>
        order.status
          ? order.status.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
          : "",
    },
    {
      label: "Print",
      field: "print",
      headerClassName: "border-t border-b border-[#d3cccc] text-center px-2",
      className: "border-[#d3cccc] text-center px-2",
      render: (row) => (
        <PrintDropdown
          order={row}
          onLabel={(o) => setLabelOrder(o)}
          onInvoice={(o) => setInvoiceOrder(o)}
        />
      ),
    },
    {
      label: "View",
      field: "view",
      headerClassName: "border-t border-b border-r border-[#d3cccc] text-left",
      className: "border-[#d3cccc] border-r",
      render: (row) => (
        <button onClick={() => navigate(`/admin/processview/${row.orderId}`)}>
          <BsEye className="text-lg xl:text-xl text-blue-600" />
        </button>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    if (!processedproducts || processedproducts.length === 0) return [];
    let data = [...processedproducts];
    data.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });
    return data;
  }, [processedproducts, sortOrder]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
  };

  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(currentPage - 1, 1);
    const endPage = Math.min(currentPage + 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          disabled={i === currentPage}
          className={`px-2 py-1 rounded border ${
            i === currentPage
              ? "bg-primary/70 text-white cursor-not-allowed"
              : "bg-white text-black hover:bg-primary/70 hover:text-white"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex gap-2 mt-4 justify-end">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`border border-gray-600 rounded px-1 ${
            currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-primary/70 hover:text-white"
          }`}
        >{"<<"}</button>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`border border-gray-600 rounded px-1 ${
            currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-primary/70 hover:text-white"
          }`}
        >{"<"}</button>

        {pages}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`border border-gray-600 rounded px-1 ${
            currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-primary/70 hover:text-white"
          }`}
        >{">"}</button>

        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`border border-gray-600 rounded px-1 ${
            currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-primary/70 hover:text-white"
          }`}
        >{">>"}</button>
      </div>
    );
  };

  const OrderCard = ({ order }) => {
    const formattedStatus = order.status
      ?.replace(/([A-Z])/g, " $1")
      ?.replace(/^./, (str) => str.toUpperCase());

    const getStatusColor = (status) => {
      switch (status) {
        case "delivered": return "bg-green-50 text-green-600";
        case "cancelled": return "bg-red-50 text-red-600";
        case "processing":
        case "shipped":
        case "outForDelivery": return "bg-blue-50 text-blue-600";
        default: return "bg-yellow-50 text-yellow-600";
      }
    };

    const statusStyles = {
          paid:
            "bg-green-100 text-green-700 border border-green-200",
          pending:
            "bg-yellow-100 text-yellow-700 border border-yellow-200",
          failed:
            "bg-red-100 text-red-700 border border-red-200",
          refunded:
            "bg-blue-100 text-blue-700 border border-blue-200",
    };
  

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="text-xs text-gray-500">Order ID</p>
            <h3 className="font-semibold text-gray-800">#{order.orderId}</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {formattedStatus}
          </span>
        </div>

        {/* Customer */}
        <div className="mt-4">
          <p className="text-xs text-gray-500">Customer</p>
          <p className="font-medium text-gray-800">{capitalizeFirstLetter(order.user?.name)}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500">Amount</p>
            <p className="font-medium">₹{Math.round(order.totalAmount)}</p>
          </div>

          <div className="">
            <p className="text-xs text-gray-500">Purchase Date</p>
            <p className="font-medium">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              })}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Payment</p>
            <p className="font-medium">{formatPaymentMethod(order.paymentMethod)}</p>
          </div>

          <div className="flex flex-col">
              <p className="text-xs text-gray-500">
                Payment Status
              </p>
  
              <p className={`mt-1 font-medium capitalize rounded-md px-2 w-auto ${statusStyles[order.paymentStatus?.toLowerCase()]}`}>
                {order.paymentStatus || "N/A"}
              </p>
          </div>
        </div>

        {/* Date */}
        

        {/* Actions */}
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100 gap-2">
          {/* Print options */}
          <div className="flex items-center gap-2 border px-2 py-1 rounded-md shadow-md">
            <AiOutlinePrinter className="text-primary" />
            <button
              onClick={() => setLabelOrder(order)}
              className="text-sm text-primary underline underline-offset-2 transition-colors"
            >
              Label
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setInvoiceOrder(order)}
              className="text-sm text-primary underline underline-offset-2 transition-colors"
            >
              Invoice
            </button>
          </div>

          <button
            onClick={() => navigate(`/admin/processview/${order.orderId}`)}
            className="flex items-center gap-2 text-blue-600 font-medium text-sm"
          >
            <BsEye />
            View Details
          </button>
        </div>
      </div>
    );
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section className="flex flex-col mt-10">
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm xl:text-base flex-wrap gap-3">
          <p className="text-base xl:text-lg font-medi
          um">
            Total : {totalRecords} Product Order
          </p>
          <div className="flex flex-col md:flex-row md:space-x-3 items-start md:items-center flex-wrap gap-2">
            <p>Filter by:</p>
            <div className="w-[210px]">
              <CustomFilter
                options={statusOptions}
                value={statusFilter || "all"}
                onChange={(value) => { setStatusFilter(value === "all" ? "" : value); setCurrentPage(1); }}
                placeholder="All Status"
                allLabel="All Status"
              />
            </div>
            <div className="w-[210px]">
              <CustomFilter
                options={sortOptions}
                value={sortOrder || "Newest"}
                onChange={(value) => { setSortOrder(value); setCurrentPage(1); }}
                placeholder="Newest First"
                allLabel="Newest First"
              />
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block">
          <TableComponent columns={columns} data={filteredData} headerBg="bg-[#f6f6f6]" />
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">No Orders Found</div>
          )}
        </div>

        {renderPagination()}
      </div>

      {/* Modals */}
      {labelOrder && (
        <LabelModel order={labelOrder} onClose={() => setLabelOrder(null)} />
      )}
      {invoiceOrder && (
        <InvoiceModel order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />
      )}
    </section>
  );
}