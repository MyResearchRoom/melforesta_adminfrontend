import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import { FaFilter, FaLock, FaLockOpen, FaPen } from 'react-icons/fa';
import TableComponent from "../../../common/TableComponent";
import capitalizeFirstLetter from '../../../common/capitalizeFirstLetter';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from "../../../../redux/actions/prodcutAction";
import axios from "axios";
import { FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import CustomFilter from '../../../common/filterOption';
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function ViewProduct({ onEdit }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const itemsPerPage = 10;
  const dispatch=useDispatch();
  const navigate =useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { product, totalPages, error,totalRecords } = useSelector(
    (state) => state.productState
  );
  
  useEffect(() => {
    dispatch(fetchProducts(currentPage, itemsPerPage, searchTerm,sortOption)); 
  }, [dispatch, currentPage,itemsPerPage,searchTerm,sortOption]);
  
  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const actionOptions = [
    {
      label: "🔒 Blocked",
      value: "true",
    },
    {
      label: "🔓 Active",
      value: "false",
    },
  ];

  const handleBlockToggle = async (productId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.patch(`${Base_Url}/api/product/blockProduct/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message || "product status updated");
    dispatch(fetchProducts()); 
    
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to update product status");
  }
  };

  const columns = [
      {
        label: "Name",
        field: "productName",
        headerClassName: "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2 border-l border-[#d3cccc]",
        render:(item)=>(
          <>
            {capitalizeFirstLetter(item.productName)}
          </>
        )
      },
      {
        label: "Variants",
        field: "variants",
        headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2 ",
        render: (item) => (
          item.variants?.length
            ? item.variants.map(v => `${v.weight} - ₹${Number(v.discountedPrice)}`).join(", ")
            : "-"
        )
      },
      {
        label: "Category",
        field: "category",
        headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
        className: "text-sm xl:text-base text-left pl-2",
        render:(item)=>(
          <>
            {item.category ? capitalizeFirstLetter(item.category?.name) : "-"}
          </>
        )
      },  
      {
        label: "View",
            field: "",
            headerClassName: "text-center pl-2 border-t border-b border-[#d3cccc] pr-2",
            className: "text-sm xl:text-base text-center border-[#d3cccc] pr-2",
            render: (item) => {
            return (
            <div className="flex flex-row space-x-2 lg:space-x-3 items-center justify-center">
                <button onClick={() => navigate(`/product-details/${item.id}`)}>
                  <FiEye className="text-sm xl:text-base text-yellow-600" />
               </button>
            </div>
            
            );
            },
      },
      {
        label: "Action",
        field: "action",
        headerClassName: "text-center pl-2 border-t border-b border-r border-[#d3cccc] pr-2",
        className: "text-sm xl:text-base text-center border-r border-[#d3cccc] pr-2",
        render: (item) => {
         const isBlocked = Boolean(item.isBlock); 
        return (
        <div className="flex flex-row space-x-2 lg:space-x-3 items-center justify-center">
            <button
              className=""
              onClick={() => handleBlockToggle(item.id)}
            >
              <p className={isBlocked ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                {isBlocked ? <FaLockOpen /> : <FaLock />}
              </p>
            </button>
  
            <button onClick={() => onEdit(item.id)}>
              <FaPen className="text-sm xl:text-base text-blue-600" />
           </button>
        </div>
        
        );
        },
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
              <p className="text-base xl:text-lg font-medium">
                Total: {totalRecords} Products
              </p>
      
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="w-full sm:w-[190px]">
                  <CustomFilter
                    options={actionOptions}
                    value={sortOption || "all"}
                    onChange={(value) => {
                      setSortOption(value === "all" ? "" : value);
                      setCurrentPage(1);
                    }}
                    placeholder="Sort by Action"
                    allLabel="Sort by Action"
                  />
                </div>
      
                <input
                  type="text"
                  className="rounded border border-gray-400 px-2 py-1 xl:py-1.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-none text-black"
                  placeholder="Search by name & category..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
      </div>

      <div className="hidden md:block">
        <TableComponent
          columns={columns}
          data={product}
          headerBg="bg-[#f6f6f6]"
        />
      </div>

      <div className="md:hidden space-y-3">
                {product?.map((item) => {
                  const isBlocked = Boolean(item.isBlock);
      
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-base">
                            {capitalizeFirstLetter(item.productName)}
                          </h3>
      
                          <p className="text-sm text-gray-500">
                            {item.category
                              ? capitalizeFirstLetter(item.category.name)
                              : "-"}
                          </p>
                        </div>
      
                        
                      </div>
      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Variants
                        </p>
      
                        <div className="flex flex-wrap gap-2">
                          {item.variants?.length ? (
                            item.variants.map((variant, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 rounded"
                              >
                                {variant.weight} - ₹
                                {Number(
                                  variant.discountedPrice
                                ).toLocaleString()}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">
                              No variants
                            </span>
                          )}
                        </div>
                      </div>
      
                      <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex flex-row justify-between">
                        <p className=''>
                          Status:
                          <span
                            className={`ml-1 font-medium ${
                              isBlocked
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {isBlocked ? "Blocked" : "Active"}
                          </span>
                        </p>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/product-details/${item.id}`)}
                          >
                            <FiEye className="text-yellow-600 text-lg" />
                          </button>
      
                          <button
                            onClick={() => handleBlockToggle(item.id)}
                          >
                            {isBlocked ? (
                              <FaLockOpen className="text-green-500 text-lg" />
                            ) : (
                              <FaLock className="text-red-500 text-lg" />
                            )}
                          </button>
      
                          <button onClick={() => onEdit(item.id)}>
                            <FaPen className="text-blue-600 text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
      

      {renderPagination()}

    </>
  )
}
