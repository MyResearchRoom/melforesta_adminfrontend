import { useEffect, useMemo, useState } from "react";
import { FaLock, FaLockOpen, FaPen } from "react-icons/fa";
import capitalizeFirstLetter from "../../../common/capitalizeFirstLetter";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../../redux/actions/categoryActions";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function CategoryList({ onEdit }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortByActionOption, setSortByActionOption] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const dispatch = useDispatch();
  const itemsPerPage = 10;
  const { categories, totalPages, error } = useSelector(
    (state) => state.categoryState
  );

  useEffect(() => {
    dispatch(fetchCategories(currentPage, itemsPerPage, searchTerm)); 
  }, [dispatch, currentPage,itemsPerPage,searchTerm]);


  const filteredData = useMemo(() => {
    let data = [...categories];

    if (sortOption === "a_to_z") data.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === "z_to_a") data.sort((a, b) => b.name.localeCompare(a.name));

    if (sortByActionOption === "Blocked") data = data.filter((item) => Boolean(item.isBlock));
    else if (sortByActionOption === "UnBlocked") data = data.filter((item) => !item.isBlock);

    setTotalRecords(data.length);
    return data;
  }, [categories, sortOption, sortByActionOption]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handleSortByActionChange = (e) => {
    setSortByActionOption(e.target.value);
    setCurrentPage(1);
  };

  const handleBlockToggle = async (categoryId, isActive) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.patch(`${Base_Url}/api/category/blockCategory/${categoryId}`,
      { isBlock: !isActive },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message || "category status updated");
    dispatch(fetchCategories(currentPage, itemsPerPage, searchTerm));
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to update staff status");
  }
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
    <div className="px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <p className="text-lg font-semibold">Total Categories: {totalRecords}</p>

        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search categories..."
            className="px-3 py-1 lg:py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-none"
          />

          <select
            value={sortOption}
            onChange={handleSortChange}
            className="px-3 py-1 lg:py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-none"
          >
            <option value="">Sort A-Z / Z-A</option>
            <option value="a_to_z">A to Z</option>
            <option value="z_to_a">Z to A</option>
          </select>

          <select
            value={sortByActionOption}
            onChange={handleSortByActionChange}
            className="px-3 py-1 lg:py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-none"
          >
            <option value="">Filter Action</option>
            <option value="Blocked">Blocked 🔒</option>
            <option value="UnBlocked">Unblocked 🔓</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No categories found</p>
        ) : (
          filteredData.map((cat) => {
            const isActive = cat.isBlock === true || cat.isBlock === "true";
            return (
              <div
                key={cat.id}
                className="relative bg-white shadow-md rounded-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* <button
                    onClick={() => handleBlockToggle(cat.id, isActive)}
                    className={`p-2 rounded-full bg-white ${
                      isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isActive ? <FaLockOpen /> : <FaLock />}
                  </button> */}
                  <button
                    onClick={() => onEdit(cat.id)}
                    className="p-2 rounded-full bg-white text-blue-600"
                  >
                    <FaPen />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {capitalizeFirstLetter(cat.name)}
                  </h3>
                  <p
                    className={`text-sm font-medium mt-1 ${
                      isActive ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {isActive ? "Blocked" : "Active"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      {renderPagination()}
    </div>
  );
}
