import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import TableComponent from "../../../common/TableComponent";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import DocumentViewModal from "../../../../model/product-manager/documeentView";
import { useState, useEffect } from "react";
import capitalizeFirstLetter from "../../../common/capitalizeFirstLetter";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;

export default function ViewStock() {
  const { productId ,variantId} = useParams();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStockById = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token"); 
        const res = await axios.get(`${Base_Url}/api/stock/getStockDetails/${productId}/${variantId}`, 
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {page: currentPage,limit:itemsPerPage,},
        });

        if (res.data.success) {
          setStockData(res.data.data);
          setCurrentPage(res.data.currentPage);
          setTotalPages(res.data.totalPages);
          setTotalRecords(res.data.totalRecords);
        } else {
          setError(res.data.message || "Failed to fetch stock data");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchStockById();
  }, [productId,currentPage]);

  const openModal = (id) => {
    setSelectedStock(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStock(null);
    setIsModalOpen(false);
  };


  const latestStock = stockData.reduce(
    (latest, current) =>
      new Date(current.restockDate) > new Date(latest.restockDate)
        ? current
        : latest,
    stockData[0]
  );
  const currentStock = latestStock?.restockQuantity || 0;
  const totalCurrentStock = stockData.reduce(
    (sum, s) => sum + (s.restockQuantity || 0),
    0
  );

  const columns = [
    {
      label: "Date",
      field: "restockDate",
      headerClassName: "text-left pl-2 border-l border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2 border-l border-[#d3cccc]",
      render: (item) => {
      if (!item.restockDate) return "-";
      const date = new Date(item.restockDate);
      const formattedDate = `${date.getDate().toString().padStart(2,'0')}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getFullYear()}`;
      return formattedDate;
      }
    },
    {
      label: "Supplier Name",
      field: "supplierName",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
      render: (item) => <>{capitalizeFirstLetter(item.supplierName)}</>,
    },
    {
      label: "Price per Unit",
      field: "pricePerUnit",
      headerClassName: "text-left pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-left pl-2",
      render: (item) => <>{Math.round(item.pricePerUnit)}</>,
    },
    {
      label: "Restock Quantity",
      field: "restockQuantity",
      headerClassName: "text-center pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-center pl-2",
    },
    {
      label: "Total Cost",
      field: "totalPrice",
      headerClassName: "text-center pl-2 border-t border-b border-[#d3cccc]",
      className: "text-sm xl:text-base text-center pl-2",
      render: (item) => <>{Math.round(item.totalPrice)}</>,
    },
    {
      label: "Document",
      field: "document",
      headerClassName: "border-t text-center border-b border-r border-[#d3cccc] text-left",
      className: "border-[#d3cccc] border-r text-center",
      render: (stock) => (
        <button onClick={() => openModal(stock.id)}>
          <MdOutlineRemoveRedEye className="text-lg xl:text-xl text-blue-600" />
        </button>
      ),
    },
  ];

  const stockInfo = stockData[0];

  if (loading) return <p className="text-center mt-10">Loading Stock...</p>;

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  
  if (!stockData || stockData.length === 0)
    return <p className="text-red-500 text-center mt-10">Stock not found</p>;

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

  return (
    <section className="space-y-5">
      <div
        className="pb-2 pt-5 flex flex-row space-x-2 items-center text-sm md:text-base xl:text-lg font-medium"
        onClick={() => navigate(-1)}
      >
        <IoArrowBack />
        <p className="font-semibold">Stock Detail</p>
      </div>

      <div className="bg-white rounded-md px-6 py-10 shadow flex flex-col space-y-10">
        <div className="flex flex-col md:flex-row gap-3 items-start justify-between">
          <div className="flex flex-col text-sm xl:text-base">
            <p>
              <strong>Id : </strong>
              {stockInfo.product?.id}
            </p>
            <p>
              <strong>Product Name : </strong>
              {capitalizeFirstLetter(stockInfo.product?.productName)}
            </p>
            <p>
              <strong>Weight : </strong>
              {capitalizeFirstLetter(stockInfo.varient?.weight)}
            </p>
            <p>
              <strong>Category : </strong>
              {capitalizeFirstLetter(stockInfo.category?.name)}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:space-x-4 items-center">
            <div className="shadow border text-[#A63F40] px-4 h-14 md:h-20 xl:px-6 rounded-md flex items-center justify-center">
              <p className="text-lg xl:text-xl font-medium">
                Current Stock Count : {stockInfo?.varient?.currentAvailableStock}
              </p>
            </div>

            <div className="shadow border text-[#A63F40] px-4 h-14 md:h-20 xl:px-6 rounded-md flex items-center justify-center">
              <p className="text-lg xl:text-xl font-medium">
                Total Stock Uptil Now: {stockInfo?.varient?.totalStock}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <TableComponent 
            columns={columns} 
            data={stockData} 
            headerBg="bg-[#f6f6f6]" 
          />
        </div>

        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                {stockData.map((stock) => (
                  <StockCard
                    key={stock.id}
                    stock={stock}
                    openModal={openModal}
                  />
                ))}
        </div>

        {renderPagination()}
      </div>

      {isModalOpen && (
        <DocumentViewModal id={selectedStock} onClose={closeModal} />
      )}
    </section>
  );
}


const StockCard = ({ stock, openModal }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return `${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="space-y-3">

        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">
            Date
          </span>

          <span className="font-medium">
            {formatDate(stock.restockDate)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">
            Supplier
          </span>

          <span className="font-medium text-right">
            {capitalizeFirstLetter(stock.supplierName)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">
            Price / Unit
          </span>

          <span className="font-medium">
            ₹{Math.round(stock.pricePerUnit)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">
            Quantity
          </span>

          <span className="font-medium">
            {stock.restockQuantity}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 text-sm">
            Total Cost
          </span>

          <span className="font-medium">
            ₹{Math.round(stock.totalPrice)}
          </span>
        </div>

      </div>

      <div className="border-t mt-4 pt-3 flex justify-end ">
        <button
          onClick={() => openModal(stock.id)}
          className="flex items-center gap-2 text-blue-600"
        >
          <MdOutlineRemoveRedEye className="text-xl" />
          <span className="text-sm">
            View Document
          </span>
        </button>
      </div>
    </div>
  );
};
