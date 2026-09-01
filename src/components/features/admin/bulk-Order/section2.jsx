import { useEffect,useState } from "react";
import TableComponent from "../../../common/TableComponent";
import capitalizeFirstLetter from "../../../../components/common/capitalizeFirstLetter"
import { useDispatch, useSelector } from "react-redux";
import { fetchBulkOrders } from "../../../../redux/actions/bulkOrderAction";
import { FaEye } from "react-icons/fa";

export default function Section2({  }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const dispatch=useDispatch();

  const [selectedDetails, setSelectedDetails] = useState("");
const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { bulkOrders=[], totalPages, totalRecords, error } = useSelector(
    (state) => state.bulkOrderState
  );

  useEffect(() =>
  {
      dispatch(fetchBulkOrders(currentPage, itemsPerPage));
  }, [dispatch, currentPage,itemsPerPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const columns = [
    {
      label: "Name",
      field: "",
      headerClassName: "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2 border-l border-[#d3cccc]",
      render:(item)=>(
        <>
          {capitalizeFirstLetter(item.contactName)}
        </>
      )
    },
    {
      label: "Company Name",
      field: "",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2 border-[#d3cccc]",
      render:(item)=>(
        <>
          {capitalizeFirstLetter(item.companyName) || "-"}
        </>
      )
    },
    {
      label: "Email",
      field: "email",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
    },
    {
      label: "Mobile number",
      field: "phone",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
    },
    {
      label: "Type",
      field: "",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2  border-[#d3cccc]",
      render:(item)=>(
        <>
          {capitalizeFirstLetter(item.orderType) || "-"}
        </>
      )
    },
    {
      label: "Quantity",
      field: "",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2  border-[#d3cccc]",
      render:(item)=>(
        <>
          {Number(item.quantity) || 0}
        </>
      )
    },
    {
  label: "Details",
  field: "details",
  headerClassName:
    "text-center pl-2 border-t border-b border-r border-[#d3cccc]",
  className:
    "text-center text-sm xl:text-base border-r border-[#d3cccc]",

  render: (item) => (
    <button
      onClick={() => {
        setSelectedDetails(item.details);
        setShowDetailsModal(true);
      }}
      className="
        mx-auto
        flex
        items-center
        justify-center
        w-8
        h-8
        rounded-full
        bg-[#fff4df]
        text-[#c77700]
        hover:bg-[#f7dfb3]
        transition-all
        duration-300
        shadow-sm border border-yellow-700
      "
    >
      <FaEye className="text-sm" />
    </button>
  ),
},
 
  ];

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
 
  if(error)
  {
    return(
      <p className="text-red-600">{error}</p>
    );
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-4 gap-4">
        <p className="text-base xl:text-lg 2xl:text-xl font-medium">
          Total: {totalRecords}
        </p>
       
      </div>

      <div className="hidden lg:block">
        <TableComponent
          columns={columns}
          data={bulkOrders}
          headerBg="bg-[#f6f6f6]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        {bulkOrders?.map((item) => (
          <div
            key={item.id}
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              shadow-sm
              p-4
              transition-all
              duration-200
            "
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-800 text-base break-words">
                  {capitalizeFirstLetter(item.contactName)}
                </h3>

                <p className="text-sm text-gray-500 mt-1 break-words">
                  {capitalizeFirstLetter(item.companyName) || "No Company"}
                </p>
              </div>

            
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-4" />

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">
                  Email
                </p>

                <p className="font-medium text-gray-800 break-all mt-1">
                  {item.email}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">
                  Mobile
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {item.phone}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">
                  Order Type
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {capitalizeFirstLetter(item.orderType) || "-"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">
                  Quantity
                </p>

                <p className="font-semibold text-green-600 mt-1">
                  {Number(item.quantity) || 0}
                </p>
              </div>
            </div>

            {/* Details Preview */}
            {item.details && (
              <>
                <div className="border-t border-gray-100 my-2" />


                <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSelectedDetails(item.details);
                    setShowDetailsModal(true);
                  }}
                  className="
                    flex
                    items-center
                    justify-center
                    w-8
                    h-8
                    rounded-full
                    bg-amber-50
                    text-amber-600
                    shadow-sm
                    shrink-0
                  "
                >
                  <FaEye className="text-sm" />
                </button>
              </div>
                
              </>
            )}
          </div>
        ))}
      </div>
      

      {renderPagination()}

      {showDetailsModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            backdrop-blur-sm
            px-4
          "
        >
          <div
            className="
              bg-white
              w-full
              max-w-lg
              rounded-2xl
              shadow-2xl
              overflow-y-auto
              animate-fadeIn my-5 max-h-[90%]
            "
          >
            {/* Header */}
            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-4
                border-b
                bg-[#fff8ec]
              "
            >
              <h2 className="text-lg font-semibold text-gray-800">
                Order Details
              </h2>

              <button
                onClick={() =>
                  setShowDetailsModal(false)
                }
                className="
                  text-gray-500
                  hover:text-red-500
                  text-xl
                  transition
                "
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p
                className="
                  text-gray-700
                  leading-7
                  whitespace-pre-wrap
                  break-words
                "
              >
                {capitalizeFirstLetter(selectedDetails) || "-"}
              </p>
            </div>
          </div>
        </div>
      )}


    </>
  );
}