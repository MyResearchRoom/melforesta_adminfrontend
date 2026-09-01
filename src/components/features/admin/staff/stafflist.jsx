import { useEffect, useMemo, useState } from "react";
import { FaFilter, FaLock, FaLockOpen, FaPen } from "react-icons/fa";
import { toast } from "react-toastify";
import ChangePasswordModal from "../../../common/Admin/changepassword";
import capitalizeFirstLetter from "../../../common/capitalizeFirstLetter"
import { savePassword } from "../../../../services/savePassword";
import axios from "axios";
const Base_Url = import.meta.env.VITE_BASE_URL;
export default function StaffList({ onEdit }) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedStaffIdForPassword, setSelectedStaffIdForPassword] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [roleFilter, setRoleFilter] = useState("All"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffDataLength, setStaffDataLength] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 7;

  const handleOpenPasswordModal = (staffId) => {
    setSelectedStaffIdForPassword(staffId);
    setIsPasswordModalOpen(true);
  };

  useEffect(() => {
  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token"); 
      
      const res = await axios.get(`${Base_Url}/api/auth/getStaffList`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          role: roleFilter !== "All" ? roleFilter.toUpperCase().replace(" ", "_") : undefined,
          search: searchTerm || undefined,
        },
      });

      if (res.data.success) {
        setStaffData(res.data.data);
        setTotalPages(res.data.totalPages);
        setStaffDataLength(res.data.totalRecords);
      }
    } catch (error) {
      console.error("Error fetching staff list:", error);
      toast.error(error.response?.data?.message || "Failed to load staff data");
    } finally {
      setLoading(false);
    }
  };
  fetchStaff();
  }, [currentPage, roleFilter, searchTerm]);


   const sortedData = useMemo(() => {
    if (!staffData) return [];
  
    let sorted = [...staffData];
  
    if (sortOption === "Blocked") {
      sorted = sorted.filter(item => Boolean(item.isBlock));
    } else if (sortOption === "UnBlocked") {
      sorted = sorted.filter(item => !item.isBlock);
    }
    sorted = sorted.filter(staff => staff.role !== "ADMIN");
    setStaffDataLength(sorted.length);
    return sorted;
   }, [staffData, sortOption]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleBlockToggle = async (staffId, isActive) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.patch(`${Base_Url}/api/auth/blockStaff/${staffId}`,
      { isBlock: !isActive },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message || "Staff status updated");

    setStaffData(prev =>
      prev.map(staff =>
        staff.id === staffId ? { ...staff, isBlock: !isActive } : staff
      )
    );
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to update staff status");
  }
  };

  const handlePasswordChange = async (id, password,confirmPassword) => {
    const token = localStorage.getItem("token");
    try {
      await savePassword({ id,password,confirmPassword, token });
      console.log("Staff updated password: ",id,password)
    } catch (err) {
      console.error("Save category failed:", err);
    }
    
    setIsPasswordModalOpen(false);
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

  if (loading) {
    return <p className="text-center">Loading staff data...</p>;
  }

  return (
  <section className="">
    <div className="flex flex-wrap justify-between items-center mb-5 gap-4">
      <p className="text-lg font-semibold text-gray-800">
        Staff Members : {staffDataLength}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <FaFilter />
          <span className="font-medium text-sm">Filters</span>
        </div>

        <select
          value={roleFilter}
          onChange={handleRoleFilterChange}
          className="border border-gray-300 px-3 rounded-lg text-sm xl:text-base py-1 xl:py-1.5 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All Roles</option>
          <option value="PRODUCT_MANAGER">Product Manager</option>
          <option value="DELIVERY_ASSOCIATE">Delivery Associate</option>
        </select>

        <select
          value={sortOption}
          onChange={handleSortChange}
          className="border border-gray-300 px-3 rounded-lg text-sm xl:text-base py-1 xl:py-1.5 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Sort by Action</option>
          <option value="Blocked">Blocked</option>
          <option value="UnBlocked">Unblocked</option>
        </select>

        <input
          type="text"
          className="border border-gray-300 px-3 rounded-lg text-sm xl:text-base py-1 xl:py-1.5 focus:outline-none focus:border-none focus:ring-2 focus:ring-primary"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {sortedData.map((staff) => (
        <div
          key={staff.id}
          className="group bg-white shadow-md rounded-xl p-5 border border-gray-200 flex flex-col justify-between hover:-translate-y-1 hover:border-gray-400"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {capitalizeFirstLetter(staff.name)}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{staff.email}</p>

            <p className="text-gray-700 mt-3 text-sm flex gap-2">
              <span className="font-semibold">Role:</span>
              <span className="uppercase text-blue-600 font-medium">
                {staff.role.replace("_", " ")}
              </span>
            </p>

            <p className="text-gray-600 text-sm mt-2">
              📍 {staff.address}
            </p>

            <p className="text-gray-600 text-sm mt-1">
              📞 {staff.mobileNumber}
            </p>
          </div>

          <div className="mt-4 flex justify-between items-center gap-2">
            <button
              onClick={() => handleBlockToggle(staff.id, staff.isBlock)}
              className={`px-3 py-1 rounded-md text-sm font-semibold flex items-center gap-2
                ${staff.isBlock ? "text-green-600 border border-green-600 group-hover:bg-green-600 group-hover:text-white " : "text-red-600 border border-red-400 group-hover:bg-red-600 group-hover:text-white"}
              `}
            >
              {staff.isBlock ? <FaLockOpen /> : <FaLock />}
              {staff.isBlock ? "Unblock" : "Block"}
            </button>

            <button
              onClick={() => handleOpenPasswordModal(staff.id)}
              className="px-3 py-1 rounded-md border border-primary text-primary text-sm font-semibold group-hover:bg-custom-gradient1 group-hover:text-white"
            >
              Change Password
            </button>

            <button
              onClick={() => onEdit(staff.id)}
              className="p-2 group-hover:bg-gray-200 rounded-full"
            >
              <FaPen className="text-blue-600" />
            </button>
          </div>
        </div>
      ))}
    </div>

    {renderPagination()}

    {isPasswordModalOpen && (
      <ChangePasswordModal
        id={selectedStaffIdForPassword}
        closeModal={() => setIsPasswordModalOpen(false)}
        onPasswordChange={handlePasswordChange}
      />
    )}
  </section>
  );

}
