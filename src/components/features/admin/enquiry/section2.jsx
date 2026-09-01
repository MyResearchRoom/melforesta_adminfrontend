import { useEffect,useState } from "react";
import TableComponent from "../../../common/TableComponent";
import capitalizeFirstLetter from "../../../../components/common/capitalizeFirstLetter"
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { fetchEnquiries } from "../../../../redux/actions/enquiryActions";
import DeleteEnquiry from "../../../../model/admin/deleteEnquiy"

export default function Section2({  }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const dispatch=useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);


  const { enquiry=[], totalPages, totalRecords, error } = useSelector(
    (state) => state.enquiryState
  );


  useEffect(() =>
    {
      dispatch(fetchEnquiries(currentPage, itemsPerPage, searchTerm)); 
  }, [dispatch, currentPage,itemsPerPage,searchTerm]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

   const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const columns = [
    {
      label: "Name",
      field: "name",
      headerClassName: "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2 border-l border-[#d3cccc]",
      render:(item)=>(
        <>
          {capitalizeFirstLetter(item.name)}
        </>
      )
    },
    {
      label: "Email",
      field: "email",
      headerClassName: "text-left pl-5 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-5",
    },
    {
      label: "Mobile number",
      field: "mobileNumber",
      headerClassName: "text-left pl-5 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-5",
    },
     {
      label: "Message",
      field: "message",
      headerClassName: "text-center pl-5 border-t border-b border-[#d3cccc]",
      className: "text-center text-sm xl:text-sm text-left pl-8",
      render: (item) => (
        <p className="whitespace-normal break-words text-wrap w-48 lg:w-[400px] xl:w-[500px] text-justify">
            {capitalizeFirstLetter(item.message)}
        </p>
      ),
    },
    {
      label: "Action",
      field: "action",
      headerClassName: "text-center pl-5 border-t border-b border-r border-[#d3cccc]",
      className: "text-sm xl:text-base text-center border-r border-[#d3cccc]",
      render: (item) => (
          <button 
            onClick={() => {
              setSelectedEnquiryId(item.id);
              setIsModalOpen(true);
            }}
          >
            <MdDelete className="text-base xl:text-lg text-red-600" />
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
      <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-4 gap-2 sm:gap-4">
        <p className="text-base xl:text-lg 2xl:text-xl font-medium">
          Total: {totalRecords} enquiries
        </p>
        <input
          type="text"
         className="
          w-full
          sm:w-[280px]
          rounded-lg
          border
          border-yellow-400
          px-3
          py-2
          text-sm
          focus:outline-none
        "
          placeholder="Search by name & email.."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="hidden lg:block">
        <TableComponent
          columns={columns}
          data={enquiry}
          headerBg="bg-[#f6f6f6]"
        />
      </div>

      <div className="lg:hidden space-y-4">
        {enquiry?.map((item) => (
          <div
            key={item.id}
            className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              shadow-sm
              p-4
            "
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-800 text-base break-words">
                  {capitalizeFirstLetter(item.name)}
                </h3>

                <p className="text-sm text-gray-500 mt-1 break-all">
                  {item.email}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-4" />

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">
                  Mobile Number
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {item.mobileNumber}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">
                  Message
                </p>

                <p className="text-gray-700 mt-1 leading-6 break-words text-[13px]">
                  {capitalizeFirstLetter(item.message)}
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="border-t border-gray-100 mt-4 pt-3 flex justify-end">
              <button
                onClick={() => {
                  setSelectedEnquiryId(item.id);
                  setIsModalOpen(true);
                }}
                className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-red-50
                  text-red-600
                  hover:bg-red-100
                  transition
                "
              >
                <MdDelete className="text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}

      <DeleteEnquiry
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={selectedEnquiryId}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        searchTerm={searchTerm}
      />


    </>
  );
}
