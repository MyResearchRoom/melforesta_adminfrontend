import { useState, useMemo, useEffect } from "react";
import { BsEye } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import TableComponent from "../../../common/TableComponent";
import capitalizeFirstLetter from "../../../common/capitalizeFirstLetter";
import formatPaymentMethod from "../../../common/fomatePaymentMethod";
import { useDispatch, useSelector } from "react-redux";
import { fetchProcessedProducts } from "../../../../redux/actions/orderProductProcessaction";
import CustomFilter from "../../../common/filterOption";
import { fetchAccounts } from "../../../../redux/actions/accountActions";

const statusOptions = [
  {
    label: "Paid",
    value: "success",
  },
  {
    label: "pending",
    value: "pending",
  },
  {
    label: "Failed",
    value: "failed",
  },
  {
    label: "Refunded",
    value: "refunded",
  },
];

const statusStyles = {
  success: "bg-green-100 text-green-700 border border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  failed: "bg-red-100 text-red-700 border border-red-200",
  refunded: "bg-blue-100 text-blue-700 border border-blue-200",
};

export default function Section2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const dispatch=useDispatch();

// startDate="",endDate=""

  useEffect(() => {
    dispatch(fetchAccounts(currentPage, rowsPerPage,searchTerm,statusFilter)); 
  }, [dispatch, currentPage,rowsPerPage,searchTerm,statusFilter]);
  
  const { account = [], totalRecords,totalPages, error } = useSelector(
    (state) => state.accountState
  );

  const columns = [
    {
      label: "Order Id",
      field: "orderId",
      headerClassName:
        "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
      className:
        "text-sm xl:text-base text-left pl-2 border-l border-[#d3cccc]",
    },
    {
      label: "Customer name",
      field: "",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
      render: (order) =>
        order.user?.name ? capitalizeFirstLetter(order.user.name) : "",
    },
    {
      label: "Razorpay id",
      field: "razorpayOrderId",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-sm text-left pl-2",
      render:(order)=>(
            <p>{order.razorpayOrderId ?? "-"}</p>
        ),
    },
    {
      label: "Payment id",
      field: "",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-sm text-left pl-2",
      render:(order)=>(
            <p>{order.razorpayPaymentId ?? "-"}</p>
        ),
    },
    {
          label: "Amount",
          field: "amount",
          headerClassName:
            "text-left pl-2 border-t border-b border-[#d3cccc]",
          className: "text-sm xl:text-base text-left pl-2",
          render:(order)=>(
            <p>₹ {Number(order.amount)}</p>
          ),
    },
    {
      label: "Status",
      field: "status",
      headerClassName:
        "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
      render: (order) => {
        const status = order.paymentStatus?.toLowerCase();

        const statusStyles = {
          success:
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
      label: "Paid Date",
      field: "paidAt",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
      render: (order) =>
        order.paidAt
          ? new Date(order.paidAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
    }, 
    {
      label: "View",
      field: "view",
      headerClassName:
        "border-t border-b border-r border-[#d3cccc] text-left",
      className: "border-[#d3cccc] border-r",
      render: (row) => (
        <button 
        onClick={()=>navigate(
              "/payment-history-details",
              {
                state: {
                  transaction: row,
                },
              }
            )}
        >
            <BsEye className="text-lg xl:text-xl text-blue-600" />
        </button>
      ),
    },
  ];

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
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
      {/* First Page */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`border border-gray-600 rounded px-1 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-primary/70 hover:text-white"
        }`}
      >
        {"<<"}
      </button>

      {/* Prev Page */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`border border-gray-600 rounded px-1 ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-primary/70 hover:text-white"
        }`}
      >
        {"<"}
      </button>

      {pages}

      {/* Next Page */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`border border-gray-600 rounded px-1 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-primary/70 hover:text-white"
        }`}
      >
        {">"}
      </button>

      {/* Last Page */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`border border-gray-600 rounded px-1 ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "hover:bg-primary/70 hover:text-white"
        }`}
      >
        {">>"}
      </button>
    </div>
  );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if(error)
  {
    return(
      <p className="text-red-600">{error}</p>
    );
  }

  return (
    <section className="flex flex-col mt-2">
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm xl:text-base flex-wrap gap-3">
          <p className="text-base xl:text-lg font-medium">
            Total : {totalRecords} 
          </p>
          <div className="flex flex-col md:flex-row md:space-x-3 items-start md:items-center flex-wrap gap-2">
            <p>Filter by:</p>

            <div className="w-[210px]">
              <CustomFilter
                options={statusOptions}
                value={statusFilter | ""}
                onChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                placeholder="All Status"
                allLabel="All Status"
              />
            </div>

            {/* <div className="w-[210px]">
              <CustomFilter
                options={sortOptions}
                value={sortOrder || "Newest"}
                onChange={(value) => {
                  setSortOrder(value);
                  setCurrentPage(1);
                }}
                placeholder="Newest First"
                allLabel="Newest First"
              />
            </div> */}

            <input
              type="text"
              className="rounded border border-yellow-400 px-2 py-1 xl:py-1.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-none text-black"
              placeholder="Search by name & category..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

      
        <div className="hidden lg:block">
          <TableComponent
            columns={columns}
            data={account}
            headerBg="bg-[#f6f6f6]"
          />
        </div>

        <div className="flex flex-col gap-3 lg:hidden">
              {account.length === 0 ? (
                    <p className="text-center text-gray-500 py-6">No records found.</p>
              ) : (
                    account.map((order, idx) => {
                      const status = order.paymentStatus?.toLowerCase();
                      const paidDate = order.paidAt
                        ? new Date(order.paidAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-";
        
                      return (
                        <div
                          key={order._id || idx}
                          className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3"
                        >
                          {/* Top row: order id + status badge */}
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm text-gray-800">
                              {order.orderId}
                            </p>
                            <span
                              className={`px-3 py-0.5 rounded-full text-xs font-medium capitalize ${
                                statusStyles[status] ||
                                "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {status || "N/A"}
                            </span>
                          </div>
        
                          {/* Customer + Amount */}
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                              {order.user?.name
                                ? capitalizeFirstLetter(order.user.name)
                                : "-"}
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                              ₹ {Number(order.amount)}
                            </p>
                          </div>
        
                          {/* Razorpay IDs */}
                          <div className="space-y-1">
                            <div className="flex flex-col">
                              <span className="text-[11px] text-gray-400 uppercase tracking-wide">
                                Razorpay Order ID
                              </span>
                              <span className="text-xs text-gray-700 break-all">
                                {order.razorpayOrderId ?? "-"}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[11px] text-gray-400 uppercase tracking-wide">
                                Payment ID
                              </span>
                              <span className="text-xs text-gray-700 break-all">
                                {order.razorpayPaymentId ?? "-"}
                              </span>
                            </div>
                          </div>
        
                          {/* Paid date + view button */}
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                            <span className="text-xs text-gray-500">{paidDate}</span>
                            <button
                              onClick={() =>
                                navigate("/payment-history-details", {
                                  state: { transaction: order },
                                })
                              }
                              className="flex items-center gap-1.5 text-xs text-blue-600 font-medium"
                            >
                              <BsEye className="text-base" />
                              View
                            </button>
                          </div>
                        </div>
                      );
                    })
              )}
        </div>

        {renderPagination()}
      </div>
    </section>
  );
}



