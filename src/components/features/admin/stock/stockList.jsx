import { useEffect, useMemo, useState } from "react";
import TableComponent from "../../../common/TableComponent";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import capitalizeFirstLetter from "../../../common/capitalizeFirstLetter";
import { fetchStock } from "../../../../redux/actions/stockActions";
import { useDispatch, useSelector } from "react-redux";
import CustomFilter from "../../../common/filterOption";


export default function StockList() {
  const navigate=useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const stockOptions = [
    {
      label: "In Stock",
      value: "inStock",
    },
    {
      label: "Out of Stock",
      value: "outOfStock",
    },
    {
      label: "Low Stock",
      value: "lowStock",
    },
  ];

  const dispatch = useDispatch();

  const { stock, totalPages, totalRecords, error } = useSelector(
    (state) => state.stockState
  );

    useEffect(() => {
        dispatch(fetchStock(currentPage, itemsPerPage, searchTerm,sortOption));     
    }, [dispatch, currentPage,itemsPerPage,searchTerm,sortOption]);

  // const sortedData = useMemo(() => {
  // if (!stock) return [];

  // let sorted = [...stock];

  // if (sortOption === "in stock") {
  //   sorted = sorted.filter((item) => item.currentStock > item.lowStockThreshold);
  // } else if (sortOption === "low stock") {
  //   sorted = sorted.filter(
  //     (item) =>
  //       item.currentStock > 0 && item.currentStock < item.lowStockThreshold
  //   );
  // } else if (sortOption === "out of stock") {
  //   sorted = sorted.filter((item) => item.currentStock === 0);
  // }

  // return sorted;
  // }, [stock, sortOption]);

   const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const columns = [
    {
      label: "Name",
      field: "productName",
      headerClassName: "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
      className: "text-sm text-left pl-2 border-l border-[#d3cccc]",
      render:(item)=>(
        <>
          {capitalizeFirstLetter(item.productName)}
        </>
      )
    },
    {
      label: "Category",
      field: "categoryName",
      headerClassName: "text-center  pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm text-left  pl-2",
      render:(item)=>(
        <>
          {capitalizeFirstLetter(item.categoryName)}
        </>
      )
    },
    {
      label: "Weight",
      field: "weight",
      headerClassName: "text-center  pl-5 border-t border-b border-[#d3cccc]",
      className: "text-sm text-center  pl-5",
      render:(item)=>(
        <>
          {capitalizeFirstLetter(item.weight)}
        </>
      )
    },
    {
      label: "Available",
      field: "",
      headerClassName: "text-left pl-5 border-t border-b border-[#d3cccc]",
      className: "text-sm text-left  pl-5",
      render:(item)=>(
        <>
          {item.availableStock}
        </>
      )
    },
    
    {
      label: "Total",
      field: "totalStock",
      headerClassName: "text-center pl-5 border-t border-b border-[#d3cccc]",
      className: "text-sm  text-center pl-5",
    },
    {
      label: "Low Stock Threshold",
      field: "lowStockThreshold",
      headerClassName: "text-center pl-5 border-t border-b border-[#d3cccc]",
      className: "text-sm text-center pl-5",
    },
    {
      label: "Status",
      field: "status",
      headerClassName: "text-left pl-2 pr-5 border-t border-b border-[#d3cccc]",
      className: "text-sm text-left pl-2 ",
      render: (row) => {
        if (row.status === "outOfStock") {
          return <span className="text-red-500 font-semibold">Out of Stock</span>;
        }
        if (row.status === "lowStock") {
          return <span className="text-yellow-500 font-semibold">Low Stock</span>;
        }
        return <span className="text-green-500 font-semibold">In Stock</span>;
      }
    },  
    {
      label: "Actions",
      field: "edit",
      headerClassName: "border-t border-b border-r border-[#d3cccc] text-left",
      className: "border-[#d3cccc] border-r",
      render: (stock) => (
        <div className="flex flex-row space-x-2 items-center justify-center">        
          <button onClick={()=>navigate(`/stockview/${stock.productId}/${stock.variantId}`)}>
            <MdOutlineRemoveRedEye className="text-lg xl:text-xl text-blue-600" />
          </button>
        </div>
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

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2 md:gap-4">
        <p className="text-base xl:text-lg 2xl:text-xl font-medium">
          Total: {totalRecords} Stocks
        </p>

        <div className="flex flex-col md:flex-row gap-2 md:space-x-3 items-center justify-center">
          <input
            type="text"
            className="rounded border border-primary px-2 py-1 xl:py-1.5 focus:outline-none"
            placeholder="Search here anything..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          
          <div className="w-full sm:w-[190px]">
            <CustomFilter
              options={stockOptions}
              value={sortOption || "all"}
              onChange={(value) => {
                setSortOption(value === "all" ? "" : value);
                setCurrentPage(1);
              }}
              placeholder="Sort by"
              allLabel="Sort by"
            />
          </div>
        </div>
        

      </div>

      <div className="hidden lg:block w-full overflow-x-hidden">
      
        <TableComponent
          columns={columns}
          data={stock}
          headerBg="bg-[#f6f6f6]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {stock?.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-base break-words">
                  {capitalizeFirstLetter(item.productName)}
                </h2>

                <p className="text-sm text-gray-500 mt-1 break-words whitespace-normal">
                  {capitalizeFirstLetter(item.categoryName)}
                </p>
              </div>

              <div className="">
                {item.currentStock === 0 ? (
                  <span className="text-red-500 font-semibold text-sm">
                    Out of Stock
                  </span>
                ) : item.currentStock < item.lowStockThreshold ? (
                  <span className="text-yellow-500 font-semibold text-sm">
                    Low Stock
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold text-sm">
                    In Stock
                  </span>
                )}
              </div>

             
            </div>

            <div className="border-t my-4"></div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-3 text-sm">
              <div>
                <p className="text-gray-500">Weight</p>
                <p className="font-medium">{item.weight}</p>
              </div>

              <div>
                <p className="text-gray-500">Available</p>
                <p className="font-medium">{item.availableStock}</p>
              </div>

              <div>
                <p className="text-gray-500">Total</p>
                <p className="font-medium">{item.totalStock}</p>
              </div>

              <div>
                <p className="text-gray-500">Threshold</p>
                <p className="font-medium">
                  {item.lowStockThreshold}
                </p>
              </div>
            </div>

            <div className="border-t my-2"></div>

            <div className="flex justify-end">
              <button
                onClick={() =>
                        navigate(
                        `/stockview/${item.productId}/${item.variantId}`
                    )
                }
                className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-50"
              > 
                <MdOutlineRemoveRedEye className="text-xl text-blue-600" />
              </button>
            </div>
           
          </div>
        ))}
      </div>

      {renderPagination()}

    </>
  );
}

