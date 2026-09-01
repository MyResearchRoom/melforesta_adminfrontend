import React, { useEffect, useState } from 'react'
import TableComponent from '../../../common/TableComponent';
import capitalizeFirstLetter from '../../../common/capitalizeFirstLetter';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCancelOrderProducts } from '../../../../redux/actions/cancelOrderAction';
import CustomFilter from "../../../common/filterOption";

function formatNumber(value) {
  const num = Number(value);
  return num % 1 === 0 ? num : num.toFixed(2);
}

export default function Section2() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const itemsPerPage = 10;
  const dispatch=useDispatch();
  // const [totalRecords, setTotalRecords] = useState(0);
  const { canceledproduct=[],totalPages,totalRecords, error } = useSelector(
    (state) => state.cancleProductState
  );
  const [status, setStatus] = useState("");

  const refundStatusOptions = [
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Refunded",
      value: "refunded",
    },
  ];

  const columns = [
      {
        label: "OrderId",
        field: "orderId",
        headerClassName: "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2 border-l border-[#d3cccc]",
      },
      {
        label: "Customer name",
        field: "name",
        headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2",
        render:(item)=>(
          <>
            {capitalizeFirstLetter(item.user?.name)}
          </>
        )
      },
      {
        label: "Product name",
        field: "name",
        headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2",
        render:(item)=>(
          <>
            {capitalizeFirstLetter(item.orderItem.product.productName)}
          </>
        )
      },
      {
        label: "Reason",
        field: "reason",
        headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2",
        render:(item)=>(
          <>          
            <p className="whitespace-normal break-words w-48 lg:w-56">
              {capitalizeFirstLetter(item.reason)}
            </p>
          </>
        )
      },
      {
        label: "Date",
        field: "date",
        headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2",
        render:(item)=>(
          <>          
            <p className="">
              {new Date(item.createdAt).toLocaleDateString("en-US", 
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })}
            </p>
          </>
        )
      },
      {
        label: "Refund Amount",
        field: "refundAmoun",
        headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2",
        render:(item)=>(
          <>
            {formatNumber(item.refundAmount)}
          </>
        )
      },
      {
        label: "Action",
        field: "action",
        className: "px-4 py-2 border-t border-b border-r text-center border-[#d3cccc]",
        headerClassName: "text-center pl-2 border-t border-b border-r border-[#d3cccc]",
            render: (item) => (
              <button
                onClick={() => navigate(`/admin/cancelled-order-details/${item.id}`)}
                className="text-blue-500 hover:text-blue-700"
              >
                <MdOutlineRemoveRedEye className='text-lg lg:text-xl'/>
              </button>      
            ),
          },
  ];

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      dispatch(fetchCancelOrderProducts(currentPage, itemsPerPage,status));
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  }, [dispatch,currentPage, itemsPerPage,status]);

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

  const CancelOrderCard = ({ item }) => {
    const refundStatus =
      item.refundStatus || "pending";

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="text-xs text-gray-500">
              Order ID
            </p>

            <h3 className="font-semibold text-gray-800">
              #{item.orderId}
            </h3>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              refundStatus === "refunded"
                ? "bg-green-50 text-green-600"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            {capitalizeFirstLetter(refundStatus)}
          </span>
        </div>

        {/* Customer */}
        <div className="mt-4">
          <p className="text-xs text-gray-500">
            Customer
          </p>

          <p className="font-medium text-sm">
            {capitalizeFirstLetter(
              item.user?.name
            )}
          </p>
        </div>

        {/* Product */}
        <div className="mt-3">
          <p className="text-xs text-gray-500">
            Product
          </p>

          <p className="font-medium break-words text-sm">
            {capitalizeFirstLetter(
              item.orderItem?.product
                ?.productName
            )}
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500">
              Refund Amount
            </p>

            <p className="font-semibold text-green-700">
              ₹{formatNumber(item.refundAmount)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Date
            </p>

            <p className="font-medium text-sm">
              {new Date(
                item.createdAt
              ).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Reason */}
        <div className="mt-4">
          <p className="text-xs text-gray-500">
            Reason
          </p>

          <p className="text-sm text-gray-700 mt-1">
            {capitalizeFirstLetter(item.reason)}
          </p>
        </div>

        {/* Action */}
        <div className="flex justify-end mt-5 pt-2 border-t border-gray-100">
          <button
            onClick={() =>
              navigate(
                `/admin/cancelled-order-details/${item.id}`
              )
            }
            className="
              flex items-center gap-2
              text-blue-600
              font-medium text-xs
            "
          >
            <MdOutlineRemoveRedEye />
            View Details
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <p className="text-center mt-10">Loading Cancel orders...</p>;
  }

  if(error){
    return(<p className="text-red-600">{error}</p>);
  }
  return (
  <section className="pb-5 pt-2 px-2">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <p className="text-base xl:text-lg 2xl:text-xl font-medium">
          Total: {totalRecords} cancel orders
        </p>

        <div className="flex flex-row space-x-2 items-center">
          <FaFilter className=""/>
          <p className="text-sm xl:text-base font-semibold"> Filter By :</p>

          <div className="w-full sm:w-[180px]">
            <CustomFilter
              options={refundStatusOptions}
              value={status || "all"}
              onChange={(value) => {
                setStatus(
                  value === "all" ? "" : value
                );

                setCurrentPage(1);
              }}
              placeholder="All"
              allLabel="All"
            />
          </div>
        </div>
    </div>

    <div className="hidden lg:block">
      <TableComponent
        columns={columns}
        data={canceledproduct}
        headerBg="bg-[#f6f6f6]"
      />
    </div>

    <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-3">
      {canceledproduct?.length > 0 ? (
        canceledproduct.map((item) => (
          <CancelOrderCard
            key={item.id}
            item={item}
          />
        ))
      ) : (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          No Cancelled Orders Found
        </div>
      )}
    </div>
    
    {renderPagination()}
  </section>
  );
}
