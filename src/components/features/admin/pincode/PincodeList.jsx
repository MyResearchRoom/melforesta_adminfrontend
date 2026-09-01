import { useEffect, useMemo, useState } from "react";
import { FaPen } from "react-icons/fa";
import capitalizeFirstLetter from "../../../common/capitalizeFirstLetter";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchPincodes } from "../../../../redux/actions/pincodeActions";
import TableComponent from "../../../common/TableComponent";
import { BsTrash, BsTrash2 } from "react-icons/bs";
import DeletePincodeModel from "../../../../model/admin/deleetPincode";
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function ({ onEdit }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  const [pincodeId,setPincodeId] =useState(null);
  const [deleteModelOpen, setDeleteModalOpen] = useState(false);

  const itemsPerPage = 10;
  const { pincodes, totalPages, error,totalRecords } = useSelector(
    (state) => state.pincodestate
  );

  useEffect(() => {
    dispatch(fetchPincodes(currentPage, itemsPerPage, searchTerm)); 
  }, [dispatch, currentPage,itemsPerPage,searchTerm]);


  const columns = [
      {
        label: "Pincode",
        field: "",
        headerClassName: "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2 border-l border-[#d3cccc]",
        render:(item)=>(
          <>
            {capitalizeFirstLetter(item.pinCode)}
          </>
        )
      },

       {
        label: "Delivery Days",
        field: "",
        headerClassName: "text-left pl-2  border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2  border-[#d3cccc]",
        render:(item)=>(
          <>
            {item.deliveryDays}
          </>
        )
      },

      {
        label: "District",
        field: "",
        headerClassName: "text-left pl-2  border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2  border-[#d3cccc]",
        render:(item)=>(
          <>
            {capitalizeFirstLetter(item.district)}
          </>
        )
      },
      {
        label: "State",
        field: "",
        headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2  border-[#d3cccc]",
        render:(item)=>(
          <>
            {capitalizeFirstLetter(item.state)}
          </>
        )
      },

     
      {
        label: "City",
        field: "",
        headerClassName: "text-left pl-2  border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2 border-[#d3cccc]",
        render:(item)=>(
          <>
            {capitalizeFirstLetter(item.city)}
          </>
        )
      },
     
      {
        label: "Action",
        field: "action",
        headerClassName: "text-center pl-2 border-t border-r border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-center border-r border-[#d3cccc]",
        render: (item) => {
        return (
        <div className="flex flex-row space-x-2 lg:space-x-3 items-center justify-center">
  
            <button onClick={() => onEdit(item.id)}>
              <FaPen className="text-sm xl:text-base text-blue-600" />
           </button>

            <button 
              onClick={() => {
                    setPincodeId(item.id);
                    setDeleteModalOpen(true);
              }}
            >
              <BsTrash className="text-sm xl:text-base text-red-600" />
           </button>
        </div>
        
        );
        },
      },
  ];

 const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };


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

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="px-2 md:px-4 py-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:space-x-5">
        <p className="text-lg font-semibold">Total Pincodes: {totalRecords}</p>

        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search pincode..."
            className="px-3 py-1 lg:py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-none"
          />

        </div>
      </div>

      <div className="hidden md:block">
        <TableComponent
          columns={columns}
          data={pincodes}
          headerBg="bg-[#f6f6f6]"
        />
      </div>

      <div className="md:hidden space-y-3">
        {pincodes?.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-500">Pincode</p>
                <p className="font-semibold text-base">
                  {capitalizeFirstLetter(item.pinCode)}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => onEdit(item.id)}>
                  <FaPen className="text-blue-600" />
                </button>

                <button
                  onClick={() => {
                    setPincodeId(item.id);
                    setDeleteModalOpen(true);
                  }}
                >
                  <BsTrash className="text-red-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <p className="text-gray-500">Delivery Days</p>
                <p>{item.deliveryDays}</p>
              </div>

              <div>
                <p className="text-gray-500">City</p>
                <p>{capitalizeFirstLetter(item.city)}</p>
              </div>

              <div>
                <p className="text-gray-500">District</p>
                <p>{capitalizeFirstLetter(item.district)}</p>
              </div>

              <div>
                <p className="text-gray-500">State</p>
                <p>{capitalizeFirstLetter(item.state)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}

      <DeletePincodeModel
          isOpen={deleteModelOpen}
          onClose={() => setDeleteModalOpen(false)}
          pincodeId={pincodeId}
      />
    </div>
  );
}
